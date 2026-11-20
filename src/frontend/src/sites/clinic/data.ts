export type SpecialtyId =
  | "therapist"
  | "cardiologist"
  | "neurologist"
  | "pediatrician"
  | "ophthalmologist";

export interface Specialty {
  id: SpecialtyId;
  label: string;
  /** Short line about what the specialist does here. */
  note: string;
  priceFrom: number;
}

export const SPECIALTIES: Specialty[] = [
  {
    id: "therapist",
    label: "Терапевт",
    note: "Первичный осмотр, справки, направление к узким специалистам",
    priceFrom: 2400,
  },
  {
    id: "cardiologist",
    label: "Кардиолог",
    note: "Давление, аритмии, ЭКГ и суточный монитор в один визит",
    priceFrom: 3200,
  },
  {
    id: "neurologist",
    label: "Невролог",
    note: "Головные боли, бессонница, боль в спине и шее",
    priceFrom: 3100,
  },
  {
    id: "pediatrician",
    label: "Педиатр",
    note: "Дети от рождения до 17 лет, прививки по графику",
    priceFrom: 2600,
  },
  {
    id: "ophthalmologist",
    label: "Офтальмолог",
    note: "Подбор очков и линз, глазное дно, давление глаза",
    priceFrom: 2800,
  },
];

/** Weekday 1 = Пн … 7 = Вс → working hours, e.g. ["09:00", "14:00"]. */
export type WeekSchedule = Partial<
  Record<1 | 2 | 3 | 4 | 5 | 6 | 7, [string, string]>
>;

export interface Doctor {
  id: string;
  name: string;
  specialty: SpecialtyId;
  experience: number;
  category: string;
  about: string;
  schedule: WeekSchedule;
}

export const DOCTORS: Doctor[] = [
  {
    id: "smirnova",
    name: "Анна Смирнова",
    specialty: "therapist",
    experience: 14,
    category: "Высшая категория",
    about:
      "Ведёт взрослых пациентов с хроническими болезнями. Сначала слушает, потом назначает — и пишет план лечения на бумаге.",
    schedule: {
      1: ["09:00", "15:00"],
      3: ["12:00", "19:00"],
      5: ["09:00", "15:00"],
    },
  },
  {
    id: "orlov",
    name: "Игорь Орлов",
    specialty: "therapist",
    experience: 8,
    category: "Первая категория",
    about:
      "Принимает по вечерам и в субботу — удобно тем, кто работает. Разбирает анализы и объясняет, что в них важно.",
    schedule: {
      2: ["15:00", "21:00"],
      4: ["15:00", "21:00"],
      6: ["10:00", "16:00"],
    },
  },
  {
    id: "belova",
    name: "Марина Белова",
    specialty: "cardiologist",
    experience: 21,
    category: "Кандидат медицинских наук",
    about:
      "Двадцать лет в кардиологии, из них десять — в отделении Мариинской больницы. Подбирает терапию при гипертонии без лишних таблеток.",
    schedule: {
      1: ["10:00", "16:00"],
      2: ["10:00", "16:00"],
      4: ["10:00", "16:00"],
    },
  },
  {
    id: "kim",
    name: "Денис Ким",
    specialty: "cardiologist",
    experience: 11,
    category: "Первая категория",
    about:
      "Аритмии, расшифровка холтера, наблюдение после стентирования. Отвечает на вопросы пациентов в мессенджере клиники.",
    schedule: {
      3: ["09:00", "15:00"],
      5: ["13:00", "20:00"],
      6: ["09:00", "14:00"],
    },
  },
  {
    id: "lebedev",
    name: "Павел Лебедев",
    specialty: "neurologist",
    experience: 17,
    category: "Высшая категория",
    about:
      "Мигрени и хроническая боль. Ведёт дневник головной боли вместе с пациентом и меняет схему по результатам.",
    schedule: {
      1: ["14:00", "20:00"],
      3: ["14:00", "20:00"],
      5: ["09:00", "14:00"],
    },
  },
  {
    id: "volkova",
    name: "Ольга Волкова",
    specialty: "neurologist",
    experience: 9,
    category: "Первая категория",
    about:
      "Нарушения сна, тревожность, последствия ковида. Работает в паре с психотерапевтом клиники.",
    schedule: { 2: ["09:00", "15:00"], 4: ["09:00", "15:00"] },
  },
  {
    id: "gromova",
    name: "Елена Громова",
    specialty: "pediatrician",
    experience: 19,
    category: "Высшая категория",
    about:
      "Ведёт детей с первого месяца. Осмотр проходит в отдельном кабинете с игровой зоной, без очереди у дверей.",
    schedule: {
      1: ["08:00", "14:00"],
      2: ["08:00", "14:00"],
      4: ["08:00", "14:00"],
      6: ["10:00", "15:00"],
    },
  },
  {
    id: "titov",
    name: "Артём Титов",
    specialty: "pediatrician",
    experience: 6,
    category: "Вторая категория",
    about:
      "Подростки и спортсмены: справки в секции, допуск к соревнованиям, профилактические осмотры.",
    schedule: { 3: ["14:00", "20:00"], 5: ["14:00", "20:00"] },
  },
  {
    id: "zaitseva",
    name: "Ксения Зайцева",
    specialty: "ophthalmologist",
    experience: 12,
    category: "Высшая категория",
    about:
      "Подбирает очки и ночные линзы детям и взрослым. Проверка зрения занимает 40 минут, без капель — по желанию.",
    schedule: {
      2: ["11:00", "18:00"],
      4: ["11:00", "18:00"],
      6: ["10:00", "15:00"],
    },
  },
];

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export const CONTACTS = {
  address: "Санкт-Петербург, ул. Малая Садовая, 6, 2 этаж",
  metro: "м. Гостиный двор, 4 минуты пешком",
  hours: [
    { days: "Пн–Пт", time: "08:00–21:00" },
    { days: "Сб", time: "09:00–17:00" },
    { days: "Вс", time: "выходной" },
  ],
  phone: "+7 (812) 000-00-00",
  phoneHref: "tel:+78120000000",
};

