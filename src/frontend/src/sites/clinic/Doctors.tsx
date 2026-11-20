import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  DOCTORS,
  type Doctor,
  SPECIALTIES,
  type SpecialtyId,
  WEEKDAYS,
  type WeekSchedule,
  initials,
  specialtyLabel,
  yearsWord,
} from "./data";

type Filter = SpecialtyId | "all";

export function ClinicDoctors() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Doctor | null>(null);
  const reduced = useReducedMotion();
  const list =
    filter === "all" ? DOCTORS : DOCTORS.filter((d) => d.specialty === filter);
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Все" },
    ...SPECIALTIES.map((s) => ({ id: s.id, label: s.label })),
  ];

  return (
    <main
      data-ocid="clinic.doctors.page"
      className="px-5 pb-28 pt-14 md:px-10 md:pt-20"
    >
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <h1 className="font-display text-4xl leading-tight md:col-span-7 md:text-6xl">
          Врачи клиники
        </h1>
        <p className="max-w-md leading-relaxed text-ink-2 md:col-span-5">
          Средний стаж — 13 лет. Нажмите на врача, чтобы увидеть расписание на
          неделю и записаться к нему.
        </p>
      </div>

      <fieldset className="mt-12 flex flex-wrap gap-2 border-b border-hairline pb-6">
        <legend className="sr-only">Фильтр по специальности</legend>
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              data-ocid={`clinic.doctors.filter.${f.id}.tab`}
              className={cn(
                "relative min-h-11 rounded-[var(--radius)] border px-4 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-foreground text-background"
                  : "border-hairline hover:border-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={reduced ? undefined : "clinic-filter"}
                  className="absolute inset-0 rounded-[calc(var(--radius)-1px)] bg-foreground"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </fieldset>

      <motion.ul layout className="mt-2" data-ocid="clinic.doctors.list">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((d, i) => (
            <motion.li
              key={d.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: 24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-hairline"
            >
              <button
                type="button"
                onClick={() => setOpen(d)}
                data-ocid={`clinic.doctors.item.${i + 1}`}
                className="group grid w-full grid-cols-[3.5rem_1fr] items-center gap-x-5 gap-y-1 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-[4rem_5fr_3fr_2fr_auto]"
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 grid aspect-square place-items-center rounded-[var(--radius)] bg-card font-display text-lg transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground md:row-span-1"
                >
                  {initials(d.name)}
                </span>
                <span className="font-display text-xl transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-2xl">
                  {d.name}
                </span>
                <span className="text-sm text-ink-2 md:text-base">
                  {specialtyLabel(d.specialty)}
                  <span className="md:hidden">
                    {" "}
                    · {d.experience} {yearsWord(d.experience)}
                  </span>
                </span>
                <span className="hidden tabular text-ink-2 md:block">
                  стаж {d.experience} {yearsWord(d.experience)}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-primary transition-transform duration-500 ease-out-expo group-hover:translate-x-1 md:block"
                >
                  →
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent
          showCloseButton={false}
          data-ocid="clinic.doctors.dialog"
          className="theme-clinic max-h-[90svh] overflow-y-auto rounded-[var(--radius)] border-hairline p-0 shadow-none sm:max-w-2xl"
        >
          {open && (
            <DoctorDetails doctor={open} onClose={() => setOpen(null)} />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function DoctorDetails({
  doctor,
  onClose,
}: {
  doctor: Doctor;
  onClose: () => void;
}) {
  return (
    <div className="grid sm:grid-cols-[14rem_1fr]">
      <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-card sm:aspect-auto">
        <svg
          aria-hidden="true"
          viewBox="0 0 120 150"
          className="h-3/4 w-3/4 text-border"
          fill="currentColor"
        >
          <circle cx="60" cy="52" r="26" />
          <path d="M14 150c0-30 20-52 46-52s46 22 46 52z" />
        </svg>
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">
          Фото врача
        </span>
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {specialtyLabel(doctor.specialty)}
            </p>
            <DialogTitle className="mt-2 font-display text-3xl font-normal leading-tight">
              {doctor.name}
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            data-ocid="clinic.doctors.close_button"
            className="grid size-11 shrink-0 place-items-center rounded-[var(--radius)] border border-hairline transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-3 text-sm text-ink-2">
          Стаж {doctor.experience} {yearsWord(doctor.experience)} ·{" "}
          {doctor.category}
        </p>
        <DialogDescription className="mt-4 leading-relaxed text-foreground">
          {doctor.about}
        </DialogDescription>
        <ScheduleGrid schedule={doctor.schedule} />
        <Link
          to="/work/clinic/booking"
          search={{ doctor: doctor.id }}
          data-ocid="clinic.doctors.book.primary_button"
          className="mt-8 inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Записаться к врачу
        </Link>
      </div>
    </div>
  );
}

function ScheduleGrid({ schedule }: { schedule: WeekSchedule }) {
  return (
    <div className="mt-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
        Расписание на неделю
      </p>
      <ul className="mt-3 grid grid-cols-7 border-l border-t border-hairline text-center">
        {WEEKDAYS.map((day, i) => {
          const hours = schedule[(i + 1) as keyof WeekSchedule];
          return (
            <li
              key={day}
              className={cn(
                "border-b border-r border-hairline px-0.5 py-2",
                hours && "bg-card",
              )}
            >
              <span className="block text-xs font-medium">{day}</span>
              <span className="mt-1 block text-[11px] leading-tight tabular text-ink-2">
                {hours ? (
                  <>
                    {hours[0]}
                    <br />
                    {hours[1]}
                  </>
                ) : (
                  "—"
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
