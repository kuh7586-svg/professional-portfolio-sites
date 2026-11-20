import {
  BackToPortfolio,
  CursorScene,
  MagneticButton,
  MusicToggle,
  RevealHeadline,
} from "@/components/shared";
import { LIGHTING_PRESETS } from "@/lib/shared/three-helpers";
import { useEffect } from "react";
import { Parties, Rules, Tariffs, Zones } from "./Sections";
import { CONTACTS, NAV } from "./data";
import { bounceFrame, createTrampoline } from "./scene";

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background">
      <div className="flex items-center justify-between gap-4 px-3 py-2 md:px-5">
        <div className="flex items-center gap-4 md:gap-8">
          <BackToPortfolio fixed={false} />
          <a
            href="#top"
            className="hidden font-display text-xl sm:block"
            data-ocid="jump.nav.logo.link"
          >
            ПРЫГ
          </a>
        </div>
        <nav
          aria-label="Разделы"
          className="hidden items-center gap-7 text-sm font-bold md:flex"
        >
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="link-draw py-3"
              data-ocid={`jump.nav.${n.id}.link`}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <MusicToggle />
      </div>
      <nav
        aria-label="Разделы"
        className="flex gap-5 overflow-x-auto border-t border-hairline px-4 text-sm font-bold md:hidden"
      >
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="shrink-0 py-3"
            data-ocid={`jump.nav_mobile.${n.id}.link`}
          >
            {n.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-14 pt-40 md:px-10 md:pb-20"
      data-ocid="jump.hero.section"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
        Батутный центр «Прыг» · Савёловская
      </p>
      <RevealHeadline
        text={["Прыгай выше,", "чем вчера"]}
        variant="tilt"
        split="letter"
        stagger={0.03}
        className="mt-5 max-w-[12ch] font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl"
      />
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <MagneticButton
            href="#tariffs"
            className="min-h-14 px-8 font-display text-base"
            data-ocid="jump.hero.primary_button"
          >
            Посчитать билеты
          </MagneticButton>
          <a
            href="#parties"
            className="link-draw py-3 text-base font-bold"
            data-ocid="jump.hero.secondary_button"
          >
            Устроить день рождения →
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm md:text-right">
          {CONTACTS.hours.map((h) => (
            <div key={h.days}>
              <dt className="text-ink-2">{h.days}</dt>
              <dd className="tabular font-bold">{h.time}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const host = encodeURIComponent(window.location.hostname);
  return (
    <footer className="relative z-10 bg-card px-5 pb-28 pt-16 text-card-foreground md:px-10">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="font-display text-5xl md:col-span-5 md:text-7xl">ПРЫГ</p>
        <div className="space-y-1 text-sm md:col-span-4">
          <p className="font-bold">{CONTACTS.address}</p>
          <p className="opacity-75">{CONTACTS.metro}</p>
          <a
            href={CONTACTS.phoneHref}
            className="link-draw mt-3 inline-block py-2 text-lg font-bold"
            data-ocid="jump.footer.phone.link"
          >
            {CONTACTS.phone}
          </a>
        </div>
        <dl className="space-y-2 text-sm md:col-span-3">
          {CONTACTS.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-4">
              <dt className="opacity-75">{h.days}</dt>
              <dd className="tabular font-bold">{h.time}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-16 text-xs opacity-70">
        © {year}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${host}`}
          target="_blank"
          rel="noreferrer"
          className="link-draw"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

export function JumpHome() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Батутный центр «Прыг» — Москва, Савёловская";
    const root = document.documentElement;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduced) root.style.scrollBehavior = "smooth";
    return () => {
      document.title = prev;
      root.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="theme-jump relative min-h-screen overflow-x-clip">
      <CursorScene
        create={createTrampoline}
        onFrame={bounceFrame}
        lighting={LIGHTING_PRESETS.jump}
        maxTurn={0.45}
        maxTilt={0.25}
        offset={[2.4, 0.3]}
        mobileOffset={[0.2, 1.1]}
        cameraZ={9}
      />
      <Header />
      <main>
        <Hero />
        <Zones />
        <Tariffs />
        <Parties />
        <Rules />
      </main>
      <Footer />
    </div>
  );
}
