// Page templates: turns the service and town data into page objects.
// Four page types are generated:
//   servicePage(service, town)  /[service]-near-[town]/  (or /[service]/ with no town)
//   townHubPage(town)           /locksmith-services-near-[town]/
//   locationsIndexPage()        locations.html
//   servicesIndexPage()         services.html
// Each returns { file, path, html, title, description, h1, type, priority }.
// Page-specific styles: components/service-page/ (service pages),
// components/location-page/ (locations.html), components/services-index/
// (services.html). Everything else on these pages is a shared component.

const cfg = require("./config");
const urls = require("./urls");
const seo = require("./seo");
const layout = require("./layout");
const { esc, callBlock } = require("./markup");
const { icon, SERVICE_ICONS, CATEGORY_ICONS } = require("./icons");
const { CATEGORIES, SERVICES } = require("./services-data");
const { TOWNS } = require("./locations-data");
const abs = (path) => `${cfg.SITE_URL}/${path}`;
const categoryLabel = (service) => CATEGORIES.find((c) => c.id === service.category).label;

// Turn a page-relative breadcrumb href ("../index.html") into an absolute URL
// for the structured-data breadcrumb trail.
const absCrumb = (href) => abs(href.replace(/^\.\.\//, "")).replace(/index\.html$/, "");

// ------------------------------------------------------------ Small components

// One clickable service card, used in every grid. data-category lets the
// home page filter the grid by category (see home.js).
function serviceCard(service, href, root = "") {
  return `<a class="service-card" data-category="${service.category}" href="${href}">
  <span class="service-card-top">
    <span class="service-card-icon">${icon(SERVICE_ICONS[service.slug], { root })}</span>
    <span class="service-tag">${esc(categoryLabel(service))}</span>
  </span>
  <h3>${esc(service.name)}</h3>
  <p>${esc(service.cardText)}</p>
  <span class="svc-link">Learn more ${icon("arrow-right", { root })}</span>
</a>`;
}

// Breadcrumb trail; the last item is the current page (no link).
function crumbsHtml(items) {
  const parts = items.map((c) =>
    c.href ? `<a href="${c.href}">${esc(c.name)}</a>` : `<span aria-current="page">${esc(c.name)}</span>`
  );
  return `<nav class="crumbs" aria-label="Breadcrumb">${parts.join('<span class="crumb-sep">/</span>')}</nav>`;
}

// A town chip: a link when we have a page for that place, plain text if not.
function nearbyChips(town, hrefFor) {
  return town.nearby
    .map((name) => {
      const match = TOWNS.find((t) => t.name === name);
      return match
        ? `<a class="town-chip" href="${hrefFor(match)}">${esc(name)}</a>`
        : `<span class="town-chip">${esc(name)}</span>`;
    })
    .join("\n");
}

const callButtons = (root) => `<a href="tel:${cfg.PHONE_TEL}" class="btn btn-primary">${icon("phone", { root })}Call ${cfg.PHONE_DISPLAY}</a>
<a href="${root}contact.html" class="btn btn-ghost">Request a free estimate${icon("arrow-right", { root })}</a>`;

// Brass call-to-action panel at the bottom of every page: the pitch on the
// left, the round call button and number on the right.
function ctaBand(heading, text, root) {
  return `<section class="cta-band">
  <div class="wrap">
    <div class="cta-panel">
      <div class="cta-copy">
        <h2>${esc(heading)}</h2>
        <p>${esc(text)}</p>
      </div>
      <div class="cta-actions">
        ${callBlock({ root, size: "lg", tone: "dark", kicker: "Call now, 24/7" })}
      </div>
    </div>
  </div>
</section>`;
}

// -------------------------------------------------------------- Service pages

const SERVICE_STYLES = [
  "components/breadcrumbs/breadcrumbs.css",
  "components/town-chips/town-chips.css",
  "components/cta-band/cta-band.css",
  "components/service-page/service-page.css",
];

// The four copy sections every service page has, in page order: the anchor
// id the "On this page" list links to, the small topic label shown above the
// H2 (also the link text), and the services-data.js fields holding the copy.
const SERVICE_TOPICS = [
  { id: "why", label: "Why you need it", heading: "h2Why", copy: "why" },
  { id: "how", label: "How we do it", heading: "h2How", copy: "how" },
  { id: "cost", label: "Cost & lifespan", heading: "h2Cost", copy: "cost" },
  { id: "risk", label: "If you wait", heading: "h2Risk", copy: "risk" },
];

// Trust points listed under the call buttons in the service hero.
const SERVICE_TRUST = [
  { icon: "shield-check", label: "Licensed & insured" },
  { icon: "clock", label: "Same-day available" },
  { icon: "tag", label: "Free estimates" },
];

// A price from the data ("$20 to $50 per lock") as a big range with its
// qualifier beside it ("per lock"). The wording is unchanged; "to" / "and up"
// just get smaller type so the numbers lead.
function priceHtml(price) {
  const match = price.match(/^(\$\d+(?:,\d{3})*(?: to \$\d+(?:,\d{3})*| and up)?)[,\s]*(.*)$/);
  const range = match ? match[1] : price;
  const note = match ? match[2] : "";
  const big = esc(range).replace(/ (to|and up)\b/, ' <span class="svc-price-joiner">$1</span>');
  const small = note ? ` <span class="svc-price-note">${esc(note)}</span>` : "";
  return `<p class="svc-price"><span class="svc-price-range">${big}</span>${small}</p>`;
}

// The dark top of a service page: breadcrumbs across the top, then the pitch
// and call buttons on the left and the "What's included" card (ending with
// the typical price) on the right. The place part of the H1 ("Near
// Huntington, NY") is wrapped so CSS can set it in brass; the text is the same.
function serviceHero({ service, town, crumbs, h1, lede, root }) {
  const place = town ? `${town.name}, ${cfg.REGION_STATE}` : `${cfg.REGION}, ${cfg.REGION_STATE}`;
  const placePhrase = h1.slice(service.name.length + 1);
  const h1Html = `${esc(service.name)} <span class="svc-h1-place">${esc(placePhrase)}</span>`;
  const trust = SERVICE_TRUST.map(
    (t) => `          <li><span class="svc-trust-icon">${icon(t.icon, { root })}</span>${esc(t.label)}</li>`
  ).join("\n");
  const includes = service.includes
    .map((item) => `          <li>${icon("check-circle", { root })}<span>${esc(item)}</span></li>`)
    .join("\n");
  return `<section class="svc-hero">
  <div class="wrap">
    ${crumbsHtml(crumbs)}
    <div class="svc-hero-grid">
      <div class="svc-hero-copy">
        <span class="eyebrow">${esc(categoryLabel(service))} locksmith · ${esc(place)}</span>
        <h1>${h1Html}</h1>
        <p class="svc-lede">${esc(lede)}</p>
        <div class="svc-actions">
          ${callButtons(root)}
        </div>
        <ul class="svc-trust">
${trust}
        </ul>
      </div>
      <aside class="svc-included" aria-labelledby="svc-included-title">
        <div class="svc-included-head">
          <span class="svc-included-icon">${icon(SERVICE_ICONS[service.slug], { root })}</span>
          <p class="svc-included-title" id="svc-included-title">What's included</p>
        </div>
        <ul class="svc-included-list">
${includes}
        </ul>
        <div class="svc-included-cost">
          <p class="svc-cost-label">Typical cost</p>
          ${priceHtml(service.price)}
        </div>
      </aside>
    </div>
  </div>
</section>`;
}

// The four copy sections, each under its topic label and with the id the
// "On this page" list links to. On a town page the town's own paragraph
// rides along with the first section, set apart as a local note, so pages
// in different towns are not copies of each other.
function serviceSections({ service, town, fill, root }) {
  return SERVICE_TOPICS.map((topic, i) => {
    const localNote =
      i === 0 && town
        ? `
  <div class="svc-local">
    <p class="svc-local-label">${icon("map-pin", { root })}Local note · ${esc(town.name)}</p>
    <p>${esc(town.localNote)}</p>
  </div>`
        : "";
    return `<div class="svc-section" id="${topic.id}">
  <p class="svc-topic">${esc(topic.label)}</p>
  <h2>${esc(fill(service[topic.heading]))}</h2>
  <p>${esc(fill(service[topic.copy]))}</p>${localNote}
</div>`;
  }).join("\n");
}

// The sidebar beside the copy. Its first part (the "On this page" list and
// the flat-rate quote card, which stays in view while the copy scrolls) fills
// the spare height; related services sit at the bottom, level with the end
// of the copy (see the Sidebar rules in service-page.css).
function serviceSidebar({ service, hrefFor, root }) {
  const toc = SERVICE_TOPICS.map(
    (t) => `        <li><a href="#${t.id}">${esc(t.label)}${icon("chevron-right", { root })}</a></li>`
  ).join("\n");
  const related = service.related
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .map(
      (s) => `      <li><a class="svc-related-card" href="${hrefFor(s)}">
        <span class="svc-related-icon">${icon(SERVICE_ICONS[s.slug], { root })}</span>
        <span class="svc-related-name">${esc(s.name)}</span>
        ${icon("arrow-right", { root, className: "svc-related-arrow" })}
      </a></li>`
    )
    .join("\n");
  return `<aside class="svc-side" aria-label="Quote and related services">
  <div class="svc-side-track">
    <nav class="svc-toc" aria-labelledby="svc-toc-title">
      <p class="svc-side-title" id="svc-toc-title">On this page</p>
      <ul>
${toc}
      </ul>
    </nav>
    <div class="svc-quote">
      <p class="svc-quote-title">Get a flat-rate quote</p>
      <p class="svc-cost-label">Typical cost</p>
      ${priceHtml(service.price)}
      <p class="svc-quote-text">Call for a price before any work starts.</p>
      ${callBlock({ root, size: "md", tone: "brass" })}
      <a href="${root}contact.html" class="btn btn-outline btn-block">Request service online${icon("arrow-right", { root })}</a>
    </div>
  </div>
  <div class="svc-related">
    <p class="svc-side-title">Related services</p>
    <ul>
${related}
    </ul>
  </div>
</aside>`;
}

// The bottom of a service page, as two white panels: where we offer this
// service (nearby towns on a town page, every town on a page with no town)
// and every other service.
function serviceMore({ service, town, hrefFor, root }) {
  const places = town
    ? `<p class="svc-topic">Nearby</p>
      <h2>Also serving communities near ${esc(town.name)}</h2>
      <div class="town-list">${nearbyChips(town, (t) => root + urls.serviceInTown(service, t))}</div>
      <ul class="svc-more-links">
        <li><a href="${root}${urls.townHub(town)}">All locksmith services near ${esc(town.name)}${icon("arrow-right", { root })}</a></li>
        <li><a href="${root}${urls.service(service)}">${esc(service.name)} across ${cfg.REGION}${icon("arrow-right", { root })}</a></li>
      </ul>`
    : `<p class="svc-topic">Service area</p>
      <h2>Where we offer ${esc(service.name)}</h2>
      <div class="town-list">${TOWNS.map((t) => `<a class="town-chip" href="${root}${urls.serviceInTown(service, t)}">${esc(t.name)}</a>`).join("\n")}</div>`;
  const others = SERVICES.filter((s) => s.slug !== service.slug)
    .map((s) => `        <li><a href="${hrefFor(s)}">${icon(SERVICE_ICONS[s.slug], { root })}<span>${esc(s.name)}</span></a></li>`)
    .join("\n");
  return `<section class="svc-more">
  <div class="wrap svc-more-grid">
    <div class="svc-more-block">
      ${places}
    </div>
    <div class="svc-more-block">
      <p class="svc-topic">Other services</p>
      <h2>More locksmith services${town ? ` near ${esc(town.name)}` : ""}</h2>
      <ul class="svc-links">
${others}
      </ul>
    </div>
  </div>
</section>`;
}

// One service, in one town (money page) or with no town (broad page).
function servicePage(service, town) {
  const root = "../";
  const values = seo.placeholderValues(town, service);
  const f = (text) => seo.fill(text, values);
  const state = cfg.REGION_STATE;

  // Same keyword phrase in H1, title, meta, canonical, and schema.
  const h1 = town ? `${service.name} Near ${town.name}, ${state}` : `${service.name} on ${cfg.REGION}, ${state}`;
  const titleShort = town ? `${service.name} Near ${town.name}` : `${service.name} on ${cfg.REGION}`;
  const title = seo.makeTitle(h1, titleShort);
  const description = seo.makeMeta(h1.replace(" Near ", " near "), service.meta);
  const path = town ? urls.serviceInTown(service, town) : urls.service(service);

  const crumbs = town
    ? [
        { name: "Home", href: `${root}index.html` },
        { name: "Locations", href: `${root}${urls.locationsIndex}` },
        { name: town.name, href: `${root}${urls.townHub(town)}` },
        { name: service.name },
      ]
    : [
        { name: "Home", href: `${root}index.html` },
        { name: "Services", href: `${root}${urls.servicesIndex}` },
        { name: service.name },
      ];

  // Links to other services stay in the same town (or stay broad).
  const hrefFor = (s) => root + (town ? urls.serviceInTown(s, town) : urls.service(s));

  const body = `${serviceHero({ service, town, crumbs, h1, lede: f(service.hero), root })}

<section class="svc-content">
  <div class="wrap svc-layout">
    <div class="svc-main">
${serviceSections({ service, town, fill: f, root })}
    </div>
    ${serviceSidebar({ service, hrefFor, root })}
  </div>
</section>

${serviceMore({ service, town, hrefFor, root })}

${ctaBand(`Need ${service.name} ${town ? `Near ${town.name}` : `on ${cfg.REGION}`}?`, `Call ${cfg.BRAND} for a flat-rate quote before any work begins. Same-day service is often available.`, root)}`;

  const url = abs(path);
  return {
    type: town ? "service-in-town" : "service",
    priority: town ? "0.7" : "0.6",
    path,
    file: `${path}index.html`,
    h1,
    title,
    description,
    html: layout.page({
      title, description, canonical: url, root, styles: SERVICE_STYLES,
      active: town ? "locations" : "services",
      jsonld: seo.schemaGraph({
        url, town, serviceName: service.name, name: h1, description,
        crumbs: crumbs.map((c) => ({ name: c.name, url: c.href ? absCrumb(c.href) : url })),
      }),
      body,
    }),
  };
}

// ------------------------------------------------------------------ Town hub

const TOWN_HUB_STYLES = [
  "components/breadcrumbs/breadcrumbs.css",
  "components/page-hero/page-hero.css",
  "components/section-head/section-head.css",
  "components/service-grid/service-grid.css",
  "components/town-chips/town-chips.css",
  "components/cta-band/cta-band.css",
];

// One town: intro, a grid of every service in that town, nearby places.
function townHubPage(town) {
  const root = "../";
  const state = cfg.REGION_STATE;
  const h1 = `Locksmith Services Near ${town.name}, ${state}`;
  const title = seo.makeTitle(h1, `Locksmith Services Near ${town.name}`);
  const description = seo.makeMeta(`Locksmith services near ${town.name}, ${state}`, "lockouts, rekeying, car keys, safes, and more");
  const path = urls.townHub(town);
  const url = abs(path);
  const crumbs = [
    { name: "Home", href: `${root}index.html` },
    { name: "Locations", href: `${root}${urls.locationsIndex}` },
    { name: town.name },
  ];
  const cards = SERVICES.map((s) => serviceCard(s, root + urls.serviceInTown(s, town), root)).join("\n");

  const body = `<section class="page-hero">
  <div class="wrap">
    ${crumbsHtml(crumbs)}
    <span class="eyebrow">${esc(town.county)} · ${cfg.REGION}</span>
    <h1>${esc(h1)}</h1>
    <p>${esc(town.intro)}</p>
    <div class="page-hero-actions">
      ${callButtons(root)}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Services in ${esc(town.name)}</span>
      <h2>All Locksmith Services Near ${esc(town.name)}, ${state}</h2>
      <p>Choose a service to see what is included, what it costs, and how the work is done in ${esc(town.name)}.</p>
    </div>
    <div class="services-grid">
${cards}
    </div>
  </div>
</section>

<section class="chips-section">
  <div class="wrap">
    <h2 class="chips-title">Also serving communities near ${esc(town.name)}</h2>
    <div class="town-list">${nearbyChips(town, (t) => root + urls.townHub(t))}</div>
  </div>
</section>

${ctaBand(`Locked out near ${town.name}?`, `Call ${cfg.BRAND} and a technician will be on the way in minutes, no matter the time.`, root)}`;

  return {
    type: "town-hub", priority: "0.9", path, file: `${path}index.html`, h1, title, description,
    html: layout.page({
      title, description, canonical: url, root, styles: TOWN_HUB_STYLES, active: "locations",
      jsonld: seo.schemaGraph({ url, town, crumbs: crumbs.map((c) => ({ name: c.name, url: c.href ? absCrumb(c.href) : url })) }),
      body,
    }),
  };
}

// ---------------------------------------------------------- Overview pages

// locations.html also loads the service grid for its .svc-link footer row,
// which the town cards share with the service cards.
const LOCATIONS_STYLES = [
  "components/page-hero/page-hero.css",
  "components/section-head/section-head.css",
  "components/service-grid/service-grid.css",
  "components/cta-band/cta-band.css",
  "components/location-page/location-page.css",
];

const SERVICES_INDEX_STYLES = [
  "components/page-hero/page-hero.css",
  "components/section-head/section-head.css",
  "components/service-grid/service-grid.css",
  "components/town-chips/town-chips.css",
  "components/cta-band/cta-band.css",
  "components/services-index/services-index.css",
];

// One town on locations.html: a card linking to that town's hub page, with
// a few neighbors named so people can find the place closest to them. The
// footer row is the service cards' own .svc-link.
function townCard(town) {
  return `<a class="town-card" href="${urls.townHub(town)}">
  <span class="town-card-icon">${icon("map-pin")}</span>
  <h3>${esc(town.name)}</h3>
  <p>Locksmith services near ${esc(town.name)}, ${cfg.REGION_STATE}</p>
  <span class="town-card-nearby">Also: ${esc(town.nearby.slice(0, 3).join(" · "))}</span>
  <span class="svc-link">See services ${icon("arrow-right")}</span>
</a>`;
}

// locations.html: every town, grouped by county. Each county section gets an
// id ("nassau-county") so it can be linked to directly.
function locationsIndexPage() {
  const root = "";
  const state = cfg.REGION_STATE;
  const h1 = `Locksmith Service Areas on ${cfg.REGION}, ${state}`;
  const title = seo.makeTitle(h1, `Locksmith Service Areas on ${cfg.REGION}`);
  const description = `${cfg.BRAND} serves ${TOWNS.length} towns across Nassau and Suffolk counties, from Freeport to Riverhead. Same-day service. Pick your town or call ${cfg.PHONE_DISPLAY}.`;
  const counties = [...new Set(TOWNS.map((t) => t.county))];

  const blocks = counties
    .map((county) => {
      const cards = TOWNS.filter((t) => t.county === county)
        .map((t) => townCard(t))
        .join("\n");
      return `<section class="county-section" id="${urls.countyAnchor(county)}">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">${esc(county)}</span>
      <h2>Locksmith Service in ${esc(county)}</h2>
    </div>
    <div class="town-grid">
${cards}
    </div>
  </div>
</section>`;
    })
    .join("\n");

  const body = `<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow">Service areas</span>
    <h1>${esc(h1)}</h1>
    <p>Technicians are based across Nassau and Suffolk counties, so help is close by. Pick your town to see every service we offer there, with local details and pricing.</p>
    <div class="page-hero-actions">
      ${callButtons(root)}
    </div>
  </div>
</section>

${blocks}

${ctaBand("Not sure if we cover your street?", "Call and we will confirm right away. If you are within reach of these towns, we can usually be there the same day.", root)}`;

  const url = abs(urls.locationsIndex);
  return {
    type: "locations", priority: "0.8", path: urls.locationsIndex, file: urls.locationsIndex, h1, title, description,
    html: layout.page({
      title, description, canonical: url, root, styles: LOCATIONS_STYLES, active: "locations",
      jsonld: seo.schemaGraph({ url, crumbs: [{ name: "Home", url: `${cfg.SITE_URL}/` }, { name: "Locations", url }] }),
      body,
    }),
  };
}

// services.html: every service, grouped by category (each section opens with
// the category's icon and has the category id, e.g. #emergency), plus town
// links.
function servicesIndexPage() {
  const root = "";
  const state = cfg.REGION_STATE;
  const h1 = `Locksmith Services on ${cfg.REGION}, ${state}`;
  const title = seo.makeTitle(h1, `Locksmith Services on ${cfg.REGION}`);
  const description = `Home, car, and commercial locksmith services on ${cfg.REGION}: lockouts, rekeying, car keys, safes, and more. Licensed & insured. Call ${cfg.PHONE_DISPLAY}.`;

  const blocks = CATEGORIES.map((cat) => {
    const cards = SERVICES.filter((s) => s.category === cat.id)
      .map((s) => serviceCard(s, urls.service(s), root))
      .join("\n");
    return `<section class="category-section" id="${cat.id}">
  <div class="wrap">
    <div class="section-head category-head">
      <span class="category-icon">${icon(CATEGORY_ICONS[cat.id], { root })}</span>
      <span class="eyebrow">${esc(cat.label)}</span>
      <h2>${esc(cat.label)} Locksmith Services</h2>
    </div>
    <div class="services-grid">
${cards}
    </div>
  </div>
</section>`;
  }).join("\n");

  const body = `<section class="page-hero">
  <div class="wrap">
    <span class="eyebrow">Services</span>
    <h1>${esc(h1)}</h1>
    <p>Every job is priced flat before work starts, and most calls are finished in a single visit. Choose a service to see what it includes, what it costs, and what happens if you wait.</p>
    <div class="page-hero-actions">
      ${callButtons(root)}
    </div>
  </div>
</section>

${blocks}

<section class="chips-section">
  <div class="wrap">
    <h2 class="chips-title">Find a locksmith in your town</h2>
    <div class="town-list">${TOWNS.map((t) => `<a class="town-chip" href="${urls.townHub(t)}">${esc(t.name)}</a>`).join("\n")}</div>
  </div>
</section>

${ctaBand("Not sure which service you need?", "Call us and describe the problem. We will recommend the right fix and give you a flat-rate quote on the spot.", root)}`;

  const url = abs(urls.servicesIndex);
  return {
    type: "services", priority: "0.8", path: urls.servicesIndex, file: urls.servicesIndex, h1, title, description,
    html: layout.page({
      title, description, canonical: url, root, styles: SERVICES_INDEX_STYLES, active: "services",
      jsonld: seo.schemaGraph({ url, crumbs: [{ name: "Home", url: `${cfg.SITE_URL}/` }, { name: "Services", url }] }),
      body,
    }),
  };
}

// --------------------------------------------- Blocks injected into index.html

// The home page's services grid: one card per service, linking to its page.
function homeServiceCards() {
  return SERVICES.map((s) => serviceCard(s, urls.service(s))).join("\n");
}

// The home page's filter tabs above the services grid: "All" plus one per
// category, each with a live count so the numbers can't drift from the data.
function homeServiceFilters() {
  const tabs = [
    { id: "all", label: "All", count: SERVICES.length },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: SERVICES.filter((s) => s.category === c.id).length })),
  ];
  return tabs
    .map((t, i) => `<button type="button" class="filter-tab" data-filter="${t.id}" aria-pressed="${i === 0}">${esc(t.label)} <span class="filter-count">${t.count}</span></button>`)
    .join("\n");
}

