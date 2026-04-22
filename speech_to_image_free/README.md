# 🎙️ EchoCanvas AI

**Tagline:** *Turn your voice into visuals*

EchoCanvas AI is a local-first, multilingual speech-to-image platform that converts spoken audio into descriptive text using `faster-whisper` and generates high-quality AI images using Stable Diffusion (`diffusers`) with no paid API dependency.

---

## 🎬 Demo

> Demo video / GIF coming soon.

- Live Demo: `TBD`
- Walkthrough Video: `TBD`

---

## ✨ Features

- Multilingual speech input processing
- Fully local AI inference (no paid APIs)
- End-to-end speech-to-image pipeline
- Real-time UI feedback with loading stages
- Style-based prompt enhancement (`realistic`, `anime`, `fantasy`, `digital-art`)

---

## 🧠 Architecture Flow

```text
Audio Input
   ↓
Transcription (faster-whisper)
   ↓
Prompt Enhancement (style-aware)
   ↓
Image Generation (Stable Diffusion v1.5)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend API | FastAPI |
| Speech-to-Text | faster-whisper |
| Text-to-Image | Hugging Face Diffusers |
| Image Model | Stable Diffusion v1.5 |
| Frontend | Next.js (App Router) + Tailwind CSS |
| UI Animations | Framer Motion |

---

## 📁 Project Structure

```text
speech_to_image_free/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── uploads/
│   ├── outputs/
│   ├── static/
│   └── templates/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

---

## ⚙️ Installation (Windows / PowerShell)

### 1. Clone Repository

```powershell
git clone <your-repo-url>
cd speech_to_image_free
```

### 2. Backend Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Run backend:

```powershell
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Backend docs:
- Swagger: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### 3. Frontend Setup

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:3000`

---

## 🚀 Usage

1. Open frontend at `http://localhost:3000`
2. Upload or record an audio clip
3. Select style (optional)
4. Click **Generate**
5. View outputs:
- Transcription text
- Final enhanced prompt
- Generated image preview
- Download image option

Expected output:
- A generated image rendered in UI and served from backend `/outputs/...`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/transcribe` | Upload audio and get transcription + detected language |
| `POST` | `/generate-image` | Generate image from text prompt (+ optional style) |
| `POST` | `/speech-to-image` | Full pipeline: audio → transcription → prompt enhancement → image |

---

## 🖼️ Screenshots

> Add screenshots here after capturing UI.

- `screenshots/home.png` (placeholder)
- `screenshots/loading-state.png` (placeholder)
- `screenshots/output-result.png` (placeholder)

---

## ⚠️ Limitations

- CPU image generation can be slow
- First run may download model weights (large)
- Performance depends heavily on local hardware (RAM/GPU/VRAM)

---

## 🧭 Future Improvements

- Richer React UI workflows and reusable modules
- GPU inference optimization and model loading improvements
- Optional cloud deployment profiles
- User accounts and saved sessions
- History timeline and image gallery

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a pull request with a clear description

---

## 📄 License

`MIT` (or your preferred license)

> Update this section once a license file is added.

---

## 👤 Author

**Name:** `Your Name`  
**LinkedIn/GitHub:** `Your Profile Links`
