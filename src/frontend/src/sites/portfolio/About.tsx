import { Magnetic, MusicCredit, Parallax } from "@/components/shared";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const EMAIL = "hello@vetrov.studio";
const TELEGRAM = "vetrov_dev";

const FACTS = [
  { label: "Срок", value: "4–8 недель от созвона до запуска" },
  { label: "Стек", value: "React, TypeScript, three.js, Motion" },
  { label: "Берусь", value: "за два проекта в месяц, не больше" },
  { label: "Где", value: "Казань, работаю с любым часовым поясом" },
];

export function PortfolioAbout() {
  const reduced = useReducedMotion();
  return (
    <section
      id="about"
      data-ocid="portfolio.about.section"
      className="relative z-10 grid gap-12 border-t border-hairline bg-background px-5 py-24 md:grid-cols-12 md:gap-10 md:px-10 md:py-40"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2 md:col-span-3">
        Обо мне
      </p>
      <div className="md:col-span-9">
        <motion.p
          className="max-w-4xl font-display text-2xl leading-[1.15] tracking-tight md:text-4xl"
          initial={reduced ? false : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Семь лет делаю сайты для дел с лицом: клиник, студий, ресторанов.
        </motion.p>
        <div className="mt-12 grid gap-10 md:grid-cols-9">
          <p className="text-base leading-relaxed text-ink-2 md:col-span-5 md:text-lg">
            Работаю один, без менеджеров между нами. Вместо долгого макета
            собираю живой прототип — на второй неделе вы уже листаете его с
            телефона и говорите, где жмёт. Тексты пишу вместе с вами: если
            администратор клиники объясняет запись понятнее, чем бриф, в сайт
            идут его слова.
          </p>
          <Parallax distance={-70} className="md:col-span-4">
            <dl className="border-t border-hairline">
              {FACTS.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-[6rem_1fr] gap-4 border-b border-hairline py-4 text-sm"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                    {f.label}
                  </dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

export function PortfolioContacts() {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState<"idle" | "done" | "fail">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied("done");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 2400);
  };

  return (
    <section
      id="contacts"
      data-ocid="portfolio.contacts.section"
      className="relative z-10 overflow-hidden border-t border-hairline bg-background px-5 py-24 md:px-10 md:py-40"
    >
      <motion.h2
        className="origin-left font-display text-4xl leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl"
        initial={reduced ? false : { scale: 0.86, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        Напишите
      </motion.h2>
      <p className="mt-6 max-w-md text-base leading-relaxed text-ink-2 md:text-lg">
        Расскажите в двух строках, что у вас за дело и что не так с нынешним
        сайтом. Отвечаю в тот же день, обычно до вечера по Москве.
      </p>
      <div className="mt-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Почта
          </span>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${EMAIL}`}
                data-ocid="portfolio.contacts.email.link"
                className="link-draw break-all font-display text-xl tracking-tight text-primary sm:text-3xl"
              >
                {EMAIL}
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copy}
              data-ocid="portfolio.contacts.copy.button"
              className="min-h-11 border border-hairline px-4 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied === "done"
                ? "Скопировано"
                : copied === "fail"
                  ? "Не вышло — выделите вручную"
                  : "Скопировать"}
            </button>
          </div>
        </div>
        <div className="md:col-span-5">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            Telegram
          </span>
          <div className="mt-3">
            <Magnetic strength={0.2}>
              <a
                href={`https://t.me/${TELEGRAM}`}
                target="_blank"
                rel="noreferrer"
                data-ocid="portfolio.contacts.telegram.link"
                className="link-draw font-display text-xl tracking-tight sm:text-3xl"
              >
                @{TELEGRAM} ↗
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PortfolioFooter() {
  const year = new Date().getFullYear();
  const host = encodeURIComponent(window.location.hostname);
  return (
    <footer className="relative z-10 border-t border-hairline bg-background px-5 pb-32 pt-10 md:px-10 md:pb-12">
      <div className="flex flex-col gap-4 md:max-w-[calc(100%-20rem)] md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-display text-xs uppercase tracking-[0.12em]">
            Алексей Ветров
          </span>
          <MusicCredit />
        </div>
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${host}`}
          target="_blank"
          rel="noreferrer"
          data-ocid="portfolio.footer.caffeine.link"
          className="link-draw text-xs text-ink-2 hover:text-foreground"
        >
          © {year}. Built with love using caffeine.ai
        </a>
      </div>
    </footer>
  );
}
