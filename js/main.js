// Homepage preloader — wordmark holds center, then the two panels split
// apart like a vault door swinging open.
const preloader = document.querySelector("#preloader");

if (preloader) {
  document.body.style.overflow = "hidden";

  window.setTimeout(() => {
    preloader.classList.add("is-opening");
  }, 800);

  window.setTimeout(() => {
    document.body.style.overflow = "";
    preloader.remove();
  }, 1500);
}

// Mobile nav drawer — a panel slides in from the right over a dimming
// scrim, closed by its own close button, the scrim, a nav link, or Escape.
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileNavDrawer = document.querySelector("#mobileNavDrawer");

function openMobileNav() {
  header.classList.add("nav-open");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  header.classList.remove("nav-open");
  document.body.style.overflow = "";
}

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    if (header.classList.contains("nav-open")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

if (mobileNavDrawer) {
  mobileNavDrawer.querySelector(".mobile-nav-scrim")?.addEventListener("click", closeMobileNav);
  mobileNavDrawer.querySelector(".mobile-nav-close")?.addEventListener("click", closeMobileNav);

  mobileNavDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });
}

// Reveal-on-scroll
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Contact form (static demo — no backend wired up yet)
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const successMsg = document.querySelector("#form-success");
    if (successMsg) {
      successMsg.classList.add("is-visible");
    }
    contactForm.reset();
  });
}
