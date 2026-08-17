(() => {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const root = document.documentElement;

  /* ---- смена темы ---- */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {});
  }

  /* ---- шапка ---- */
  const header = document.getElementById("header");
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("header--scrolled", y > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  /* ---- Mobile nav ---- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }),
  );

  /* ---- эффект появления при скролле ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---- счётчики ---- */
  const counters = document.querySelectorAll(".stat__num[data-count]");
  const fmt = new Intl.NumberFormat("ru-RU");

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!prefersReduced && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => {
      el.textContent =
        fmt.format(parseInt(el.dataset.count, 10)) + (el.dataset.suffix || "");
    });
  }

  /* ---- Form ---- */
  const form = document.getElementById("form");
  const note = document.getElementById("formNote");
  const inputs = form.querySelectorAll("input, textarea");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    inputs.forEach((input) => {
      const bad = !input.value.trim();
      input.classList.toggle("invalid", bad);
      if (bad) valid = false;
    });

    if (valid) {
      form.reset();
      note.hidden = false;
      setTimeout(() => (note.hidden = true), 6000);
    }
  });

  inputs.forEach((input) =>
    input.addEventListener("input", () => input.classList.remove("invalid")),
  );
})();
