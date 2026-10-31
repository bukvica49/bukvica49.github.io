/* ═══ Славянская дата по Круголету Числобога ═══
   Порт 1-в-1 из ~/vk-poster/slavic_calendar.py + slavic_auto.py + chertogs.json
   Якорь: 20.09.2026 = 1 Рамхатъ 7535, ОСЬМИЦА */
(function () {
  'use strict';

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

  /* ── Чертоги — 1-в-1 из ~/vk-poster/chertogs.json ── */
  const CHERTOGS = {
    1:  { name: 'Вепрь',           patron: 'Рамхат',           tree: 'Груша' },
    2:  { name: 'Щука',            patron: 'Рожана',           tree: 'Слива' },
    3:  { name: 'Лебедь',          patron: 'Макошь',           tree: 'Сосна' },
    4:  { name: 'Змей',            patron: 'Семаргл',          tree: 'Липа' },
    5:  { name: 'Ворон',           patron: 'Коляда, Варуна',   tree: 'Лиственница' },
    6:  { name: 'Медведь',         patron: 'Сварог',           tree: 'Малина' },
    7:  { name: 'Бусл (аист)',     patron: 'Род',              tree: 'Ива' },
    8:  { name: 'Волк (Белый Пёс)', patron: 'Велес',           tree: 'Тополь' },
    9:  { name: 'Лиса',            patron: 'Марена',           tree: 'Смородина, граб' },
    10: { name: 'Тур',             patron: 'Крышень',          tree: 'Осина' },
    11: { name: 'Лось',            patron: 'Лада',             tree: 'Берёза' },
    12: { name: 'Финист',          patron: 'Вышень',           tree: 'Вишня' },
    13: { name: 'Конь',            patron: 'Купала',           tree: 'Папоротник' },
    14: { name: 'Орёл',            patron: 'Перун',            tree: 'Дуб' },
    15: { name: 'Раса (Леопард)',  patron: 'Даждьбог (Тарх)',  tree: 'Ясень' },
    16: { name: 'Дева',            patron: 'Джива',            tree: 'Яблоня' }
  };

  /* ── Границы чертогов — 1-в-1 из ~/vk-poster/slavic_auto.py ── */
  const CHERTOG_STARTS = [1, 23, 45, 66, 88, 110, 134, 159, 184,
                          207, 229, 252, 274, 297, 319, 343];

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
    return SLAVIC_DAYS[wi] + ' · ' + d + ' ' + SLAVIC_MONTHS[mi] + ' · Лѣто ' + leto;
  }

  function chertogLine(dt) {
    const { leto, mi, d } = calcSlavic(dt);
    const n = chertogNumber(leto, mi, d);
    const ch = CHERTOGS[n] || { name: '?', patron: '?', tree: '?' };
    return 'Чертог ' + ch.name + ' · ' + ch.patron + ' · ' + ch.tree;
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
