// Footer markup: a brand + call row, four link columns (company, popular
// services, service area, contact), and the copyright/license line.
// Styled by docs/components/footer/footer.css.

const cfg = require("./config");
const urls = require("./urls");
const { SERVICES } = require("./services-data");
const { TOWNS } = require("./locations-data");
const { esc, callBlock, logo } = require("./markup");
const { icon } = require("./icons");

// Services featured in the footer (internal links to the broad service pages).
const FOOTER_SERVICES = [
  "home-lockout-service",
  "car-key-replacement",
  "lock-rekeying",
  "deadbolt-installation",
  "smart-lock-installation",
];

// One footer link column: a small heading over a plain list of links.
function linkColumn(title, items) {
  const lis = items.map((li) => `          <li>${li}</li>`).join("\n");
  return `      <div class="footer-col">
        <h2 class="footer-heading">${title}</h2>
        <ul class="footer-links">
${lis}
        </ul>
      </div>`;
}

// Site footer, used on every page. On phones the CSS trims it to three
// short rows: logo + call orb, phone · email, and the copyright line.
function footer({ root }) {
  const link = (href, label) => `<a href="${root}${href}">${label}</a>`;

  const company = [
    link("about.html", "About"),
    link(urls.servicesIndex, "Services"),
    link(urls.locationsIndex, "Locations"),
    link("contact.html", "Contact"),
  ];

  const popular = FOOTER_SERVICES.map((slug) => SERVICES.find((s) => s.slug === slug)).map((s) =>
    link(urls.service(s), esc(s.name))
  );

  // Counties come from the town data, in the order the towns are listed.
  const counties = [...new Set(TOWNS.map((t) => t.county))];
  const area = [
    ...counties.map((c) => link(`${urls.locationsIndex}#${urls.countyAnchor(c)}`, esc(c))),
    `<a class="footer-link-more" href="${root}${urls.locationsIndex}">All locations${icon("arrow-right", { root })}</a>`,
  ];

  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        ${logo({ root, className: "footer-logo" })}
        <p class="footer-tagline">Licensed, insured locksmiths across Long Island, NY — open 24/7.</p>
      </div>
      ${callBlock({ root, size: "md", tone: "brass", kicker: "Call 24/7" })}
    </div>
    <div class="footer-grid">
${linkColumn("Company", company)}
${linkColumn("Popular services", popular)}
${linkColumn("Service area", area)}
      <div class="footer-col footer-col--contact">
        <h2 class="footer-heading">Contact</h2>
        <ul class="footer-contact">
          <li><a class="footer-phone" href="tel:${cfg.PHONE_TEL}">${icon("phone", { root })}${cfg.PHONE_DISPLAY}</a></li>
          <li><a href="mailto:${cfg.EMAIL}">${icon("mail", { root })}${cfg.EMAIL}</a></li>
          <li>${icon("clock", { root })}Open 24/7</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© ${new Date().getFullYear()} ${cfg.BRAND}. All rights reserved.</p>
      <p class="footer-license">License #placeholder-0000 · Fully Insured</p>
    </div>
  </div>
</footer>`;
}

module.exports = { FOOTER_SERVICES, footer };
