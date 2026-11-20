import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";
import {
  DAY_LABELS,
  DURATIONS,
  type DayType,
  type Duration,
  PRICES,
  rub,
} from "./data";

function Stepper({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const btn =
    "grid size-11 place-items-center rounded-full border border-card-foreground/30 transition-[transform,background-color] duration-300 hover:bg-card-foreground hover:text-card active:scale-90 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  return (
    <div className="flex items-center justify-between gap-4 border-b border-card-foreground/20 py-4">
      <div className="min-w-0">
        <p className="text-lg font-bold">{label}</p>
        <p className="text-sm text-card-foreground/70">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={btn}
          aria-label={`${label}: меньше`}
          disabled={value <= 0}
          onClick={() => onChange(value - 1)}
          data-ocid={`jump.calc.${id}.minus_button`}
        >
          <Minus className="size-4" />
        </button>
        <output
          aria-label={label}
          className="tabular w-8 text-center font-display text-2xl"
          data-ocid={`jump.calc.${id}.output`}
        >
          {value}
        </output>
        <button
          type="button"
          className={btn}
          aria-label={`${label}: больше`}
          disabled={value >= 20}
          onClick={() => onChange(value + 1)}
          data-ocid={`jump.calc.${id}.plus_button`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Segmented<T extends string | number>({
  name,
  legend,
  options,
  value,
  onChange,
  format,
}: {
  name: string;
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  format: (v: T) => string;
}) {
  return (
    <fieldset className="py-4">
      <legend className="mb-3 text-lg font-bold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={String(opt)}
            className={cn(
              "relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm font-bold transition-[transform,background-color,color] duration-300 ease-out-expo active:scale-95 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
              value === opt
                ? "-rotate-2 border-primary bg-primary text-primary-foreground"
                : "border-card-foreground/30 hover:border-card-foreground",
            )}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === opt}
              onChange={() => onChange(opt)}
              data-ocid={`jump.calc.${name}.radio`}
            />
            {format(opt)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TicketCalculator() {
  const [children, setChildren] = useState(2);
  const [adults, setAdults] = useState(1);
  const [duration, setDuration] = useState<Duration>(60);
  const [day, setDay] = useState<DayType>("weekday");
  const reduced = useReducedMotion();

  const price = PRICES[day][duration];
  const total = children * price.child + adults * price.adult;

  const spring = useSpring(total, { stiffness: 140, damping: 18 });
  const shown = useTransform(spring, (v) =>
    Math.max(0, Math.round(v)).toLocaleString("ru-RU"),
  );
  useEffect(() => {
    if (reduced) spring.jump(total);
    else spring.set(total);
  }, [total, spring, reduced]);

  return (
    <div
      className="grid gap-10 rounded-lg bg-card p-6 text-card-foreground md:grid-cols-12 md:p-10"
      data-ocid="jump.calc.panel"
    >
      <div className="md:col-span-7">
        <Stepper
          id="children"
          label="Дети"
          hint={`до 14 лет · ${rub(price.child)}`}
          value={children}
          onChange={setChildren}
        />
        <Stepper
          id="adults"
          label="Взрослые"
          hint={`которые тоже прыгают · ${rub(price.adult)}`}
          value={adults}
          onChange={setAdults}
        />
        <Segmented
          name="duration"
          legend="Сколько прыгаем"
          options={DURATIONS}
          value={duration}
          onChange={setDuration}
          format={(d) => `${d} мин`}
        />
        <Segmented
          name="day"
          legend="Когда"
          options={["weekday", "weekend"] as const}
          value={day}
          onChange={setDay}
          format={(d) => DAY_LABELS[d]}
        />
      </div>
      <div className="flex flex-col justify-between gap-6 border-card-foreground/20 md:col-span-5 md:border-l md:pl-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-card-foreground/70">
          Итого к оплате
        </p>
        <div>
          <motion.p
            key={`${day}-${duration}-${children}-${adults}`}
            initial={reduced ? false : { scaleY: 0.86, scaleX: 1.06 }}
            animate={{ scaleY: 1, scaleX: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
            className="tabular origin-bottom font-display text-6xl leading-none md:text-7xl"
            aria-hidden="true"
          >
            <motion.span>{shown}</motion.span>
            <span className="ml-2 text-primary">₽</span>
          </motion.p>
          <p className="sr-only" aria-live="polite" data-ocid="jump.calc.total">
            Итого: {rub(total)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-card-foreground/75">
            {children + adults === 0
              ? "Добавьте хотя бы одного прыгуна — посчитаем сразу."
              : `${children} дет. × ${rub(price.child)} + ${adults} взр. × ${rub(price.adult)}, ${duration} минут, ${DAY_LABELS[day].toLowerCase()}.`}
          </p>
        </div>
        <p className="text-sm text-card-foreground/70">
          Носки — 150 ₽, если нет своих. Оплата на ресепшене картой или по СБП.
        </p>
      </div>
    </div>
  );
}