// The facts strip at the bottom of the home hero. The town and service
// counts come from the data, so they stay true as towns and services change.
function homeFacts() {
  const facts = [
    { icon: "clock", value: "24/7", label: "Emergency dispatch" },
    { icon: "van", value: "15–25 min", label: "Typical arrival" },
    { icon: "map-pin", value: String(TOWNS.length), label: "Long Island towns" },
    { icon: "key", value: String(SERVICES.length), label: "Locksmith services" },
  ];
  return facts
    .map((f) => `<li class="hero-fact">${icon(f.icon)}<strong>${esc(f.value)}</strong> <span>${esc(f.label)}</span></li>`)
    .join("\n");
}

// The home page's service-area chips, grouped by county: one link per town hub.
function homeTownChips() {
  const counties = [...new Set(TOWNS.map((t) => t.county))];
  return counties
    .map((county) => {
      const towns = TOWNS.filter((t) => t.county === county);
      const chips = towns.map((t) => `    <a class="town-chip" href="${urls.townHub(t)}">${esc(t.name)}</a>`).join("\n");
      return `<div class="county-group">
  <p class="county-group-title">${icon("map-pin")}${esc(county)} <span class="county-group-count">${towns.length} towns</span></p>
  <div class="town-list">
${chips}
  </div>
</div>`;
    })
    .join("\n");
}

// The contact form's "Service needed" options: one per service.
function contactServiceOptions() {
  return SERVICES.map((s) => `<option value="${s.slug}">${esc(s.name)}</option>`).join("\n");
}

// Every page the build generates.
function allPages() {
  const pages = [servicesIndexPage(), locationsIndexPage()];
  for (const s of SERVICES) pages.push(servicePage(s, null));
  for (const t of TOWNS) {
    pages.push(townHubPage(t));
    for (const s of SERVICES) pages.push(servicePage(s, t));
  }
  return pages;
}

module.exports = { allPages, homeServiceCards, homeServiceFilters, homeFacts, homeTownChips, contactServiceOptions };
