(function () {
  const root = document.documentElement;
  if (!root.dataset.theme) {
    const savedTheme = localStorage.getItem("lorival-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    root.dataset.theme = savedTheme || (prefersLight ? "light" : "dark");
  }

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const syncThemeTooltip = () => {
    if (!themeToggle) return;
    const label =
      root.dataset.theme === "light"
        ? themeToggle.dataset.labelOff
        : themeToggle.dataset.labelOn;
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("data-tooltip", label);
  };

  syncThemeTooltip();

  themeToggle?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("lorival-theme", root.dataset.theme);
    syncThemeTooltip();
  });

  const statGrid = document.querySelector("[data-stat-grid]");
  if (statGrid) {
    const cards = Array.from(statGrid.children);
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => fragment.appendChild(card));
    statGrid.appendChild(fragment);
  }

  const header = document.querySelector("[data-header]");
  let lastScrollY = 0;
  let scrollQueued = false;

  const updateHeader = (y) => {
    if (!header) return;
    const goingDown = y > lastScrollY + 8;
    const goingUp = y < lastScrollY - 8;
    if (y < 20 || goingUp) header.classList.remove("is-hidden");
    if (y > 120 && goingDown) header.classList.add("is-hidden");
    lastScrollY = y;
  };

  const onScroll = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      scrollQueued = false;
      updateHeader(window.scrollY);
    });
  };

  document.addEventListener("scroll", onScroll, { passive: true });
  requestAnimationFrame(() => {
    lastScrollY = window.scrollY;
    updateHeader(lastScrollY);
  });

  document.querySelectorAll("[data-review-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".review-card");
      if (!card) return;

      const excerpt = card.querySelector("[data-review-excerpt]");
      const full = card.querySelector("[data-review-full]");
      const expanded = card.classList.toggle("is-expanded");

      if (excerpt) excerpt.hidden = expanded;
      if (full) full.hidden = !expanded;
      button.textContent = expanded
        ? button.dataset.labelLess
        : button.dataset.labelMore;
    });
  });

  const versionDialog = document.querySelector("[data-version-dialog]");
  const versionDialogImg = versionDialog?.querySelector("[data-version-dialog-img]");
  if (versionDialog && versionDialogImg) {
    const zoomLabel = versionDialog.querySelector("[data-version-zoom-label]");
    const zoomIn = versionDialog.querySelector("[data-version-zoom-in]");
    const zoomOut = versionDialog.querySelector("[data-version-zoom-out]");
    const zoomReset = versionDialog.querySelector("[data-version-zoom-reset]");
    const baseWidth = 960;
    const minZoom = 0.5;
    const maxZoom = 3;
    const step = 0.25;
    let zoom = 1;

    const applyZoom = () => {
      versionDialog.style.setProperty("--version-zoom-width", `${Math.round(baseWidth * zoom)}px`);
      if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    };

    const setZoom = (next) => {
      zoom = Math.min(maxZoom, Math.max(minZoom, Math.round(next * 100) / 100));
      applyZoom();
    };

    document.querySelectorAll("[data-version-lightbox]").forEach((button) => {
      button.addEventListener("click", () => {
        const fullSrc = button.getAttribute("data-full") || "";
        versionDialogImg.removeAttribute("src");
        versionDialogImg.src = fullSrc;
        versionDialogImg.alt = button.getAttribute("data-alt") || "";
        setZoom(1);
        versionDialog.showModal();
      });
    });

    zoomIn?.addEventListener("click", () => setZoom(zoom + step));
    zoomOut?.addEventListener("click", () => setZoom(zoom - step));
    zoomReset?.addEventListener("click", () => setZoom(1));

    versionDialog.addEventListener("click", (event) => {
      if (event.target === versionDialog) versionDialog.close();
    });

    versionDialog.addEventListener("close", () => {
      versionDialogImg.removeAttribute("src");
      versionDialogImg.alt = "";
      setZoom(1);
    });

    versionDialog.addEventListener(
      "wheel",
      (event) => {
        if (!(event.metaKey || event.ctrlKey)) return;
        event.preventDefault();
        setZoom(zoom + (event.deltaY < 0 ? step : -step));
      },
      { passive: false }
    );
  }

  const typewriter = document.querySelector("[data-typewriter]");
  if (!typewriter || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const phrases = [
    "data-driven decisions",
    "contract-first APIs",
    "software engineering craft",
    "automation over toil",
    "agentic software engineering",
    "you build it, you run it",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrase = phrases[phraseIndex];
    typewriter.textContent = phrase.slice(0, charIndex);

    if (!deleting && charIndex < phrase.length) charIndex += 1;
    else if (!deleting) deleting = true;
    else if (charIndex > 0) charIndex -= 1;
    else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    const delay = deleting ? 45 : charIndex === phrase.length ? 1200 : 70;
    window.setTimeout(tick, delay);
  };

  tick();
})();
