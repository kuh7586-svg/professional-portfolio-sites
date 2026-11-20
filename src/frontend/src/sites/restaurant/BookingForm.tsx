import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type FormEvent, type ReactNode, useState } from "react";
import { ADDRESS } from "./data";

type Field = "date" | "time" | "guests" | "name" | "phone";
type Errors = Partial<Record<Field, string>>;
interface Draft {
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MAX_GUESTS = 8;

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Пт и Сб работаем до 01:00 — последняя посадка 23:30, в остальные дни 22:00. */
function slotsFor(iso: string): string[] {
  const day = iso ? parseIso(iso).getDay() : 1;
  const last = day === 5 || day === 6 ? 23.5 : 22;
  const out: string[] = [];
  for (let h = 12; h <= last; h += 0.5) {
    out.push(`${pad(Math.floor(h))}:${h % 1 ? "30" : "00"}`);
  }
  return out;
}

function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = `7${d.slice(1)}`;
  if (d && !d.startsWith("7")) d = `7${d}`;
  d = d.slice(0, 11);
  if (!d) return "";
  const p = d.slice(1);
  let s = "+7";
  if (p.length) s += ` (${p.slice(0, 3)}`;
  if (p.length >= 3) s += ")";
  if (p.length > 3) s += ` ${p.slice(3, 6)}`;
  if (p.length > 6) s += `-${p.slice(6, 8)}`;
  if (p.length > 8) s += `-${p.slice(8, 10)}`;
  return s;
}

function validate(f: Draft, now: Date): Errors {
  const e: Errors = {};
  const today = toIso(now);
  const limit = new Date(now);
  limit.setDate(limit.getDate() + 60);
  if (!f.date) e.date = "Выберите дату визита";
  else if (f.date < today)
    e.date = "Эта дата уже прошла — выберите сегодня или позже";
  else if (f.date > toIso(limit))
    e.date = "Бронируем не дальше чем на 60 дней вперёд";

  const slots = slotsFor(f.date);
  if (!f.time) e.time = "Выберите время";
  else if (!slots.includes(f.time))
    e.time = `В этот день последняя посадка в ${slots[slots.length - 1]}`;
  else if (f.date === today) {
    const [h, m] = f.time.split(":").map(Number);
    if (h * 60 + m < now.getHours() * 60 + now.getMinutes() + 30)
      e.time =
        "На сегодня бронируем минимум за 30 минут — выберите время позже";
  }

  if (f.guests < 1 || f.guests > MAX_GUESTS)
    e.guests = `Онлайн — от 1 до ${MAX_GUESTS} гостей. Компанию больше ждём по телефону`;

  const name = f.name.trim();
  if (!name) e.name = "Как к вам обращаться?";
  else if (name.length < 2 || !/^[A-Za-zА-Яа-яЁё\s-]+$/.test(name))
    e.name = "Имя — минимум 2 буквы, без цифр и символов";

  if (!f.phone) e.phone = "Укажите телефон — позвоним, чтобы подтвердить стол";
  else if (f.phone.replace(/\D/g, "").length !== 11)
    e.phone = "Номер неполный: нужно 10 цифр после +7";
  return e;
}

const inputCls =
  "w-full min-h-12 border-0 border-b border-hairline bg-transparent px-0 pb-2 pt-1 font-body text-lg text-foreground [color-scheme:dark] placeholder:text-ink-2/60 transition-colors duration-300 focus:border-primary focus:outline-none focus-visible:ring-0";

