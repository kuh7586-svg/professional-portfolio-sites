import { Parallax, RevealHeadline } from "@/components/shared";
import { motion } from "motion/react";
import { useEffect } from "react";
import { ArchFooter } from "./ArchFooter";
import { ArchHeader } from "./ArchHeader";
import { BuildingScene } from "./BuildingScene";
import { ProjectGallery } from "./ProjectGallery";
import { RequestForm } from "./RequestForm";

const STATS = [
  { value: "47", label: "построенных объектов" },
  { value: "9", label: "побед в конкурсах" },
  { value: "14", label: "лет практики" },
];

const STAGES = [
  {
    n: "01",
    title: "Обмеры и замысел",
    text: "Выезжаем на участок, снимаем геодезию, фотографируем свет в разное время дня. Итог — одна схема и одна фраза о доме.",
    time: "3 недели",
  },
  {
    n: "02",
    title: "Эскиз в макете",
    text: "Собираем макет 1:100 из картона и сосны. Его можно вертеть в руках и спорить — до рендеров мы доходим позже.",
    time: "5 недель",
  },
  {
    n: "03",
    title: "Рабочий проект",
    text: "Разделы АР, КР и ИОС, ведомость материалов, сметы. Каждый узел нарисован, чтобы стройка не импровизировала.",
    time: "3—5 месяцев",
  },
  {
    n: "04",
    title: "Авторский надзор",
    text: "Архитектор бюро на площадке раз в неделю. Принимаем кладку, окна и бетон, пока исправить ещё дёшево.",
    time: "до сдачи",
  },
];

export function ArchHome() {
  useEffect(() => {
    document.title = "Архбюро «Отвес» — архитектура и интерьеры";
  }, []);

  return (
    <div
      className="theme-arch grain relative min-h-screen"
      data-ocid="arch.page"
    >
      <BuildingScene />
      <ArchHeader />
      <main className="relative z-10">
        <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-end px-5 pb-14 pt-20 md:px-10 md:pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Архитектурное бюро · Москва · с 2011
          </p>
          <RevealHeadline
            text={["Строим тишину", "из камня и света"]}
            className="mt-6 max-w-5xl font-display text-6xl font-light leading-[0.9] tracking-tight sm:text-7xl lg:text-[9rem]"
            lineClassName="last:italic"
            stagger={0.1}
            duration={1.1}
          />
          <div className="mt-12 grid gap-10 border-t border-hairline pt-8 md:grid-cols-12">
            <p className="max-w-md text-base leading-relaxed md:col-span-5 md:text-lg">
              Проектируем частные дома, библиотеки и интерьеры. Ведём объект от
              обмеров участка до последнего шва кладки.
            </p>
            <dl className="grid grid-cols-3 gap-6 md:col-span-7">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: "40%" }}
                  animate={{ opacity: 1, y: "0%" }}
                  transition={{
                    delay: 0.9 + i * 0.12,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-5xl leading-none tabular md:text-6xl">
                    {s.value}
                  </dd>
                  <dd className="mt-2 text-xs text-ink-2 md:text-sm">
                    {s.label}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </section>

        <ProjectGallery />

        <section
          id="metod"
          aria-labelledby="metod-title"
          className="relative scroll-mt-16 overflow-hidden border-t border-hairline bg-card px-5 py-24 md:px-10 md:py-40"
        >
          <Parallax
            distance={-260}
            axis="x"
            className="pointer-events-none absolute -right-10 top-10 select-none"
          >
            <span
              aria-hidden="true"
              className="text-outline block font-display text-[10rem] italic leading-none opacity-40 md:text-[18rem]"
            >
              1:100
            </span>
          </Parallax>
          <div className="relative grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                Метод
              </p>
              <h2
                id="metod-title"
                className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tight md:text-6xl"
              >
                Сначала макет, потом чертёж
              </h2>
            </div>
            <ol className="md:col-span-7 md:col-start-6">
              {STAGES.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-t border-foreground/80 py-8 md:grid-cols-[4rem_1fr_8rem]"
                >
                  <span className="font-mono text-xs tabular text-ink-2">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl leading-tight">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-ink-2">
                      {s.text}
                    </p>
                  </div>
                  <span className="col-start-2 font-mono text-xs uppercase tracking-[0.2em] md:col-start-3 md:text-right">
                    {s.time}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="zayavka"
          aria-labelledby="zayavka-title"
          className="scroll-mt-16 border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-40"
        >
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                Заявка
              </p>
              <h2
                id="zayavka-title"
                className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tight md:text-6xl"
              >
                Расскажите о&nbsp;месте
              </h2>
              <p className="mt-6 max-w-sm leading-relaxed text-ink-2">
                Берём четыре новых объекта в год. Ближайшее окно — весна 2027.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <RequestForm />
            </div>
          </div>
        </section>
      </main>
      <ArchFooter />
    </div>
  );
}
