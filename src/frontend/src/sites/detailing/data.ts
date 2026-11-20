export type CarClassId = "sedan" | "crossover" | "suv";

export interface CarClass {
  id: CarClassId;
  label: string;
  hint: string;
  priceFactor: number;
  timeFactor: number;
}

export const CAR_CLASSES: CarClass[] = [
  {
    id: "sedan",
    label: "Седан",
    hint: "Camry, K5, 3 Series",
    priceFactor: 1,
    timeFactor: 1,
  },
  {
    id: "crossover",
    label: "Кроссовер",
    hint: "RAV4, Tiguan, X3",
    priceFactor: 1.2,
    timeFactor: 1.15,
  },
  {
    id: "suv",
    label: "Внедорожник",
    hint: "Land Cruiser, G-Class, X7",
    priceFactor: 1.4,
    timeFactor: 1.3,
  },
];

export interface Service {
  id: string;
  title: string;
  detail: string;
  price: number;
  hours: number;
}

export const PACKAGES: Service[] = [
  {
    id: "wash-wax",
    title: "Мойка и воск",
    detail: "Двухфазная мойка, очистка дисков и арок, твёрдый воск на 2 месяца",
    price: 6500,
    hours: 3,
  },
  {
    id: "polish",
    title: "Полировка в один шаг",
    detail:
      "Снимает до 70% голограмм и мелких царапин, возвращает глубину цвета",
    price: 18000,
    hours: 8,
  },
  {
    id: "ceramic",
    title: "Коррекция + керамика",
    detail: "Двухэтапная полировка и два слоя керамики. Гарантия 3 года",
    price: 42000,
    hours: 20,
  },
  {
    id: "ppf",
    title: "Плёнка на перед",
    detail: "Полиуретан на капот, бампер, фары и зеркала. Срок службы до 7 лет",
    price: 68000,
    hours: 24,
  },
];

export const ADDONS: Service[] = [
  {
    id: "interior",
    title: "Химчистка салона",
    detail: "Сиденья, потолок, ковры",
    price: 12000,
    hours: 6,
  },
  {
    id: "glass",
    title: "Керамика на стёкла",
    detail: "Антидождь на год",
    price: 4500,
    hours: 1,
  },
  {
    id: "leather",
    title: "Защита кожи",
    detail: "Чистка и пропитка",
    price: 5500,
    hours: 1.5,
  },
  {
    id: "engine",
    title: "Мойка двигателя",
    detail: "Паром, с консервацией",
    price: 3500,
    hours: 1,
  },
  {
    id: "tint",
    title: "Тонировка задней полусферы",
    detail: "Плёнка LLumar",
    price: 9000,
    hours: 2,
  },
];

export interface Quote {
  carClass: CarClass;
  items: string[];
  price: number;
  hours: number;
}

export function computeQuote(
  classId: CarClassId,
  packageId: string | null,
  addonIds: string[],
): Quote {
  const carClass = CAR_CLASSES.find((c) => c.id === classId) ?? CAR_CLASSES[0];
  const chosen = [
    ...PACKAGES.filter((p) => p.id === packageId),
    ...ADDONS.filter((a) => addonIds.includes(a.id)),
  ];
  const basePrice = chosen.reduce((sum, s) => sum + s.price, 0);
  const baseHours = chosen.reduce((sum, s) => sum + s.hours, 0);
  return {
    carClass,
    items: chosen.map((s) => s.title),
    price: Math.round((basePrice * carClass.priceFactor) / 100) * 100,
    hours: Math.round(baseHours * carClass.timeFactor * 2) / 2,
  };
}

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export const formatRub = (value: number) => rub.format(value);
export const formatHours = (value: number) => `${num.format(value)} ч`;
