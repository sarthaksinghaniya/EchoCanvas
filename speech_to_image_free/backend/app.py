import os
import uuid
from pathlib import Path
from typing import Any

from faster_whisper import WhisperModel
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool


APP_TITLE = "Speech-to-Image Free Backend"
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "small")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
ALLOWED_AUDIO_EXTENSIONS = {
    ".wav",
    ".mp3",
    ".m4a",
    ".flac",
    ".ogg",
    ".webm",
    ".mp4",
    ".aac",
    ".wma",
}


app = FastAPI(title=APP_TITLE)
whisper_model: WhisperModel | None = None

# Local frontend origins for development/testing.
LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=LOCAL_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def create_runtime_directories() -> None:
    """Ensure runtime folders exist before handling requests."""
    global whisper_model

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    try:
        whisper_model = WhisperModel(
            WHISPER_MODEL_NAME,
            device=WHISPER_DEVICE,
            compute_type=WHISPER_COMPUTE_TYPE,
        )
    except Exception as exc:
        raise RuntimeError(
            f"Failed to load faster-whisper model '{WHISPER_MODEL_NAME}': {exc}"
        ) from exc


def is_audio_upload(file: UploadFile) -> bool:
    """Validate upload using MIME type and extension fallback."""
    content_type = (file.content_type or "").lower()
    if content_type.startswith("audio/"):
        return True

    suffix = Path(file.filename or "").suffix.lower()
    return suffix in ALLOWED_AUDIO_EXTENSIONS


async def save_uploaded_audio(file: UploadFile) -> Path:
    """Persist uploaded audio file to disk and return saved path."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file name provided.")

    if not is_audio_upload(file):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a valid audio file.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_AUDIO_EXTENSIONS:
        suffix = ".audio"

    unique_name = f"{uuid.uuid4().hex}{suffix}"
    target_path = UPLOAD_DIR / unique_name

    try:
        target_path.write_bytes(file_bytes)
    except OSError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save uploaded file: {exc}",
        ) from exc

    return target_path


def transcribe_audio(audio_path: Path) -> dict[str, Any]:
    """Run faster-whisper transcription and return normalized metadata."""
    if whisper_model is None:
        raise RuntimeError("Whisper model is not loaded.")

    segments, info = whisper_model.transcribe(
        str(audio_path),
        beam_size=5,
        vad_filter=True,
    )
    text = " ".join(segment.text.strip() for segment in segments if segment.text).strip()

    return {
        "transcription": text,
        "detected_language": info.language,
        "language_probability": getattr(info, "language_probability", None),
    }


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint for quick API sanity checks."""
    return {
        "status": "ok",
        "service": APP_TITLE,
        "message": "API is running",
    }


@app.get("/health")
async def health() -> dict[str, str]:
    """Health endpoint used by local checks and monitoring."""
    return {
        "status": "healthy",
        "service": APP_TITLE,
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)) -> dict[str, Any]:
    """Accept an audio upload and return multilingual transcription details."""
    try:
        audio_path = await save_uploaded_audio(file)
        result = await run_in_threadpool(transcribe_audio, audio_path)
        return {
            "status": "ok",
            "file_name": audio_path.name,
            **result,
        }
    except HTTPException:
        raise
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {exc}",
        ) from exc
    finally:
        await file.close()
