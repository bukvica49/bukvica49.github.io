// js/article.js — общий скрипт для страниц статей (/posts/postN.html)
(function () {
  // Ссылка на страницу со списком статей, относительно файла статьи
  var POSTS_PAGE_URL = '../nav/posts.html';

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

    // обычная вкладка: шаг назад по истории (15.11.2026)
    if (window.history && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = POSTS_PAGE_URL;
    }
  };
})();

  // ── Переключение модалка ↔ обычная страница (15.11.2026) ──
  function _inIframe() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }

  window.toggleExpandFromArticle = function () {
    if (_inIframe()) {
      // модалка → обычная вкладка
      window.open(window.location.href, '_blank', 'noopener');
    } else {
      // обычная вкладка → вернуть в модалку: запоминаем статью и уводим на список
      try { sessionStorage.setItem('vp-modal-reopen', window.location.href); } catch (e) {}
      window.location.href = POSTS_PAGE_URL;
    }
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
