from fastapi import FastAPI

app = FastAPI(title="Speech-to-Image Free Backend")


@app.get("/")
async def health_check() -> dict[str, str]:
    """Basic health route to verify the API is running."""
    return {
        "status": "ok",
        "message": "Speech-to-Image backend is running",
    }
