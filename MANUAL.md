# Сайт bukvica49.github.io — шпаргалка

## Что это
Статический сайт «Родная Традиция» (HTML/CSS/JS, без сборки) на GitHub Pages.
- URL: https://bukvica49.github.io/
- Репо: `git@github.com:bukvica49/bukvica49.github.io.git`
- Рабочая копия: `~/site/bukvica49.github.io/`

## Структура
- `index.html` — главная
- `nav/{info,posts,contacts}.html` — вкладки
- `css/styles.css`, `css/navstyles.css` — стили
- `js/slavic-date.js` — ⚠️ СГЕНЕРИРОВАННЫЙ
- `js/script.js` — общий JS
- `pages/`, `posts/` — доп. страницы
- `.github/workflows/pages.yml` — деплой

## Локальный просмотр
    cd ~/site/bukvica49.github.io
    python3 -m http.server 8000
Открыть http://localhost:8000/ + Ctrl+Shift+R.

⚠️ `file://` НЕ использовать — `<script src="js/...">` не грузится.

## Деплой
`git push` в `main` → Pages собирается САМ (`.github/workflows/pages.yml`).
Статус: https://github.com/bukvica49/bukvica49.github.io/actions

## ⚠️ Славянская дата — СВЯЗАНА С АВТОПОСТЕРОМ
`js/slavic-date.js` — **СГЕНЕРИРОВАННЫЙ**. НЕ ПРАВИТЬ РУКАМИ.

> В шаблоне `tools/build_site_slavic_js.py` портированы:
> - `LONG_MONTHS` — длинные имена месяцев (`Божественного Начала`, `Новых Даровъ`, …), источник — `MONTH_DESC` в `slavic_calendar.py`
> - `cyrYear()` — кириллическая запись года (`҂ЗФЛЕ`), источник — `bukvicy.to_bukvicy`
>
> При правке этих данных — **сначала править `.py`**, потом `python3 tools/build_site_slavic_js.py`.

Источник — в `~/site/vk-poster/`:
- `chertogs.json` — 16 Чертогов (name, name_gen, patron, tree, pol)
- `slavic_auto.py` → `CHERTOG_STARTS` — границы по дню года
- `slavic_calendar.py` — ядро (9-дневка, 9 месяцев, якорь 20.09.2026)

Формат в подвале сайта (совпадает с VK-постом):

    СЕДМИЦА · 4 Айлѣтъ Сороковнiкъ (Мѣсꙗцъ) Новых Даровъ · Лѣто ҂ЗФЛЕ(7535)  Ѿ  С.М.З.Х.
    ⚡ Чертог Щуки – Богиня-Покровительница Рожана ⚡
    🌳 Священное Древо: Слива.

### После правки Чертогов / границ — пересобрать
    cd ~/site/vk-poster && python3 tools/build_site_slavic_js.py
    cd ~/site/bukvica49.github.io
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
3. `grep "slavic-date.js" index.html nav/*.html` — проверить, что `?v` одинаков везде

### Дата на сайте неправильная
Сначала сверить с dry-run автопостера:
    cd ~/site/vk-poster && python3 poster.py config.main.json --dry-run

- dry-run правильный → `python3 tools/build_site_slavic_js.py`
- dry-run неправильный → `~/site/vk-poster/HANDOFF.md`

## Файлы
| Файл | Роль |
|---|---|
| `index.html`, `nav/*.html`, `css/*.css`, `js/script.js` | руками |
| `js/slavic-date.js` | **СГЕНЕРИРОВАН** через `tools/build_site_slavic_js.py` |
| `MANUAL.md` | эта шпаргалка |
| `.github/workflows/pages.yml` | деплой |
| `.gitignore` | бэкапы, метрика-скрипты |

## Для AI
Прочитай `~/site/bukvica49.github.io/MANUAL.md` и `~/site/vk-poster/HANDOFF.md`.
Проблема: <одна строка>.

