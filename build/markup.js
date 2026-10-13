// Tiny HTML helpers shared by every template (navbar, footer, page
// templates): text escaping, the brand wordmark and logo, and the round
// brass call button. Kept apart from layout.js so any template can use
// them without circular requires.

const cfg = require("./config");
const { icon } = require("./icons");

// Escape text before it goes into HTML or an attribute.
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The logo wordmark: the first word of the brand name, then the rest in a
// <span> so CSS can color it brass.
function brandHtml() {
  const [first, ...rest] = cfg.BRAND.split(" ");
  return `${first} <span>${rest.join(" ")}</span>`;
}

// The brand logo: a keyhole in a brass-ringed circle (a lock cylinder's
// face), then the wordmark. Used by the navbar and the footer; styled by
// docs/components/logo/logo.css.
function logo({ root, className = "" }) {
  const cls = className ? `logo ${className}` : "logo";
  return `<a href="${root}index.html" class="${cls}">
      <span class="logo-mark" aria-hidden="true">${icon("keyhole", { root })}</span>
      <span class="logo-text">${brandHtml()}</span>
    </a>`;
}

// The round call button on its own (icon only). Styled by
// components/call-orb/call-orb.css. size: "sm" | "md" | "lg";
// tone: "brass" (brass orb, for light or dark surfaces) | "dark" (ink orb,
// for brass surfaces like the CTA panel).
function callOrb({ root = "", size = "md", tone = "brass" } = {}) {
  return `<a class="call-orb call-orb--${size} call-orb--${tone}" href="tel:${cfg.PHONE_TEL}" aria-label="Call ${esc(cfg.BRAND)} at ${cfg.PHONE_DISPLAY}">${icon("phone", { root })}</a>`;
}

// The round call button with the phone number beside it, as one link (one
// big tap target). The kicker is the small line above the number.
function callBlock({ root = "", size = "md", tone = "brass", kicker = "Call 24/7" } = {}) {
  return `<a class="call-block call-block--${tone}" href="tel:${cfg.PHONE_TEL}">
  <span class="call-orb call-orb--${size} call-orb--${tone}" aria-hidden="true">${icon("phone", { root })}</span>
  <span class="call-block-text"><span class="call-block-kicker">${esc(kicker)}</span><span class="call-block-number">${cfg.PHONE_DISPLAY}</span></span>
</a>`;
}

module.exports = { esc, brandHtml, logo, callOrb, callBlock };
