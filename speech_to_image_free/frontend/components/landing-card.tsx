"use client";

import { useRef, useState } from "react";

import { AudioInput } from "@/components/AudioInput";
import { speechToImage } from "@/lib/api";

export function LandingCard() {
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [style, setStyle] = useState("realistic");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const loadingTimersRef = useRef<number[]>([]);

  const handleGenerate = async () => {
    if (!selectedAudio) {
      setError("Please upload or record an audio file first.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Uploading audio...");
    setError(null);

    window.clearTimeout(loadingTimersRef.current[0]);
    window.clearTimeout(loadingTimersRef.current[1]);
    loadingTimersRef.current = [
      window.setTimeout(() => setLoadingMessage("Transcribing..."), 700),
      window.setTimeout(() => setLoadingMessage("Generating image..."), 1800),
    ];

    try {
      const result = await speechToImage(selectedAudio, style);
      setTranscription(result.transcription);
      setFinalPrompt(result.final_prompt);
      setImageUrl(result.image_url);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Something went wrong.";
      setError(message);
    } finally {
      loadingTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      loadingTimersRef.current = [];
      setLoadingMessage("");
      setIsLoading(false);
    }
  };

  return (
    <article className="rounded-2xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
      <p className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
        EchoCanvas AI
      </p>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Speak to Generate
      </h1>

      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
        Upload or record your voice, choose a visual style, and generate a polished
        image from your spoken idea.
      </p>

      <div className="mt-8 space-y-5">
        <AudioInput value={selectedAudio} onChange={setSelectedAudio} />

        <section className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="style" className="text-sm font-semibold text-slate-800">
              Style
            </label>
            <select
              id="style"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              disabled={isLoading}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300"
            >
              <option value="realistic">Realistic</option>
              <option value="anime">Anime</option>
              <option value="fantasy">Fantasy</option>
              <option value="digital-art">Digital Art</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={isLoading}
            className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(15,23,42,0.7)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? loadingMessage || "Generating image..." : "Generate"}
          </button>
        </section>

        {isLoading ? <p className="text-sm text-slate-600">{loadingMessage}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Transcription</h3>
          <div className="mt-2 min-h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            {transcription || "Your speech transcription will appear here."}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Final Prompt</h3>
          <div className="mt-2 min-h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            {finalPrompt || "Enhanced image prompt will appear here."}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800">Generated Image</h3>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated output"
              className="mt-3 max-h-[30rem] w-full rounded-2xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="mt-3 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#edf2f7_100%)] text-sm text-slate-400">
              Generated image preview will appear here.
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
