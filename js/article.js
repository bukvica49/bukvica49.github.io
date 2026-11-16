// js/article.js — общий скрипт для страниц статей (/posts/postN.html)
// Патч 22d: URL списка статей — глобально (нужен и вне IIFE: toggleExpandFromArticle)
var POSTS_PAGE_URL = '../nav/posts.html';

(function () {
  // Ссылка на страницу со списком статей, относительно файла статьи

  /**
   * Возврат из статьи:
   *  - если открыто в модальном окне (iframe) — закрываем модалку;
   *  - если открыто напрямую — переходим на страницу со списком статей.
   */
  window.goBackFromArticle = function () {
    var isInsideIframe = false;
    try {
      isInsideIframe = window.self !== window.top;
    } catch (e) {
      isInsideIframe = true;
    }

    if (isInsideIframe) {
      try {
        var parentDoc = window.parent.document;
        var closeBtn = parentDoc.querySelector('.close');
        if (closeBtn) {
          closeBtn.click();
          return;
        }
        parentDoc.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
        );
        return;
      } catch (e) {
        try {
          window.top.location.href = POSTS_PAGE_URL;
          return;
        } catch (e2) {
          /* доступа нет — идём обычным путём */
        }
      }
    }

    // обычная вкладка: всегда в список статей (15.11.2026, патч 5)
    try { sessionStorage.removeItem('vp-modal-reopen'); } catch (e) {}
    window.location.href = POSTS_PAGE_URL;
  };
  
  // ── Патч 21: картинка увеличивается НА СВОЁМ МЕСТЕ ──
  function initInplaceZoom() {
    if (window.__vpInplaceInit) return;
    window.__vpInplaceInit = true;

    var layer = null;      // текущий плавающий клон
    var scale = 1, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0;
    var origin = null;     // {rect, img}
    var MIN = 0.3, MAX = 8;

    function apply() {
      if (!layer) return;
      layer.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
      var lbl = layer.querySelector('.vp-zbar span');
      if (lbl) lbl.textContent = Math.round(scale * 100) + '%';
    }

    function openZoom(imgEl) {
      closeZoom();
      var r = imgEl.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;
      origin = { rect: { l: r.left, t: r.top, w: r.width, h: r.height } };

      layer = document.createElement('div');
      layer.className = 'vp-img-zoom';
      layer.style.left = r.left + 'px';
      layer.style.top = r.top + 'px';
      layer.style.width = r.width + 'px';
      layer.style.height = r.height + 'px';
      var clone = imgEl.cloneNode(false);
      layer.appendChild(clone);
      var bar = document.createElement('div');
      bar.className = 'vp-zbar';
      bar.innerHTML = '<button data-z="out" title="Уменьшить">−</button>' +
        '<span>100%</span>' +
        '<button data-z="in" title="Увеличить">+</button>' +
        '<button data-z="reset" title="Сбросить">⟳</button>';
      layer.appendChild(bar);
      var x = document.createElement('button');
      x.className = 'vp-zclose'; x.textContent = '✕'; x.title = 'Закрыть (Esc)';
      layer.appendChild(x);
      document.body.appendChild(layer);
      scale = 1; tx = 0; ty = 0;
    }

    function closeZoom() {
      if (!layer) return;
      var el = layer;
      layer = null;
      // плавный возврат на исходное место
      var o = origin; origin = null;
      if (o) {
        el.classList.add('vp-closing');
        el.style.transform = 'translate(0,0) scale(1)';
        setTimeout(function(){ el.remove(); }, 220);
      } else el.remove();
    }

    // Патч 21b: зум к курсору по БАЗОВОМУ rect (getBoundingClientRect слоя
    // возвращает трансформированный размер — из-за этого зум ломался)
    function setScale(ns, cx, cy) {
      ns = Math.min(MAX, Math.max(MIN, ns));
      if (cx !== undefined && layer && origin) {
        var o = origin.rect;
        var cxBase = o.l + o.w / 2 + tx;  // текущий центр слоя на экране (без transform-искажения)
        var cyBase = o.t + o.h / 2 + ty;
        var k = ns / scale;
        // точка курсора относительно центра
        var px = cx - cxBase, py = cy - cyBase;
        // чтобы точка осталась под курсором: сдвиг компенсирует изменение масштаба
        tx = tx + px * (1 - k);
        ty = ty + py * (1 - k);
      }
      scale = ns; apply();
    }

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (layer) {
        // клики внутри слоя
        if (t.closest && t.closest('.vp-img-zoom')) {
          var b = t.closest && t.closest('[data-z]');
          if (t.classList && t.classList.contains('vp-zclose')) { closeZoom(); return; }
          if (b) {
            var z = b.getAttribute('data-z');
            if (z === 'in') setScale(scale * 1.25);
            if (z === 'out') setScale(scale / 1.25);
            if (z === 'reset') { scale = 1; tx = 0; ty = 0; apply(); }
          }
          return;
        }
        // клик мимо — закрыть
        closeZoom();
        return;
      }
      if (t && t.tagName === 'IMG') {
        if (t.closest && t.closest('.article-footer, .vp-zbar, .modal, .vp-img-zoom')) return;
        e.preventDefault(); e.stopPropagation();
        t.classList.add('vp-article-img');
        openZoom(t);
      }
    }, true);

    window.addEventListener('wheel', function (e) {
      if (!layer) return;
      e.preventDefault();
      setScale(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY);
    }, { passive: false });

    window.addEventListener('dblclick', function (e) {
      if (!layer) return;
      if (e.target.closest && e.target.closest('.vp-img-zoom')) {
        if (scale !== 1) { scale = 1; tx = 0; ty = 0; apply(); }
        else setScale(2.5, e.clientX, e.clientY);
      }
    });

    // панорамирование
    window.addEventListener('mousedown', function (e) {
      if (!layer || !e.target.closest || !e.target.closest('.vp-img-zoom')) return;
      if (e.target.closest && e.target.closest('.vp-zbar, .vp-zclose')) return;
      dragging = true; sx = e.clientX - tx; sy = e.clientY - ty;
      layer.classList.add('vp-grabbing'); e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      tx = e.clientX - sx; ty = e.clientY - sy; apply();
    });
    window.addEventListener('mouseup', function () { dragging = false; });

    // тач: pan одним пальцем, щипок — зум
    var tDist = 0;
    window.addEventListener('touchstart', function (e) {
      if (!layer) return;
      if (e.touches.length === 1 && e.target.closest && e.target.closest('.vp-img-zoom')) {
        dragging = true; sx = e.touches[0].clientX - tx; sy = e.touches[0].clientY - ty;
      } else if (e.touches.length === 2) {
        dragging = false;
        tDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (!layer) return;
      if (e.touches.length === 1 && dragging) {
        e.preventDefault();
        tx = e.touches[0].clientX - sx; ty = e.touches[0].clientY - sy; apply();
      } else if (e.touches.length === 2 && tDist) {
        e.preventDefault();
        var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        setScale(scale * (d / tDist)); tDist = d;
      }
    }, { passive: false });
    window.addEventListener('touchend', function () { dragging = false; tDist = 0; });

    window.addEventListener('keydown', function (e) {
      if (!layer) return;
      if (e.key === 'Escape') closeZoom();
      if (e.key === '+' || e.key === '=') setScale(scale * 1.25);
      if (e.key === '-') setScale(scale / 1.25);
      if (e.key === '0') { scale = 1; tx = 0; ty = 0; apply(); }
    });

    window.addEventListener('scroll', function () { if (layer) closeZoom(); }, { once: true, passive: true });
    // при скролле страницы закрываем — позиция fixed больше не совпадает со статьёй
    window.addEventListener('scroll', function () { if (layer) closeZoom(); }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initInplaceZoom);
  else initInplaceZoom();

})();

  // ── Переключение модалка ↔ обычная страница (15.11.2026) ──
  function _inIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }

  window.toggleExpandFromArticle = function () {
    // Патч 22c: универсальное «свернуть»
    var _makeVpOpen = function () {
      var _rel = '';
      try {
        var _u = new URL(window.location.href);
        var _segs = _u.pathname.replace(/\/$/, '').split('/').filter(Boolean);
        _rel = _segs.slice(-2).join('/'); // posts/postN.html
      } catch (e) {
        _rel = window.location.pathname.split('/').filter(Boolean).slice(-2).join('/');
      }
      try { sessionStorage.setItem('vp-modal-reopen', JSON.stringify({ url: window.location.href, ts: Date.now() })); } catch (e) {}
      window.location.href = POSTS_PAGE_URL + '?vp-open=' + encodeURIComponent(_rel);
    };

    if (_inIframe()) {
      // модалка → обычная вкладка (без noopener — иначе opener потеряем)
      window.open(window.location.href, '_blank');
      return;
    }

    if (window.opener && !window.opener.closed) {
      // вкладку открыли «Развернуть» → пробуем закрыть; если браузер запретил — фолбэк
      window.close();
      setTimeout(function () {
        // если вкладка ещё жива — close не сработал → возвращаемся через ?vp-open=
        if (!window.closed) _makeVpOpen();
      }, 300);
      return;
    }

    // статья открыта напрямую (адресная строка, правый клик) — всегда через ?vp-open=
    _makeVpOpen();
  };

// подпись кнопки по режиму
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('vp-expand-btn');
    if (!b) return;
    if (_inIframe()) {
      b.innerHTML = '<span class="icon">⤢</span> Развернуть';
      b.setAttribute('aria-label', 'Открыть статью на всю страницу');
    } else {
      b.innerHTML = '<span class="icon">⤡</span> Свернуть';
      b.setAttribute('aria-label', 'Вернуть статью в модальное окно');
    }
  });
