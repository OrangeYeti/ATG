(function () {
  let revealObserver = null;
  let activeObserver = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initHeader() {
    const sync = () => {
      const header = document.getElementById("siteHeader");
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 14);
    };

    sync();
    if (!window.__ATG_HEADER_BOUND) {
      window.addEventListener("scroll", sync, { passive: true });
      window.__ATG_HEADER_BOUND = true;
    }
  }

  function initMobileNav() {
    const header = document.getElementById("siteHeader");
    const button = header ? header.querySelector(".menu-button") : null;
    if (!header || !button) return;

    button.addEventListener("click", () => {
      const isOpen = !header.classList.contains("is-open");
      header.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("is-menu-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
    });

    header.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("is-open");
        document.body.classList.remove("is-menu-open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
        history.pushState(null, "", id);
      });
    });
  }

  function initLocaleButtons() {
    document.querySelectorAll("button[data-locale]").forEach((button) => {
      button.addEventListener("click", () => {
        const locale = button.dataset.locale;
        window.ATG_I18N.setLocale(locale);
      });
    });
  }

  function initReveals() {
    const items = [...document.querySelectorAll(".reveal")];
    if (revealObserver) revealObserver.disconnect();

    if (prefersReducedMotion()) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 24, 180)}ms`;
      revealObserver.observe(item);
    });
  }

  function initActiveNav() {
    if (activeObserver) activeObserver.disconnect();
    const links = [...document.querySelectorAll(".nav__link")];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { threshold: 0.32, rootMargin: "-18% 0px -58% 0px" }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }

  function init() {
    initHeader();
    initMobileNav();
    initAnchors();
    initLocaleButtons();
    initReveals();
    initActiveNav();
  }

  window.ATG_MOTION = {
    init
  };
})();
