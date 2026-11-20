import {
  BackToPortfolio,
  CursorScene,
  CustomCursor,
  MagneticButton,
  MusicToggle,
  RevealHeadline,
} from "@/components/shared";
import { LIGHTING_PRESETS } from "@/lib/shared/three-helpers";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { BookingForm } from "./BookingForm";
import { MenuSection } from "./MenuSection";
import { ADDRESS, HOURS, MENU } from "./data";
import { createWineGlass, swirlWine } from "./wineGlass";

const NAV = [
  { href: "#menu", label: "Меню" },
  { href: "#booking", label: "Бронь" },
  { href: "#contacts", label: "Как найти" },
];

const RIBBON = MENU.flatMap((c) => c.dishes.slice(0, 3).map((d) => d.name));

export function RestaurantHome() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const prev = document.title;
    document.title = "Шафран — ресторан на углях";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="theme-resto grain relative min-h-screen overflow-x-hidden">
      <CustomCursor />
      <CursorScene
        create={createWineGlass}
        onFrame={swirlWine}
        lighting={LIGHTING_PRESETS.resto}
        offset={[1.55, -0.15]}
        mobileOffset={[0.75, 0.55]}
        maxTurn={0.55}
        maxTilt={0.3}
        cameraZ={6.2}
      />
      <BackToPortfolio />

      <header className="relative z-10 flex items-center justify-end gap-6 px-5 py-4 pl-48 md:px-10 md:py-5">
        <nav aria-label="Разделы ресторана" className="hidden gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-ocid={`resto.nav.${n.href.slice(1)}.link`}
              className="link-draw py-3 text-sm uppercase tracking-[0.18em]"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <MusicToggle />
      </header>

      <main>
        <section
          data-ocid="resto.hero.section"
          className="relative z-10 flex min-h-[calc(100svh-5rem)] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-2">
            Кухня Нижней Волги и Кавказа · с 2014
          </span>
          <RevealHeadline
            text="Шафран"
            split="letter"
            variant="tilt"
            stagger={0.07}
            duration={1.1}
            className="mt-6 font-display text-6xl uppercase leading-none tracking-[0.16em] sm:text-8xl lg:text-[10rem]"
          />
          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <motion.p
              initial={reduced ? false : { opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.9, duration: 1 }}
              className="max-w-md text-base leading-relaxed text-ink-2 md:col-span-5 md:text-lg"
            >
              Готовим на углях из виноградной лозы: стерлядь, ягнёнок, баклажан.
              Вина Дона и Крыма по бокалу. Тридцать два места и одна печь.
            </motion.p>
            <div className="flex flex-wrap items-center gap-6 md:col-span-7 md:justify-end">
              <MagneticButton
                href="#booking"
                data-ocid="resto.hero.booking.primary_button"
                className="rounded-none px-8 uppercase tracking-[0.2em]"
              >
                Забронировать стол
              </MagneticButton>
              <a
                href="#menu"
                data-ocid="resto.hero.menu.link"
                className="link-draw py-3 text-sm uppercase tracking-[0.18em]"
              >
                Смотреть меню
              </a>
            </div>
          </div>
        </section>

        <div
          aria-hidden="true"
          className="relative z-10 overflow-hidden border-y border-hairline bg-card py-4 text-card-foreground"
        >
          <div className="flex w-max animate-marquee">
            {["a", "b"].map((copy) => (
              <div key={copy} className="flex shrink-0">
                {RIBBON.map((name) => (
                  <span
                    key={`${copy}-${name}`}
                    className="flex items-center gap-8 pr-8 font-display text-2xl italic md:text-3xl"
                  >
                    {name}
                    <span className="text-primary not-italic">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <MenuSection />

        <section
          id="booking"
          aria-labelledby="booking-title"
          data-ocid="resto.booking.section"
          className="relative z-10 border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-36"
        >
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                Бронь стола
              </span>
              <h2
                id="booking-title"
                className="mt-4 mb-12 font-display text-4xl leading-tight md:text-6xl"
              >
                Оставим стол у печи
              </h2>
              <BookingForm />
            </div>

            <aside
              id="contacts"
              aria-label="Адрес и часы работы"
              className="md:col-span-4 md:col-start-9 md:pt-24"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                Адрес
              </span>
              <p className="mt-3 font-display text-2xl leading-snug">
                {ADDRESS.street}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                {ADDRESS.hint}
              </p>
              <a
                href={ADDRESS.phoneHref}
                data-ocid="resto.contacts.phone.link"
                className="link-draw mt-6 inline-block py-2 font-display text-2xl text-primary"
              >
                {ADDRESS.phone}
              </a>

              <span className="mt-12 block font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                Часы работы
              </span>
              <dl className="mt-3">
                {HOURS.map((h) => (
                  <div
                    key={h.days}
                    className="flex justify-between gap-4 border-b border-hairline py-3"
                  >
                    <dt>{h.days}</dt>
                    <dd className="tabular text-ink-2">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-ink-2">
                Кухня закрывается за час до закрытия зала.
              </p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="relative z-10 flex flex-col gap-3 border-t border-hairline bg-background px-5 pb-28 pt-10 text-sm text-ink-2 md:flex-row md:justify-between md:px-10">
        <span className="font-display text-lg uppercase tracking-[0.3em] text-foreground">
          Шафран
        </span>
        <span>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="link-draw text-foreground"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
