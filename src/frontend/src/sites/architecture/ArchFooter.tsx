import { MusicCredit } from "@/components/shared";

export function ArchFooter() {
  const year = new Date().getFullYear();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer className="relative z-10 border-t border-foreground bg-background px-5 py-14 md:px-10">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="font-display text-6xl italic leading-none md:col-span-5 md:text-8xl">
          Отвес
        </p>
        <address className="grid gap-1 text-sm not-italic text-ink-2 md:col-span-4">
          <span>Москва, Хохловский пер., 7, стр. 3</span>
          <a
            href="tel:+74951280416"
            className="link-draw w-fit text-foreground"
          >
            +7 495 128-04-16
          </a>
          <a
            href="mailto:studio@otves.ru"
            className="link-draw w-fit text-foreground"
          >
            studio@otves.ru
          </a>
          <span>Пн—Пт, 10:00—19:00</span>
        </address>
        <div className="grid content-start gap-3 md:col-span-3">
          <MusicCredit />
          <p className="text-[11px] text-ink-2">
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(host)}`}
              target="_blank"
              rel="noreferrer"
              className="link-draw text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
