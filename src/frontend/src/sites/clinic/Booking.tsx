import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import {
  CONTACTS,
  DOCTORS,
  SPECIALTIES,
  type SpecialtyId,
  formatRub,
  initials,
  specialtyLabel,
  upcomingSlots,
  yearsWord,
} from "./data";

const STEPS = ["Специальность", "Врач", "Дата и время", "Контакты"];
const dayFmt = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});
const longFmt = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function phoneError(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!value.trim())
    return "Введите номер телефона — по нему администратор подтвердит запись";
  const ok =
    (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) ||
    (digits.length === 10 && digits[0] === "9");
  return ok ? "" : "Номер должен содержать 11 цифр, например +7 921 555-12-34";
}

function nameError(value: string) {
  const v = value.trim();
  if (!v) return "Введите имя — так врач будет к вам обращаться";
  if (v.length < 2) return "Имя слишком короткое";
  if (/\d/.test(v)) return "В имени не должно быть цифр";
  return "";
}

export function ClinicBooking() {
  const reduced = useReducedMotion();
  const search = useRouterState({
    select: (s) => s.location.search as Record<string, unknown>,
  });
  const preset = DOCTORS.find((d) => d.id === search.doctor);

  const [step, setStep] = useState(preset ? 2 : 0);
  const [dir, setDir] = useState(1);
  const [specialty, setSpecialty] = useState<SpecialtyId | null>(
    preset?.specialty ?? null,
  );
  const [doctorId, setDoctorId] = useState<string | null>(preset?.id ?? null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  const doctor = DOCTORS.find((d) => d.id === doctorId) ?? null;
  const slots = useMemo(() => (doctor ? upcomingSlots(doctor) : []), [doctor]);
  const day = slots.find((d) => d.key === dayKey) ?? slots[0] ?? null;
  const price = SPECIALTIES.find((s) => s.id === specialty)?.priceFrom ?? 0;

  const stepError = [
    specialty ? "" : "Выберите специальность врача",
    doctor ? "" : "Выберите врача",
    time && day ? "" : "Выберите свободное время",
    nameError(name) || phoneError(phone),
  ][step];

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setTried(false);
    setStep(to);
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (stepError) {
      setTried(true);
      return;
    }
    if (step === 3) setDone(true);
    else go(step + 1);
  };

  const restart = () => {
    setDone(false);
    setStep(0);
    setSpecialty(null);
    setDoctorId(null);
    setDayKey(null);
    setTime(null);
    setName("");
    setPhone("");
    setTried(false);
  };

  if (done && doctor && day && time) {
    return (
      <main
        data-ocid="clinic.booking.success_state"
        className="px-5 pb-28 pt-14 md:px-10 md:pt-20"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl border border-hairline bg-card p-6 md:p-10"
        >
          <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check aria-hidden="true" className="size-5" />
          </span>
          <h1 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
            {name.trim()}, вы записаны
          </h1>
          <p className="mt-3 text-ink-2">
            Администратор позвонит на {phone} в течение часа, чтобы подтвердить
            визит.
          </p>
          <dl className="mt-8 divide-y divide-border border-y border-hairline">
            {[
              [
                "Врач",
                `${doctor.name}, ${specialtyLabel(doctor.specialty).toLowerCase()}`,
              ],
              ["Когда", `${longFmt.format(day.date)}, ${time}`],
              ["Где", CONTACTS.address],
              ["Стоимость", `от ${formatRub(price)}, оплата после приёма`],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                  {k}
                </dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={restart}
              data-ocid="clinic.booking.restart.secondary_button"
              className={ghostBtn}
            >
              Записаться ещё раз
            </button>
            <Link
              to="/work/clinic"
              data-ocid="clinic.booking.home.link"
              className="link-draw flex min-h-11 items-center text-sm"
            >
              На главную клиники
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main
      data-ocid="clinic.booking.page"
      className="px-5 pb-28 pt-14 md:px-10 md:pt-20"
    >
      <div className="grid gap-10 md:grid-cols-12">
        <aside className="md:col-span-4">
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Запись на приём
          </h1>
          <ol className="mt-10 border-t border-hairline">
            {STEPS.map((label, i) => (
              <li key={label} className="border-b border-hairline">
                <button
                  type="button"
                  disabled={i >= step}
                  onClick={() => go(i)}
                  data-ocid={`clinic.booking.step.${i + 1}.tab`}
                  aria-current={i === step ? "step" : undefined}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-4 text-left text-sm transition-colors duration-300 disabled:cursor-default",
                    i === step
                      ? "text-foreground"
                      : i < step
                        ? "text-primary hover:underline"
                        : "text-ink-2",
                  )}
                >
                  <span className="w-6 font-mono text-xs tabular">
                    {i < step ? "✓" : `0${i + 1}`}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <div className="relative mt-6 h-px bg-border">
            <motion.span
              className="absolute inset-y-0 left-0 w-full origin-left bg-primary"
              animate={{ scaleX: (step + 1) / STEPS.length }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            />
          </div>
        </aside>

        <form
          onSubmit={next}
          noValidate
          className="md:col-span-8"
          data-ocid="clinic.booking.form"
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={step}
                custom={dir}
                initial={reduced ? false : { x: dir * 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={reduced ? undefined : { x: dir * -60, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 0 && (
                  <StepFrame title="К какому специалисту?">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {SPECIALTIES.map((s, i) => (
                        <Choice
                          key={s.id}
                          active={specialty === s.id}
                          ocid={`clinic.booking.specialty.radio.${i + 1}`}
                          onClick={() => {
                            setSpecialty(s.id);
                            if (doctor?.specialty !== s.id) {
                              setDoctorId(null);
                              setTime(null);
                            }
                          }}
                        >
                          <span className="font-display text-xl">
                            {s.label}
                          </span>
                          <span className="text-sm text-ink-2">
                            от {formatRub(s.priceFrom)}
                          </span>
                        </Choice>
                      ))}
                    </div>
                  </StepFrame>
                )}
                {step === 1 && (
                  <StepFrame
                    title={`${specialty ? specialtyLabel(specialty) : "Врач"}: кого выберете?`}
                  >
                    <div className="grid gap-2">
                      {DOCTORS.filter((d) => d.specialty === specialty).map(
                        (d, i) => (
                          <Choice
                            key={d.id}
                            active={doctorId === d.id}
                            ocid={`clinic.booking.doctor.radio.${i + 1}`}
                            onClick={() => {
                              if (doctorId !== d.id) {
                                setDayKey(null);
                                setTime(null);
                              }
                              setDoctorId(d.id);
                            }}
                          >
                            <span className="flex items-center gap-4">
                              <span
                                aria-hidden="true"
                                className="grid size-11 place-items-center rounded-[var(--radius)] bg-card font-display"
                              >
                                {initials(d.name)}
                              </span>
                              <span>
                                <span className="block font-display text-xl">
                                  {d.name}
                                </span>
                                <span className="text-sm text-ink-2">
                                  стаж {d.experience} {yearsWord(d.experience)}{" "}
                                  · {d.category}
                                </span>
                              </span>
                            </span>
                          </Choice>
                        ),
                      )}
                    </div>
                  </StepFrame>
                )}
                {step === 2 && doctor && day && (
                  <StepFrame title={`Свободное время · ${doctor.name}`}>
                    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                      {slots.map((d, i) => (
                        <button
                          key={d.key}
                          type="button"
                          aria-pressed={d.key === day.key}
                          onClick={() => {
                            setDayKey(d.key);
                            setTime(null);
                          }}
                          data-ocid={`clinic.booking.day.toggle.${i + 1}`}
                          className={cn(
                            "flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-[var(--radius)] border text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            d.key === day.key
                              ? "border-foreground bg-foreground text-background"
                              : "border-hairline hover:border-foreground",
                          )}
                        >
                          <span className="text-xs uppercase opacity-70">
                            {dayFmt.format(d.date)}
                          </span>
                          <span className="tabular">
                            {dateFmt.format(d.date)}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {day.times.map((t, i) => (
                        <button
                          key={t.time}
                          type="button"
                          disabled={!t.free}
                          aria-pressed={time === t.time}
                          aria-label={
                            t.free ? `${t.time}` : `${t.time}, занято`
                          }
                          onClick={() => setTime(t.time)}
                          data-ocid={`clinic.booking.time.toggle.${i + 1}`}
                          className={cn(
                            "min-h-11 rounded-[var(--radius)] border text-sm tabular transition-[color,background-color,transform] duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:border-transparent disabled:text-ink-2 disabled:line-through",
                            time === t.time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-hairline hover:border-primary",
                          )}
                        >
                          {t.time}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-ink-2">
                      Зачёркнутое время уже занято.
                    </p>
                  </StepFrame>
                )}
                {step === 3 && (
                  <StepFrame title="Как с вами связаться">
                    <div className="grid max-w-md gap-6">
                      <Field
                        id="clinic-name"
                        label="Имя"
                        error={tried ? nameError(name) : ""}
                      >
                        <Input
                          id="clinic-name"
                          value={name}
                          autoComplete="given-name"
                          placeholder="Мария"
                          onChange={(e) => setName(e.target.value)}
                          aria-invalid={tried && !!nameError(name)}
                          aria-describedby="clinic-name-error"
                          data-ocid="clinic.booking.name.input"
                          className="h-12 rounded-[var(--radius)] border-hairline bg-background text-base"
                        />
                      </Field>
                      <Field
                        id="clinic-phone"
                        label="Телефон"
                        error={tried ? phoneError(phone) : ""}
                      >
                        <Input
                          id="clinic-phone"
                          type="tel"
                          inputMode="tel"
                          value={phone}
                          autoComplete="tel"
                          placeholder="+7 921 555-12-34"
                          onChange={(e) => setPhone(e.target.value)}
                          aria-invalid={tried && !!phoneError(phone)}
                          aria-describedby="clinic-phone-error"
                          data-ocid="clinic.booking.phone.input"
                          className="h-12 rounded-[var(--radius)] border-hairline bg-background text-base tabular"
                        />
                      </Field>
                      {doctor && day && time && (
                        <p className="text-sm text-ink-2">
                          {doctor.name} · {longFmt.format(day.date)}, {time}
                        </p>
                      )}
                    </div>
                  </StepFrame>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {tried && stepError && step < 3 && (
            <p
              role="alert"
              data-ocid="clinic.booking.error_state"
              className="mt-6 text-sm text-primary"
            >
              {stepError}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
            <button
              type="submit"
              data-ocid="clinic.booking.submit_button"
              className={primaryBtn}
            >
              {step === 3 ? "Подтвердить запись" : "Далее"}
            </button>
            {step > 0 && (
              <button
                type="button"
                onClick={() => go(step - 1)}
                data-ocid="clinic.booking.back.secondary_button"
                className={ghostBtn}
              >
                Назад
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

const primaryBtn =
  "inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const ghostBtn =
  "inline-flex min-h-11 items-center rounded-[var(--radius)] border border-hairline px-6 text-sm transition-colors duration-300 hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function StepFrame({
  title,
  children,
}: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-6 font-display text-2xl md:text-3xl">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Choice({
  active,
  onClick,
  ocid,
  children,
}: {
  active: boolean;
  onClick: () => void;
  ocid: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      data-ocid={ocid}
      className={cn(
        "flex min-h-16 items-center justify-between gap-4 rounded-[var(--radius)] border px-5 py-4 text-left transition-[border-color,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-card"
          : "border-hairline hover:border-foreground",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
          active ? "border-primary bg-primary" : "border-hairline",
        )}
      >
        {active && (
          <span className="size-1.5 rounded-full bg-primary-foreground" />
        )}
      </span>
    </button>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      {children}
      <p
        id={`${id}-error`}
        data-ocid={`${id.replace("-", ".")}.error_state`}
        className="min-h-5 text-sm text-primary"
        role={error ? "alert" : undefined}
      >
        {error}
      </p>
    </div>
  );
}
