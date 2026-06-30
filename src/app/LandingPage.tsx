import { AssetIcon } from "../ui/AssetIcon";
import { Icon } from "../ui/Icon";

const faqs = [
  {
    question: "Is Bocchi a therapy app?",
    answer: "No. Bocchi is not therapy or medical advice. It is a smol private wellness room for logging tiny care actions.",
  },
  {
    question: "Where is my data stored?",
    answer: "Your data stays locally on your device/browser. There is no account, no cloud sync, no ads, and no tracking.",
  },
  {
    question: "Who is Bocchi for?",
    answer: "Bocchi is for indoor people, introverts, loners, and anyone whose world has gotten small and wants basic care to feel softer.",
  },
  {
    question: "Do I need to go outside?",
    answer: "No. Outside is optional. Your room will wait.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="border-b border-border bg-surface/80 px-5 py-4 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4" aria-label="Landing navigation">
          <a className="focus-ring inline-flex items-center rounded-bocchi" href="/" aria-label="Bocchi home">
            <img className="h-10 w-auto pixel-icon" src="/logo.png" alt="bocchi" />
          </a>
          <a className="focus-ring rounded-[1rem] bg-warm px-5 py-3 text-sm font-bold text-white hover:bg-warmHover" href="/app">
            Enter your room
          </a>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:grid-cols-2 md:py-20">
          <div className="order-2 md:order-1">
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-ink sm:text-5xl md:text-6xl">
              Private wellness for indoor people, introverts, and loners.
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">
              Bocchi is a tiny room for caring for water, food, rest, movement, hygiene, room care, and gentle outside time. Just do one smol thing, and that’s enough :)
            </p>
            <div className="mt-6 inline-flex max-w-sm items-center gap-3 rounded-smol border border-ink/10 bg-white/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-soft shadow-bocchi">
              <AssetIcon name="lock" size={28} />
              <span>No accounts, no ads, no tracking. Your data stays on your device.</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <img className="mx-auto w-full max-w-[620px] pixel-art" src="/assets/hero-img.webp" alt="A cozy pixel room with Bocchi care hints" />
          </div>
        </section>

        <section className="bg-brandSoft/40 px-5 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-4xl font-bold text-ink">Care for your smol world</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <FeatureCard icon="plant" title="Care for your smol world">
                Build gentle habits, log your health metrics, and tend to what matters to you.
              </FeatureCard>
              <FeatureCard icon="sleep" title="Built for quiet days">
                Simple tools for rest, reflection, and low-energy days.
              </FeatureCard>
              <FeatureCard icon="heart" title="Private by default">
                Your room is your space. Everything is private and stays that way.
              </FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-4xl font-bold text-ink">Frequently Asked Questions</h2>
            <div className="mt-8 divide-y divide-border rounded-bocchi bg-surface/60">
              {faqs.map((faq) => (
                <details key={faq.question} className="group px-4 py-4">
                  <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-smol text-lg font-bold text-ink">
                    <span className="flex items-center gap-3"><Icon name="info" size={20} />{faq.question}</span>
                    <Icon name="chevronDown" size={22} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 pl-8 text-lg leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-warm px-5 py-16 text-center text-white">
          <img className="mx-auto h-16 w-auto rounded-bocchi bg-white/20 p-2 pixel-icon" src="/logo.png" alt="" />
          <h2 className="mx-auto mt-8 max-w-2xl text-4xl font-bold leading-tight">For quiet people and closed curtains.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Open your room, tap what needs care, and do one tiny thing. That is enough for today :)
          </p>
          <a className="focus-ring mt-8 inline-flex rounded-[1rem] bg-ink px-6 py-3 font-bold text-white hover:brightness-110" href="/app">
            Let’s start smol
          </a>
        </section>
      </main>

      <footer className="bg-ink px-5 py-5 text-sm text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row">
          <p>
            Copyright © bocchi by{" "}
            <a className="underline underline-offset-4" href="https://oktavsoftware.com/" target="_blank" rel="noreferrer">oktavsoftware</a>.
          </p>
          <p>
            v1.0.0 <span className="mx-2 text-white/40">·</span>
            <a className="underline underline-offset-4" href="https://github.com/indigoscipio/oktavhermit" target="_blank" rel="noreferrer">GitHub Link</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

type FeatureCardProps = {
  icon: "heart" | "plant" | "sleep";
  title: string;
  children: string;
};

function FeatureCard({ icon, title, children }: FeatureCardProps) {
  return (
    <article className="text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-bocchi border border-border bg-surface shadow-bocchi">
        <AssetIcon name={icon} size={62} />
      </div>
      <h3 className="mt-6 text-2xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-xs text-lg leading-relaxed text-muted">{children}</p>
    </article>
  );
}
