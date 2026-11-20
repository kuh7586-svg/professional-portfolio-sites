# Project Guidance

## User Preferences

- Язык сайтов — русский
- Не нейрослоп: без фиолетовых градиентов, Inter и Roboto, стекла, одинаковых скруглений и теней, блоков из трёх карточек, одинакового выплывания секций, шаблонных текстов
- Не ярко: приглушённые, сдержанные палитры
- Красивые, разнообразные анимации
- 3D-модели на фоне, которые следят за курсором
- Минимум 5 сложных демо-сайтов, в том числе поликлиника и батутный центр
- Музыка настоящая, найденная, не сгенерированная
- Шрифты с кириллицей: с характером в заголовках (Unbounded или антиква), спокойные для текста (Manrope, Golos Text)

## Accepted Requirements

- Красивое, не нейрослопное портфолио, чтобы люди видели мои работы
- Минимум 5 сложных сайтов в портфолио, включая поликлинику и батутный центр
- 3D-модели на фоне, которые следят за курсором
- Очень красивые анимации, не яркие цвета
- Рабочие кнопки и интерактив
- Настоящая найденная музыка, не сгенерированная
- Без признаков нейрослопа из чек-листа: фиолетовые градиенты, Inter и Roboto, три карточки, стекло, одинаковые тени и скругления, одинаковое выплывание секций

## Verified Commands

- **typecheck**: `cd src/frontend && pnpm typecheck`
- **fix**: `cd src/frontend && pnpm fix`
- **build**: `mops check --fix && pnpm bindgen`

## Learnings

- Clinic booking flow: after choosing a doctor the screen shows 'Свободное время', the contacts step button is 'Подтвердить запись', empty-field errors start with 'Введите имя' / 'Введите номер телефона', success heading ends with 'вы записаны'.
- E2E flows with startPath need explicit steps and checks in every pre_commit_checks contract; avoid bare currency-symbol checks.
- Owner contacts live in src/frontend/src/sites/portfolio/About.tsx as EMAIL='dirka111q@gmail.com' and TELEGRAM='terakotacat' (JSX adds @).
- Clinic demo home heading is 'Врач, у которого есть время на вас'; demo sites link back with 'в портфолио'. The 'Скопировано' copy label is transient, so do not check it in e2e.
