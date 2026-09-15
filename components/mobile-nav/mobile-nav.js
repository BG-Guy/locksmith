// Mobile nav: opens/closes the slide-in panel from the header's hamburger
// button. Closed by its own close button, the scrim, a nav link, or Escape.
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
