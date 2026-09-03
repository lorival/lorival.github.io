(function () {
  const statGrid = document.querySelector("[data-stat-grid]");
  if (statGrid) {
    const cards = Array.from(statGrid.children);
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    cards.forEach((card) => statGrid.appendChild(card));
  }

  const root = document.documentElement;
  const savedTheme = localStorage.getItem("lorival-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.dataset.theme = savedTheme || (prefersLight ? "light" : "dark");

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

  const header = document.querySelector("[data-header]");
  let lastScrollY = window.scrollY;

  const onScroll = () => {
    if (header) {
      const goingDown = window.scrollY > lastScrollY + 8;
      const goingUp = window.scrollY < lastScrollY - 8;
      if (window.scrollY < 20 || goingUp) header.classList.remove("is-hidden");
      if (window.scrollY > 120 && goingDown) header.classList.add("is-hidden");
    }
    lastScrollY = window.scrollY;
  };

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
