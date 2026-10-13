// Page transitions (see page-transition.css): following a link to another
// page of this site swings the vault door shut over this page, then the
// browser moves on, and the next page opens the door with its own title on
// it. The opening runs on CSS timing, started before the first paint by the
// inline script in the door's markup (build/page-transition.js). This file
// shuts the door, holds the page still while it is shut, and opens it again
// when Back returns to a page that was left shut.

const root = document.documentElement;
const door = document.querySelector(".page-transition");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// The note that tells the next page to open the door, and the path rule both
// pages use to compare addresses ("/", "/index.html" and "" are one page).
// Keep both in step with the inline script in build/page-transition.js.
const TRIP_KEY = "page-transition";
const pagePath = (url) => url.pathname.replace(/(\/index)?\.html$/, "").replace(/\/$/, "");

let leaving = false;
let reopenTimer = 0;

// ------------------------------------------------------------- Scroll lock

// Keep the page from scrolling while the door is shut, and let go as soon as
// its last CSS step ("page-transition-done") has run. A timer backs that up,
// so the page can never stay locked.
function lockScrollWhileShut() {
  const lastStep = door.getAnimations?.().find((a) => a.animationName === "page-transition-done");
  if (!lastStep || lastStep.playState === "finished") return;

  const release = () => root.classList.remove("transition-locked");
  root.classList.add("transition-locked");
  lastStep.finished.then(release, release);
  window.setTimeout(release, 3000);
}

// ------------------------------------------------------------------ Leaving

// The address a click should carry through the door: a plain click on a
// link to another page of this site. Calls (tel:), email, other sites, jumps
// within this page, and clicks meant for a new tab pass through untouched.
function destinationOf(event) {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return null;

  const url = new URL(link.href);
  if (url.origin !== location.origin) return null;

  const samePage = pagePath(url) === pagePath(location) && url.search === location.search;
  if (samePage && link.getAttribute("href").includes("#")) return null;
  return url;
}

// Shut the door, then follow the link once it has closed (a timer covers
// animations that can't run, e.g. in a background tab). Without session
// storage the next page couldn't open the door, so just go.
function leaveFor(url) {
  try {
    sessionStorage.setItem(TRIP_KEY, JSON.stringify({ to: pagePath(url), at: Date.now() }));
  } catch {
    location.assign(url.href);
    return;
  }

  leaving = true;
  root.classList.remove("is-arriving", "transition-locked");
  root.classList.add("is-leaving");

  let gone = false;
  const go = () => {
    if (gone) return;
    gone = true;
    location.assign(url.href);
  };
  const shutting = door.getAnimations?.({ subtree: true }) ?? [];
  Promise.all(shutting.map((a) => a.finished)).then(go, go);
  window.setTimeout(go, 1000);

  // If the browser never leaves (Stop was pressed, or the link started a
  // download), open the door again instead of leaving the page covered.
  reopenTimer = window.setTimeout(reopen, 8000);
}

// Open the door on this page again: after Back restores it from the
// browser's page cache exactly as it was left (shut), or when leaving stalled.
function reopen() {
  window.clearTimeout(reopenTimer);
  if (!root.classList.contains("is-leaving")) return;

  try {
    sessionStorage.removeItem(TRIP_KEY);
  } catch {
    // Nothing to clean up without storage.
  }
  leaving = false;
  root.classList.remove("is-leaving");
  root.classList.add("is-arriving");
  lockScrollWhileShut();
}

// ------------------------------------------------------------------ Wiring

// Listen on the document, so every other click handler (e.g. the drawer
// closing itself) has run first. A second click while the door shuts is
// swallowed, so it can't start a second trip.
if (door) {
  document.addEventListener("click", (event) => {
    if (reducedMotion.matches) return;
    const url = destinationOf(event);
    if (!url) return;
    event.preventDefault();
    if (!leaving) leaveFor(url);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) reopen();
  });

  // This load already opens with the door shut: the home page's preloader,
  // or an arrival through a link.
  if (door.classList.contains("page-transition--preload") || root.classList.contains("is-arriving")) {
    lockScrollWhileShut();
  }
}
