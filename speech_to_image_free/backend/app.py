import os
import uuid
import logging
from pathlib import Path
from typing import Any

import torch
from diffusers import StableDiffusionPipeline
from faster_whisper import WhisperModel
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool


APP_TITLE = "Speech-to-Image Free Backend"
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "small")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
DIFFUSION_MODEL_ID = os.getenv(
    "DIFFUSION_MODEL_ID",
    "stable-diffusion-v1-5/stable-diffusion-v1-5",
)
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

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(APP_TITLE)


app = FastAPI(title=APP_TITLE)
whisper_model: WhisperModel | None = None
diffusion_pipeline: StableDiffusionPipeline | None = None

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
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR), check_dir=False), name="outputs")


class GenerateImageRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000)
    style: str | None = Field(default=None, max_length=100)


STYLE_PROMPTS = {
    "realistic": "highly detailed realistic photography, natural lighting, sharp focus",
    "anime": "anime style illustration, vibrant colors, clean line art, studio quality",
    "fantasy": "epic fantasy scene, cinematic lighting, magical atmosphere, intricate details",
    "digital-art": "modern digital art, concept art quality, detailed composition",
}


def load_whisper_model() -> WhisperModel:
    """Load and return faster-whisper model once at startup."""
    return WhisperModel(
        WHISPER_MODEL_NAME,
        device=WHISPER_DEVICE,
        compute_type=WHISPER_COMPUTE_TYPE,
    )


def load_diffusion_pipeline() -> StableDiffusionPipeline:
    """Load and return Stable Diffusion pipeline once at startup."""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32
    logger.info(
        "Loading diffusion pipeline (model=%s, device=%s, dtype=%s)",
        DIFFUSION_MODEL_ID,
        device,
        str(dtype).replace("torch.", ""),
    )
    pipeline = StableDiffusionPipeline.from_pretrained(
        DIFFUSION_MODEL_ID,
        torch_dtype=dtype,
    )
    pipeline = pipeline.to(device)
    if device == "cpu":
        pipeline.enable_attention_slicing()
    return pipeline


@app.on_event("startup")
async def create_runtime_directories() -> None:
    """Ensure runtime folders exist before handling requests."""
    global whisper_model, diffusion_pipeline

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    try:
        whisper_model = load_whisper_model()
        logger.info(
            "faster-whisper loaded (model=%s, device=%s, compute_type=%s)",
            WHISPER_MODEL_NAME,
            WHISPER_DEVICE,
            WHISPER_COMPUTE_TYPE,
        )
        diffusion_pipeline = load_diffusion_pipeline()
        logger.info("Stable Diffusion pipeline loaded successfully")
    except Exception as exc:
        raise RuntimeError(f"Failed to initialize startup models: {exc}") from exc


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


def enhance_prompt(prompt: str, style: str | None) -> str:
    """Apply optional style-based prompt enhancement."""
    cleaned_prompt = prompt.strip()
    if not style:
        return cleaned_prompt

    style_key = style.strip().lower()
    style_suffix = STYLE_PROMPTS.get(style_key)
    if not style_suffix:
        return cleaned_prompt
    return f"{cleaned_prompt}, {style_suffix}"


def generate_image(prompt: str) -> str:
    """Generate and save image to outputs folder, then return relative URL path."""
    if diffusion_pipeline is None:
        raise RuntimeError("Diffusion pipeline is not loaded.")

    with torch.inference_mode():
        result = diffusion_pipeline(
            prompt=prompt,
            num_inference_steps=30,
            guidance_scale=7.5,
        )

    image = result.images[0]
    file_name = f"{uuid.uuid4().hex}.png"
    output_path = OUTPUT_DIR / file_name
    image.save(output_path)
    return f"/outputs/{file_name}"


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
    original_filename = file.filename or "unknown"
    try:
        logger.info(
            "Transcribe request received: filename=%s content_type=%s",
            original_filename,
            file.content_type or "unknown",
        )
        audio_path = await save_uploaded_audio(file)
        relative_audio_path = audio_path.relative_to(BASE_DIR).as_posix()
        logger.info("Transcription started: saved_path=%s", relative_audio_path)
        result = await run_in_threadpool(transcribe_audio, audio_path)
        logger.info(
            "Transcription completed: saved_path=%s language=%s",
            relative_audio_path,
            result.get("detected_language"),
        )
        return {
            "status": "ok",
            "original_filename": original_filename,
            "saved_file_path": relative_audio_path,
            "detected_language": result.get("detected_language"),
            "transcription": result.get("transcription", ""),
            "language_probability": result.get("language_probability"),
        }
    except HTTPException:
        raise
    except RuntimeError as exc:
        logger.exception("Transcription runtime error for file: %s", original_filename)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected transcription error for file: %s", original_filename)
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {exc}",
        ) from exc
    finally:
        await file.close()


@app.post("/generate-image")
async def generate_image_route(payload: GenerateImageRequest) -> dict[str, Any]:
    """Generate image from prompt using local Stable Diffusion pipeline."""
    original_prompt = payload.prompt.strip()
    if not original_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    final_prompt = enhance_prompt(original_prompt, payload.style)
    logger.info(
        "Image generation request received: style=%s",
        (payload.style or "none"),
    )

    try:
        image_url = await run_in_threadpool(generate_image, final_prompt)
        logger.info("Image generation completed: image_url=%s", image_url)
        return {
            "status": "ok",
            "original_prompt": original_prompt,
            "final_prompt": final_prompt,
            "image_url": image_url,
        }
    except RuntimeError as exc:
        logger.exception("Image generation runtime error")
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected image generation error")
        raise HTTPException(
            status_code=500,
            detail=f"Image generation failed: {exc}",
        ) from exc
