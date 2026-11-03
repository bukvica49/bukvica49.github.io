# Сайт bukvica49.github.io — шпаргалка

## Что это
Статический сайт «Родная Традиция» (HTML/CSS/JS, без сборки) на GitHub Pages.
- URL: https://bukvica49.github.io/
- Репо: `git@github.com:bukvica49/bukvica49.github.io.git`
- Рабочая копия: `~/site/bukvica49.github.io-main/`

## Структура
- `index.html` — главная
- `nav/{info,posts,contacts}.html` — вкладки
- `css/styles.css`, `css/navstyles.css` — стили
- `js/slavic-date.js` — ⚠️ СГЕНЕРИРОВАННЫЙ
- `js/script.js` — общий JS
- `pages/`, `posts/` — доп. страницы
- `.github/workflows/pages.yml` — деплой

## Локальный просмотр
    cd ~/site/bukvica49.github.io-main
    python3 -m http.server 8000
Открыть http://localhost:8000/ + Ctrl+Shift+R.

⚠️ `file://` НЕ использовать — `<script src="js/...">` не грузится.

## Деплой
`git push` в `main` → Pages собирается САМ (`.github/workflows/pages.yml`).
Статус: https://github.com/bukvica49/bukvica49.github.io/actions

## ⚠️ Славянская дата — СВЯЗАНА С АВТОПОСТЕРОМ
`js/slavic-date.js` — **СГЕНЕРИРОВАННЫЙ**. НЕ ПРАВИТЬ РУКАМИ.

Источник — в `~/vk-poster/`:
- `chertogs.json` — 16 Чертогов (name, name_gen, patron, tree, pol)
- `slavic_auto.py` → `CHERTOG_STARTS` — границы по дню года
- `slavic_calendar.py` — ядро (9-дневка, 9 месяцев, якорь 20.09.2026)

Формат в подвале сайта (совпадает с VK-постом):

    СЕДМИЦА · 4 Айлѣтъ · Лѣто 7535 от С.М.З.Х.
    ⚡ Чертог Щуки – Богиня-Покровительница Рожана ⚡
    🌳 Священное Древо: Слива.

### После правки Чертогов / границ — пересобрать
    cd ~/vk-poster && python3 tools/build_site_slavic_js.py
    cd ~/site/bukvica49.github.io-main
    git add js/ index.html nav/
    git commit -m "sync: славянская дата из chertogs.json"
    git push

Генератор сам поднимает `?v=N→N+1` в `index.html` + `nav/*.html` (cache-bust).

## Кэш браузера
Правки видны с **Ctrl+Shift+R**. `?v=N` автоинкрементится генератором.
CSS/HTML руками — `?v` не меняется, нужен только Ctrl+Shift+R.

## Метрика
Счётчик ID `3012ed4ff0acc9df` уже в HTML (`yandex_3012ed4ff0acc9df.html`).
Скрипты `add_metrika*.sh`, `update_metrika_id.sh` — в `.gitignore`, не в репо.

## Бэкапы и .gitignore
Правило: `*.bak*` — в `.gitignore`, **НЕ на сервер**.
Причина: `pages.yml` деплоит `path: .` — что в git, то и в проде.

Если случайно закоммитил бэкап:
    git rm --cached path/to/file.bak-xxx
    git add .gitignore
    git commit -m "cleanup: убрать .bak из репо"
    git push

## Диагностика

### Не обновилось после push
1. GitHub → Actions → зелёная галочка (~30–60 сек)
2. Ctrl+Shift+R
3. `grep "slavic-date.js" index.html` — проверить `?v`

### Дата на сайте неправильная
Сначала сверить с dry-run автопостера:
    cd ~/vk-poster && python3 poster.py config.main.json --dry-run

- dry-run правильный → `python3 tools/build_site_slavic_js.py`
- dry-run неправильный → `~/vk-poster/HANDOFF.md`

## Файлы
| Файл | Роль |
|---|---|
| `index.html`, `nav/*.html`, `css/*.css`, `js/script.js` | руками |
| `js/slavic-date.js` | **СГЕНЕРИРОВАН** через `tools/build_site_slavic_js.py` |
| `MANUAL.md` | эта шпаргалка |
| `.github/workflows/pages.yml` | деплой |
| `.gitignore` | бэкапы, метрика-скрипты |

## Для AI
Прочитай `~/site/bukvica49.github.io-main/MANUAL.md` и `~/vk-poster/HANDOFF.md`.
Проблема: <одна строка>.

Правила:
1. `js/slavic-date.js` — НЕ ПРАВИТЬ РУКАМИ. Только `tools/build_site_slavic_js.py`.
2. Формат/логика Чертогов — сначала в `~/vk-poster/`, потом генератор.
3. Push в `bukvica49.github.io` ≠ push в `vk-poster`. Два разных репо.
4. `.bak` — не коммитить никогда.
