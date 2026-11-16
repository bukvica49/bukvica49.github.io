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
  }

  // --- Клик по узлу дерева → открыть буквицу ---
  document.querySelectorAll(".tree-node a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      const match = href.match(/page(\d+)\.html$/);
      const pageNum = match ? parseInt(match[1], 10) : 1;
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


// ── Патч 31: плавающая кнопка «Развернуть» в модалке на index.html ──
(function () {
  var modal = document.getElementById("modal");
  var iframe = document.getElementById("modal-iframe");
  if (!modal || !iframe) return;

  var fab = document.createElement("button");
  fab.type = "button";
  fab.id = "vp-modal-fab";
  fab.innerHTML = '<span class="icon">⤢</span>'; // Патч 30: без текста
  fab.title = "Открыть страницу на всю вкладку";
  // Патч 27: z-index инлайном — гарантия поверх затемнения
  fab.style.position = "fixed";
  fab.style.zIndex = "1002";
  document.body.appendChild(fab);

  var st = document.createElement("style");
  st.textContent = [
    '#vp-modal-fab{ right:20px; bottom:20px; width:52px; height:52px;',
    '  padding:0; border:none; border-radius:10px; background:rgba(0,0,0,.7); color:#fff;',
    '  display:none; flex-direction:column; align-items:center; justify-content:center;',
    '  cursor:pointer; transition:background .15s, transform .15s; }',
    '#vp-modal-fab .icon{ font-size:20px; line-height:1; color:#fff; }',
    '#vp-modal-fab:hover{ background:#ff3333; transform:scale(1.1); }',
    '#vp-modal-fab:focus{ outline:2px solid #00aaff; outline-offset:2px; }'
  ].join('\\n');
  document.head.appendChild(st);

  function isOpen() { return modal.style.display === "flex"; }
  function refresh() { fab.style.display = isOpen() ? "flex" : "none"; }

  fab.addEventListener("click", function () {
    if (!isOpen()) return;
    var src = iframe.getAttribute("src");
    if (!src) return;
    try { localStorage.setItem('vp-expand-mode', 'expanded'); } catch (e) {}
    window.open(src, "_blank"); // без noopener — вкладка сможет «Свернуться» обратно в модалку
  });

  setInterval(refresh, 400);
  refresh();
})();


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

// Патч 37b: хронология модалки
(function () {
  var modal = document.getElementById('modal');
  if (!modal || !window.MutationObserver) return;
  var t = function () { return (performance.now() / 1000).toFixed(3); };
  var mo = new MutationObserver(function () {
    var st = (new Error().stack || '').split('
').slice(1, 4).join(' | ');
    console.log('[vp-chrono]', t(), 'display ->', modal.style.display, st);
  });
  mo.observe(modal, { attributes: true, attributeFilter: ['style'] });
  document.querySelectorAll('.tree-node a').forEach(function (a) {
    a.addEventListener('click', function () { console.log('[vp-chrono]', t(), 'клик tree-node'); }, true);
  });
  var cb = document.querySelector('.close');
  if (cb) cb.addEventListener('click', function () { console.log('[vp-chrono]', t(), 'клик .close'); }, true);
})();
