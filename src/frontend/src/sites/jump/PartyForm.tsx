import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, type ReactNode, useState } from "react";
import { CONTACTS, PACKAGES, rub } from "./data";

type Field = "date" | "pkg" | "guests" | "name" | "phone";
type Errors = Partial<Record<Field, string>>;

function isoDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

interface Props {
  pkg: string;
  onPkgChange: (id: string) => void;
}

export function PartyForm({ pkg, onPkgChange }: Props) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  const minDate = isoDay(2);
  const maxDate = isoDay(180);
  const chosen = PACKAGES.find((p) => p.id === pkg);

  const errors: Errors = {};
  if (!date) errors.date = "Выберите дату праздника.";
  else if (date < minDate)
    errors.date = "Бронируем минимум за 2 дня — выберите дату позже.";
  else if (date > maxDate)
    errors.date = "Запись открыта только на полгода вперёд.";
  if (!chosen) errors.pkg = "Выберите пакет праздника.";
  const g = Number(guests);
  if (!guests) errors.guests = "Укажите, сколько будет детей.";
  else if (!Number.isInteger(g) || g < 3)
    errors.guests = "Минимум 3 ребёнка — иначе лучше взять обычные билеты.";
  else if (chosen && g > chosen.maxGuests)
    errors.guests = `В пакет «${chosen.name}» помещается до ${chosen.maxGuests} детей. Выберите пакет побольше.`;
  if (name.trim().length < 2) errors.name = "Напишите, как к вам обращаться.";
  if (phone.replace(/\D/g, "").length < 11)
    errors.phone = "Нужен телефон из 11 цифр, например +7 916 123-45-67.";

  const show = (f: Field) => (tried ? errors[f] : undefined);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (Object.keys(errors).length === 0) setDone(true);
  };

  const reset = () => {
    setDate("");
    setGuests("");
    setName("");
    setPhone("");
    setTried(false);
    setDone(false);
  };

  const input =
    "mt-2 block min-h-12 w-full rounded-full border-2 bg-background px-5 text-base text-foreground transition-colors duration-300 focus-visible:border-primary focus-visible:outline-none";

  const fieldBox = (f: Field, label: string, control: ReactNode) => (
    <div>
      <label htmlFor={`party-${f}`} className="text-sm font-bold">
        {label}
      </label>
      {control}
      {show(f) && (
        <p
          id={`party-${f}-error`}
          className="mt-2 pl-5 text-sm font-semibold text-destructive"
          data-ocid={`jump.party.${f}.error_state`}
        >
          {show(f)}
        </p>
      )}
    </div>
  );
  const aria = (f: Field) => ({
    id: `party-${f}`,
    "aria-invalid": Boolean(show(f)),
    "aria-describedby": show(f) ? `party-${f}-error` : undefined,
    className: cn(input, show(f) ? "border-destructive" : "border-hairline"),
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done && chosen ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="rounded-lg border-2 border-primary p-8 md:p-10"
          data-ocid="jump.party.success_state"
          aria-live="polite"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Заявка принята
          </p>
          <h3 className="mt-4 font-display text-3xl md:text-4xl">
            Ура, {name.trim()}! Праздник почти готов
          </h3>
          <dl className="mt-8 grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="text-sm text-ink-2">Дата</dt>
              <dd className="font-bold">{formatDate(date)}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-2">Пакет</dt>
              <dd className="font-bold">
                «{chosen.name}» — {rub(chosen.price)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-2">Гостей</dt>
              <dd className="font-bold">{guests} детей</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-2">Перезвоним на</dt>
              <dd className="font-bold">{phone}</dd>
            </div>
          </dl>
          <p className="mt-8 max-w-prose leading-relaxed text-ink-2">
            Администратор позвонит в течение часа (с 10:00 до 22:00), уточнит
            время и пришлёт ссылку на предоплату 30%. Вопросы — {CONTACTS.phone}
            .
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 min-h-11 rounded-full border-2 border-foreground px-6 text-sm font-bold transition-[transform,background-color,color] duration-300 hover:bg-foreground hover:text-background active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-ocid="jump.party.reset_button"
          >
            Забронировать ещё один праздник
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={submit}
          exit={{ opacity: 0, scale: 0.96 }}
          className="grid gap-5"
          data-ocid="jump.party.form"
        >
          {fieldBox(
            "date",
            "Дата праздника",
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-ocid="jump.party.date.input"
              {...aria("date")}
            />,
          )}
          {fieldBox(
            "pkg",
            "Пакет",
            <select
              value={pkg}
              onChange={(e) => onPkgChange(e.target.value)}
              data-ocid="jump.party.pkg.select"
              {...aria("pkg")}
            >
              <option value="">— выберите пакет —</option>
              {PACKAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · до {p.maxGuests} детей · {rub(p.price)}
                </option>
              ))}
            </select>,
          )}
          {fieldBox(
            "guests",
            "Сколько детей",
            <input
              type="number"
              inputMode="numeric"
              min={3}
              max={20}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="например, 10"
              data-ocid="jump.party.guests.input"
              {...aria("guests")}
            />,
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {fieldBox(
              "name",
              "Ваше имя",
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="jump.party.name.input"
                {...aria("name")}
              />,
            )}
            {fieldBox(
              "phone",
              "Телефон",
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 ___ ___-__-__"
                data-ocid="jump.party.phone.input"
                {...aria("phone")}
              />,
            )}
          </div>
          <button
            type="submit"
            className="mt-2 min-h-14 justify-self-start rounded-full bg-primary px-8 font-display text-lg text-primary-foreground transition-transform duration-300 ease-out-expo hover:-translate-y-1 hover:-rotate-1 active:translate-y-0 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-ocid="jump.party.submit_button"
          >
            Забронировать праздник
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
