import { Parallax, RevealHeadline } from "@/components/shared";
import { Link, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import { ArchFooter } from "./ArchFooter";
import { ArchHeader } from "./ArchHeader";
import { MaskImage } from "./MaskImage";
import { PROJECTS, findProject } from "./data";

const backLink =
  "group inline-flex min-h-11 items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function BackToGallery({ ocid }: { ocid: string }) {
  return (
    <Link
      to="/work/architecture"
      hash="proekty"
      data-ocid={ocid}
      className={backLink}
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-500 ease-out-expo group-hover:-translate-x-1.5"
      >
        ←
      </span>
      <span className="link-draw">Все проекты</span>
    </Link>
  );
}

export function ArchProject() {
  const { projectId } = useParams({ strict: false });
  const project = findProject(projectId);

  useEffect(() => {
    document.title = project
      ? `${project.title} — Архбюро «Отвес»`
      : "Проект не найден — Архбюро «Отвес»";
  }, [project]);

  if (!project) {
    return (
      <div
        className="theme-arch grain min-h-screen"
        data-ocid="arch.project.page"
      >
        <ArchHeader />
        <main
          data-ocid="arch.project.error_state"
          className="flex min-h-[70vh] flex-col items-start justify-center gap-8 px-5 md:px-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            404
          </p>
          <h1 className="font-display text-5xl font-light leading-[0.95] md:text-7xl">
            Такого проекта в архиве нет
          </h1>
          <BackToGallery ocid="arch.project.back.link" />
        </main>
      </div>
    );
  }

  const index = PROJECTS.indexOf(project);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const facts = [
    { label: "Площадь", value: project.area },
    { label: "Год", value: String(project.year) },
    { label: "Город", value: project.city },
    { label: "Статус", value: project.status },
    ...project.facts,
  ];

  return (
    <div
      className="theme-arch grain min-h-screen"
      data-ocid="arch.project.page"
    >
      <ArchHeader />
      <main>
        <section className="px-5 pb-12 pt-12 md:px-10 md:pb-16 md:pt-16">
          <BackToGallery ocid="arch.project.back.link" />
          <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
            {String(index + 1).padStart(2, "0")} · {project.type}
          </p>
          <RevealHeadline
            key={project.id}
            text={project.title}
            className="mt-4 max-w-6xl font-display text-6xl font-light leading-[0.9] tracking-tight sm:text-7xl lg:text-[8.5rem]"
            split="letter"
            stagger={0.02}
          />
        </section>

        <MaskImage
          key={`${project.id}-cover`}
          src={project.cover}
          alt={`${project.title}, ${project.city}, ${project.year}`}
          eager
          className="h-[60svh] w-full md:h-[88svh]"
        />

        <section className="grid gap-12 border-b border-hairline px-5 py-20 md:grid-cols-12 md:px-10 md:py-32">
          <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-8 md:col-span-4">
            {facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="border-t border-foreground pt-3"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
                  {f.label}
                </dt>
                <dd className="mt-2 font-display text-2xl leading-tight tabular md:text-3xl">
                  {f.value}
                </dd>
              </motion.div>
            ))}
          </dl>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-3xl leading-snug md:text-5xl md:leading-[1.1]">
              {project.lead}
            </p>
            {project.body.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="mt-8 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg"
              >
                {para}
              </p>
            ))}
          </div>
        </section>

        <div className="overflow-hidden">
          <Parallax distance={120}>
            <img
              src={project.detail}
              alt={`Деталь проекта «${project.title}»`}
              loading="lazy"
              className="h-[55svh] w-full scale-110 object-cover grayscale md:h-[80svh]"
            />
          </Parallax>
        </div>

        <section className="flex flex-col gap-10 px-5 py-20 md:flex-row md:items-end md:justify-between md:px-10 md:py-32">
          <BackToGallery ocid="arch.project.back_bottom.link" />
          <Link
            to={`/work/architecture/${next.id}`}
            data-ocid="arch.project.next.link"
            className="group block text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
              Следующий проект
            </span>
            <span className="mt-3 block font-display text-4xl italic leading-none transition-transform duration-500 ease-out-expo group-hover:-translate-x-3 md:text-7xl">
              {next.title} →
            </span>
          </Link>
        </section>
      </main>
      <ArchFooter />
    </div>
  );
}
