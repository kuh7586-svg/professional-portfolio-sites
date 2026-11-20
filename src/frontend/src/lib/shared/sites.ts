export type ThemeClass =
  | "theme-portfolio"
  | "theme-clinic"
  | "theme-jump"
  | "theme-arch"
  | "theme-detail"
  | "theme-resto";

export interface SiteInfo {
  id:
    | "portfolio"
    | "clinic"
    | "jump"
    | "architecture"
    | "detailing"
    | "restaurant";
  path: string;
  theme: ThemeClass;
  name: string;
  kind: string;
}

export const SITES: SiteInfo[] = [
  {
    id: "portfolio",
    path: "/",
    theme: "theme-portfolio",
    name: "Портфолио",
    kind: "Работы",
  },
  {
    id: "clinic",
    path: "/work/clinic",
    theme: "theme-clinic",
    name: "Клиника «Тихий пульс»",
    kind: "Поликлиника",
  },
  {
    id: "jump",
    path: "/work/jump",
    theme: "theme-jump",
    name: "Батутный центр «Прыг»",
    kind: "Батутный центр",
  },
  {
    id: "architecture",
    path: "/work/architecture",
    theme: "theme-arch",
    name: "Архбюро «Отвес»",
    kind: "Архитектура",
  },
  {
    id: "detailing",
    path: "/work/detailing",
    theme: "theme-detail",
    name: "Детейлинг «Графит»",
    kind: "Детейлинг",
  },
  {
    id: "restaurant",
    path: "/work/restaurant",
    theme: "theme-resto",
    name: "Ресторан «Шафран»",
    kind: "Ресторан",
  },
];

/** Returns the site that owns a pathname (longest matching prefix, portfolio fallback). */
export function siteForPath(pathname: string): SiteInfo {
  const clean = pathname.split(/[?#]/)[0] ?? "/";
  const match = SITES.filter(
    (s) =>
      s.path !== "/" && (clean === s.path || clean.startsWith(`${s.path}/`)),
  ).sort((a, b) => b.path.length - a.path.length)[0];
  return match ?? SITES[0];
}

export const MUSIC_TRACK = {
  src: "/assets/audio/clean-soul.mp3",
  fallbackSrc:
    "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Clean%20Soul.mp3",
  title: "Clean Soul",
  author: "Kevin MacLeod",
  sourceUrl: "https://incompetech.com",
  licenseName: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  volume: 0.22,
};
