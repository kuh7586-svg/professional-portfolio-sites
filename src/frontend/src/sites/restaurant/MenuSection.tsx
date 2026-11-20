import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useRef, useState } from "react";
import { MENU, formatPrice } from "./data";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function MenuSection() {
  const [active, setActive] = useState(MENU[0].id);
  const reduced = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = MENU.findIndex((c) => c.id === active);
  const category = MENU[index];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + MENU.length) % MENU.length;
    setActive(MENU[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      data-ocid="resto.menu.section"
      className="relative z-10 border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-36"
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Меню · осень 2026
          </span>
          <h2
            id="menu-title"
            className="mt-4 font-display text-4xl leading-tight md:text-6xl"
          >
            Что сегодня на углях
          </h2>
          <div className="relative mt-10 hidden h-40 overflow-hidden md:block">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={category.id}
                aria-hidden="true"
                initial={reduced ? false : { y: "100%", rotate: 8 }}
                animate={{ y: "0%", rotate: 0 }}
                exit={{ y: "-100%", rotate: -8 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="absolute left-0 top-0 block origin-left font-display text-[9rem] leading-none text-outline"
              >
                0{index + 1}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="min-w-0 md:col-span-8">
          <div
            role="tablist"
            aria-label="Разделы меню"
            onKeyDown={onKeyDown}
            className="-mx-5 flex gap-1 overflow-x-auto border-b border-hairline px-5 md:mx-0 md:px-0"
          >
            {MENU.map((c, i) => {
              const selected = c.id === active;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls="menu-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  data-ocid={`resto.menu.${c.id}.tab`}
                  className={cn(
                    "relative min-h-12 shrink-0 px-4 pb-3 pt-2 font-body text-sm uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "text-primary"
                      : "text-ink-2 hover:text-foreground",
                  )}
                >
                  {c.label}
                  {selected && (
                    <motion.span
                      layoutId="resto-tab-line"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-x-2 -bottom-px h-0.5 bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`tab-${category.id}`}
            data-ocid="resto.menu.panel"
            className="relative mt-8 min-h-[28rem]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={category.id}
                initial="hidden"
                animate="shown"
                exit="gone"
                variants={{
                  hidden: {},
                  shown: {
                    transition: { staggerChildren: reduced ? 0 : 0.055 },
                  },
                  gone: { opacity: 0, transition: { duration: 0.2 } },
                }}
              >
                <p className="mb-6 font-display text-lg italic text-ink-2">
                  {category.note}
                </p>
                <ul>
                  {category.dishes.map((dish, i) => (
                    <motion.li
                      key={dish.id}
                      data-ocid={`resto.menu.item.${i + 1}`}
                      variants={{
                        hidden: reduced
                          ? { opacity: 1 }
                          : {
                              opacity: 0,
                              x: 40,
                              clipPath: "inset(0 0 0 100%)",
                            },
                        shown: {
                          opacity: 1,
                          x: 0,
                          clipPath: "inset(0 0 0 0%)",
                          transition: { duration: 0.6, ease: EASE },
                        },
                      }}
                      className="group grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-hairline py-5"
                    >
                      <h3 className="flex min-w-0 items-baseline gap-3 font-display text-xl md:text-2xl">
                        <span className="break-words transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                          {dish.name}
                        </span>
                        {dish.mark && (
                          <span className="shrink-0 border border-primary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                            {dish.mark}
                          </span>
                        )}
                      </h3>
                      <span className="tabular self-baseline text-right font-display text-xl text-primary md:text-2xl">
                        {formatPrice(dish.price)}
                      </span>
                      <p className="text-sm leading-relaxed text-ink-2 md:text-base">
                        {dish.description}
                      </p>
                      <span className="text-right font-mono text-xs text-ink-2">
                        {dish.weight}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
