document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("modal-iframe");
  const closeBtn = document.querySelector(".close");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // Храним список всех ссылок, которые могут открываться в модалке, и индекс текущей
  const links = Array.from(document.querySelectorAll(".article-link.modal-link"));
  let currentIndex = -1;

  // --- Вспомогательные функции ---

  function updateNavButtons() {
    const isValid = currentIndex >= 0 && currentIndex < links.length;
    const hasPrev = isValid && currentIndex > 0;
    const hasNext = isValid && currentIndex < links.length - 1;

    prevBtn.disabled = !hasPrev;
    nextBtn.disabled = !hasNext;

    prevBtn.style.opacity = hasPrev ? "0.8" : "0.4";
    nextBtn.style.opacity = hasNext ? "0.8" : "0.4";

    prevBtn.style.cursor = hasPrev ? "pointer" : "not-allowed";
    nextBtn.style.cursor = hasNext ? "pointer" : "not-allowed";
  }

  function openModalWithLink(linkElement) {
    if (!linkElement) return;

    const href = linkElement.getAttribute("href");
    iframe.src = href;

    // Находим индекс этой ссылки, чтобы корректно работали кнопки навигации
    currentIndex = links.indexOf(linkElement);

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    modal.setAttribute("aria-hidden", "false");
    modal.focus();

    updateNavButtons();
  }

  function closeModal() {
    modal.style.display = "none";
    iframe.src = "";
    document.body.style.overflow = "";
    modal.setAttribute("aria-hidden", "true");
    document.body.focus();
    currentIndex = -1;
  }

  // --- Обработчики событий ---

  // Открываем в модалке по клику на любую ссылку .modal-link
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // Патч 23: память режима — «expanded» → сразу развёрнутая вкладка
      var _mode = 'modal';
      try { _mode = localStorage.getItem('vp-expand-mode') || 'modal'; } catch (err) {}
      if (_mode === 'expanded') {
        window.open(link.getAttribute("href"), "_blank");
        return;
      }
      openModalWithLink(link);
    });
  });


  // ── Патч 22: приоритет ?vp-open= (статья открыта напрямую и «свёрнута») ──
  try {
    var _q = new URLSearchParams(window.location.search).get('vp-open');
    if (_q) {
      history.replaceState(null, '', window.location.pathname);
      var _openDirect = function () {
        var _lk = links.find ? links.find(function (l) {
          var h2 = l.getAttribute('href') || '';
          return _q.endsWith(h2.split('/').pop()) || h2.endsWith(_q);
        }) : null;
        if (_lk) setTimeout(function () { openModalWithLink(_lk); }, 150);
        else setTimeout(function () {
          iframe.src = _q.startsWith('posts/') || _q.startsWith('pages/') ? ('../' + _q) : _q;
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          modal.setAttribute('aria-hidden', 'false');
        }, 150);
      };
      _openDirect();
      window.__vpOpenDone = true;
    }
  } catch (e) {}

  // ── Авто-открытие статьи в модалке после «Свернуть» (15.11.2026) ──
  if (!window.__vpOpenDone) try {
    var _raw = sessionStorage.getItem('vp-modal-reopen');
    if (_raw) {
      sessionStorage.removeItem('vp-modal-reopen');
      // патч 5: метка времени — модалка открывается только если «Свернуть» было < 3 сек назад
      var _reopen = null, _fresh = false;
      try {
        var _obj = JSON.parse(_raw);
        if (_obj && _obj.url) { _reopen = _obj.url; _fresh = (Date.now() - _obj.ts) < 3000; }
      } catch (e2) { _reopen = _raw; _fresh = true; }
      if (_fresh && _reopen) {
        var _link = links.find ? links.find(function (l) {
          return l.getAttribute('href') && _reopen.endsWith(l.getAttribute('href').split('/').pop());
        }) : null;
        if (_link) {
          setTimeout(function () { openModalWithLink(_link); }, 150);
        } else {
          // pages/pageN.html не в списке ссылок — открываем модалку напрямую
          setTimeout(function () {
            iframe.src = _reopen;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            modal.setAttribute('aria-hidden', 'false');
          }, 150);
        }
      }
      // не свежая — просто открываем список без модалки (это «Назад»)
    }
  } catch (e) { /* sessionStorage недоступен — ничего */ }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      const prevLink = links[currentIndex - 1];
      openModalWithLink(prevLink);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < links.length - 1) {
      const nextLink = links[currentIndex + 1];
      openModalWithLink(nextLink);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "flex") return;

    switch (e.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) {
          const prevLink = links[currentIndex - 1];
          openModalWithLink(prevLink);
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < links.length - 1) {
          const nextLink = links[currentIndex + 1];
          openModalWithLink(nextLink);
        }
        break;
    }
  });

  // ARIA и доступность
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Просмотр статьи");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-hidden", "true");

  closeBtn.setAttribute("aria-label", "Закрыть модальное окно");
  prevBtn.setAttribute("aria-label", "Предыдущая статья");
  nextBtn.setAttribute("aria-label", "Следующая статья");

  // Адаптивная сетка (оставляем, если где-то используется .family-tree)
  function resizeFamilyTree() {
    const tree = document.querySelector(".family-tree");
    if (!tree) return;

    const windowWidth = window.innerWidth;
    if (windowWidth <= 480) {
      tree.style.width = "90%";
    } else if (windowWidth <= 768) {
      tree.style.width = "85%";
    } else {
      tree.style.width = "100%";
      tree.style.maxWidth = "600px";
    }
  }

  resizeFamilyTree();
  window.addEventListener("resize", resizeFamilyTree);
});





