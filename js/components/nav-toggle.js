// Mobile nav toggle
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    header.classList.toggle("nav-open");
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => header.classList.remove("nav-open"));
  });
}
