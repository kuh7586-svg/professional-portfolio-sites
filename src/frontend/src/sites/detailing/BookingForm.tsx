import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type FormEvent, useRef, useState } from "react";
import { type Quote, formatHours, formatRub } from "./data";

type Field = "name" | "phone" | "car" | "date";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", phone: "", car: "", date: "" };
const ORDER: Field[] = ["name", "phone", "car", "date"];

function isoDate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function shiftDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoDate(d);
}

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (!d) return "";
  if (d[0] === "8") d = `7${d.slice(1)}`;
  if (d[0] !== "7") d = `7${d}`;
  d = d.slice(0, 11);
  let out = "+7";
  if (d.length > 1) out += ` (${d.slice(1, 4)}`;
  if (d.length >= 4) out += ")";
  if (d.length > 4) out += ` ${d.slice(4, 7)}`;
  if (d.length > 7) out += `-${d.slice(7, 9)}`;
  if (d.length > 9) out += `-${d.slice(9, 11)}`;
  return out;
}

function validate(v: Values): Errors {
  const e: Errors = {};
  const name = v.name.trim();
  if (!name) e.name = "Укажите имя — так мастер будет к вам обращаться";
  else if (!/^[A-Za-zА-Яа-яЁё\s-]{2,40}$/.test(name))
    e.name = "Имя — только буквы, от 2 до 40 символов";
  const digits = v.phone.replace(/\D/g, "");
  if (!digits) e.phone = "Нужен телефон, чтобы подтвердить время";
  else if (digits.length !== 11)
    e.phone = "Номер неполный: нужно 10 цифр после +7";
  if (v.car.trim().length < 2)
    e.car = "Напишите марку и модель, например «Kia K5»";
  if (!v.date) e.date = "Выберите дату визита";
  else if (v.date < shiftDays(1)) e.date = "Ближайшая свободная дата — завтра";
  else if (v.date > shiftDays(60))
    e.date = "Запись открыта только на 60 дней вперёд";
  return e;
}

const LABELS: Record<Field, string> = {
  name: "Имя",
  phone: "Телефон",
  car: "Марка и модель",
  date: "Дата визита",
};

export function BookingForm({ quote }: { quote: Quote | null }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState<Values | null>(null);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({});
  const reduced = useReducedMotion();

  const update = (field: Field, raw: string) => {
    const next = {
      ...values,
      [field]: field === "phone" ? formatPhone(raw) : raw,
    };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    setConfirmed(values);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
    setConfirmed(null);
  };

  if (confirmed) {
    const when = new Date(`${confirmed.date}T10:00:00`).toLocaleDateString(
      "ru-RU",
      { weekday: "long", day: "numeric", month: "long" },
    );
    return (
      <motion.div
        data-ocid="detail.booking.success_state"
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="border border-primary p-6 md:p-10"
        aria-live="polite"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Заявка принята
        </p>
        <h3 className="mt-4 font-display text-3xl uppercase leading-none md:text-5xl">
          {confirmed.name.trim()}, ждём {confirmed.car.trim()}
        </h3>
        <dl className="mt-8 grid gap-4 border-t border-hairline pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-2">Дата</dt>
            <dd className="mt-1 text-base">{when}, к 10:00</dd>
          </div>
          <div>
            <dt className="text-ink-2">Перезвоним</dt>
            <dd className="mt-1 text-base">{confirmed.phone} за 30 минут</dd>
          </div>
          {quote && (
            <div className="sm:col-span-2">
              <dt className="text-ink-2">Работы</dt>
              <dd className="mt-1 text-base">
                {quote.items.join(", ")} — {formatRub(quote.price)},{" "}
                {formatHours(quote.hours)}
              </dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          onClick={reset}
          data-ocid="detail.booking.secondary_button"
          className="mt-8 min-h-11 border-b border-foreground pb-1 text-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Записать другую машину
        </button>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8">
      <p
        data-ocid="detail.booking.quote_summary"
        className="border-l-2 border-primary pl-4 text-sm text-ink-2"
      >
        {quote
          ? `${quote.carClass.label}: ${quote.items.join(", ")} · ${formatRub(quote.price)}`
          : "Набор услуг можно не выбирать — подберём на осмотре, он бесплатный."}
      </p>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        {ORDER.map((field) => {
          const error = errors[field];
          const id = `detail-${field}`;
          return (
            <div key={field} className="min-w-0">
              <Label
                htmlFor={id}
                className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2"
              >
                {LABELS[field]}
              </Label>
              <Input
                id={id}
                ref={(el) => {
                  refs.current[field] = el;
                }}
                type={
                  field === "date" ? "date" : field === "phone" ? "tel" : "text"
                }
                inputMode={field === "phone" ? "tel" : undefined}
                autoComplete={
                  field === "name" ? "name" : field === "phone" ? "tel" : "off"
                }
                placeholder={
                  field === "name"
                    ? "Андрей"
                    : field === "phone"
                      ? "+7 (900) 000-00-00"
                      : field === "car"
                        ? "BMW X5, 2021"
                        : undefined
                }
                min={field === "date" ? shiftDays(1) : undefined}
                max={field === "date" ? shiftDays(60) : undefined}
                value={values[field]}
                onChange={(e) => update(field, e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                data-ocid={`detail.booking.${field}.input`}
                className={cn(
                  "mt-2 h-12 rounded-none border-0 border-b bg-transparent px-0 text-lg shadow-none [color-scheme:dark] focus-visible:ring-0 dark:bg-transparent md:text-lg",
                  error
                    ? "border-destructive"
                    : "border-hairline focus-visible:border-primary",
                )}
              />
              {error && (
                <p
                  id={`${id}-error`}
                  data-ocid={`detail.booking.${field}.error_state`}
                  className="mt-2 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        data-ocid="detail.booking.submit_button"
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-8 font-display text-sm uppercase tracking-[0.15em] text-primary-foreground transition-[transform,opacity] duration-300 ease-out-expo hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Отправить заявку
      </button>
    </form>
  );
}
