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
    <article className="rounded-[28px] border border-white/70 bg-white/65 p-7 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-10 lg:p-12">
      <p className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
        EchoCanvas AI
      </p>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        Speak to Generate
      </h1>

      <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
        Upload or record your voice, choose a visual style, and generate a polished
        image from your spoken idea.
      </p>

      <div className="mt-10 space-y-6">
        <AudioInput value={selectedAudio} onChange={setSelectedAudio} />

        <section className="rounded-2xl border border-white/70 bg-gradient-to-b from-white/85 to-slate-50/70 p-5 shadow-[0_14px_36px_-26px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="style" className="text-sm font-semibold text-slate-800">
              Style
            </label>
            <select
              id="style"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              disabled={isLoading}
              className="mt-2 w-full rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300"
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
            className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgba(15,23,42,0.75)] transition duration-200 hover:scale-[1.02] hover:bg-slate-800 hover:shadow-[0_22px_34px_-18px_rgba(15,23,42,0.8)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? loadingMessage || "Generating image..." : "Generate"}
          </button>
          </div>
        </section>

        {isLoading ? <p className="text-sm text-slate-600">{loadingMessage}</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_14px_36px_-28px_rgba(15,23,42,0.4)] backdrop-blur">
          <h3 className="text-sm font-semibold tracking-wide text-slate-800 uppercase">Transcription</h3>
          <div className="mt-3 min-h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50/90 p-3 text-sm text-slate-500">
            {transcription || "Your speech transcription will appear here."}
          </div>
        </section>

        <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_14px_36px_-28px_rgba(15,23,42,0.4)] backdrop-blur">
          <h3 className="text-sm font-semibold tracking-wide text-slate-800 uppercase">Prompt</h3>
          <div className="mt-3 min-h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50/90 p-3 text-sm text-slate-500">
            {finalPrompt || "Enhanced image prompt will appear here."}
          </div>
        </section>

        <section className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_46px_-30px_rgba(15,23,42,0.45)] backdrop-blur lg:col-span-2">
          <h3 className="text-sm font-semibold tracking-wide text-slate-800 uppercase">Output</h3>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated output"
              className="mt-4 max-h-[34rem] w-full rounded-2xl border border-slate-200/80 object-cover shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)]"
            />
          ) : (
            <div className="mt-4 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#edf2f7_100%)] text-sm text-slate-400">
              Generated image preview will appear here.
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
