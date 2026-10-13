// Navbar behavior: grows the fixed bar from a floating capsule into a
// full-width bar over the first 100px of scroll and switches it to its dark
// look at 100px, and runs the mobile drawer (open/close, focus trap, scroll
// lock). All the visuals live in navbar.css; markup in build/navbar.js.

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const drawer = document.getElementById("mobileNavDrawer");

// ------------------------------------------------------ Scroll-driven bar

// Distance, in pixels, over which the capsule becomes a full-width bar.
const GROW_DISTANCE = 100;

// Write how far into that distance the page is (0 → 1) for the CSS to size
// the bar from, and flip to the dark look once it's all the way there.
// Clamped at 0 so iOS's rubber-band bounce above the page can't go negative.
function updateBar() {
  const progress = Math.min(Math.max(window.scrollY, 0), GROW_DISTANCE) / GROW_DISTANCE;
  header.style.setProperty("--navbar-progress", progress.toFixed(3));
  header.classList.toggle("is-scrolled", progress === 1);
}

// Recalculate at most once per frame while scrolling.
if (header) {
  let ticking = false;
  updateBar();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateBar();
        ticking = false;
      });
    },
    { passive: true }
  );
  // A page restored by the back button can come back mid-scroll.
  window.addEventListener("pageshow", updateBar);
}

// ---------------------------------------------------------- Mobile drawer

// Everything Tab can land on inside the open panel.
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Wider than this the hamburger is hidden (matches navbar.css).
const desktopQuery = window.matchMedia("(min-width: 1120px)");

const isOpen = () => drawer.classList.contains("is-open");

// Open: show the panel, lock the page behind it, move focus inside (without
// scrolling anything — the panel is still sliding in at this point).
function openDrawer() {
  drawer.classList.add("is-open");
  document.documentElement.classList.add("nav-locked");
  navToggle.setAttribute("aria-expanded", "true");
  drawer.querySelector(".mobile-nav-close").focus({ preventScroll: true });
}

// Close: slide the panel away, unlock the page, and hand focus back to the
// hamburger — unless it isn't on screen any more (widened to desktop).
function closeDrawer({ restoreFocus = true } = {}) {
  if (!isOpen()) return;
  drawer.classList.remove("is-open");
  document.documentElement.classList.remove("nav-locked");
  navToggle.setAttribute("aria-expanded", "false");
  if (restoreFocus) navToggle.focus({ preventScroll: true });
}

// Keep Tab / Shift+Tab cycling inside the open panel.
function trapFocus(event) {
  const items = drawer.querySelectorAll(FOCUSABLE);
  const first = items[0];
  const last = items[items.length - 1];
  if (!drawer.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// Wire it up: hamburger, close button, scrim, every link, the keyboard,
// and a resize past the breakpoint.
if (navToggle && drawer) {
  navToggle.addEventListener("click", () => (isOpen() ? closeDrawer() : openDrawer()));
  drawer.querySelector(".mobile-nav-close").addEventListener("click", () => closeDrawer());
  drawer.querySelector(".mobile-nav-scrim").addEventListener("click", () => closeDrawer());

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeDrawer());
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") closeDrawer();
    else if (event.key === "Tab") trapFocus(event);
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeDrawer({ restoreFocus: false });
  });
}
