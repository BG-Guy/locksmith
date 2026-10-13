// Navbar markup: the fixed site header (hamburger, logo, nav links, the
// circular call button) and the mobile drawer it opens. Styled by
// docs/components/navbar/navbar.css; behavior in navbar.js beside it.

const urls = require("./urls");
const { brandHtml, callBlock, logo } = require("./markup");
const { icon } = require("./icons");

// Main navigation, in display order. `id` matches the `active` argument
// every page passes in.
const NAV = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "services", label: "Services", href: urls.servicesIndex },
  { id: "locations", label: "Locations", href: urls.locationsIndex },
  { id: "about", label: "About", href: "about.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];

// `root` is the path from the current page back to the site root:
// "" for pages at the top level, "../" for pages inside a folder.

// Marks the nav item for the current page. A top-level page IS the page its
// item links to ("page"); a page in a folder (a service page, a town hub)
// sits inside that item's section ("true" = the current item of a set).
function currentAttr(id, { active, root }) {
  if (id !== active) return "";
  return ` aria-current="${root === "" ? "page" : "true"}"`;
}

// Site header. The hamburger comes first in the DOM so keyboard order
// matches the screen (it sits on the left on phones and tablets, and is
// hidden on desktop, where the nav links show instead).
function header({ active, root }) {
  const links = NAV.map(
    (n) => `        <li><a href="${root}${n.href}"${currentAttr(n.id, { active, root })}>${n.label}</a></li>`
  ).join("\n");
  return `<header class="site-header">
  <div class="site-header-inner">
    <button type="button" class="nav-toggle" aria-controls="mobileNavDrawer" aria-expanded="false" aria-label="Open menu">
      ${icon("menu", { root })}
    </button>
    ${logo({ root })}
    <nav class="main-nav" aria-label="Main">
      <ul class="main-nav-list">
${links}
      </ul>
    </nav>
    <div class="header-actions">
      ${callBlock({ root, size: "md", tone: "brass", kicker: "Call 24/7" })}
    </div>
  </div>
</header>`;
}

// Mobile drawer: slides in from the left when the hamburger is tapped.
// A sibling AFTER the header, not inside it (navbar.css explains why).
// Contents: wordmark + close, the nav list, a call card, a trust line.
function drawer({ active, root }) {
  const items = NAV.map(
    (n) => `        <li><a href="${root}${n.href}"${currentAttr(n.id, { active, root })}><span>${n.label}</span>${icon("chevron-right", { root })}</a></li>`
  ).join("\n");
  return `<div class="mobile-nav-drawer" id="mobileNavDrawer">
  <div class="mobile-nav-scrim"></div>
  <div class="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="mobile-nav-head">
      <span class="logo-text">${brandHtml()}</span>
      <button type="button" class="mobile-nav-close" aria-label="Close menu">
        ${icon("close", { root })}
      </button>
    </div>
    <nav class="mobile-nav-body" aria-label="Main">
      <ul class="mobile-nav-list">
${items}
      </ul>
    </nav>
    <div class="mobile-nav-call">
      ${callBlock({ root, size: "lg", tone: "brass", kicker: "Call 24/7" })}
      <a class="btn btn-ghost btn-block" href="${root}contact.html">Request service${icon("arrow-right", { root })}</a>
    </div>
    <ul class="mobile-nav-trust">
      <li>${icon("shield-check", { root })}Licensed &amp; insured</li>
      <li>${icon("clock", { root })}Open 24/7</li>
    </ul>
  </div>
</div>`;
}

// Header + drawer together: the block injected into hand-made pages.
function headerBlock(opts) {
  return `<a class="skip-link" href="#main">Skip to main content</a>\n${header(opts)}\n\n${drawer(opts)}`;
}

module.exports = { NAV, header, drawer, headerBlock };
