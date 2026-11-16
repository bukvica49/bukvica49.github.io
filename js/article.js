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

    window.location.href = POSTS_PAGE_URL;
  };
})();
