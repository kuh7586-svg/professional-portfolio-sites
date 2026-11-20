# Design Brief

## Direction
«Мастерская в темноте»: тёмное редакционное портфолио и пять демо-сайтов. У каждого своя тема-обёртка `.theme-*` в index.css.

## Tone
Сдержанная редакционная строгость: тонкие линии, крупный короткий шрифт, мало цвета. Яркость — только у одного акцента на экран.

## Differentiation
Матовая 3D-скульптура с инерцией тянется за курсором. Каждое демо меняет всю тему одним классом: шрифты, палитру и радиус.

## Color Palette (portfolio = :root/.dark/.theme-portfolio — no other colors)
| Token | Hex | OKLCH | Role |
| --- | --- | --- | --- |
| background/card | #111312 | 0.183 0.004 165 | page, rows |
| foreground | #ECE8E1 | 0.931 0.01 80 | text |
| border/muted (`--site-line`) | #2B2F2D | 0.3 0.007 160 | hairlines |
| muted-foreground (`--site-ink-2`) | #8A8F8A | 0.638 0.008 145 | secondary text |
| primary/accent | #C2D0A8 | 0.836 0.054 125 | one CTA pill, active markers |

## Demo Themes (wrap root of each demo in class; use bg-background, text-primary, border-hairline, text-ink-2 etc.)
| Class | Site | Display / Body | Hex palette (bg · ink · ink-2 · line · surface/card · accent) | Radius |
| --- | --- | --- | --- | --- |
| `.theme-clinic` | Клиника «Тихий пульс» | PT Serif / Golos Text | #F1EFEA · #22262A · #6E716F · #D8D4CC · #E6E1D8 · #9E3B3B | 6px |
| `.theme-jump` | Батутный центр «Прыг» | Dela Gothic One / Nunito | #EFE9DD · #1C1C1A · #6B655C · #D6CDBD · card #2F5D5A · #E0623A | 24px |
| `.theme-arch` | Архбюро «Отвес» | Cormorant / Onest | #F4F4F1 · #0E0E0E · #777773 · #D9D9D4 · #E9E9E5 · accent = ink | 0 |
| `.theme-detail` | Детейлинг «Графит» | Oswald / Commissioner | #0B0C0E · #E6E6E3 · #7D8086 · #26292D · #16181B · #C9733A | 2px |
| `.theme-resto` | Ресторан «Шафран» | Prata / Raleway | #1E1416 · #EFE3D3 · #A08C80 · #3A2A2C · card #5C1F2B · #D4A23A | 0 |

3D/Canvas literals (three.js can't read CSS vars): portfolio sculpture #2B2F2D metal + rim light #C2D0A8; clinic heart/molecule #9E3B3B + #D8D4CC; jump ball #E0623A, net #2F5D5A; arch building #0E0E0E wire on #F4F4F1; detail car #16181B body, copper rim #C9733A; resto glass #EFE3D3 transmission, wine #5C1F2B.

## Typography
- Portfolio display: Unbounded (only short headings, ≤2 lines on 375px: use `text-4xl sm:text-6xl lg:text-8xl`, `leading-[0.95] tracking-tight`)
- Body: Manrope; mono labels: JetBrains Mono (`font-mono text-xs uppercase tracking-[0.2em]`)
- Scale: hero `text-4xl sm:text-6xl lg:text-8xl`, h2 `text-3xl md:text-5xl`, label mono `text-xs`, body `text-base md:text-lg leading-relaxed`
- Fonts load from jsDelivr Fontsource (cyrillic+latin) via @font-face in index.css; local Lora/JetBrains Mono as fallback.

## Elevation & Depth
Flat. Depth comes from the 3D layer behind the text, film grain (`.grain` on root), and 1px hairlines. No shadows or gradients on cards. `shadow-lift` only on the before/after handle and floating cursor badge.

## Structural Zones (portfolio)
| Zone | Background | Border | Notes |
| --- | --- | --- | --- |
| Header | transparent over bg, fixed | `border-b border-hairline` | name left, nav + eq music toggle right |
| Hero | bg + 3D canvas absolute behind | — | text left, sculpture right/center |
| Works | bg | `border-t` per row | 5 full-width rows: big index, title, type, stack, wide preview |
| About/Contacts | bg-muted/0 → plain | `border-t` | 2-column asymmetric, mono labels |
| Footer | bg | `border-t` | email, Telegram, license credit for music track |

## Spacing & Rhythm
Sections `py-24 md:py-40`, gutters `px-5 md:px-10`, rows `py-8 md:py-12`. Uneven asymmetric grid (5/7, 4/8) instead of centered stacks.

## Component Patterns
- Buttons: portfolio — `rounded-full` pill, bg-primary, magnetic hover (translate toward cursor, spring); secondary = text + `.link-draw`
- Cards: none, except clickable work rows and demo service/price items; no shadow/gradient; hover = image scale 1.04 + row text shift
- Badges: mono uppercase text inside 1px border, radius follows theme `rounded-sm`
- Custom cursor: 10px dot + 40px ring (mix-blend-difference), grows over links; add `.cursor-custom` on root

## Motion
- Entrance: only first screen — hero headline line-by-line clip reveal (`.clip-hidden`→`.clip-shown`, 0.9s ease-out-expo, stagger 0.08s)
- Per-site signatures (no shared fade-up): portfolio row image clip-wipe on hover; clinic `animate-pulse-line` ECG stroke; jump `animate-squash` + spring counters; arch horizontal mask + slow parallax; detail before/after drag + scan line; resto `animate-marquee` menu ribbon + letter-spaced title
- Route transition: full-screen panel wipe in target theme bg (0.7s ease-in-out-quart) when opening/closing a demo
- Music toggle: 4 bars `animate-eq-bar` with staggered delays, paused when off

## Constraints
- No purple/blue-violet, no gradients on surfaces, no glass under text, no Inter/Roboto
- No three-icon-card blocks; one bold thing per screen; one accent per site
- Honour prefers-reduced-motion (already global); 3D canvas pointer-events none
- Every demo shows a visible «← В портфолио» link (fixed, top-left, mono)

## Signature Detail
A matte stone-metal sculpture with inertia: it eases toward the cursor and then settles behind the headline.
