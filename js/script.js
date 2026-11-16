// Ждём полной загрузки DOM перед запуском
document.addEventListener("DOMContentLoaded", () => {
  // === Элементы интерфейса ===
  const modal    = document.getElementById("modal");
  const iframe   = document.getElementById("modal-iframe");
  const closeBtn = document.querySelector(".close");
  const prevBtn  = document.getElementById("prev-btn");
  const nextBtn  = document.getElementById("next-btn");

  let currentPage = 0;
  const totalPages = 49;

  // --- Обновить состояние кнопок навигации ---
  function updateNavButtons() {
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    prevBtn.style.opacity = currentPage <= 1 ? "0.4" : "0.8";
    nextBtn.style.opacity = currentPage >= totalPages ? "0.4" : "0.8";

    prevBtn.style.cursor = currentPage <= 1 ? "not-allowed" : "pointer";
    nextBtn.style.cursor = currentPage >= totalPages ? "not-allowed" : "pointer";
  }

  // --- Открыть модальное окно ---
  function openModal(pageNum) {
    const page = Math.max(1, Math.min(pageNum, totalPages));
    currentPage = page;
    iframe.src = `pages/page${page}.html`;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    modal.setAttribute("aria-hidden", "false");

    updateNavButtons();
    modal.focus();
  }

  // --- Закрыть модальное окно ---
  function closeModal() {
    modal.style.display = "none";
    iframe.src = "";
    document.body.style.overflow = "";
    modal.setAttribute("aria-hidden", "true");
    document.body.focus();
    // Патч 48: закрыл модалку — глобальный модальный режим
    try { localStorage.setItem('vp-expand-mode', 'modal'); } catch (e2) {}
  }

  // --- Клик по узлу дерева → открыть буквицу ---
  document.querySelectorAll(".tree-node a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      const match = href.match(/page(\d+)\.html$/);
      const pageNum = match ? parseInt(match[1], 10) : 1;
      // Патч 48: глобальный режим — вкладкой, если раньше развернул любую буквицу/статью
      try {
        if (localStorage.getItem('vp-expand-mode') === 'expanded') {
          window.open(href, '_blank');
          return;
        }
      } catch (e3) {}
      openModal(pageNum);
    });
  });

  // --- Кнопки и клик по фону ---
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) openModal(currentPage - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) openModal(currentPage + 1);
  });

  // --- Клавиатурная навигация ---
  document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "flex") return;
    switch (e.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (currentPage > 1) openModal(currentPage - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentPage < totalPages) openModal(currentPage + 1);
        break;
    }
  });

  // --- ARIA и доступность ---
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Страница буквицы");

  closeBtn.setAttribute("aria-label", "Закрыть модальное окно");
  prevBtn.setAttribute("aria-label", "Предыдущая буквица");
  nextBtn.setAttribute("aria-label", "Следующая буквица");

  modal.setAttribute("tabindex", "-1");

  // === Адаптивная сетка: подстройка размера под экран ===
  const tree = document.querySelector(".family-tree");

  function resizeFamilyTree() {
    if (!tree) return;

    const windowWidth = window.innerWidth;

    // Мобилка и планшет — резиновая сетка, страница скроллится как обычно
    if (windowWidth <= 768) {
      tree.style.width = windowWidth <= 480 ? "90%" : "85%";
      tree.style.height = "";
      tree.style.maxWidth = "";
      return;
    }

    // Десктоп — вписываем в оставшееся место, квадрат min(w, h)
    const container = tree.parentElement;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    const size = Math.max(240, Math.min(w, h));

    tree.style.width = size + "px";
    tree.style.height = size + "px";
    tree.style.maxWidth = "none";
  }

  // Первичный расчёт + при ресайзе окна
  resizeFamilyTree();
  window.addEventListener("resize", resizeFamilyTree);

  // Пересчёт при изменении контейнера (загрузка шрифтов, появление скроллбара, dev-tools)
  if (tree && "ResizeObserver" in window) {
    const ro = new ResizeObserver(() => resizeFamilyTree());
    ro.observe(tree.parentElement);
  }

  // Финальный пересчёт после полной загрузки страницы
  window.addEventListener("load", resizeFamilyTree);
});




