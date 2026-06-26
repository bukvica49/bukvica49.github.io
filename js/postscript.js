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
      openModalWithLink(link);
    });
  });

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
