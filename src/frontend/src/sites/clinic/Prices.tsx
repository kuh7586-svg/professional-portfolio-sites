import { Magnetic } from "@/components/shared";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CONTACTS, PRICES, formatRub } from "./data";

export function ClinicPrices() {
  const [groupId, setGroupId] = useState(PRICES[0].id);
  const reduced = useReducedMotion();
  const group = PRICES.find((g) => g.id === groupId) ?? PRICES[0];

  return (
    <main data-ocid="clinic.prices.page" className="pb-28">
      <section className="grid gap-10 px-5 pt-14 md:grid-cols-12 md:px-10 md:pt-20">
        <div className="md:col-span-4">
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Услуги и цены
          </h1>
          <p className="mt-5 max-w-sm leading-relaxed text-ink-2">
            Цены действуют с 1 сентября 2026 года. Стоимость приёма не меняется,
            если врач задержался или назначил дополнительный осмотр.
          </p>
          <div
            role="tablist"
            aria-label="Разделы прайса"
            className="mt-10 flex flex-col border-t border-hairline"
          >
            {PRICES.map((g) => {
              const active = g.id === groupId;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="clinic-price-table"
                  onClick={() => setGroupId(g.id)}
                  data-ocid={`clinic.prices.${g.id}.tab`}
                  className={cn(
                    "group flex min-h-14 items-center justify-between border-b border-hairline text-left font-display text-xl transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-primary" : "hover:text-primary",
                  )}
                >
                  {g.title}
                  <span className="font-body text-xs tabular text-ink-2">
                    {g.items.length} позиций
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-8">
          <motion.div
            key={group.id}
            id="clinic-price-table"
            role="tabpanel"
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="max-h-[70svh] overflow-auto border-y border-hairline"
          >
            <table
              className="w-full border-collapse text-left"
              data-ocid="clinic.prices.table"
            >
              <caption className="sr-only">{group.title}</caption>
              <thead className="sticky top-0 bg-background">
                <tr className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                  <th scope="col" className="py-4 pr-4 font-normal">
                    Услуга
                  </th>
                  <th
                    scope="col"
                    className="hidden py-4 pr-4 font-normal sm:table-cell"
                  >
                    Длительность
                  </th>
                  <th scope="col" className="py-4 text-right font-normal">
                    Цена
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item, i) => (
                  <tr
                    key={item.name}
                    data-ocid={`clinic.prices.row.${i + 1}`}
                    className="border-t border-hairline transition-colors duration-300 hover:bg-card"
                  >
                    <td className="py-4 pr-4">
                      {item.name}
                      {item.duration && (
                        <span className="block text-xs text-ink-2 sm:hidden">
                          {item.duration}
                        </span>
                      )}
                    </td>
                    <td className="hidden py-4 pr-4 text-sm text-ink-2 sm:table-cell">
                      {item.duration ?? "—"}
                    </td>
                    <td className="whitespace-nowrap py-4 text-right font-medium tabular">
                      {formatRub(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="mt-4 text-xs text-ink-2">
            Оплата картой, наличными и по ДМС. Налоговый вычет — справку выдаём
            в регистратуре.
          </p>
        </div>
      </section>

      <section className="mx-5 mt-24 grid gap-8 border border-hairline bg-card p-6 md:mx-10 md:grid-cols-12 md:p-10">
        <div className="md:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Как добраться
          </p>
          <p className="mt-3 font-display text-2xl leading-snug">
            {CONTACTS.address}
          </p>
          <p className="mt-1 text-sm text-ink-2">{CONTACTS.metro}</p>
        </div>
        <dl className="space-y-1 md:col-span-3">
          {CONTACTS.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-4 tabular">
              <dt className="text-ink-2">{h.days}</dt>
              <dd>{h.time}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col items-start gap-4 md:col-span-4 md:items-end">
          <a
            href={CONTACTS.phoneHref}
            data-ocid="clinic.prices.phone.link"
            className="link-draw text-xl tabular"
          >
            {CONTACTS.phone}
          </a>
          <Magnetic>
            <Link
              to="/work/clinic/booking"
              data-ocid="clinic.prices.book.primary_button"
              className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Записаться
            </Link>
          </Magnetic>
        </div>
      </section>
    </main>
  );
}
