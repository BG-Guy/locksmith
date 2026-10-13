// The vault door: two charcoal halves meeting on a brass seam, with the logo,
// a loading bar, and the page's title on it. The home page plays it as its
// preloader on every visit; every page plays it when it is reached through a
// link on this site, after the page being left has swung it shut. Styled and
// run by docs/components/page-transition/.

const { esc, brandHtml } = require("./markup");
const { icon } = require("./icons");

// Runs before the first paint: if the visitor got here by a link on this
// site (page-transition.js left a note naming this page, under 10s ago),
// start the page with the door shut so it can open. The note's key and the
// path rule must match page-transition.js.
const ARRIVAL_SCRIPT = `
  try {
    var trip = JSON.parse(sessionStorage.getItem("page-transition"));
    sessionStorage.removeItem("page-transition");
    var here = location.pathname.replace(/(\\/index)?\\.html$/, "").replace(/\\/$/, "");
    if (trip && trip.to === here && Date.now() - trip.at < 10000) {
      document.documentElement.classList.add("is-arriving");
    }
  } catch (error) {}
`;

// The door, then its arrival check. `title` is the page title shown under
// the logo on arrival; it goes in data-title and CSS draws it, so search
// engines don't read it as a second copy of the page's heading. `preload`
// plays the door on every load (the home page), without a title.
function pageTransition({ root, title, preload = false }) {
  const cls = preload ? "page-transition page-transition--preload" : "page-transition";
  return `<div class="${cls}" aria-hidden="true">
  <div class="page-transition-panel page-transition-panel-left"></div>
  <div class="page-transition-panel page-transition-panel-right"></div>
  <div class="page-transition-brand">
    <span class="page-transition-mark">${icon("keyhole", { root })}</span>
    <span class="page-transition-logo">${brandHtml()}</span>
    <span class="page-transition-bar"></span>
    <span class="page-transition-title" data-title="${esc(title)}"></span>
  </div>
</div>
<script>${ARRIVAL_SCRIPT}</script>`;
}

module.exports = { pageTransition };
