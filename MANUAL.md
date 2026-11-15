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

> В шаблоне `tools/build_site_slavic_js.py` портированы:
> - `LONG_MONTHS` — длинные имена месяцев (`Божественного Начала`, `Новых Даровъ`, …), источник — `MONTH_DESC` в `slavic_calendar.py`
> - `cyrYear()` — кириллическая запись года (`҂ЗФЛЕ`), источник — `bukvicy.to_bukvicy`
>
> При правке этих данных — **сначала править `.py`**, потом `python3 tools/build_site_slavic_js.py`.

Источник — в `~/vk-poster/`:
- `chertogs.json` — 16 Чертогов (name, name_gen, patron, tree, pol)
- `slavic_auto.py` → `CHERTOG_STARTS` — границы по дню года
- `slavic_calendar.py` — ядро (9-дневка, 9 месяцев, якорь 20.09.2026)

Формат в подвале сайта (совпадает с VK-постом):

    СЕДМИЦА · 4 Айлѣтъ Сороковнiкъ (Мѣсꙗцъ) Новых Даровъ · Лѣто ҂ЗФЛЕ(7535)  Ѿ  С.М.З.Х.
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
3. `grep "slavic-date.js" index.html nav/*.html` — проверить, что `?v` одинаков везде

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


---

# 🆕 Изменения 15.11.2026 — кнопки «Назад/Развернуть/Свернуть» + editor.html в корне

## Кнопки статьи (js/article.js)

- **← Назад** (posts/postN.html) — ВСЕГДА ведёт в список статей `nav/posts.html`;
  в модалке — закрывает модалку. Предварительно чистит `sessionStorage['vp-modal-reopen']`.
- **⤢ Развернуть** (в модалке) — открывает статью обычной вкладкой: `window.open(url,'_blank')`
  **БЕЗ 'noopener'** (noopener обнуляет opener → «Свернуть» не закроет вкладку).
- **⤡ Свернуть** (в обычной вкладке, которая была открыта «Развернуть») — `window.close()`:
  вкладка закрывается, ты в родителе с открытой модалкой на той же статье.
  Fallback (вкладка открыта вручную, opener нет): `sessionStorage['vp-modal-reopen'] = {url, ts}`
  → переход на posts.html → авто-модалка ТОЛЬКО если метка свежая (< 3 сек).
- **pages/pageN.html**: «← Назад» убрано; footer = одна кнопка «⤢ Развернуть» **по центру**
  (`margin:0 auto`); article.js подключён в head; footer перед метрикой Яндекса.
- Покрыты ВСЕ: posts/post1-9 (9) + pages/page1-49 (49). Точка проверки:
  `grep -l "vp-expand-btn" posts/post*.html pages/page*.html | wc -l` → 58.

## Авто-модалка (js/postscript.js на nav/posts.html)

- Читает `vp-modal-reopen` (JSON {url, ts}); принимает только `Date.now()-ts < 3000`;
  ищет ссылку среди `.article-link.modal-link` — если есть, `openModalWithLink(link)`;
  если нет (pages) — прямой `iframe.src=url` + `modal.style.display='flex'`.
- Урок: `window.open(...,'noopener')` наследует КОПИЮ sessionStorage в дочернюю вкладку —
  старый флаг мог сам открывать модалку при «Назад». Решение — метка времени.

## editor.html в корне сайта

- Кнопка ✍ на сайте открывает `/editor.html` (относительно главной) — файл задеплоен
  в корень **этого** репо (копия `vk-poster/web/editor.html`).
- `app.js` (в vk-poster) открывает с cache-buster `editor.html?v=<timestamp>`.
- ⚠️ После правок editor.html в vk-poster — **перекопировать сюда и запушить**:

```bash
cp ~/site/vk-poster/web/editor.html ~/site/bukvica49.github.io/editor.html
git add editor.html && git commit -m "deploy editor.html" && git push
```

- Проверка деплоя: открыть https://bukvica49.github.io/editor.html — должен быть
  редактор с вкладками «Лист 1»/«+» у «Готовый HTML:» (не «Редактор ещё не открыт»,
  не светлый ВК-редактор без вкладок).

---

# 🆕 Изменения 15.11.2026 — «⤡ Свернуть» при прямом открытии статьи + зум картинок

## «⤡ Свернуть» из статьи, открытой напрямую

**Первопричина:** `POSTS_PAGE_URL` была объявлена внутри IIFE, а `toggleExpandFromArticle` —
снаружи → `ReferenceError` при клике, кнопка молчала для статей, открытых не из модалки.

**Фиксы (коммиты 22b…22d):**
1. `POSTS_PAGE_URL` вынесен глобально (22d) — главное.
2. Веткам «Свернуть» добавлен универсальный механизм: `posts.html?vp-open=posts/postN.html`
   (22/22b; путь = последние 2 сегмента — работает и на https, и на file://).
3. `window.close()` с проверкой через 300 мс: если браузер запретил закрыть вкладку
   (открыта пользователем, не скриптом) — fallback на `?vp-open=` (22c).

**Механика:** postscript.js на posts.html читает `?vp-open=` ПЕРВЫМ, открывает модалку
(по ссылке из списка — с навигацией ←→, иначе напрямую iframe) и чистит адрес
`history.replaceState`. Старый sessionStorage-флаг остался fallback-ом.

**Проверка:** открыть `posts/postN.html` адресной строкой → «⤡ Свернуть» → модалка
с этой статьёй на posts.html. Через модалку: «⤢ Развернуть» → «⤡ Свернуть» → окно
закрывается, возврат в модалку (как было).

## Зум картинок в статьях (postN.html)

Клик по картинке → она «вырастает» НА СВОЁМ МЕСТЕ (fixed-клон в позиции оригинала,
не полноэкранный оверлей). Масштаб: колесо (зум к курсору, 0.3×–8×), кнопки −/+/⟳
со счётчиком, двойной клик (сброс / 2.5×), клавиши +/−/0; тянуть мышью; тач — палец/щипок.
Закрытие: ✕, Esc, клик мимо, скролл страницы — плавный возврат на место.

**Грабли:** 1) `transition: transform` на плавающем слое «съедает» колесо — transition только
на закрытие (класс `.vp-closing`); 2) зум-математика — по БАЗОВОМУ rect (getBoundingClientRect
возвращает трансформированный размер); 3) `js/article.js` подключён без ?v= — после правок
Ctrl+Shift+R, иначе кэш CDN.
