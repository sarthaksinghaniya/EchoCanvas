export function LandingCard() {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/80 px-8 py-12 shadow-[0_10px_40px_-18px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:px-12">
      <p className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
        EchoCanvas AI
      </p>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        Create Images from Your Voice
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
        A local-first multilingual speech-to-image workspace built for fast ideation,
        visual storytelling, and creative experimentation.
      </p>
    </article>
  );
}