function FieldBox({
  id,
  label,
  error,
  children,
  className,
}: {
  id: Field;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={`booking-${id}`}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2"
      >
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`booking-${id}-error`}
            data-ocid={`resto.booking.${id}.error_state`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const EMPTY: Draft = { date: "", time: "", guests: 2, name: "", phone: "" };

export function BookingForm() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [confirmed, setConfirmed] = useState<(Draft & { code: string }) | null>(
    null,
  );
  const now = new Date();
  const slots = slotsFor(form.date);

  const update = <K extends Field>(key: K, value: Draft[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (tried) setErrors(validate(next, new Date()));
  };

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setTried(true);
    const found = validate(form, new Date());
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(`booking-${first}`)?.focus();
      return;
    }
    setConfirmed({
      ...form,
      code: `Ш-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const reset = () => {
    setConfirmed(null);
    setForm(EMPTY);
    setTried(false);
    setErrors({});
  };

  const aria = (id: Field) => ({
    id: `booking-${id}`,
    "aria-invalid": Boolean(errors[id]),
    "aria-describedby": errors[id] ? `booking-${id}-error` : undefined,
  });

  const dateLabel = confirmed
    ? parseIso(confirmed.date).toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {confirmed ? (
        <motion.div
          key="done"
          data-ocid="resto.booking.success_state"
          initial={reduced ? false : { clipPath: "inset(50% 0 50% 0)" }}
          animate={{ clipPath: "inset(0% 0 0% 0)" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="bg-card px-6 py-10 text-card-foreground md:px-10 md:py-14"
          aria-live="polite"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Бронь {confirmed.code}
          </span>
          <h3 className="mt-4 font-display text-3xl md:text-5xl">
            Стол ждёт вас, {confirmed.name.trim()}
          </h3>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-foreground/20 pt-6">
            {[
              ["Когда", `${dateLabel}, ${confirmed.time}`],
              ["Гостей", String(confirmed.guests)],
              ["Телефон", confirmed.phone],
              ["Адрес", ADDRESS.street],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                  {k}
                </dt>
                <dd className="mt-1 break-words text-base first-letter:uppercase">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-md text-sm leading-relaxed opacity-80">
            За два часа до визита администратор Вера позвонит, чтобы подтвердить
            стол. Держим бронь 20 минут.
          </p>
          <button
            type="button"
            onClick={reset}
            data-ocid="resto.booking.edit_button"
            className="link-draw mt-8 min-h-11 font-mono text-xs uppercase tracking-[0.2em] text-primary"
          >
            Забронировать другой стол
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={submit}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          data-ocid="resto.booking.form"
          className="grid grid-cols-2 gap-x-8 gap-y-8"
        >
          <FieldBox id="date" label="Дата" error={errors.date}>
            <input
              type="date"
              {...aria("date")}
              min={toIso(now)}
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              data-ocid="resto.booking.date.input"
              className={inputCls}
            />
          </FieldBox>
          <FieldBox id="time" label="Время" error={errors.time}>
            <select
              {...aria("time")}
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              data-ocid="resto.booking.time.select"
              className={cn(inputCls, "bg-background")}
            >
              <option value="">—:—</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FieldBox>
          <FieldBox
            id="guests"
            label="Гостей"
            error={errors.guests}
            className="col-span-2"
          >
            <div className="mt-2 flex items-center gap-1 border-b border-hairline pb-2">
              {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  id={n === 1 ? "booking-guests" : undefined}
                  aria-pressed={form.guests === n}
                  aria-label={`${n} гост${n === 1 ? "ь" : n < 5 ? "я" : "ей"}`}
                  onClick={() => update("guests", n)}
                  data-ocid={`resto.booking.guests.toggle.${n}`}
                  className={cn(
                    "tabular relative grid size-11 place-items-center font-display text-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    form.guests === n
                      ? "text-primary-foreground"
                      : "text-ink-2 hover:text-foreground",
                  )}
                >
                  {form.guests === n && (
                    <motion.span
                      layoutId="resto-guests"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 30,
                      }}
                      className="absolute inset-0 bg-primary"
                    />
                  )}
                  <span className="relative">{n}</span>
                </button>
              ))}
            </div>
          </FieldBox>
          <FieldBox
            id="name"
            label="Имя"
            error={errors.name}
            className="col-span-2 sm:col-span-1"
          >
            <input
              type="text"
              autoComplete="given-name"
              placeholder="Анна"
              {...aria("name")}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              data-ocid="resto.booking.name.input"
              className={inputCls}
            />
          </FieldBox>
          <FieldBox
            id="phone"
            label="Телефон"
            error={errors.phone}
            className="col-span-2 sm:col-span-1"
          >
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (900) 000-00-00"
              {...aria("phone")}
              value={form.phone}
              onChange={(e) => update("phone", formatPhone(e.target.value))}
              data-ocid="resto.booking.phone.input"
              className={inputCls}
            />
          </FieldBox>
          <div className="col-span-2 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              data-ocid="resto.booking.submit_button"
              className="min-h-12 bg-primary px-8 font-body text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Забронировать стол
            </button>
            <span className="text-sm text-ink-2">
              Больше {MAX_GUESTS} гостей —{" "}
              <a href={ADDRESS.phoneHref} className="link-draw text-foreground">
                {ADDRESS.phone}
              </a>
            </span>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