// ── Патч 34: вкладка-буквица просит закрыть модалку на index (возврат на главную) ──
window.addEventListener('message', function (ev) {
  try {
    if (!ev.data || ev.data.type !== 'vp-home') return;
    var modal = document.getElementById('modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
    var iframe = document.getElementById('modal-iframe');
    if (iframe) iframe.src = '';
    var fab = document.getElementById('vp-modal-fab');
    if (fab) fab.style.display = 'none';
  } catch (e) {}
});

// Патч 44c: вкладка-буквица сигналит vp-open — открыть её в модалке index
window.addEventListener('message', function (ev) {
  try {
    var d = ev.data;
    if (!d || d.type !== 'vp-open' || !d.url) return;
    var m = String(d.url).match(/page([0-9]+)\.html$/);
    if (!m) return;
    var modal = document.getElementById('modal');
    var iframe = document.getElementById('modal-iframe');
    if (!modal || !iframe) return;
    iframe.src = 'pages/page' + m[1] + '.html';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
  } catch (e) {}
});

// Патч 44c: ?vp-open=pages/pageN.html — открыть модалку буквицы при загрузке index
(function () {
  try {
    var q = new URLSearchParams(window.location.search);
    var t = q.get('vp-open') || '';
    var m = t.match(/page([0-9]+)\.html$/);
    if (!m) return;
    setTimeout(function () {
      var modal = document.getElementById('modal');
      var iframe = document.getElementById('modal-iframe');
      if (!modal || !iframe) return;
      iframe.src = 'pages/page' + m[1] + '.html';
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      history.replaceState(null, '', window.location.pathname);
    }, 200);
  } catch (e) {}
})();

// ── Патч 46: fab «Развернуть» в модалке index (буквицы) ──
(function () {
  var modal = document.getElementById('modal');
  var iframe = document.getElementById('modal-iframe');
  if (!modal || !iframe) return;

  var fab = document.createElement('button');
  fab.type = 'button';
  fab.id = 'vp-modal-fab';
  fab.innerHTML = '<span class="icon">⤢</span>';
  fab.title = 'Открыть буквицу на всю вкладку';
  fab.style.position = 'fixed';
  fab.style.zIndex = '1002';
  fab.style.display = 'none';
  document.body.appendChild(fab);

  var st = document.createElement('style');
  st.textContent = [
    '#vp-modal-fab{ right:20px; bottom:20px; width:52px; height:52px;',
    '  padding:0; border:none; border-radius:10px; background:rgba(0,0,0,.7); color:#fff;',
    '  flex-direction:column; align-items:center; justify-content:center;',
    '  cursor:pointer; transition:background .15s, transform .15s; }',
    '#vp-modal-fab .icon{ font-size:20px; line-height:1; color:#fff; }',
    '#vp-modal-fab:hover{ background:#ff3333; transform:scale(1.1); }',
    '#vp-modal-fab:focus{ outline:2px solid #00aaff; outline-offset:2px; }'
  ].join('\n');
  document.head.appendChild(st);

  function isOpen() { return modal.style.display === 'flex'; }
  function refresh() { fab.style.display = isOpen() ? 'flex' : 'none'; }

  fab.addEventListener('click', function () {
    if (!isOpen()) return;
    var src = iframe.getAttribute('src');
    if (!src) return;
    try { localStorage.setItem('vp-expand-mode', 'expanded'); } catch (e1) {} // Патч 48b
    window.open(src, '_blank');
  });

  setInterval(refresh, 400);
  refresh();
})();
// Патч 47: память развернутых буквиц активна
// Патч 48: глобальная память режима буквиц
