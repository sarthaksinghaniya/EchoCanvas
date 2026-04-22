export type SpeechToImageResult = {
  transcription: string;
  final_prompt: string;
  image_url: string;
};

type SpeechToImageApiResponse = {
  transcription?: unknown;
  final_prompt?: unknown;
  image_url?: unknown;
  detail?: unknown;
};

const SPEECH_TO_IMAGE_ENDPOINT = "http://localhost:8000/speech-to-image";

export async function speechToImage(
  file: File,
  style?: string
): Promise<SpeechToImageResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (style) {
    formData.append("style", style);
  }

  let response: Response;
  try {
    response = await fetch(SPEECH_TO_IMAGE_ENDPOINT, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Unable to connect to backend at http://localhost:8000.");
  }

  let payload: SpeechToImageApiResponse | null = null;
  try {
    payload = (await response.json()) as SpeechToImageApiResponse;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail =
      payload && typeof payload.detail === "string"
        ? payload.detail
        : "Speech-to-image request failed.";
    throw new Error(detail);
  }

  const transcription =
    payload && typeof payload.transcription === "string" ? payload.transcription : "";
  const finalPrompt =
    payload && typeof payload.final_prompt === "string" ? payload.final_prompt : "";
  const imageUrl = payload && typeof payload.image_url === "string" ? payload.image_url : "";

  if (!imageUrl) {
    throw new Error("Backend response did not include a valid image URL.");
  }

  return {
    transcription,
    final_prompt: finalPrompt,
    image_url: imageUrl,
  };
}
