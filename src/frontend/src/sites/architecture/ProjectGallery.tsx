import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MaskImage } from "./MaskImage";
import { FILTERS, type Filter, PROJECTS } from "./data";

/** Uneven rhythm: wide, narrow-dropped, centred-wide. */
const SLOTS = [
  "md:col-span-7",
  "md:col-span-5 md:mt-40",
  "md:col-span-8 md:col-start-3",
];

export function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>("Все");
  const shown =
    filter === "Все" ? PROJECTS : PROJECTS.filter((p) => p.type === filter);

  return (
    <section
      id="proekty"
      aria-labelledby="proekty-title"
      data-ocid="arch.gallery.section"
      className="relative z-10 scroll-mt-16 border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-40"
    >
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Избранное · 2022—2025
          </p>
          <h2
            id="proekty-title"
            className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tight md:text-7xl"
          >
            Проекты
          </h2>
        </div>
        <div
          role="tablist"
          aria-label="Тип проекта"
          className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-7 md:justify-end"
        >
          {FILTERS.map((f) => {
            const count =
              f === "Все"
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.type === f).length;
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                data-ocid={`arch.filter.${FILTERS.indexOf(f) + 1}.tab`}
                className={cn(
                  "relative min-h-11 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "text-foreground"
                    : "text-ink-2 hover:text-foreground",
                )}
              >
                {f}
                <sup className="ml-1 tabular">{count}</sup>
                {active && (
                  <motion.span
                    layoutId="arch-filter-line"
                    className="absolute inset-x-0 bottom-2 h-px bg-foreground"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ul
        data-ocid="arch.project.list"
        className="mt-16 grid gap-x-10 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-y-24"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={SLOTS[i % SLOTS.length]}
            >
              <Link
                to={`/work/architecture/${p.id}`}
                data-ocid={`arch.project.item.${i + 1}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <MaskImage
                  src={p.cover}
                  alt={`${p.title}, ${p.city}`}
                  className="aspect-[16/10]"
                />
                <div className="mt-5 flex items-baseline justify-between gap-6 border-b border-hairline pb-5">
                  <div className="min-w-0">
                    <h3 className="font-display text-3xl leading-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-4xl">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-2">
                      {p.type} · {p.city}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular text-ink-2">
                    {p.year} / {p.area}
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