Правила:
1. `js/slavic-date.js` — НЕ ПРАВИТЬ РУКАМИ. Только `tools/build_site_slavic_js.py`.
2. Формат/логика Чертогов — сначала в `~/site/vk-poster/`, потом генератор.
3. Push в `bukvica49.github.io` ≠ push в `vk-poster`. Два разных репо.
4. `.bak` — не коммитить никогда.
## Кнопочная система статей и буквиц (финал 16.11.2026)
- статьи и буквицы: модалка → «⤢» → вкладка + память `vp-expand-mode`;
  закладка «⤡» на вкладке → модалка; крестик модалки сбрасывает режим;
  буквицы: «Азъ» — выход на главную с первого двойного клика (зум off на /pages/);
- `js/article.js?v=52` подключён ко ВСЕМ `posts/*.html` и `pages/pageN.html`;
- `js/postscript.js?v=3` — nav/posts.html; `js/script.js?v=15` — index.html;
- шаблон нового поста: `posts/_template.html` (article.js?v=52, footer с кнопками);
- отладка: статьи сразу вкладками → консоль `localStorage.removeItem('vp-expand-mode')`;
- откаты: теги `stable-pages-52` (финал), `stable-1411` (база 14.11).
- подробности: MANUAL_SITE_FEATURES.md и MANUAL_CODE_EDITOR.md в репо `~/site/vk-poster`.

## Редактор ✍ — «📄 Сверстать HTML» (патч 54, web/app.js в vk-poster)
- ввод в #src: строка 1 — заголовок; [img] URL Подпись; [src] URL; пустая строка = абзац;
- #dst = готовый posts/postN.html (pages.css, article.js?v=52, footer с кнопками).

## Уроки 53-серии (важно)
- правки js/app.js — только точными якорями (count==1) + `node --check` после КАЖДОЙ правки;
- сломанный синтаксис app.js = пропавшая панель поиска превью; эталон отката 9089aaf (vk-poster).

---

# 🆕 Изменения 20.11.2026 (вечер) — буквицы числовые: Лѣто ҂ȤФЛЄ (7535)

## Таблица буквиц (канон)
А=1 В=2 Г=3 Д=4 Є=5 (Єсть) Ѕ=6 (зело) Ȥ=7 (Ȥемля) И=8 Θ=9 (фита)
І=10 К=20 Л=30 М=40 Н=50 Ѯ=60 О=70 П=80 Y=90 (Червль)
Р=100 С=200 Т=300 У=400 Ф=500 Х=600 Ѱ=700 Ѿ=800 (отъ) Ц=900
Тысяча: префикс ҂ (҂ × значение).
Пример: 7535 = ҂(7000) + Ф(500) + Л(30) + Є(5) = ҂ȤФЛЄ ✅

## Где живёт таблица (КРИТИЧНО — три места!)
1. `bukvicy.py` (vk-poster) — `to_bukvicy(leto)` → шапки постов ВК.
2. `tools/build_site_slavic_js.py` (vk-poster) — СВОЯ копия таблицы
   внутри шаблона js. Правка bukvicy.py на подвал сайта НЕ влияет —
   патчить генератор отдельно!
3. `js/slavic-date.js` (сайт) — СГЕНЕРИРОВАННЫЙ, руками не править;
   обновляется генератором (п.2) + коммит/пуш сайт-репо.

## Как менять буквицы (порядок)
1) bukvicy.py (ONES/TENS/HUNDREDS + docstring)
2) tools/build_site_slavic_js.py (та же таблица в шаблоне!)
3) python3 -c "from bukvicy import to_bukvicy; assert to_bukvicy(7535)=='҂ȤФЛЄ'"
4) python3 tools/build_site_slavic_js.py
5) grep -o "5:'Є'" ~/site/bukvica49.github.io/js/slavic-date.js
6) пуш обоих репо; live: Ctrl+Shift+R (Pages-кэш до 10 мин)

## Грабли (не повторять)
- Генератор НЕ читает bukvicy.py — таблица задублирована, править ОБА файла.
- Таблица в генераторе внутри f-string ({{ }}) — замену делать по
  внутреннему тексту, скобки не трогать.
