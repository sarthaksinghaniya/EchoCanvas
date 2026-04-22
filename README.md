# EchoCanvas AI Workspace

This repository contains the **EchoCanvas AI** project (multilingual speech-to-image, fully local).

## Main Project

- App folder: [`speech_to_image_free/`](./speech_to_image_free)
- Project documentation: [`speech_to_image_free/README.md`](./speech_to_image_free/README.md)

## Quick Run

### Backend (FastAPI)

```bash
cd speech_to_image_free/backend
python -m venv .venv
source .venv/Scripts/activate  # PowerShell: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### Frontend (Next.js)

```bash
cd speech_to_image_free/frontend
npm install
npm run dev
```

## How It Works

### End-to-End Flow

```text
User Audio -> FastAPI Upload -> faster-whisper Transcription
-> Style Prompt Enhancement -> Stable Diffusion Image Generation
-> Image Saved in backend/outputs -> URL Returned to Frontend
-> UI shows Transcription + Final Prompt + Generated Image
```

### Backend Processing

1. **Startup initialization**
- Loads `faster-whisper` model once.
- Loads Stable Diffusion pipeline (`diffusers`) once.
- Creates runtime folders (`uploads`, `outputs`, `static`) if missing.

2. **Speech-to-image API (`POST /speech-to-image`)**
- Accepts audio file (`multipart/form-data`) and optional `style`.
- Validates and saves audio to `backend/uploads`.
- Transcribes speech + detects language.
- Enhances prompt based on style (`realistic`, `anime`, `fantasy`, `digital-art`).
- Generates image locally and saves to `backend/outputs`.
- Returns JSON with:
  - `transcription`
  - `final_prompt`
  - `image_url`
  - language metadata

3. **Static image serving**
- Generated images are served via FastAPI static mount:
  - `/outputs/<filename>.png`

### Frontend Behavior

1. User uploads or records audio.
2. User selects style and clicks **Generate**.
3. UI sends `FormData` request to backend.
4. UI displays staged loading states:
- Uploading audio...
- Transcribing...
- Generating image...
5. On success, UI renders:
- Transcription text
- Final enhanced prompt
- Generated image preview
6. User can reset state or download image.

### Error Handling

- Invalid audio input -> clean `400` response.
- Runtime/model issues -> `503` response.
- Unexpected errors -> `500` response.
- Frontend shows readable error cards without page reload.

## Notes

- Backend docs: `http://127.0.0.1:8000/docs`
- Frontend: `http://localhost:3000`
