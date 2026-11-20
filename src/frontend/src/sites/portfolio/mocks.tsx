import { motion } from "motion/react";
import type { CSSProperties } from "react";

export interface MockProps {
  live: boolean;
}

const run = (live: boolean): CSSProperties => ({
  animationPlayState: live ? "running" : "paused",
});

function MiniNav({ name, links }: { name: string; links: string[] }) {
  return (
    <div className="absolute inset-x-[4%] top-[5%] flex items-center justify-between border-b border-hairline pb-[1.4%] text-[1.5cqw]">
      <span className="font-display text-[2cqw]">{name}</span>
      <span className="hidden gap-[2.5cqw] text-ink-2 @[360px]:flex">
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </span>
    </div>
  );
}

export function ClinicMock({ live }: MockProps) {
  return (
    <div className="theme-clinic absolute inset-0">
      <MiniNav name="Тихий пульс" links={["Врачи", "Цены", "Запись"]} />
      <div className="absolute left-[4%] top-[24%] w-[46%]">
        <p className="font-display text-[4.4cqw] leading-[1.05]">
          Врач, который сначала слушает
        </p>
        <span className="mt-[2.5cqw] inline-block rounded-md bg-primary px-[2cqw] py-[0.9cqw] text-[1.5cqw] text-primary-foreground">
          Записаться на приём
        </span>
      </div>
      <div className="absolute right-[4%] top-[22%] grid w-[38%] grid-cols-2 gap-[1.2cqw]">
        {["Терапевт", "Кардиолог", "УЗИ", "Анализы"].map((s) => (
          <div key={s} className="rounded-md bg-card p-[1.4cqw] text-[1.5cqw]">
            {s}
            <span className="mt-[2cqw] block text-ink-2">от 1 900 ₽</span>
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 600 60"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[8%] h-[16%] w-full text-primary"
        aria-hidden="true"
      >
        <path
          d="M0 30 H210 L228 30 L240 6 L254 54 L266 18 L276 30 H600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="600"
          className="animate-pulse-line"
          style={run(live)}
        />
      </svg>
    </div>
  );
}

export function JumpMock({ live }: MockProps) {
  return (
    <div className="theme-jump absolute inset-0">
      <MiniNav name="Прыг" links={["Зоны", "Цены", "Праздники"]} />
      <p className="absolute left-[4%] top-[20%] font-display text-[13cqw] leading-none">
        ПРЫГ
      </p>
      <p className="absolute left-[4%] top-[58%] w-[40%] text-[1.8cqw] text-ink-2">
        Сорок батутов, поролоновая яма и тренер у каждой зоны
      </p>
      <div className="absolute bottom-[10%] right-[30%] flex h-[20cqw] w-[13cqw] items-end justify-center">
        <span
          className="block h-[9cqw] w-[9cqw] animate-squash rounded-full bg-primary"
          style={run(live)}
        />
      </div>
      <div className="absolute bottom-[10%] right-[4%] w-[22%] rounded-3xl bg-card p-[1.8cqw] text-card-foreground">
        <span className="font-display text-[4cqw] leading-none">1 200</span>
        <span className="block text-[1.4cqw] opacity-80">м² прыжков</span>
      </div>
    </div>
  );
}

export function ArchMock({ live }: MockProps) {
  const cols = ["c1", "c2", "c3", "c4", "c5", "c6"];
  return (
    <div className="theme-arch absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex justify-between px-[4%]">
        {cols.map((c) => (
          <span key={c} className="h-full w-px bg-border" />
        ))}
      </div>
      <MiniNav name="Отвес" links={["Проекты", "Бюро", "Контакт"]} />
      <p className="absolute left-[4%] top-[22%] font-display text-[10cqw] italic leading-none">
        Отвес
      </p>
      <p className="absolute left-[4%] top-[50%] w-[30%] text-[1.5cqw] text-ink-2">
        Дома, которые стоят прямо. Казань, Свияжск, Иннополис
      </p>
      <div
        className="absolute bottom-0 right-[4%] flex h-[62%] w-[52%] items-end gap-[1.5cqw] transition-transform duration-[1600ms] ease-out-expo"
        style={{ transform: live ? "translateX(-8%)" : "translateX(0)" }}
      >
        <div className="h-full w-[34%] border border-foreground" />
        <div className="h-[70%] w-[22%] bg-foreground" />
        <div className="h-[86%] w-[30%] border border-foreground bg-card" />
      </div>
      <span
        className="absolute bottom-[12%] left-[4%] h-px w-[38%] origin-left bg-foreground transition-transform duration-1000 ease-out-expo"
        style={{ transform: live ? "scaleX(1)" : "scaleX(0.2)" }}
      />
    </div>
  );
}

export function DetailMock({ live }: MockProps) {
  return (
    <div className="theme-detail absolute inset-0 overflow-hidden">
      <MiniNav name="ГРАФИТ" links={["Услуги", "До / после", "Запись"]} />
      <div className="absolute inset-x-[4%] bottom-[10%] top-[22%] flex">
        <div className="relative w-1/2 bg-card">
          <span className="absolute left-[6%] top-[8%] text-[1.4cqw] uppercase tracking-[0.2em] text-ink-2">
            До
          </span>
          <span className="absolute bottom-[10%] left-[6%] font-display text-[5cqw] uppercase leading-none text-ink-2">
            Мутный лак
          </span>
        </div>
        <div className="relative w-1/2 border-l border-primary bg-background">
          <span className="absolute left-[6%] top-[8%] text-[1.4cqw] uppercase tracking-[0.2em] text-primary">
            После
          </span>
          <span className="absolute bottom-[10%] left-[6%] font-display text-[5cqw] uppercase leading-none">
            Зеркало
          </span>
        </div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          animate={live ? { x: ["-50%", "50%"] } : { x: "0%" }}
          transition={
            live
              ? {
                  duration: 2.6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
              : { duration: 0.6 }
          }
        >
          <span className="absolute inset-y-0 left-1/2 w-px bg-primary" />
        </motion.div>
      </div>
    </div>
  );
}

const DISHES = [
  "Тартар из оленины",
  "Уха на костре",
  "Пирог с щавелем",
  "Утка с брусникой",
  "Шафрановый пломбир",
];
const RIBBON = ["a", "b"].flatMap((pass) =>
  DISHES.map((dish) => ({ id: `${pass}-${dish}`, dish })),
);

export function RestoMock({ live }: MockProps) {
  return (
    <div className="theme-resto absolute inset-0 overflow-hidden">
      <MiniNav name="Шафран" links={["Меню", "Вино", "Стол"]} />
      <p className="absolute left-[4%] top-[24%] font-display text-[7cqw] uppercase leading-none tracking-[0.18em]">
        Шафран
      </p>
      <p className="absolute left-[4%] top-[48%] text-[1.6cqw] text-ink-2">
        Поволжская кухня · ужин с 18:00
      </p>
      <span
        className="absolute right-[8%] top-[16%] block h-[24cqw] w-[24cqw] animate-spin-slow rounded-full border border-dashed border-primary"
        style={run(live)}
      />
      <div className="absolute inset-x-0 bottom-[8%] overflow-hidden bg-card py-[1.2cqw]">
        <div
          className="flex w-max animate-marquee gap-[3cqw] whitespace-nowrap text-[1.8cqw] text-card-foreground"
          style={{ ...run(live), animationDuration: "14s" }}
        >
          {RIBBON.map((item) => (
            <span key={item.id}>
              {item.dish} <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
