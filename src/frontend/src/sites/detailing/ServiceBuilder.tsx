import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";
import { useSpring, useTransform } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  ADDONS,
  CAR_CLASSES,
  type CarClassId,
  PACKAGES,
  type Quote,
  computeQuote,
  formatHours,
  formatRub,
} from "./data";

function AnimatedValue({
  value,
  format,
}: { value: number; format: (v: number) => string }) {
  const spring = useSpring(value, { stiffness: 140, damping: 22 });
  const text = useTransform(spring, (v) => format(v));
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.span>{text}</motion.span>;
}

const roundRub = (v: number) => formatRub(Math.round(v / 100) * 100);
const roundHours = (v: number) => formatHours(Math.round(v * 2) / 2);

export function ServiceBuilder({ onBook }: { onBook: (q: Quote) => void }) {
  const [classId, setClassId] = useState<CarClassId>("sedan");
  const [packageId, setPackageId] = useState<string | null>("ceramic");
  const [addonIds, setAddonIds] = useState<string[]>(["glass"]);
  const quote = useMemo(
    () => computeQuote(classId, packageId, addonIds),
    [classId, packageId, addonIds],
  );
  const empty = quote.items.length === 0;
  const days = Math.max(1, Math.ceil(quote.hours / 9));

  const toggleAddon = (id: string) =>
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-12 lg:col-span-7">
        <fieldset>
          <legend className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            01 — Класс автомобиля
          </legend>
          <div className="grid grid-cols-3 border border-hairline">
            {CAR_CLASSES.map((c, i) => (
              <label
                key={c.id}
                className={cn(
                  "relative flex min-h-16 cursor-pointer flex-col justify-center px-3 py-3 transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring md:px-5",
                  i > 0 && "border-l border-hairline",
                  classId === c.id
                    ? "bg-foreground text-background"
                    : "hover:bg-card",
                )}
              >
                <input
                  type="radio"
                  name="car-class"
                  value={c.id}
                  checked={classId === c.id}
                  onChange={() => setClassId(c.id)}
                  className="sr-only"
                  data-ocid={`detail.class.radio.${i + 1}`}
                />
                <span className="font-display text-lg uppercase tracking-wide md:text-2xl">
                  {c.label}
                </span>
                <span
                  className={cn(
                    "hidden text-xs sm:block",
                    classId === c.id ? "opacity-70" : "text-ink-2",
                  )}
                >
                  {c.hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            02 — Пакет · один на выбор
          </h3>
          <ul className="border-t border-hairline">
            {PACKAGES.map((p, i) => {
              const on = packageId === p.id;
              return (
                <li key={p.id} className="border-b border-hairline">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPackageId(on ? null : p.id)}
                    data-ocid={`detail.package.toggle.${i + 1}`}
                    className="group grid w-full grid-cols-[1.5rem_1fr_auto] items-baseline gap-4 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 flex size-5 items-center justify-center border transition-colors duration-300",
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-hairline group-hover:border-foreground",
                      )}
                    >
                      {on && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block font-display text-xl uppercase tracking-wide transition-transform duration-500 ease-out-expo group-hover:translate-x-1 md:text-2xl",
                          on && "text-primary",
                        )}
                      >
                        {p.title}
                      </span>
                      <span className="mt-1 block text-sm text-ink-2">
                        {p.detail}
                      </span>
                    </span>
                    <span className="text-right font-mono text-sm tabular-nums">
                      {formatRub(p.price)}
                      <span className="block text-xs text-ink-2">
                        {formatHours(p.hours)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            03 — Дополнительно
          </h3>
          <div className="flex flex-wrap gap-2">
            {ADDONS.map((a, i) => {
              const on = addonIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleAddon(a.id)}
                  data-ocid={`detail.addon.toggle.${i + 1}`}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    on
                      ? "border-primary text-primary"
                      : "border-hairline hover:border-foreground",
                  )}
                >
                  <Plus
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 transition-transform duration-300",
                      on && "rotate-45",
                    )}
                  />
                  {a.title}
                  <span className="font-mono text-xs text-ink-2">
                    +{formatRub(a.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside
        aria-label="Итог расчёта"
        data-ocid="detail.quote.panel"
        className="self-start border border-hairline bg-card p-6 md:p-8 lg:sticky lg:top-8 lg:col-span-5"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
          {quote.carClass.label} · итог
        </p>
        <p className="mt-6 font-display text-5xl tabular-nums tracking-tight md:text-6xl">
          <AnimatedValue value={quote.price} format={roundRub} />
        </p>
        <p className="mt-2 font-mono text-sm tabular-nums text-ink-2">
          <AnimatedValue value={quote.hours} format={roundHours} /> в боксе
          {!empty &&
            ` · ${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`}
        </p>
        <output className="sr-only" aria-live="polite">
          {`${formatRub(quote.price)}, ${formatHours(quote.hours)}`}
        </output>
        <ul className="mt-6 space-y-1 border-t border-hairline pt-4 text-sm">
          {empty ? (
            <li data-ocid="detail.quote.empty_state" className="text-ink-2">
              Выберите пакет или хотя бы одну дополнительную услугу
            </li>
          ) : (
            quote.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-primary">
                  —
                </span>
                {item}
              </li>
            ))
          )}
        </ul>
        <button
          type="button"
          disabled={empty}
          onClick={() => onBook(quote)}
          data-ocid="detail.quote.primary_button"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 font-display text-sm uppercase tracking-[0.15em] text-primary-foreground transition-[transform,opacity] duration-300 ease-out-expo hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-40"
        >
          Записаться с этим набором
        </button>
        <p className="mt-3 text-xs text-ink-2">
          Цена окончательная после осмотра: если лак тоньше 90 мкм, полировку
          делаем щадящую и пересчитываем.
        </p>
      </aside>
    </div>
  );
}
