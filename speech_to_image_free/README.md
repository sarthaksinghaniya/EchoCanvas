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

## Local Setup (Placeholder)

1. Create and activate a Python virtual environment.
2. Install backend dependencies from `backend/requirements.txt`.
3. Copy `backend/.env.example` to `.env` and adjust values if needed.
4. Run the FastAPI app with Uvicorn.

Detailed setup commands will be added in the next implementation step.

## Planned Features

- Audio upload endpoint
- Multilingual transcription with faster-whisper
- Prompt generation pipeline
- Local image generation with Stable Diffusion v1.5
- Basic web UI for upload + result preview
- Saved outputs and simple history
