export function LandingPage() {
  return (
    <div className="min-h-dvh bg-bg px-5 py-8 text-ink">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:py-8">
        <section className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-bocchi border border-ink/10 bg-paper p-6 shadow-bocchi sm:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-muted">Bocchi</p>
            <h1 className="mt-3 text-5xl font-bold leading-none text-ink sm:text-6xl">Private wellness for indoor people.</h1>
            <p className="mt-5 text-xl leading-relaxed text-muted">
              A tiny room for caring for water, light, food, rest, movement, hygiene, room care, and gentle outside time — without streaks, pressure, or judgment.
            </p>
            <a className="focus-ring mt-6 inline-flex rounded-full bg-warm px-6 py-3 text-lg font-bold text-paper hover:brightness-105" href="/app">
              Enter your room
            </a>
          </div>

          <div className="rounded-bocchi border border-ink/10 bg-panel/70 p-5 shadow-bocchi">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-paper/70">
              <img className="h-full w-full object-contain" src="/assets/room-shell.webp" alt="A small pixel room preview" />
              <img className="absolute left-[34%] top-[62%] w-[28%] -translate-x-1/2 -translate-y-1/2" src="/assets/table-and-cup.webp" alt="" />
              <img className="absolute left-[50%] top-[36%] w-[34%] -translate-x-1/2 -translate-y-1/2" src="/assets/avatar-male.webp" alt="" />
              <img className="absolute left-[70%] top-[33%] w-[28%] -translate-x-1/2 -translate-y-1/2" src="/assets/window.webp" alt="" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard title="Care for your small world.">
            Bocchi turns basic care into tiny room interactions. Tap the cup for water, the window for light, the bed for rest, or the door when you are ready to step outside.
          </InfoCard>
          <InfoCard title="Built for quiet days.">
            For loners, introverts, hikikomori-adjacent users, and anyone whose world has gotten small or needs care to feel softer.
          </InfoCard>
          <InfoCard title="Private by default.">
            No account. No cloud sync. No ads. No tracking. Your data stays on this device, and you can export or clear it anytime.
          </InfoCard>
        </section>
      </main>

      <footer className="mx-auto mt-6 max-w-5xl pb-6 text-center text-sm text-muted">
        bocchi by{" "}
        <a className="font-semibold text-ink underline decoration-warm/40 underline-offset-4" href="https://oktavsoftware.com/" target="_blank" rel="noreferrer">
          oktavsoftware
        </a>{" "}
        <a className="font-semibold text-ink underline decoration-warm/40 underline-offset-4" href="https://github.com/indigoscipio/oktavhermit" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
}

type InfoCardProps = {
  title: string;
  children: string;
};

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <article className="rounded-bocchi border border-ink/10 bg-paper p-5 shadow-bocchi">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-3 text-lg leading-relaxed text-muted">{children}</p>
    </article>
  );
}
