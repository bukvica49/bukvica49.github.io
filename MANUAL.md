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
- `pages/`, `posts/` — доп. страницы (все с фавиконом ../az.png)
- `.github/workflows/pages.yml` — деплой

## Локальный просмотр
    cd ~/site/bukvica49.github.io
    python3 -m http.server 8000
Открыть http://localhost:8000/ + Ctrl+Shift+R.

⚠️ `file://` НЕ использовать — `<script src="js/...">` не грузится.

## Деплой
`git push` в `main` → Pages собирается САМ (`.github/workflows/pages.yml`).
Статус: https://github.com/bukvica49/bukvica49.github.io/actions

## ⚠️ Славянская дата — ЕДИНЫЙ ДВИЖОК
`js/slavic-date.js` — **СГЕНЕРИРОВАН**. НЕ ПРАВИТЬ РУКАМИ.

Единственный источник дат: `~/site/vk-poster/calendar_engine.py`
(якорь 1 Рамхатъ 7535 = 19.09.2026; границы Чертогов — тоже из него).

### После правки движка/буквиц — пересобрать
    cd ~/site/vk-poster && python3 tools/build_site_slavic_js.py
    cd ~/site/bukvica49.github.io
    git add js/ index.html nav/ && git commit -m "sync: slavic-date.js из calendar_engine" && git push

Генератор сам поднимает `?v=N→N+1` в `index.html` и `nav/*.html` (cache-bust).

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

# 🆕 Единый движок и буквицы (обновлено 23.11.2026)

## Таблица буквиц — теперь ДВА места (было три)
1. `bukvicy.py` (vk-poster) — `to_bukvicy(leto)` → шапки постов ВК.
2. `tools/build_site_slavic_js.py` — читает таблицу из bukvicy.py при сборке. Дубля больше нет.
3. `js/slavic-date.js` — сгенерирован, руками не править.

## Как менять буквицы
1) bukvicy.py → 2) `python3 -c "from bukvicy import to_bukvicy; assert to_bukvicy(7535)=='҂ȤФЛЄ'"` → 3) генератор → 4) пуш обоих репо, Ctrl+Shift+R.

## Грабли (не повторять)
- НЕ добавлять в код компенсации «+1 день» — только `post_slavic_date()` (граница суток 18:00).
- Push в `bukvica49.github.io` ≠ push в `vk-poster`. Два разных репо. `.bak` — не коммитить.
