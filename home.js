// Behavior unique to index.html: the vault-door preloader, and the
// scroll-reveal animation used by this page's sections.

// Preloader — wordmark holds center, then the two panels split apart
// like a vault door swinging open.
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

// Reveal-on-scroll — fades and rises each .reveal section in as it enters
// the viewport.
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
