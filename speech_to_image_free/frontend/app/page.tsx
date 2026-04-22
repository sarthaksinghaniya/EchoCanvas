import { LandingCard } from "@/components/landing-card";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_34%,#eaf1f8_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.45)_0%,rgba(226,238,251,0.35)_55%,rgba(244,248,253,0.5)_100%)]" />
      <div className="pointer-events-none absolute -top-24 h-72 w-72 rounded-full bg-white/75 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-sky-100/65 blur-3xl" />

      <section className="relative z-10 w-full max-w-5xl">
        <LandingCard />
      </section>
    </main>
  );
}
