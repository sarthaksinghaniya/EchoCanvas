import { LandingCard } from "@/components/landing-card";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_35%,#eef3f8_100%)]" />
      <div className="pointer-events-none absolute -top-24 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />

      <section className="relative z-10 w-full max-w-3xl">
        <LandingCard />
      </section>
    </main>
  );
}
