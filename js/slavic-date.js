/* ═══ Славянская дата по Круголету Числобога в подвале ═══ */
(function () {
  const MONTHS = ['Рамхатъ','Айлѣтъ','Бэйлѣтъ','Гэйлѣтъ','Дайлѣтъ','Элѣтъ','Вэйлѣтъ','Хэйлѣтъ','Тайлѣтъ'];
  const SUMMERS = ['Тёмный Сохъ','Звѣздный Жрецъ','Огненный Жрецъ','Жемчужный Сиринъ',
    'Огненный Свитокъ','Зелёный Мечъ','Жёлтый Лисъ','Огненный Драконъ',
    'Зелёный Змѣй','Огненный Орёлъ','Звѣздный Дельфинъ','Златой Конь',
    'Огненный Пёсъ','Звѣздный Туръ','Огненный Домъ','Звѣздный Храмъ'];

  const isLeap = (s) => {
    const p = ((s - 1) % 16) + 1;
    return p === 3 || p === 7 || p === 11 || p === 15;
  };

  function getDate(now) {
    const y = now.getFullYear(), ys = new Date(y, 2, 20);
    let sy = y + 5508;
    if (now < ys) sy -= 1;
    const start = new Date(now < ys ? y - 1 : y, 2, 20);
    let rem = Math.floor((now - start) / 86400000) + 1, mi = 1;
    for (let i = 1; i <= 9; i++) {
      let dm = (i % 2 === 1) ? 41 : 40;
      if (i === 2 && isLeap(sy)) dm = 41;
      if (rem <= dm) { mi = i; break; }
      rem -= dm;
    }
    return {
      year: sy,
      month: MONTHS[mi - 1],
      day: rem,
      summer: SUMMERS[((sy - 1) % 16)]
    };
  }

  function getTime(now) {
    const s = ((now.getHours() * 60 + now.getMinutes()) + 360) % 1440;
    return { h: Math.floor(s / 90), m: s % 90 };
  }

  function update() {
    const f = document.querySelector('.footer-bar');
    if (!f) return;
    let el = document.getElementById('footer-slavic-date');
    if (!el) {
      el = document.createElement('div');
      el.id = 'footer-slavic-date';
      el.className = 'footer-slavic';
      f.appendChild(el);
    }
    const now = new Date(), d = getDate(now), t = getTime(now);
    el.innerHTML =
      '<span class="hs-label">По Круголету Числобога</span>' +
      'Лѣто ' + d.year + ' от С.М.З.Х. · ' + d.month + 'ъ ' + d.day +
      ' · ' + d.summer + ' · ' + t.h + ' часъ ' + t.m + ' частицъ';
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', update);
  else update();

  setInterval(update, 30000);
})();
