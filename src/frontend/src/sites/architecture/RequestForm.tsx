import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useId, useState } from "react";

const TYPES = [
  "Частный дом",
  "Многоквартирный дом",
  "Общественное здание",
  "Интерьер квартиры или офиса",
] as const;

interface Draft {
  name: string;
  contact: string;
  type: string;
  description: string;
}
type Field = keyof Draft;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Draft = { name: "", contact: "", type: "", description: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(d: Draft): Errors {
  const e: Errors = {};
  const name = d.name.trim();
  if (!name) e.name = "Напишите, как к вам обращаться";
  else if (name.length < 2) e.name = "Имя слишком короткое — минимум 2 буквы";

  const contact = d.contact.trim();
  const digits = contact.replace(/\D/g, "");
  if (!contact) e.contact = "Оставьте почту или телефон для ответа";
  else if (contact.includes("@")) {
    if (!EMAIL.test(contact))
      e.contact = "Проверьте почту: пример — anna@mail.ru";
  } else if (
    !/^[\d\s()+-]+$/.test(contact) ||
    digits.length < 10 ||
    digits.length > 12
  )
    e.contact =
      "Телефон должен содержать 10–11 цифр, например +7 912 345-67-89";

  if (!d.type) e.type = "Выберите тип объекта";

  const desc = d.description.trim();
  if (desc.length < 20)
    e.description = `Опишите задачу хотя бы в 20 символах — сейчас ${desc.length}`;
  else if (desc.length > 600) e.description = "Не больше 600 символов";
  return e;
}

const fieldBase =
  "mt-2 block w-full border-0 border-b bg-transparent px-0 py-3 text-lg text-foreground placeholder:text-ink-2/70 transition-colors duration-300 focus:border-foreground focus:outline-none focus-visible:ring-0";

export function RequestForm() {
  const uid = useId();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<Draft | null>(null);

  const id = (f: Field) => `${uid}-${f}`;
  const set = (f: Field, value: string) => {
    setDraft((d) => ({ ...d, [f]: value }));
    if (errors[f])
      setErrors((e) => ({ ...e, [f]: validate({ ...draft, [f]: value })[f] }));
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const found = validate(draft);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    setSubmitted(draft);
    setDraft(EMPTY);
  };

  const errorFor = (f: Field) =>
    errors[f] ? (
      <p
        id={`${id(f)}-error`}
        data-ocid={`arch.request.${f}.error_state`}
        className="mt-2 text-sm text-foreground before:mr-2 before:content-['—']"
      >
        {errors[f]}
      </p>
    ) : null;

  const aria = (f: Field) => ({
    id: id(f),
    "aria-invalid": Boolean(errors[f]),
    "aria-describedby": errors[f] ? `${id(f)}-error` : undefined,
  });

  const label = "font-mono text-xs uppercase tracking-[0.2em] text-ink-2";
  const line = (f: Field) =>
    errors[f] ? "border-foreground" : "border-hairline";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitted ? (
        <motion.div
          key="done"
          data-ocid="arch.request.success_state"
          aria-live="polite"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-foreground pt-10"
        >
          <p className={label}>Заявка принята</p>
          <p className="mt-6 font-display text-4xl leading-tight md:text-6xl">
            Спасибо, {submitted.name.trim()}.
          </p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">
            Ответим в течение двух рабочих дней на {submitted.contact.trim()}.
            Тип объекта — {submitted.type.toLowerCase()}. На первую встречу
            возьмите план участка или обмеры, если они есть.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(null)}
            data-ocid="arch.request.new.secondary_button"
            className="link-draw mt-10 min-h-11 font-mono text-xs uppercase tracking-[0.2em]"
          >
            Отправить ещё одну заявку
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          data-ocid="arch.request.panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="grid gap-10 md:grid-cols-2"
        >
          <div>
            <label htmlFor={id("name")} className={label}>
              Имя
            </label>
            <input
              {...aria("name")}
              autoComplete="name"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Анна Корнилова"
              data-ocid="arch.request.name.input"
              className={cn(fieldBase, line("name"))}
            />
            {errorFor("name")}
          </div>
          <div>
            <label htmlFor={id("contact")} className={label}>
              Почта или телефон
            </label>
            <input
              {...aria("contact")}
              autoComplete="email"
              inputMode="email"
              value={draft.contact}
              onChange={(e) => set("contact", e.target.value)}
              placeholder="anna@mail.ru или +7 912 345-67-89"
              data-ocid="arch.request.contact.input"
              className={cn(fieldBase, line("contact"))}
            />
            {errorFor("contact")}
          </div>
          <div className="md:col-span-2">
            <label htmlFor={id("type")} className={label}>
              Тип проекта
            </label>
            <select
              {...aria("type")}
              value={draft.type}
              onChange={(e) => set("type", e.target.value)}
              data-ocid="arch.request.type.select"
              className={cn(
                fieldBase,
                line("type"),
                "cursor-pointer rounded-none",
              )}
            >
              <option value="">Выберите из списка</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errorFor("type")}
          </div>
          <div className="md:col-span-2">
            <label htmlFor={id("description")} className={label}>
              Коротко о задаче
            </label>
            <textarea
              {...aria("description")}
              rows={4}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Участок 15 соток под Звенигородом, хотим дом на 180 м² к лету 2027"
              data-ocid="arch.request.description.textarea"
              className={cn(fieldBase, line("description"), "resize-none")}
            />
            <div className="flex justify-between gap-4">
              {errorFor("description") ?? <span />}
              <span className="mt-2 shrink-0 font-mono text-xs tabular text-ink-2">
                {draft.description.trim().length} / 600
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 md:col-span-2">
            <button
              type="submit"
              data-ocid="arch.request.submit_button"
              className="group inline-flex min-h-14 items-center gap-4 bg-primary px-8 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-300 ease-out-expo active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              Отправить заявку
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
              >
                →
              </span>
            </button>
            <p className="max-w-xs text-sm text-ink-2">
              Первая консультация — бесплатно, 40 минут в мастерской или онлайн.
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
