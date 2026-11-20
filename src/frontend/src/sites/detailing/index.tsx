import {
  BackToPortfolio,
  CursorScene,
  MagneticButton,
  MusicToggle,
  RevealHeadline,
} from "@/components/shared";
import { LIGHTING_PRESETS } from "@/lib/shared/three-helpers";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { BeforeAfter } from "./BeforeAfter";
import { BookingForm } from "./BookingForm";
import { ServiceBuilder } from "./ServiceBuilder";
import { animateCar, createCar } from "./carModel";
import type { Quote } from "./data";

const NAV = [
  { href: "#services", label: "Расчёт" },
  { href: "#result", label: "До / после" },
  { href: "#booking", label: "Запись" },
];

const FACTS = [
  { value: "4", label: "бокса с закрытой вентиляцией" },
  { value: "1 840", label: "машин с 2016 года" },
  { value: "3 года", label: "гарантия на керамику" },
];

function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-12 flex items-end justify-between gap-6 border-b border-hairline pb-6 md:mb-16">
      <h2 className="font-display text-4xl uppercase leading-none tracking-tight md:text-6xl">
        {title}
      </h2>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
        {index}
      </span>
    </div>
  );
}

export function DetailingHome() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = "Детейлинг «Графит» — полировка, керамика, плёнка";
  }, []);

  const book = (q: Quote) => {
    setQuote(q);
    document
      .getElementById("booking")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div
      data-ocid="detail.page"
      className="theme-detail grain relative min-h-screen overflow-x-clip"
    >
      <CursorScene
        create={createCar}
        onFrame={animateCar}
        lighting={LIGHTING_PRESETS.detail}
        maxTurn={0.9}
        maxTilt={0.25}
        offset={[1.35, -0.25]}
        mobileOffset={[0, -0.95]}
        cameraZ={6}
      />
      <BackToPortfolio />

      <header className="relative z-10 flex items-center justify-end gap-6 px-5 pb-4 pl-44 pt-4 md:px-10 md:pl-56 md:pt-6">
        <span className="mr-auto hidden font-display text-xl uppercase tracking-[0.3em] sm:block">
          Графит
        </span>
        <nav aria-label="Разделы" className="hidden gap-6 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-ocid={`detail.nav.${n.href.slice(1)}.link`}
              className="min-h-11 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-2 transition-colors hover:text-primary"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <MusicToggle />
      </header>

      <section className="relative z-10 flex min-h-[calc(100svh-5rem)] flex-col justify-between px-5 pb-10 pt-10 md:px-10 md:pt-20">
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/40"
            animate={{ y: ["0vh", "92vh"], opacity: [0, 1, 0] }}
            transition={{
              duration: 5.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatDelay: 1.5,
            }}
          />
        )}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Детейлинг-ателье · Москва, Электрозаводская, 21
          </p>
          <RevealHeadline
            text={["Лак как в день", "выдачи из салона"]}
            variant="tilt"
            className="mt-6 font-display text-5xl uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl"
          />
          <p className="mt-8 max-w-md text-base leading-relaxed text-ink-2 md:text-lg">
            Убираем голограммы и паутинку, закрываем кузов керамикой или
            плёнкой. Толщину лака меряем до и после — замеры отдаём вам.
          </p>
          <MagneticButton
            href="#services"
            data-ocid="detail.hero.primary_button"
            className="mt-10 rounded-lg px-8 font-display uppercase tracking-[0.15em]"
          >
            Рассчитать стоимость
          </MagneticButton>
        </div>
        <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-hairline pt-6">
          {FACTS.map((f) => (
            <div key={f.label}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-display text-2xl uppercase md:text-4xl">
                {f.value}
              </dd>
              <dd
                aria-hidden="true"
                className="mt-1 text-xs text-ink-2 md:text-sm"
              >
                {f.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        id="services"
        className="relative z-10 scroll-mt-6 bg-background px-5 py-24 md:px-10 md:py-40"
      >
        <SectionHead index="Конструктор" title="Соберите работы" />
        <ServiceBuilder onBook={book} />
      </section>

      <section
        id="result"
        className="relative z-10 scroll-mt-6 border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-40"
      >
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
              Коррекция + керамика · 22 часа
            </span>
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-tight md:text-6xl">
              Тяните шторку
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-ink-2">
              Капот Audi A6 цвета «дайтона». Было 34 мкм на кромке и сплошные
              голограммы после автомойки. Сняли 3 мкм, остальное — глянец.
            </p>
          </div>
          <div className="lg:col-span-8">
            <BeforeAfter />
          </div>
        </div>
      </section>

      <section
        id="booking"
        className="relative z-10 scroll-mt-6 border-t border-hairline bg-card px-5 py-24 md:px-10 md:py-40"
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-4xl uppercase leading-none tracking-tight md:text-6xl">
              Запись на осмотр
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-ink-2">
              Осмотр — 20 минут и бесплатно. Перезвоним в течение получаса, с
              9:00 до 21:00 без выходных.
            </p>
          </div>
          <div className="lg:col-span-8">
            <BookingForm quote={quote} />
          </div>
        </div>
      </section>

      <footer className="relative z-10 flex flex-col gap-4 border-t border-hairline bg-background px-5 pb-28 pt-10 text-sm text-ink-2 md:flex-row md:justify-between md:px-10">
        <span>
          «Графит» · Электрозаводская, 21 ·{" "}
          <a href="tel:+74951234567" className="hover:text-primary">
            +7 (495) 123-45-67
          </a>
        </span>
        <span>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
