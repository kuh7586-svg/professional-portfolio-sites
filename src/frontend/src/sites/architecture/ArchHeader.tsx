import { BackToPortfolio, MusicToggle } from "@/components/shared";
import { Link } from "@tanstack/react-router";

const NAV = [
  { label: "Проекты", hash: "proekty" },
  { label: "Метод", hash: "metod" },
  { label: "Заявка", hash: "zayavka" },
];

export function ArchHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background">
      <div className="flex min-h-16 items-center justify-between gap-4 px-5 md:px-10">
        <div className="flex min-w-0 items-center gap-4 md:gap-8">
          <BackToPortfolio fixed={false} />
          <Link
            to="/work/architecture"
            data-ocid="arch.home.link"
            className="hidden font-display text-2xl italic leading-none tracking-tight sm:inline"
          >
            Отвес
          </Link>
        </div>
        <nav
          aria-label="Разделы бюро"
          className="flex items-center gap-5 md:gap-8"
        >
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <li key={item.hash}>
                <Link
                  to="/work/architecture"
                  hash={item.hash}
                  data-ocid={`arch.nav.${item.hash}.link`}
                  className="link-draw font-mono text-xs uppercase tracking-[0.2em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <MusicToggle />
        </nav>
      </div>
    </header>
  );
}
