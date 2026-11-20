import { TransitionLink } from "@/components/shared";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { SITES, type SiteInfo } from "@/lib/shared/sites";
import { motion, useInView, useReducedMotion } from "motion/react";
import { type ComponentType, useRef, useState } from "react";
import {
  ArchMock,
  ClinicMock,
  DetailMock,
  JumpMock,
  type MockProps,
  RestoMock,
} from "./mocks";

interface WorkMeta {
  type: string;
  stack: string;
  note: string;
  Mock: ComponentType<MockProps>;
}

const META: Record<Exclude<SiteInfo["id"], "portfolio">, WorkMeta> = {
  clinic: {
    type: "Поликлиника · запись к врачу",
    stack: "React · TanStack Router · three.js",
    note: "Онлайн-запись в три шага и прайс без звёздочек",
    Mock: ClinicMock,
  },
  jump: {
    type: "Батутный центр · билеты и праздники",
    stack: "React · Motion · three.js",
    note: "Мяч на первом экране пружинит от курсора",
    Mock: JumpMock,
  },
  architecture: {
    type: "Архитектурное бюро · портфолио проектов",
    stack: "React · three.js · Motion",
    note: "Каркас дома собирается линиями при прокрутке",
    Mock: ArchMock,
  },
  detailing: {
    type: "Детейлинг-центр · услуги и запись",
    stack: "React · three.js · Pointer Events",
    note: "Ползунок до/после по настоящему лаку",
    Mock: DetailMock,
  },
  restaurant: {
    type: "Ресторан · меню и бронь стола",
    stack: "React · Motion · Tailwind",
    note: "Меню бежит лентой, бокал ловит свет",
    Mock: RestoMock,
  },
};

function WorkRow({ site, index }: { site: SiteInfo; index: number }) {
  const meta = META[site.id as keyof typeof META];
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { amount: 0.55 });
  const [hovered, setHovered] = useState(false);
  const live = fine ? hovered : inView;
  const { Mock } = meta;
  const num = String(index + 1).padStart(2, "0");

  return (
    <li ref={ref} className="border-t border-hairline">
      <TransitionLink
        to={site.path}
        data-cursor="открыть"
        data-active={live}
        data-ocid={`portfolio.work.item.${index + 1}`}
        aria-label={`${site.name} — ${meta.type}. Открыть демо`}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="group grid grid-cols-[3rem_1fr] gap-x-4 py-6 focus-visible:outline-none md:grid-cols-[8rem_1fr] md:gap-x-8 md:py-8"
      >
        <span className="font-display text-2xl leading-none text-ink-2 transition-colors duration-500 group-data-[active=true]:text-primary md:text-5xl">
          {num}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="font-display text-2xl uppercase leading-[1.02] tracking-tight transition-transform duration-700 ease-out-expo group-data-[active=true]:translate-x-2 md:text-5xl">
              {site.name}
            </h3>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
              {site.kind}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-2 md:text-base">
            {meta.type} <span aria-hidden="true">·</span> {meta.stack}
          </p>
          <motion.div
            className="@container relative mt-4 aspect-[4/3] overflow-hidden border border-hairline bg-muted group-focus-visible:ring-2 group-focus-visible:ring-ring md:mt-5 md:aspect-[21/9]"
            initial={reduced ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, amount: 0.05, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="absolute inset-0 opacity-40 grayscale">
              <Mock live={false} />
            </div>
            <div className="absolute inset-0 transition-[clip-path] duration-700 ease-in-out-quart [clip-path:inset(0_100%_0_0)] group-data-[active=true]:[clip-path:inset(0_0_0_0)]">
              <Mock live={live} />
            </div>
          </motion.div>
          <p className="mt-4 flex items-center justify-between gap-4 text-sm">
            <span className="text-ink-2">{meta.note}</span>
            <span className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] transition-transform duration-500 ease-out-expo group-data-[active=true]:-translate-x-1">
              Открыть ↗
            </span>
          </p>
        </div>
      </TransitionLink>
    </li>
  );
}

export function PortfolioWorks() {
  const works = SITES.filter((s) => s.id !== "portfolio");
  return (
    <section
      id="works"
      data-ocid="portfolio.works.section"
      className="relative z-10 bg-background scroll-mt-16 px-5 pt-16 pb-8 md:scroll-mt-20 md:px-10 md:pt-24 md:pb-12"
    >
      <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
        <h2 className="font-display text-3xl leading-[0.95] tracking-tight md:text-5xl">
          Пять работ
        </h2>
        <p className="max-w-xs text-right text-sm text-ink-2">
          Превью оживает в палитре своего сайта. Клик открывает демо целиком.
        </p>
      </div>
      <ul data-ocid="portfolio.works.list">
        {works.map((site, i) => (
          <WorkRow key={site.id} site={site} index={i} />
        ))}
      </ul>
    </section>
  );
}
