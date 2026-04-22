export function LandingCard() {
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
        <section className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5">
          <h2 className="text-sm font-semibold text-slate-800">Audio Upload / Record</h2>
          <p className="mt-1 text-xs text-slate-500">Upload a voice clip or record directly.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="file"
              accept="audio/*"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              Record (Soon)
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="style" className="text-sm font-semibold text-slate-800">
              Style
            </label>
            <select
              id="style"
              defaultValue="realistic"
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
            className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(15,23,42,0.7)] transition hover:bg-slate-800"
          >
            Generate
          </button>
        </section>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Transcription</h3>
          <div className="mt-2 min-h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-400">
            Your speech transcription will appear here.
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Final Prompt</h3>
          <div className="mt-2 min-h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-400">
            Enhanced image prompt will appear here.
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800">Generated Image</h3>
          <div className="mt-3 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#edf2f7_100%)] text-sm text-slate-400">
            Generated image preview will appear here.
          </div>
        </section>
      </div>
    </article>
  );
}
