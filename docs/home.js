// Behavior unique to index.html: the scroll lock behind the preloader, the
// services filter tabs, and the reveal-on-scroll animation.
//
// The vault-door preloader and the hero's lock animation run on CSS timing
// alone (home.css): the doors start opening at 0.8s and the hero sequence
// starts with them, or almost at once when the page has no preloader. Both
// share one clock, so they stay in sync, and nothing can get stuck closed
// if this script fails to load.

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ------------------------------------------------------------ Preloader lock

// Keep the page from scrolling behind the closed doors, and release it as
// soon as the preloader's last CSS step ("preloader-done") has run. A timer
// backs that up, so the page can never stay locked.
const preloader = document.querySelector("#preloader");

function lockScrollWhilePreloading() {
  const lastStep = preloader.getAnimations?.().find((a) => a.animationName === "preloader-done");
  if (!lastStep || lastStep.playState === "finished") return;

  const root = document.documentElement;
  const release = () => root.classList.remove("is-preloading");
  root.classList.add("is-preloading");
  lastStep.finished.then(release, release);
  window.setTimeout(release, 3000);
}

if (preloader && !prefersReducedMotion) {
  lockScrollWhilePreloading();
}

// ------------------------------------------------------ Services filter tabs

// Show only the cards whose data-category matches the pressed tab ("all"
// shows every card), keep aria-pressed in step, and announce the result in
// the polite status line under the tabs (#services-status).
const filterTabs = [...document.querySelectorAll(".filter-tab")];
const serviceCards = [...document.querySelectorAll(".services-grid .service-card")];
const filterStatus = document.querySelector("#services-status");

// The tab's own words ("Residential"), without its count badge.
function tabLabel(tab) {
  return [...tab.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join("")
    .trim()
    .toLowerCase();
}

function showCategory(tab) {
  const category = tab.dataset.filter;
  let shown = 0;

  filterTabs.forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));

  serviceCards.forEach((card) => {
    const matches = category === "all" || card.dataset.category === category;
    const wasHidden = card.classList.contains("is-hidden");
    card.classList.toggle("is-hidden", !matches);
    if (!matches) return;
    shown += 1;

    // A card coming back into view fades up instead of popping in. Leaving
    // display:none restarts its animation, so no forced reflow is needed.
    if (wasHidden && !prefersReducedMotion) card.classList.add("is-entering");
  });

  if (filterStatus) {
    const noun = shown === 1 ? "service" : "services";
    filterStatus.textContent =
      category === "all" ? `Showing all ${shown} ${noun}` : `Showing ${shown} ${tabLabel(tab)} ${noun}`;
  }
}

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => showCategory(tab));
});

// Drop the entrance class once its own animation ends (events from the
// card's children bubble up too, so check which animation finished).
serviceCards.forEach((card) => {
  card.addEventListener("animationend", (event) => {
    if (event.target === card && event.animationName === "hero-rise") {
      card.classList.remove("is-entering");
    }
  });
});

// ---------------------------------------------------------- Reveal on scroll

// Fade and rise each .reveal block in as it enters the viewport. The hidden
// start state only applies under html.has-reveal (added here), so content
// is never left invisible if this script doesn't run, and visitors who ask
// for less motion simply see everything in place.
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
  document.documentElement.classList.add("has-reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    // Trigger when a block's top edge is 8% above the bottom of the screen
    // (threshold 0, so even blocks taller than the screen reveal).
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => {
    revealObserver.observe(el);
    // A block that receives keyboard focus shows at once, so Tab can never
    // land on a control that is still faded out
    el.addEventListener(
      "focusin",
      () => {
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
      },
      { once: true }
    );
  });
}
