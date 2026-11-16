// js/bukvica.js — общий скрипт для страниц буквиц (/pages/pageN.html)
(function () {
  'use strict';

  var HOME_PAGE_URL = '../index.html';

  window.goBackToHome = function () {
    var isInsideIframe = false;
    try { isInsideIframe = window.self !== window.top; } catch (e) { isInsideIframe = true; }

    if (isInsideIframe) {
      try {
        var parentDoc = window.parent.document;
        // Патч 33: надёжное закрытие — напрямую дёргаем modal display (крестик мог быть
        // не найден из-за вложенности), с логом для диагностики
        var modal = parentDoc.getElementById('modal');
        console.info('[vp] goBack: modal найден?', !!modal);
        if (modal) {
          modal.style.display = 'none';
          parentDoc.body.style.overflow = '';
          modal.setAttribute('aria-hidden', 'true');
          var iframe = parentDoc.getElementById('modal-iframe');
          if (iframe) iframe.src = '';
          console.info('[vp] goBack: модалка закрыта напрямую');
          // Патч 36: щит от pass-through клика — этот же клик мог провалиться под
          // оверлей и переоткрыть модалку (стек показал openModal из tree-node)
          try {
            var shield = function (ev) {
              ev.stopPropagation();
              ev.preventDefault();
            };
            parentDoc.addEventListener('click', shield, true);
            parentDoc.addEventListener('mousedown', shield, true);
            parentDoc.addEventListener('mouseup', shield, true);
            setTimeout(function () {
              parentDoc.removeEventListener('click', shield, true);
              parentDoc.removeEventListener('mousedown', shield, true);
              parentDoc.removeEventListener('mouseup', shield, true);
            }, 400);
          } catch (e2) {}
          return;
        }
        var closeBtn = parentDoc.querySelector('.close');
        if (closeBtn) { closeBtn.click(); console.info('[vp] goBack: close.click'); return; }
        parentDoc.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
        );
        return;
      } catch (e) {
        console.info('[vp] goBack: ошибка, уходим напрямую', e);
        try { window.top.location.href = HOME_PAGE_URL; return; } catch (e2) {}
      }
    }
    // Патч 34: вкладка открыта fab'ом с index (opener жив) — сигналим родителю:
    // index-вкладка закроет свою модалку, эта вкладка закроется сама.
    try {
      if (window.opener && !window.opener.closed) {
        // Патч 48: сброс убран — глобальный режим сохраняется при возврате с вкладки
        window.opener.postMessage({ type: 'vp-home' }, '*');
        window.close();
        // если браузер запретил close — fallback: обычный переход
        setTimeout(function () {
          if (!window.closed) window.location.href = HOME_PAGE_URL;
        }, 250);
        return;
      }
    } catch (e) {}
    window.location.href = HOME_PAGE_URL;
  };

  // === Возврат на главную — только ПЕРВАЯ картинка на странице ===
  function bindFirstClickableImage() {
    var img = document.querySelector('.clickable-image');   // единственная
    if (!img) return;
    if (img.hasAttribute('onclick') || img.dataset.homeBound === '1') return;
    img.dataset.homeBound = '1';

    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    if (!img.hasAttribute('title')) {
      img.setAttribute('title', 'Вернуться на главную страницу');
    }

    img.addEventListener('click', function (e) {
      e.preventDefault();
      window.goBackToHome();
    });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.goBackToHome();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindFirstClickableImage);
  } else {
    bindFirstClickableImage();
  }
})();
