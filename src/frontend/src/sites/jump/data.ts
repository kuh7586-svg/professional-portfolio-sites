export const CONTACTS = {
  address: "Москва, ул. Вятская, 27, корп. 3 — 2 этаж",
  metro: "5 минут пешком от м. Савёловская",
  phone: "+7 (495) 128-40-17",
  phoneHref: "tel:+74951284017",
  hours: [
    { days: "Пн–Пт", time: "10:00–22:00" },
    { days: "Сб–Вс и праздники", time: "09:00–23:00" },
  ],
};

export const NAV = [
  { id: "zones", label: "Зоны" },
  { id: "tariffs", label: "Тарифы" },
  { id: "parties", label: "Праздники" },
  { id: "rules", label: "Правила" },
] as const;

export interface Zone {
  name: string;
  fact: string;
  text: string;
  age: string;
}

export const ZONES: Zone[] = [
  {
    name: "Большая арена",
    fact: "24 батута",
    text: "Сетка 18 × 9 метров, наклонные стенки для отскока и разметка для сальто под присмотром тренера.",
    age: "с 6 лет",
  },
  {
    name: "Поролоновая яма",
    fact: "12 000 кубиков",
    text: "Яма глубиной 2,2 метра: прыгаешь с трамплина и мягко тонешь в поролоне. Отличное место для первого сальто.",
    age: "с 5 лет",
  },
  {
    name: "Ниндзя-трасса",
    fact: "11 препятствий",
    text: "Канаты, кольца, кривая стена высотой 3,5 м и таймер на финише — рекорд дня висит на табло у входа.",
    age: "с 8 лет",
  },
  {
    name: "Данк-баскетбол",
    fact: "кольцо на 3,05 м",
    text: "Три батута перед корзиной: разбег, толчок и тот самый слэм-данк, который получается с пятой попытки.",
    age: "с 7 лет",
  },
  {
    name: "Скалодром",
    fact: "7 трасс",
    text: "Стена 6 метров с автостраховкой. Трассы от «зелёной» для новичков до «чёрной» с отрицательным уклоном.",
    age: "с 6 лет",
  },
  {
    name: "Малышня",
    fact: "отдельный зал",
    text: "Низкие батуты, мягкий лабиринт и горка. Взрослые прыгают вместе с детьми бесплатно.",
    age: "2–5 лет",
  },
];

export const DURATIONS = [30, 60, 90, 120] as const;
export type Duration = (typeof DURATIONS)[number];
export type DayType = "weekday" | "weekend";

/** Цена одного прыгуна в рублях. */
export const PRICES: Record<
  DayType,
  Record<Duration, { child: number; adult: number }>
> = {
  weekday: {
    30: { child: 450, adult: 550 },
    60: { child: 690, adult: 790 },
    90: { child: 890, adult: 990 },
    120: { child: 1050, adult: 1190 },
  },
  weekend: {
    30: { child: 550, adult: 650 },
    60: { child: 850, adult: 950 },
    90: { child: 1090, adult: 1190 },
    120: { child: 1290, adult: 1390 },
  },
};

export const DAY_LABELS: Record<DayType, string> = {
  weekday: "Будни",
  weekend: "Выходные",
};

export interface PartyPackage {
  id: string;
  name: string;
  price: number;
  maxGuests: number;
  hours: number;
  includes: string[];
}

export const PACKAGES: PartyPackage[] = [
  {
    id: "mini",
    name: "Разминка",
    price: 14900,
    maxGuests: 8,
    hours: 2,
    includes: [
      "1 час на батутах",
      "Комната на 1 час",
      "Чай, морс и пицца на всех",
    ],
  },
  {
    id: "classic",
    name: "Полёт",
    price: 23900,
    maxGuests: 12,
    hours: 3,
    includes: [
      "1,5 часа на батутах",
      "Аниматор и игры на арене",
      "Комната на 1,5 часа и торт 1,5 кг",
    ],
  },
  {
    id: "max",
    name: "Невесомость",
    price: 36900,
    maxGuests: 20,
    hours: 3,
    includes: [
      "2 часа: арена, яма и ниндзя-трасса",
      "Тренер, аниматор и шоу мыльных пузырей",
      "Фотограф и 40 обработанных кадров",
    ],
  },
];

export const RULES = [
  "Прыгаем только в нескользящих носках. Нет своих — купите на ресепшене за 150 ₽.",
  "Перед первым прыжком — пятиминутный инструктаж от тренера. Без него на арену не пускаем.",
  "Один батут — один прыгун. Сальто только в яме и только после разрешения тренера.",
  "Дети до 7 лет прыгают с взрослым. Сопровождающий без прыжков проходит бесплатно.",
  "Из карманов всё выкладываем: телефоны, ключи и украшения оставьте в бесплатном шкафчике.",
  "Еду и напитки берём с собой только в кафе. На сетке пьём воду из бутылки с крышкой.",
];

export const rub = (value: number) =>
  `${Math.round(value).toLocaleString("ru-RU")} ₽`;
