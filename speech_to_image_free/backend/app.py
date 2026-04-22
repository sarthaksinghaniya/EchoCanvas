from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


APP_TITLE = "Speech-to-Image Free Backend"
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"


app = FastAPI(title=APP_TITLE)

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
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


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
