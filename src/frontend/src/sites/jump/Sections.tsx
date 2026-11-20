import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { PartyForm } from "./PartyForm";
import { TicketCalculator } from "./TicketCalculator";
import {
  CONTACTS,
  DURATIONS,
  PACKAGES,
  PRICES,
  RULES,
  ZONES,
  rub,
} from "./data";

const view = { once: true, margin: "0px 0px -12% 0px" } as const;

function Kicker({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
      {children}
    </p>
  );
}

export function Zones() {
  const reduced = useReducedMotion();
  return (
    <section
      id="zones"
      className="relative z-10 scroll-mt-28 border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-36"
      data-ocid="jump.zones.section"
    >
      <div className="grid gap-6 md:grid-cols-12">
        <Kicker>01 — Зоны и аттракционы</Kicker>
        <h2 className="font-display text-3xl leading-[1.05] md:col-span-8 md:col-start-5 md:text-5xl">
          1 400 м² — шесть зон, в каждой своя высота
        </h2>
      </div>
      <ul className="mt-16 border-b border-hairline">
        {ZONES.map((z, i) => (
          <motion.li
            key={z.name}
            initial={reduced ? false : { x: i % 2 ? 80 : -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={view}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
            className="group grid gap-3 border-t border-hairline py-8 md:grid-cols-12 md:items-baseline md:gap-6"
            data-ocid={`jump.zones.item.${i + 1}`}
          >
            <span className="tabular font-mono text-sm text-ink-2 md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:col-span-4 md:text-3xl">
              {z.name}
            </h3>
            <p className="font-bold text-primary md:col-span-2">{z.fact}</p>
            <p className="max-w-prose leading-relaxed md:col-span-4">
              {z.text}
            </p>
            <span className="justify-self-start rounded-sm border border-hairline px-2 py-1 font-mono text-[11px] uppercase tracking-[0.15em] md:col-span-1 md:justify-self-end">
              {z.age}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function Tariffs() {
  const reduced = useReducedMotion();
  return (
    <section
      id="tariffs"
      className="relative z-10 scroll-mt-28 bg-muted px-5 py-24 md:px-10 md:py-36"
      data-ocid="jump.tariffs.section"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Kicker>02 — Тарифы</Kicker>
          <h2 className="mt-6 font-display text-3xl leading-[1.05] md:text-5xl">
            Платите за минуты, а не за вход
          </h2>
          <p className="mt-6 max-w-prose leading-relaxed text-ink-2">
            Цена за одного прыгуна. Время идёт с момента выхода на арену,
            инструктаж в него не входит.
          </p>
          <table className="mt-10 w-full text-left text-sm">
            <caption className="sr-only">Цены за одного прыгуна</caption>
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="py-3 font-bold">Время</th>
                <th className="py-3 text-right font-bold">Будни</th>
                <th className="py-3 text-right font-bold">Выходные</th>
              </tr>
            </thead>
            <tbody>
              {DURATIONS.map((d, i) => (
                <motion.tr
                  key={d}
                  initial={reduced ? false : { scaleY: 0.4, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={view}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 11,
                    delay: i * 0.07,
                  }}
                  className="origin-bottom border-b border-hairline"
                >
                  <td className="py-3 font-bold">{d} мин</td>
                  <td className="tabular py-3 text-right">
                    {rub(PRICES.weekday[d].child)}
                    <span className="block text-xs text-ink-2">
                      взр. {rub(PRICES.weekday[d].adult)}
                    </span>
                  </td>
                  <td className="tabular py-3 text-right">
                    {rub(PRICES.weekend[d].child)}
                    <span className="block text-xs text-ink-2">
                      взр. {rub(PRICES.weekend[d].adult)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:col-span-8">
          <h3 className="mb-5 font-display text-2xl">Посчитайте поход</h3>
          <TicketCalculator />
        </div>
      </div>
    </section>
  );
}

export function Parties() {
  const [pkg, setPkg] = useState("");
  const reduced = useReducedMotion();
  return (
    <section
      id="parties"
      className="relative z-10 scroll-mt-28 bg-background px-5 py-24 md:px-10 md:py-36"
      data-ocid="jump.parties.section"
    >
      <Kicker>03 — Праздники</Kicker>
      <h2 className="mt-6 max-w-4xl font-display text-3xl leading-[1.05] md:text-5xl">
        День рождения, после которого все спят без задних ног
      </h2>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {PACKAGES.map((p, i) => {
          const active = pkg === p.id;
          return (
            <motion.button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPkg(p.id)}
              initial={reduced ? false : { rotate: i % 2 ? 5 : -5, y: 60 }}
              whileInView={{ rotate: 0, y: 0 }}
              viewport={view}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              className={cn(
                "flex flex-col rounded-lg border-2 p-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-8",
                active
                  ? "border-card bg-card text-card-foreground"
                  : "border-hairline hover:border-foreground",
              )}
              data-ocid={`jump.parties.item.${i + 1}`}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">
                до {p.maxGuests} детей · {p.hours} часа
              </span>
              <span className="mt-4 font-display text-3xl">{p.name}</span>
              <span className="tabular mt-2 text-xl font-bold">
                {rub(p.price)}
              </span>
              <ul className="mt-6 space-y-2 text-sm leading-relaxed">
                {p.includes.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
              <span className="mt-8 text-sm font-bold underline-offset-4">
                {active ? "Выбран ✓" : "Выбрать пакет"}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-20 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="font-display text-2xl md:text-3xl">Бронь праздника</h3>
          <p className="mt-4 leading-relaxed text-ink-2">
            Оставьте дату и число гостей — администратор перезвонит и закрепит
            за вами комнату. Предоплата 30%, отмена бесплатно за 3 дня.
          </p>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <PartyForm pkg={pkg} onPkgChange={setPkg} />
        </div>
      </div>
    </section>
  );
}

export function Rules() {
  const reduced = useReducedMotion();
  return (
    <section
      id="rules"
      className="relative z-10 scroll-mt-28 border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-36"
      data-ocid="jump.rules.section"
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Kicker>04 — Правила</Kicker>
          <h2 className="mt-6 font-display text-3xl leading-[1.05] md:text-5xl">
            Шесть правил, чтобы прыгать без травм
          </h2>
          <div className="mt-10 space-y-1 text-sm">
            <p className="font-bold">{CONTACTS.address}</p>
            <p className="text-ink-2">{CONTACTS.metro}</p>
          </div>
        </div>
        <ol className="md:col-span-7 md:col-start-6">
          {RULES.map((rule, i) => (
            <motion.li
              key={rule}
              initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={view}
              transition={{
                duration: 0.9,
                ease: [0.76, 0, 0.24, 1],
                delay: i * 0.06,
              }}
              className="flex gap-6 border-b border-hairline py-6 first:pt-0"
              data-ocid={`jump.rules.item.${i + 1}`}
            >
              <span className="tabular font-display text-2xl text-primary">
                {i + 1}
              </span>
              <p className="text-base leading-relaxed md:text-lg">{rule}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
