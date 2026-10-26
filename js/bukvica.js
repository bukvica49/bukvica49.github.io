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
        var closeBtn = parentDoc.querySelector('.close');
        if (closeBtn) { closeBtn.click(); return; }
        parentDoc.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
        );
        return;
      } catch (e) {
        try { window.top.location.href = HOME_PAGE_URL; return; } catch (e2) {}
      }
    }
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