function adaptArticleLinks() {
  const isMobile = window.innerWidth <= 768;

  document.querySelectorAll('.article-link').forEach(link => {
    // Находим иконку — она должна быть первой вложенностью
    const icon = link.querySelector('.link-icon');
    if (!icon) return;

    const mobileTitle = link.getAttribute('data-mobile-title');
    const originalText = link.dataset.originalFullText || '';

    // Получаем только текстовый узел (без иконки)
    const textContent = Array.from(link.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent.trim())
      .join(' ')
      .trim();

    if (mobileTitle && isMobile) {
      // Оставляем иконку на месте, меняем только текст
      link.textContent = '';          // очищаем всё
      link.appendChild(icon);         // возвращаем иконку
      link.insertAdjacentText('beforeend', mobileTitle);
    } else if (originalText) {
      // Возвращаем полный текст
      link.textContent = '';
      link.appendChild(icon);
      link.insertAdjacentText('beforeend', originalText);
    }
  });
}

// Инициализация: сохраняем полный текст (без иконки) один раз
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.article-link').forEach(link => {
    const icon = link.querySelector('.link-icon');
    if (icon) {
      const textNodes = Array.from(link.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      const fullText = textNodes.map(n => n.textContent.trim()).join(' ').trim();
      link.dataset.originalFullText = fullText;
    } else {
      link.dataset.originalFullText = link.textContent.trim();
    }
  });

  adaptArticleLinks();
});

window.addEventListener('resize', adaptArticleLinks);


// ── Патч 24: плавающая кнопка «Развернуть» как часть модального окна ──
(function () {
  var modal = document.getElementById("modal");
  var iframe = document.getElementById("modal-iframe");
  if (!modal || !iframe) return;

  var fab = document.createElement("button");
  fab.type = "button";
  fab.id = "vp-modal-fab";
  fab.innerHTML = '<span class="icon">⤢</span><span class="vp-fab-label">Развернуть</span>';
  fab.title = "Открыть статью на всю страницу";
  document.body.appendChild(fab);

  var st = document.createElement("style");
  st.textContent = [
    '#vp-modal-fab{ position:fixed; right:18px; bottom:18px; width:52px; height:52px;',
    '  padding:0; border:1px solid rgba(0,0,0,.15); border-radius:14px; background:#fff;',
    '  display:none; flex-direction:column; align-items:center; justify-content:center;',
    '  z-index:10001; cursor:pointer; box-shadow:0 4px 16px rgba(0,0,0,.35); }',
    '#vp-modal-fab .icon{ font-size:22px; line-height:1; }',
    '#vp-modal-fab .vp-fab-label{ font-size:9px; line-height:1.2; margin-top:2px; opacity:.85; }',
    '#vp-modal-fab:hover{ transform:scale(1.06); transition:.15s; }'
  ].join('\\n');
  document.head.appendChild(st);

  function isOpen() {
    return modal.style.display === "flex";
  }
  function refresh() {
    var open = isOpen();
    var mode = 'modal';
    try { mode = localStorage.getItem('vp-expand-mode') || 'modal'; } catch (e) {}
    // показываем кнопку только когда модалка открыта и режим — модальный
    fab.style.display = (open && mode === 'modal') ? 'flex' : 'none';
  }

  fab.addEventListener("click", function () {
    if (!isOpen()) return;
    var src = iframe.getAttribute("src");
    if (!src) return;
    try { localStorage.setItem('vp-expand-mode', 'expanded'); } catch (e) {}
    window.open(src, "_blank"); // без noopener — вкладка сможет «Свернуться» в модалку
  });

  // следим за открытием/закрытием модалки (display меняется напрямую)
  var _t = setInterval(refresh, 400);
  refresh();
})();
