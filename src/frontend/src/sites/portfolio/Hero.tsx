import {
  CursorScene,
  MagneticButton,
  MusicToggle,
  RevealHeadline,
} from "@/components/shared";
import { LIGHTING_PRESETS } from "@/lib/shared/three-helpers";
import { motion, useReducedMotion } from "motion/react";
import { animateSculpture, createSculpture } from "./sculpture";

const NAV = [
  { href: "#works", label: "Работы" },
  { href: "#about", label: "Обо мне" },
  { href: "#contacts", label: "Контакты" },
];

export function PortfolioHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background">
      <div className="flex h-14 items-center justify-between gap-4 px-5 md:h-16 md:px-10">
        <a
          href="#top"
          data-ocid="portfolio.nav.home.link"
          className="font-display text-xs uppercase tracking-[0.12em] md:text-sm"
        >
          Алексей Ветров
        </a>
        <nav aria-label="Разделы" className="flex items-center gap-4 md:gap-8">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-ocid={`portfolio.nav.${item.href.slice(1)}.link`}
              className="link-draw hidden py-2 text-sm text-foreground sm:inline"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacts"
            data-ocid="portfolio.nav.contacts_mobile.link"
            className="link-draw py-2 text-sm sm:hidden"
          >
            Написать
          </a>
          <MusicToggle className="hidden md:inline-flex" />
        </nav>
      </div>
    </header>
  );
}

export function PortfolioHero() {
  const reduced = useReducedMotion();
  return (
    <section
      id="top"
      data-ocid="portfolio.hero.section"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-16 pt-24 md:justify-center md:px-10 md:pb-24"
    >
      <CursorScene
        position="absolute"
        create={createSculpture}
        onFrame={animateSculpture}
        lighting={LIGHTING_PRESETS.portfolio}
        offset={[1.75, 0.05]}
        mobileOffset={[0.35, 0.95]}
        maxTurn={0.85}
        maxTilt={0.5}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-b from-transparent to-background md:h-48"
      />
      <div className="relative z-10 max-w-3xl">
        <motion.p
          className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2"
          initial={reduced ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Фронтенд и 3D · Казань → везде
        </motion.p>
        <RevealHeadline
          text={["Сайты", "на ощупь"]}
          variant="rise"
          delay={0.15}
          className="mt-5 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
        />
        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-ink-2 md:text-lg"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
        >
          Скульптура справа поворачивается за вашим курсором. Так же отзываются
          и мои сайты: клиника, батуты, бюро, детейлинг и ресторан — ниже.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center gap-6"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton
            href="#contacts"
            data-ocid="portfolio.hero.primary_button"
          >
            Обсудить проект <span aria-hidden="true">↗</span>
          </MagneticButton>
          <a
            href="#works"
            data-ocid="portfolio.hero.works.link"
            className="link-draw py-2 text-sm"
          >
            Смотреть пять работ ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}
