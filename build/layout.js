// Shared page chrome: the <head>, header, mobile drawer, and footer.
// Used for every generated page, and injected into the hand-made pages
// (index, about, contact) between their <!-- build:... --> markers, so the
// navigation is defined in exactly one place.

const cfg = require("./config");
const urls = require("./urls");
const { SERVICES } = require("./services-data");

// Main navigation, in display order. `id` matches the `active` argument.
const NAV = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "services", label: "Services", href: urls.servicesIndex },
  { id: "locations", label: "Locations", href: urls.locationsIndex },
  { id: "about", label: "About", href: "about.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];

// Services featured in the footer (internal links to the broad service pages).
const FOOTER_SERVICES = [
  "home-lockout-service",
  "car-key-replacement",
  "lock-rekeying",
  "deadbolt-installation",
  "smart-lock-installation",
];

// Stylesheets every page needs, relative to the site root.
const BASE_STYLES = [
  "global.css",
  "components/buttons/buttons.css",
  "components/header/header.css",
  "components/mobile-nav/mobile-nav.css",
  "components/footer/footer.css",
];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PHONE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" stroke="currentColor" stroke-width="1.5"/></svg>';

// `root` is the path from the current page back to the site root:
// "" for pages at the top level, "../" for pages inside a folder.

// Site header: logo, desktop nav, phone + CTA, hamburger button.
function header({ active, root }) {
  const links = NAV.map(
    (n) => `      <a href="${root}${n.href}"${n.id === active ? ' class="active"' : ""}>${n.label}</a>`
  ).join("\n");
  return `<header class="site-header">
  <div class="wrap">
    <a href="${root}index.html" class="logo">
      <span class="logo-mark">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="#D9A455" stroke-width="1.6"/>
          <path d="M12 12v8M9 16h6M9 19h6" stroke="#D9A455" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="logo-text">Guardian <span>Locksmith</span></span>
    </a>
    <nav class="main-nav">
${links}
    </nav>
    <div class="header-actions">
      <a href="tel:${cfg.PHONE_TEL}" class="phone-pill">
        ${PHONE_ICON}
        <span>${cfg.PHONE_DISPLAY}</span>
      </a>
      <a href="${root}contact.html" class="btn btn-primary">Request Service</a>
    </div>
    <button class="nav-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
}

// Mobile slide-in menu. Sits after the header (a sibling, not a child).
function drawer({ active, root }) {
  const items = NAV.map(
    (n) => `      <li><a href="${root}${n.href}"${n.id === active ? ' class="active"' : ""}>${n.label}</a></li>`
  ).join("\n");
  return `<div class="mobile-nav-drawer" id="mobileNavDrawer">
  <div class="mobile-nav-scrim"></div>
  <nav class="mobile-nav-panel" aria-label="Site navigation">
    <div class="mobile-nav-panel-head">
      <span class="mobile-nav-panel-title">Menu</span>
      <button class="mobile-nav-close" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
    <ul class="mobile-nav-list">
${items}
    </ul>
    <div class="mobile-nav-panel-foot">
      <a href="tel:${cfg.PHONE_TEL}" class="btn btn-primary btn-block">Call ${cfg.PHONE_DISPLAY}</a>
    </div>
  </nav>
</div>`;
}

// Header + drawer together: the block injected into hand-made pages.
function headerBlock(opts) {
  return `${header(opts)}\n\n${drawer(opts)}`;
}

// Site footer: brand, company links, popular services, contact details.
function footer({ root }) {
  const popular = FOOTER_SERVICES.map((slug) => SERVICES.find((s) => s.slug === slug))
    .map((s) => `          <li><a href="${root}${urls.service(s)}">${esc(s.name)}</a></li>`)
    .join("\n");
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="logo-text">Guardian <span>Locksmith</span></span>
        <p>Licensed, insured locksmith services across Long Island, NY. Residential, commercial, and automotive — available 24/7.</p>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="${root}about.html">About Us</a></li>
          <li><a href="${root}${urls.servicesIndex}">Services</a></li>
          <li><a href="${root}${urls.locationsIndex}">Locations</a></li>
          <li><a href="${root}contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Popular Services</h4>
        <ul>
${popular}
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${cfg.PHONE_TEL}">${cfg.PHONE_DISPLAY}</a></li>
          <li><a href="mailto:${cfg.EMAIL}">${cfg.EMAIL}</a></li>
          <li>Long Island, NY</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${cfg.BRAND}. All rights reserved.</span>
      <span>License #placeholder-0000 · Fully Insured</span>
    </div>
  </div>
</footer>`;
}

// A complete generated page. `body` is the <main> content.
function page({ title, description, canonical, root, styles = [], jsonld, active, body }) {
  const css = [...BASE_STYLES, ...styles]
    .map((f) => `<link rel="stylesheet" href="${root}${f}">`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<!-- GENERATED by build/build.js from build/*-data.js. Do not edit by hand:
     change the data or the templates, then run "npm run build". -->
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=Teko:wght@500;600;700&display=swap" rel="stylesheet">
${css}
<script type="application/ld+json">${jsonld}</script>
</head>
<body>

${headerBlock({ active, root })}

<main>
${body}
</main>

${footer({ root })}

<script src="${root}components/mobile-nav/mobile-nav.js" defer></script>
</body>
</html>
`;
}

module.exports = { NAV, esc, header, drawer, headerBlock, footer, page };
