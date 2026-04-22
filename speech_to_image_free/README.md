# Speech-to-Image Free

## Overview

`Speech-to-Image Free` is a local-first project that converts spoken input into generated images using open-source models.
The goal is to keep everything beginner-friendly, modular, and free from paid API dependencies.

## Stack

- Backend: Python + FastAPI
- Speech-to-Text: faster-whisper (planned)
- Text-to-Image: Hugging Face diffusers + Stable Diffusion v1.5 (planned)
- Frontend: HTML, CSS, JavaScript (planned)
- Runtime: Local machine (Windows-friendly setup)

## Windows Local Setup (PowerShell)

### 1. Python version recommendation

Use Python `3.10` or `3.11` for best compatibility with the planned ML stack.

Check your version:

```powershell
python --version
```

### 2. Create and activate virtual environment

From project root (`speech_to_image_free`):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If script execution is blocked in PowerShell, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### 3. Install backend requirements

```powershell
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Run FastAPI with Uvicorn

From `speech_to_image_free\backend`:

```powershell
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### 5. API docs URL

After server start, open:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### 6. Performance note (CPU vs GPU)

- Image generation will run on CPU if no CUDA-compatible GPU is configured.
- CPU generation is significantly slower.
- With NVIDIA CUDA GPU, generation is much faster.

### 7. faster-whisper dependency note

`faster-whisper` uses bundled decoding dependencies (via PyAV), so a separate system-wide FFmpeg installation is typically not required for this project setup.

## Planned Features

- Audio upload endpoint
- Multilingual transcription with faster-whisper
- Prompt generation pipeline
- Local image generation with Stable Diffusion v1.5
- Basic web UI for upload + result preview
- Saved outputs and simple history
