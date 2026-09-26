// Navbar: the hamburger toggle for the mobile drawer, and the scroll
// listener that grows the sticky bar from a floating pill into a flush,
// full-width bar over the first 100px of scroll (the sizing itself is
// CSS, driven by the --navbar-progress custom property; see navbar.css).

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileNavDrawer = document.querySelector("#mobileNavDrawer");

// ----------------------------------------------------------- Mobile drawer

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

// -------------------------------------------------------- Scroll-grow bar

// Distance, in pixels, over which the bar grows from a pill to full width.
const GROW_DISTANCE = 100;

function updateNavbarProgress() {
  const progress = Math.min(window.scrollY, GROW_DISTANCE) / GROW_DISTANCE;
  header.style.setProperty("--navbar-progress", progress);
}

if (header) {
  let ticking = false;
  updateNavbarProgress();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateNavbarProgress();
        ticking = false;
      });
    },
    { passive: true }
  );
}
