import { CursorScene, Magnetic, RevealHeadline } from "@/components/shared";
import { LIGHTING_PRESETS } from "@/lib/shared/three-helpers";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CONTACTS, DOCTORS, SPECIALTIES, formatRub } from "./data";
import { animateMolecule, createMolecule } from "./molecule";

const VISIT = [
  {
    time: "00:00",
    title: "Без очереди у кабинета",
    text: "Приходите к своему времени: администратор встречает и провожает к врачу. Опоздание врача больше 10 минут — приём бесплатно.",
  },
  {
    time: "00:30",
    title: "Полчаса на разговор",
    text: "Первичный приём длится 30–40 минут. Врач успевает выслушать, осмотреть и ответить на вопросы.",
  },
  {
    time: "Тот же день",
    title: "Анализы и ЭКГ здесь же",
    text: "Лаборатория на этаже. Результаты общего анализа крови приходят на почту через три часа.",
  },
  {
    time: "Через неделю",
    title: "Врач позвонит сам",
    text: "Уточнит, как действует лечение, и при необходимости поправит схему без повторного визита.",
  },
];

export function ClinicHome() {
  const reduced = useReducedMotion();
  return (
    <main data-ocid="clinic.home.page">
      <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col justify-end overflow-hidden px-5 pb-14 pt-24 md:px-10 md:pb-20">
        <CursorScene
          position="absolute"
          create={createMolecule}
          onFrame={animateMolecule}
          lighting={LIGHTING_PRESETS.clinic}
          offset={[1.9, 0.35]}
          mobileOffset={[0.6, 1.5]}
          maxTurn={0.9}
          maxTilt={0.5}
        />
        <div className="relative z-10 max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Поликлиника на Малой Садовой · с 2009 года
          </p>
          <RevealHeadline
            text={["Врач, у которого", "есть время на вас"]}
            variant="tilt"
            className="mt-6 font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          />
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg"
          >
            Приём 30 минут, а не 12. Терапевты, кардиологи, неврологи, педиатры
            и офтальмологи — {DOCTORS.length} врачей в одном здании у Гостиного
            двора.
          </motion.p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Magnetic strength={0.4}>
              <Link
                to="/work/clinic/booking"
                data-ocid="clinic.hero.primary_button"
                className="inline-flex min-h-12 items-center gap-3 rounded-[var(--radius)] bg-primary px-7 text-base font-medium text-primary-foreground transition-transform duration-300 ease-out-expo active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Записаться
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Magnetic>
            <a
              href={CONTACTS.phoneHref}
              data-ocid="clinic.hero.phone.link"
              className="link-draw text-sm tabular"
            >
              или позвоните {CONTACTS.phone}
            </a>
          </div>
        </div>
        <EcgLine />
      </section>

      <section className="relative z-10 border-t border-hairline bg-card px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <h2 className="font-display text-3xl leading-tight md:col-span-4 md:text-5xl">
            Как проходит приём
          </h2>
          <ol className="md:col-span-8">
            {VISIT.map((step) => (
              <li
                key={step.title}
                className="grid gap-2 border-t border-hairline py-7 sm:grid-cols-[9rem_1fr]"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary tabular">
                  {step.time}
                </span>
                <div>
                  <h3 className="font-display text-xl">{step.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-ink-2">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-3xl md:text-5xl">Направления</h2>
          <Link
            to="/work/clinic/prices"
            data-ocid="clinic.home.prices.link"
            className="link-draw text-sm"
          >
            Полный прайс →
          </Link>
        </div>
        <ul className="mt-12 border-b border-hairline">
          {SPECIALTIES.map((s, i) => {
            const count = DOCTORS.filter((d) => d.specialty === s.id).length;
            return (
              <li key={s.id} className="border-t border-hairline">
                <Link
                  to="/work/clinic/doctors"
                  data-ocid={`clinic.home.specialty.item.${i + 1}`}
                  className="group relative grid items-baseline gap-2 py-6 md:grid-cols-12 md:gap-6"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[-1px] h-px origin-left scale-x-0 bg-primary transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                  />
                  <span className="font-display text-2xl transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:col-span-4 md:text-3xl">
                    {s.label}
                  </span>
                  <span className="text-ink-2 md:col-span-5">{s.note}</span>
                  <span className="flex justify-between gap-4 text-sm tabular md:col-span-3 md:justify-end">
                    <span className="text-ink-2">
                      {count} {count === 1 ? "врач" : "врача"}
                    </span>
                    <span>от {formatRub(s.priceFrom)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

function EcgLine() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 60"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 w-full text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path
        d="M0 40H210l8-14 8 14h20l6-34 9 50 7-16h16l10-10 10 10H600"
        strokeDasharray="600"
        className="animate-pulse-line"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
