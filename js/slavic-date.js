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
  function header(dt) {
    const sl = slavicDate(dt);
    const days = dayDiff(sl, ANCHOR_DATE);
    const [leto, mi, d, wi] = shiftDays(ANCHOR_LETO, ANCHOR_MONTH, ANCHOR_DAY, ANCHOR_WIDX, days);
    return SLAVIC_DAYS[wi] + ' · ' + d + ' ' + SLAVIC_MONTHS[mi] + ' · Лѣто ' + leto;
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
    el.textContent = header();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else update();
  setInterval(update, 60000);
  window.__slavicHeader = header;
})();
