(function () {
  var prefersReduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.querySelector(".mobile-panel");
  var navLinks = panel ? panel.querySelectorAll("a") : [];

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closePanel() {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openPanel() {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) closePanel();
      else openPanel();
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closePanel);
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 900px)").matches) closePanel();
    });
  }

  var smoothOk = !prefersReduce;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: smoothOk ? "smooth" : "auto",
          block: "start",
        });
      }
    });
  });

  var revealEls = document.querySelectorAll(".scroll-reveal");

  if (prefersReduce) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window && revealEls.length) {
    var revealIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealIo.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    revealEls.forEach(function (el) {
      revealIo.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
