# Speech-to-Image (Local, Multilingual, Free)

Beginner-friendly local project for:
- Speech-to-text (multilingual) with `faster-whisper`
- Text-to-image with Hugging Face `diffusers`
- Backend with `FastAPI`
- Frontend with simple `HTML/CSS/JS`
- No paid APIs

This repo is being built incrementally in safe steps.

## Goal

Upload/record speech -> transcribe locally -> generate image locally.

## Tech Stack

- Python (backend)
- FastAPI + Uvicorn
- faster-whisper (STT)
- diffusers + Stable Diffusion v1.5 (image generation)
- Vanilla HTML/CSS/JS (frontend)

## Current Status

- Workspace initialized
- Architecture and plan finalized
- App code not implemented yet (next steps pending)

## Proposed Project Structure

```text
gen-ai/
  backend/
    app/
      main.py
      api/
        routes/
          health.py
          stt.py
          image.py
          pipeline.py
      core/
        config.py
        logging.py
      schemas/
        stt.py
        image.py
        pipeline.py
      services/
        whisper_service.py
        diffusion_service.py
      utils/
        file_io.py
        audio_validation.py
    tests/
      test_health.py
    requirements.txt
    .env.example
  frontend/
    index.html
    styles.css
    app.js
    assets/
  data/
    input_audio/
    outputs/
    temp/
  models/
    README.md
  scripts/
    setup_windows.ps1
    run_backend.ps1
  .gitignore
  README.md
```

## Windows Prerequisites

As of April 22, 2026:

1. Windows 10/11 (64-bit)
2. Python 3.10 or 3.11 (recommended)
3. Git
4. At least 25-40 GB free disk
5. 16 GB RAM recommended (8 GB minimum for basic tests)

### Optional (for GPU acceleration)

- NVIDIA GPU + latest driver
- PyTorch CUDA build matching your system
- For faster-whisper GPU path: CUDA 12 + cuDNN 9 compatible setup

CPU-only mode is fully possible (slower but easier to start).

## Planned Incremental Implementation

1. Create folders, `.gitignore`, and Python virtual environment
2. Add minimal FastAPI app and `/health` endpoint
3. Add audio upload endpoint with validation
4. Integrate `faster-whisper` transcription service
5. Integrate `diffusers` with Stable Diffusion v1.5
6. Add end-to-end pipeline endpoint (speech -> text -> image)
7. Build simple frontend to call backend APIs
8. Add output storage and cleanup utilities
9. Add basic tests and run instructions
10. Optimize for performance (optional)

## Notes

- Keep each step testable before moving to next.
- Prefer robust error handling over complex abstractions.
- Keep code beginner-friendly and Windows-compatible.
