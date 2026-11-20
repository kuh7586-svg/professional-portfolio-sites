import { BackToPortfolio, MusicCredit, MusicToggle } from "@/components/shared";
import { Link, Outlet } from "@tanstack/react-router";
import { CONTACTS } from "./data";

export { ClinicBooking } from "./Booking";
export { ClinicDoctors } from "./Doctors";
export { ClinicHome } from "./Home";
export { ClinicPrices } from "./Prices";

const SECTIONS = [
  { to: "/work/clinic", label: "Главная", ocid: "home" },
  { to: "/work/clinic/doctors", label: "Врачи", ocid: "doctors" },
  { to: "/work/clinic/prices", label: "Услуги и цены", ocid: "prices" },
  { to: "/work/clinic/booking", label: "Запись", ocid: "booking" },
];

/** Shared shell for all clinic sections (route /work/clinic). */
export function ClinicLayout() {
  return (
    <div className="theme-clinic flex min-h-screen flex-col">
      <header className="relative z-20 border-b border-hairline bg-background">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 md:px-10">
          <BackToPortfolio fixed={false} />
          <Link
            to="/work/clinic"
            data-ocid="clinic.brand.link"
            className="flex min-h-11 items-center gap-2 font-display text-lg"
          >
            <PulseMark />
            Тихий пульс
          </Link>
          <nav
            aria-label="Разделы клиники"
            className="order-last -mx-5 flex w-[calc(100%+2.5rem)] gap-6 overflow-x-auto px-5 lg:order-none lg:mx-0 lg:ml-auto lg:w-auto lg:px-0"
          >
            {SECTIONS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-primary after:scale-x-100" }}
                data-ocid={`clinic.nav.${s.ocid}.link`}
                className="relative flex min-h-11 shrink-0 items-center text-sm transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-expo hover:text-primary hover:after:scale-x-100"
              >
                {s.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-5 lg:ml-0">
            <a
              href={CONTACTS.phoneHref}
              data-ocid="clinic.header.phone.link"
              className="hidden min-h-11 items-center text-sm tabular md:flex"
            >
              {CONTACTS.phone}
            </a>
            <MusicToggle />
          </div>
        </div>
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
      <ClinicFooter />
    </div>
  );
}

function PulseMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 16"
      className="h-4 w-8 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 9h8l2-5 3 10 3-12 2 7h12" />
    </svg>
  );
}

function ClinicFooter() {
  const year = new Date().getFullYear();
  const host = encodeURIComponent(window.location.hostname);
  return (
    <footer className="relative z-10 bg-foreground pb-20 text-background">
      <div className="grid gap-10 px-5 py-14 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="font-display text-3xl">Тихий пульс</p>
          <p className="mt-3 max-w-sm text-sm opacity-70">
            Многопрофильная поликлиника для взрослых и детей. Лицензия
            ЛО-78-01-000000 от 12.03.2021.
          </p>
        </div>
        <address className="not-italic md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">
            Адрес
          </p>
          <p className="mt-2">{CONTACTS.address}</p>
          <p className="text-sm opacity-70">{CONTACTS.metro}</p>
          <a
            href={CONTACTS.phoneHref}
            data-ocid="clinic.footer.phone.link"
            className="link-draw mt-3 inline-block text-lg tabular"
          >
            {CONTACTS.phone}
          </a>
        </address>
        <div className="md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">
            Часы работы
          </p>
          <dl className="mt-2 space-y-1">
            {CONTACTS.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 tabular">
                <dt>{h.days}</dt>
                <dd className="opacity-80">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-background/15 px-5 py-5 text-xs opacity-70 md:flex-row md:justify-between md:px-10">
        <span>
          © {year}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${host}`}
            target="_blank"
            rel="noreferrer"
            className="link-draw"
          >
            caffeine.ai
          </a>
        </span>
        <MusicCredit className="text-background" />
      </div>
    </footer>
  );
}
