/* ═══ Славянская дата по Круголету Числобога ═══
   ⚠️  СГЕНЕРИРОВАННЫЙ ФАЙЛ — НЕ ПРАВИТЬ ВРУЧНУЮ
   Источник: ~/vk-poster/chertogs.json + slavic_auto.CHERTOG_STARTS
   Пересобрать: cd ~/vk-poster && python3 tools/build_site_slavic_js.py */
(function () {
  'use strict';

  const SHOW_SMZH = true;  /* «от С.М.З.Х.» в шапке — как в VK-посте */

  const SLAVIC_DAYS = ['ПОНЕДѢЛЬНИКЪ','ВТОРНИКЪ','ТРИТЕЙНИКЪ','ЧЕТВЕРИКЪ','ПѦТНИЦА',
                       'ШЕСТИЦА','СЕДМИЦА','ОСЬМИЦА','НЕДѢЛѦ'];
  const SLAVIC_MONTHS = ['Рамхатъ','Айлѣтъ','Бейлѣтъ','Гэйлѣтъ','Дайлѣтъ',
                         'Элѣтъ','Вэйлѣтъ','Хэйлѣтъ','Тайлѣтъ'];
  const MONTH_LENS_SIMPLE = [41,40,41,40,41,40,41,40,41];
  const MONTH_LENS_SACRED = [41,41,41,41,41,41,41,41,41];
  const DAY_START_HOUR = 18;

  const ANCHOR_DATE  = new Date(2026, 8, 20);
  const ANCHOR_LETO  = 7535;
  const ANCHOR_MONTH = 0;
  const ANCHOR_DAY   = 1;
  const ANCHOR_WIDX  = 7;

  /* ── Чертоги (из chertogs.json) ── */
  const CHERTOGS = {
    1: { name: 'Вепрь', name_gen: 'Вепря', patron: 'Рамхат', tree: 'Груша', pol: 'м' },
    2: { name: 'Щука', name_gen: 'Щуки', patron: 'Рожана', tree: 'Слива', pol: 'ж' },
    3: { name: 'Лебедь', name_gen: 'Лебедя', patron: 'Макошь', tree: 'Сосна', pol: 'ж' },
    4: { name: 'Змей', name_gen: 'Змея', patron: 'Семаргл', tree: 'Липа', pol: 'м' },
    5: { name: 'Ворон', name_gen: 'Ворона', patron: 'Коляда, Варуна', tree: 'Лиственница', pol: 'м' },
    6: { name: 'Медведь', name_gen: 'Медведя', patron: 'Сварог', tree: 'Малина', pol: 'м' },
    7: { name: 'Бусл (аист)', name_gen: 'Бусла (аиста)', patron: 'Род', tree: 'Ива', pol: 'м' },
    8: { name: 'Волк (Белый Пёс)', name_gen: 'Волка (Белого Пса)', patron: 'Велес', tree: 'Тополь', pol: 'м' },
    9: { name: 'Лиса', name_gen: 'Лисы', patron: 'Марена', tree: 'Смородина, граб', pol: 'ж' },
    10: { name: 'Тур', name_gen: 'Тура', patron: 'Крышень', tree: 'Осина', pol: 'м' },
    11: { name: 'Лось', name_gen: 'Лося', patron: 'Лада', tree: 'Берёза', pol: 'ж' },
    12: { name: 'Финист', name_gen: 'Финиста', patron: 'Вышень', tree: 'Вишня', pol: 'м' },
    13: { name: 'Конь', name_gen: 'Коня', patron: 'Купала', tree: 'Папоротник', pol: 'м' },
    14: { name: 'Орёл', name_gen: 'Орла', patron: 'Перун', tree: 'Дуб', pol: 'м' },
    15: { name: 'Раса (Леопард)', name_gen: 'Расы (Леопарда)', patron: 'Даждьбог (Тарх)', tree: 'Ясень', pol: 'м' },
    16: { name: 'Дева', name_gen: 'Девы', patron: 'Джива', tree: 'Яблоня', pol: 'ж' }
  };

  /* ── Границы (из slavic_auto.CHERTOG_STARTS) ── */
  const CHERTOG_STARTS = [1, 24, 46, 67, 89, 111, 135, 160, 185, 208, 230, 253, 275, 298, 320, 344];

  function isSacred(leto) { return leto % 16 === 0; }
  function monthLens(leto) { return isSacred(leto) ? MONTH_LENS_SACRED : MONTH_LENS_SIMPLE; }

  function shiftDays(leto, mi, d, wi, days) {
    const step = days >= 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(days); i++) {
      wi = (wi + step + 9) % 9;
      d += step;
      if (d < 1) {
        mi -= 1;
        if (mi < 0) { mi = 8; leto -= 1; }
        d = monthLens(leto)[mi];
      } else if (d > monthLens(leto)[mi]) {
        d = 1;
        mi += 1;
        if (mi > 8) { mi = 0; leto += 1; }
      }
    }
    return [leto, mi, d, wi];
  }

  function dayDiff(a, b) {
    const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((ua - ub) / 86400000);
  }

  function slavicDate(dt) {
    if (!(dt instanceof Date)) dt = new Date();
    const sl = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    if (dt.getHours() >= DAY_START_HOUR) sl.setDate(sl.getDate() + 1);
    return sl;
  }

  function calcSlavic(dt) {
    const sl = slavicDate(dt);
    const days = dayDiff(sl, ANCHOR_DATE);
    const [leto, mi, d, wi] = shiftDays(ANCHOR_LETO, ANCHOR_MONTH, ANCHOR_DAY, ANCHOR_WIDX, days);
    return { leto, mi, d, wi };
  }

  function dayOfYear(leto, mi, d) {
    const lens = monthLens(leto);
    let total = 0;
    for (let i = 0; i < mi; i++) total += lens[i];
    return total + d;
  }

  function chertogNumber(leto, mi, d) {
    const day = dayOfYear(leto, mi, d);
    let n = 16;
    for (let i = 0; i < CHERTOG_STARTS.length; i++) {
      if (day >= CHERTOG_STARTS[i]) n = i + 1;
      else break;
    }
    return n;
  }

  function header(dt) {
    const { leto, mi, d, wi } = calcSlavic(dt);
    const tail = SHOW_SMZH ? ' от С.М.З.Х.' : '';
    return SLAVIC_DAYS[wi] + ' · ' + d + ' ' + SLAVIC_MONTHS[mi] + ' · Лѣто ' + leto + tail;
  }

  function chertogLine(dt) {
    const { leto, mi, d } = calcSlavic(dt);
    const n = chertogNumber(leto, mi, d);
    const ch = CHERTOGS[n] || { name_gen: '?', patron: '?', tree: '?', pol: '' };
    const polText = ch.pol === 'ж' ? 'Богиня-Покровительница' : 'Бог-Покровитель';
    return '⚡ Чертог ' + ch.name_gen + ' – ' + polText + ' ' + ch.patron + ' ⚡' +
           '<br>🌳 Священное Древо: ' + ch.tree + '.';
  }

  function update() {
    const footer = document.querySelector('.footer-bar');
    if (!footer) return;
    let el = document.getElementById('footer-slavic-date');
    if (!el) {
      el = document.createElement('div');
      el.id = 'footer-slavic-date';
      el.className = 'footer-slavic';
      footer.appendChild(el);
    }
    el.innerHTML = header() +
      '<br><span class="chertog-line">' + chertogLine() + '</span>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else update();
  setInterval(update, 60000);

  window.__slavicHeader = header;
  window.__chertogLine  = chertogLine;
  window.__chertogNumber = function (dt) {
    const { leto, mi, d } = calcSlavic(dt);
    return chertogNumber(leto, mi, d);
  };
})();
