export interface Dish {
  id: string;
  name: string;
  description: string;
  weight: string;
  price: number;
  mark?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  note: string;
  dishes: Dish[];
}

export const MENU: MenuCategory[] = [
  {
    id: "starters",
    label: "Закуски",
    note: "Подаём, пока вы выбираете вино",
    dishes: [
      {
        id: "tartare",
        name: "Тартар из оленины",
        description: "Каперсы, копчёный желток, хрустящий бородинский хлеб",
        weight: "160 г",
        price: 890,
        mark: "шеф",
      },
      {
        id: "pkhali",
        name: "Пхали из трёх зелёных",
        description: "Шпинат, лук-порей и черемша с грецким орехом и гранатом",
        weight: "180 г",
        price: 540,
      },
      {
        id: "herring",
        name: "Сельдь пряного посола",
        description: "Печёный картофель, сметана с укропом, маринованный лук",
        weight: "200 г",
        price: 620,
      },
      {
        id: "eggplant",
        name: "Баклажан с углей",
        description: "Мацони, кинза, масло с аджикой и жареный кунжут",
        weight: "220 г",
        price: 580,
      },
      {
        id: "sudak",
        name: "Крудо из судака",
        description: "Облепиха, огурец, масло с укропом и солью Эльтона",
        weight: "140 г",
        price: 760,
      },
    ],
  },
  {
    id: "mains",
    label: "Основные",
    note: "Готовим на углях из виноградной лозы",
    dishes: [
      {
        id: "lamb",
        name: "Каре ягнёнка",
        description: "Тыквенное пюре с шафраном, соус из ткемали, мята",
        weight: "280 г",
        price: 2150,
        mark: "шеф",
      },
      {
        id: "sturgeon",
        name: "Стерлядь на решётке",
        description: "Раки, раковое масло, молодой картофель с укропом",
        weight: "320 г",
        price: 2480,
      },
      {
        id: "duck",
        name: "Утиная ножка конфи",
        description: "Печёная айва, брусничный соус, пшено с тыквой",
        weight: "300 г",
        price: 1390,
      },
      {
        id: "ukha",
        name: "Уха по-ростовски",
        description: "Три вида рыбы, томлёные томаты, рюмка водки на дымке",
        weight: "350 мл",
        price: 790,
      },
      {
        id: "khinkali",
        name: "Хинкали с бараниной",
        description: "Ручная лепка, курдючный жир, чёрный перец. Цена за 3 шт.",
        weight: "330 г",
        price: 690,
      },
    ],
  },
  {
    id: "desserts",
    label: "Десерты",
    note: "Сладкое без лишнего сахара",
    dishes: [
      {
        id: "pakhlava",
        name: "Пахлава с шафраном",
        description: "Тонкое тесто, фундук, мёд с горных пасек Дагестана",
        weight: "120 г",
        price: 520,
        mark: "шеф",
      },
      {
        id: "medovik",
        name: "Медовик на гречишном мёде",
        description: "Сметанный крем, солёная карамель, крошка из коржей",
        weight: "150 г",
        price: 480,
      },
      {
        id: "pear",
        name: "Груша в красном вине",
        description: "Ваниль, гвоздика, шарик мороженого из топлёного молока",
        weight: "200 г",
        price: 560,
      },
      {
        id: "syrniki",
        name: "Сырники из печи",
        description: "Фермерский творог, сметана, варенье из лесной малины",
        weight: "190 г",
        price: 450,
      },
    ],
  },
  {
    id: "drinks",
    label: "Напитки",
    note: "Вина Крыма, Кубани и Дона",
    dishes: [
      {
        id: "krasnostop",
        name: "Красностоп золотовский",
        description: "Дон, 2021. Вишня, чернослив, мягкие танины. Бокал 150 мл",
        weight: "150 мл",
        price: 790,
      },
      {
        id: "tsimlyansky",
        name: "Цимлянский чёрный",
        description: "Дон, 2020. Ежевика, специи, долгое послевкусие",
        weight: "150 мл",
        price: 860,
      },
      {
        id: "kokur",
        name: "Кокур белый",
        description: "Крым, 2022. Айва, белые цветы, свежая кислотность",
        weight: "150 мл",
        price: 690,
      },
      {
        id: "mors",
        name: "Морс из облепихи",
        description: "С мёдом и розмарином, подаём холодным или горячим",
        weight: "400 мл",
        price: 350,
      },
      {
        id: "tea",
        name: "Чай с чабрецом",
        description: "Чайник на двоих, кизиловое варенье к нему",
        weight: "600 мл",
        price: 420,
      },
    ],
  },
];

export const HOURS = [
  { days: "Пн — Чт", time: "12:00 — 23:00" },
  { days: "Пт — Сб", time: "12:00 — 01:00" },
  { days: "Вс", time: "12:00 — 23:00" },
];

export const ADDRESS = {
  street: "Москва, Большая Никитская ул., 24/1, стр. 2",
  hint: "м. Арбатская, 7 минут пешком. Вход со двора, под фонарём",
  phone: "+7 (495) 128-44-07",
  phoneHref: "tel:+74951284407",
};

export const formatPrice = (rub: number) =>
  `${rub.toLocaleString("ru-RU")}\u00a0₽`;
