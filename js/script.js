// Ждём полной загрузки DOM перед запуском скрипта
document.addEventListener("DOMContentLoaded", () => {
  // === Основные элементы интерфейса ===
  const modal = document.getElementById("modal");           /* → модальное окно */
  const iframe = document.getElementById("modal-iframe");   /* → iframe для загрузки страниц буквиц */
  const closeBtn = document.querySelector(".close");        /* → кнопка закрытия */
  const prevBtn = document.getElementById("prev-btn");      /* → кнопка "назад" */
  const nextBtn = document.getElementById("next-btn");      /* → кнопка "вперёд" */

  let currentPage = 0;                                      /* → текущая открытая страница */
  const totalPages = 49;                                    /* → общее количество страниц буквиц */

  // --- Функция: обновить состояние навигационных кнопок ---
  function updateNavButtons() {
    prevBtn.disabled = currentPage <= 1;                    /* → блокируем "назад", если на первой странице */
    nextBtn.disabled = currentPage >= totalPages;           /* → блокируем "вперёд", если на последней */

    prevBtn.style.opacity = currentPage <= 1 ? "0.4" : "0.8"; /* → понижаем прозрачность для неактивной кнопки */
    nextBtn.style.opacity = currentPage >= totalPages ? "0.4" : "0.8";

    prevBtn.style.cursor = currentPage <= 1 ? "not-allowed" : "pointer"; /* → меняем курсор */
    nextBtn.style.cursor = currentPage >= totalPages ? "not-allowed" : "pointer";
  }

  // --- Функция: открыть модальное окно с указанной страницей ---
  function openModal(pageNum) {
    const page = Math.max(1, Math.min(pageNum, totalPages)); /* → ограничиваем номер в пределах 1–49 */
    currentPage = page;                                       /* → сохраняем текущую страницу */
    iframe.src = `pages/page${page}.html`;                   /* → загружаем HTML-файл страницы */
    modal.style.display = "flex";                             /* → показываем модальное окно */
    document.body.style.overflow = "hidden";                  /* → отключаем скролл страницы */
    modal.setAttribute("aria-hidden", "false");               /* → доступность: окно видимо для скринридеров */

    // Обновляем состояние кнопок
    updateNavButtons();

    // Фокус на модальное окно для доступности (управление с клавиатуры)
    modal.focus();
  }

  // --- Функция: закрыть модальное окно ---
  function closeModal() {
    modal.style.display = "none";                             /* → скрываем окно */
    iframe.src = "";                                          /* → очищаем iframe — останавливаем загрузку */
    document.body.style.overflow = "";                        /* → возвращаем скролл страницы */
    modal.setAttribute("aria-hidden", "true");                /* → доступность: окно скрыто */
    document.body.focus();                                    /* → возвращаем фокус на основной документ */
  }

  // --- Открытие модального окна по клику на узел дерева ---
  document.querySelectorAll(".tree-node a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();                                     /* → отменяем стандартный переход по ссылке */
      const href = link.getAttribute("href");                 /* → получаем путь из атрибута href */
      const match = href.match(/page(\d+)\.html$/);           /* → извлекаем номер страницы через регулярку */
      const pageNum = match ? parseInt(match[1], 10) : 1;     /* → преобразуем в число, по умолчанию — 1 */
      openModal(pageNum);                                     /* → открываем нужную страницу */
    });
  });

  // --- Обработчики событий для кнопок и клика по фону ---
  closeBtn.addEventListener("click", closeModal);             /* → закрытие по крестику */

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();                     /* → закрытие по клику на тёмный фон */
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) openModal(currentPage - 1);          /* → переход к предыдущей странице */
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) openModal(currentPage + 1); /* → переход к следующей странице */
  });

  // --- Клавиатурная навигация — для доступности ---
  document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "flex") return;               /* → работаем только если окно открыто */

    switch (e.key) {
      case "Escape":                                          /* → Esc — закрыть */
        closeModal();
        break;
      case "ArrowLeft":                                       /* → ← — предыдущая */
        e.preventDefault();                                   /* → отменяем скролл страницы */
        if (currentPage > 1) openModal(currentPage - 1);
        break;
      case "ArrowRight":                                      /* → → — следующая */
        e.preventDefault();
        if (currentPage < totalPages) openModal(currentPage + 1);
        break;
    }
  });

  // --- Дополнительно: ARIA и доступность ---
  modal.setAttribute("aria-hidden", "true");                  /* → изначально окно скрыто */
  modal.setAttribute("role", "dialog");                       /* → роль диалогового окна */
  modal.setAttribute("aria-modal", "true");                   /* → указываем, что это модальное окно */
  modal.setAttribute("aria-label", "Страница буквицы");       /* → название для скринридеров */

  closeBtn.setAttribute("aria-label", "Закрыть модальное окно"); /* → подсказка для кнопки */
  prevBtn.setAttribute("aria-label", "Предыдущая буквица");
  nextBtn.setAttribute("aria-label", "Следующая буквица");

  modal.setAttribute("tabindex", "-1");                       /* → фокус можно установить программно */

  // === Адаптивная сетка: подстройка размера дерева под экран ===
  function resizeFamilyTree() {
    const tree = document.querySelector('.family-tree');      /* → получаем сетку */
    if (!tree) return;                                        /* → защита от ошибок, если элемента нет */

    const windowWidth = window.innerWidth;                    /* → текущая ширина окна */

    if (windowWidth <= 480) {
      tree.style.width = '90%';                               /* → на узких экранах — почти вся ширина */
    } else if (windowWidth <= 768) {
      tree.style.width = '85%';                               /* → на планшетах */
    } else {
      tree.style.width = '100%';                              /* → на десктопах */
      tree.style.maxWidth = '600px';                          /* → но не больше 600px */
    }
  }

  // Вызываем при загрузке и при изменении размера окна
  resizeFamilyTree();                                         /* → сразу подстраиваем при загрузке */
  window.addEventListener('resize', resizeFamilyTree);        /* → и при ресайзе */
});
