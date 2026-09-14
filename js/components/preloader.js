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