export interface PriceItem {
  name: string;
  price: number;
  duration?: string;
}

export interface PriceGroup {
  id: string;
  title: string;
  items: PriceItem[];
}

export const PRICES: PriceGroup[] = [
  {
    id: "visits",
    title: "Приём врача",
    items: [
      { name: "Терапевт, первичный приём", price: 2400, duration: "30 мин" },
      { name: "Терапевт, повторный приём", price: 1900, duration: "20 мин" },
      { name: "Кардиолог, первичный приём", price: 3200, duration: "40 мин" },
      { name: "Невролог, первичный приём", price: 3100, duration: "40 мин" },
      { name: "Педиатр, приём в клинике", price: 2600, duration: "30 мин" },
      {
        name: "Педиатр, вызов на дом",
        price: 5500,
        duration: "в пределах КАД",
      },
      {
        name: "Офтальмолог, приём с подбором очков",
        price: 2800,
        duration: "40 мин",
      },
    ],
  },
  {
    id: "diagnostics",
    title: "Диагностика",
    items: [
      { name: "ЭКГ с расшифровкой", price: 1200, duration: "15 мин" },
      {
        name: "Суточный мониторинг ЭКГ (холтер)",
        price: 4600,
        duration: "24 часа",
      },
      { name: "УЗИ сердца (ЭхоКГ)", price: 3900, duration: "30 мин" },
      { name: "УЗИ брюшной полости", price: 2900, duration: "30 мин" },
      {
        name: "Измерение внутриглазного давления",
        price: 900,
        duration: "10 мин",
      },
    ],
  },
  {
    id: "labs",
    title: "Анализы",
    items: [
      { name: "Общий анализ крови", price: 450 },
      { name: "Биохимия крови, 12 показателей", price: 2300 },
      { name: "Гормоны щитовидной железы (ТТГ, Т4 св.)", price: 1150 },
      { name: "Липидный профиль", price: 980 },
      { name: "Взятие крови из вены", price: 250 },
    ],
  },
];

export function formatRub(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function yearsWord(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "год";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "года";
  return "лет";
}

export function specialtyLabel(id: SpecialtyId) {
  return SPECIALTIES.find((s) => s.id === id)?.label ?? "";
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

export interface DaySlots {
  key: string;
  date: Date;
  times: { time: string; free: boolean }[];
}

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Stable pseudo-random "busy" marker so the same slot stays taken across renders. */
function isTaken(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 3 === 0;
}

/** Working days in the next 14 days with 30-minute slots. */
export function upcomingSlots(doctor: Doctor, from = new Date()): DaySlots[] {
  const days: DaySlots[] = [];
  for (let i = 1; i <= 14; i++) {
    const date = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + i,
    );
    const weekday = (((date.getDay() + 6) % 7) + 1) as keyof WeekSchedule;
    const hours = doctor.schedule[weekday];
    if (!hours) continue;
    const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const times: DaySlots["times"] = [];
    for (let m = toMinutes(hours[0]); m < toMinutes(hours[1]); m += 30) {
      const time = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
      times.push({ time, free: !isTaken(`${doctor.id}${key}${time}`) });
    }
    days.push({ key, date, times });
  }
  return days;
}
