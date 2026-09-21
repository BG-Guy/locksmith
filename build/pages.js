// Page templates: turns the service and town data into page objects.
// Four page types are generated:
//   servicePage(service, town)  /[service]-near-[town]/  (or /[service]/ with no town)
//   townHubPage(town)           /locksmith-services-near-[town]/
//   locationsIndexPage()        locations.html
//   servicesIndexPage()         services.html
// Each returns { file, path, html, title, description, h1, type, priority }.

const cfg = require("./config");
const urls = require("./urls");
const seo = require("./seo");
const layout = require("./layout");
const { CATEGORIES, SERVICES } = require("./services-data");
const { TOWNS } = require("./locations-data");

const { esc } = layout;
const abs = (path) => `${cfg.SITE_URL}/${path}`;
const categoryLabel = (service) => CATEGORIES.find((c) => c.id === service.category).label;

// Turn a page-relative breadcrumb href ("../index.html") into an absolute URL
// for the structured-data breadcrumb trail.
const absCrumb = (href) => abs(href.replace(/^\.\.\//, "")).replace(/index\.html$/, "");

// ------------------------------------------------------------ Small components

// One clickable service card, used in every grid.
function serviceCard(service, href) {
  return `<a class="service-card" href="${href}">
  <span class="service-tag">${esc(categoryLabel(service))}</span>
  <h3>${esc(service.name)}</h3>
  <p>${esc(service.cardText)}</p>
  <span class="svc-link">Learn more →</span>
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

const callButtons = (root) => `<a href="tel:${cfg.PHONE_TEL}" class="btn btn-primary">Call ${cfg.PHONE_DISPLAY}</a>
<a href="${root}contact.html" class="btn btn-ghost">Request a free estimate</a>`;

// Brass call-to-action banner at the bottom of every page.
function ctaBand(heading, text) {
  return `<section class="cta-band">
  <div class="wrap">
    <h2>${esc(heading)}</h2>
    <p>${esc(text)}</p>
    <a href="tel:${cfg.PHONE_TEL}" class="btn btn-primary">Call ${cfg.PHONE_DISPLAY}</a>
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

  // The four copy sections, in order. The town's own paragraph rides along
  // with section 1 so pages in different towns are not copies of each other.
  const sections = [
    [f(service.h2Why), [f(service.why), town ? town.localNote : null]],
    [f(service.h2How), [f(service.how)]],
    [f(service.h2Cost), [f(service.cost)]],
    [f(service.h2Risk), [f(service.risk)]],
  ]
    .map(
      ([heading, paragraphs]) => `<div class="svc-section">
  <h2>${esc(heading)}</h2>
  ${paragraphs.filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("\n  ")}
</div>`
    )
    .join("\n");

  const hrefFor = (s) => root + (town ? urls.serviceInTown(s, town) : urls.service(s));
  const related = service.related
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .map((s) => `<li><a href="${hrefFor(s)}">${esc(s.name)}</a></li>`)
    .join("\n");
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug)
    .map((s) => `<li><a href="${hrefFor(s)}">${esc(s.name)}</a></li>`)
    .join("\n");

  // Bottom links: nearby towns + hub (town page) or every town (broad page).
  const placeLinks = town
    ? `<h2>Also serving communities near ${esc(town.name)}</h2>
      <div class="town-list">${nearbyChips(town, (t) => root + urls.serviceInTown(service, t))}</div>
      <p class="svc-more-links"><a href="${root}${urls.townHub(town)}">All locksmith services near ${esc(town.name)}</a> · <a href="${root}${urls.service(service)}">${esc(service.name)} across ${cfg.REGION}</a></p>`
    : `<h2>Where we offer ${esc(service.name)}</h2>
      <div class="town-list">${TOWNS.map((t) => `<a class="town-chip" href="${root}${urls.serviceInTown(service, t)}">${esc(t.name)}</a>`).join("\n")}</div>`;

  const body = `<section class="svc-hero">
  <div class="wrap">
    <div>
      ${crumbsHtml(crumbs)}
      <span class="eyebrow">${esc(categoryLabel(service))} locksmith · ${esc(town ? `${town.name}, ${state}` : `${cfg.REGION}, ${state}`)}</span>
      <h1>${esc(h1)}</h1>
      <p class="svc-lede">${esc(f(service.hero))}</p>
      <div class="svc-actions">
        ${callButtons(root)}
      </div>
      <ul class="svc-trust">
        <li>Licensed &amp; insured</li>
        <li>Same-day available</li>
        <li>Free estimates</li>
      </ul>
    </div>
    <aside class="svc-included" aria-label="What is included">
      <p class="svc-included-title">What's included</p>
      <ul>
${service.includes.map((i) => `        <li>${esc(i)}</li>`).join("\n")}
      </ul>
    </aside>
  </div>
</section>

<section class="svc-content">
  <div class="wrap svc-layout">
    <div class="svc-main">
${sections}
    </div>
    <aside class="svc-side">
      <div class="svc-quote">
        <p class="svc-quote-title">Get a flat-rate quote</p>
        <p>Call for a price before any work starts. Typical range: ${esc(f("{price}"))}.</p>
        <a href="tel:${cfg.PHONE_TEL}" class="btn btn-primary btn-block">Call ${cfg.PHONE_DISPLAY}</a>
        <a href="${root}contact.html" class="btn btn-outline btn-block">Request service online</a>
      </div>
      <div class="svc-related">
        <p class="svc-related-title">Related services</p>
        <ul>
${related}
        </ul>
      </div>
    </aside>
  </div>
</section>

<section class="svc-more">
  <div class="wrap">
    <div class="svc-more-block">
      ${placeLinks}
    </div>
    <div class="svc-more-block">
      <h2>More locksmith services${town ? ` near ${esc(town.name)}` : ""}</h2>
      <ul class="svc-links">
${otherServices}
      </ul>
    </div>
  </div>
</section>

${ctaBand(`Need ${service.name} ${town ? `Near ${town.name}` : `on ${cfg.REGION}`}?`, "Call Guardian Locksmith for a flat-rate quote before any work begins. Same-day service is often available.")}`;

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
  const cards = SERVICES.map((s) => serviceCard(s, root + urls.serviceInTown(s, town))).join("\n");

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

${ctaBand(`Locked out near ${town.name}?`, "Call Guardian Locksmith and a technician will be on the way in minutes, no matter the time.")}`;

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

const OVERVIEW_STYLES = [
  "components/page-hero/page-hero.css",
  "components/section-head/section-head.css",
  "components/service-grid/service-grid.css",
  "components/town-chips/town-chips.css",
  "components/cta-band/cta-band.css",
  "components/location-page/location-page.css",
];

// locations.html: every town, grouped by county.
function locationsIndexPage() {
  const root = "";
  const state = cfg.REGION_STATE;
  const h1 = `Locksmith Service Areas on ${cfg.REGION}, ${state}`;
  const title = seo.makeTitle(h1, `Locksmith Service Areas on ${cfg.REGION}`);
  const description = `Guardian Locksmith serves ${TOWNS.length} towns across Nassau and Suffolk counties, from Freeport to Riverhead. Same-day service. Pick your town or call ${cfg.PHONE_DISPLAY}.`;
  const counties = [...new Set(TOWNS.map((t) => t.county))];

  const blocks = counties
    .map((county) => {
      const cards = TOWNS.filter((t) => t.county === county)
        .map(
          (t) => `<a class="town-card" href="${urls.townHub(t)}">
  <h3>${esc(t.name)}</h3>
  <p>Locksmith services near ${esc(t.name)}, ${state}</p>
  <span class="town-card-nearby">Also: ${esc(t.nearby.slice(0, 3).join(" · "))}</span>
  <span class="svc-link">See services →</span>
</a>`
        )
        .join("\n");
      return `<section>
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

${ctaBand("Not sure if we cover your street?", "Call and we will confirm right away. If you are within reach of these towns, we can usually be there the same day.")}`;

  const url = abs(urls.locationsIndex);
  return {
    type: "locations", priority: "0.8", path: urls.locationsIndex, file: urls.locationsIndex, h1, title, description,
    html: layout.page({
      title, description, canonical: url, root, styles: OVERVIEW_STYLES, active: "locations",
      jsonld: seo.schemaGraph({ url, crumbs: [{ name: "Home", url: `${cfg.SITE_URL}/` }, { name: "Locations", url }] }),
      body,
    }),
  };
}

// services.html: every service, grouped by category, plus town links.
function servicesIndexPage() {
  const root = "";
  const state = cfg.REGION_STATE;
  const h1 = `Locksmith Services on ${cfg.REGION}, ${state}`;
  const title = seo.makeTitle(h1, `Locksmith Services on ${cfg.REGION}`);
  const description = `Home, car, and commercial locksmith services on ${cfg.REGION}: lockouts, rekeying, car keys, safes, and more. Licensed & insured. Call ${cfg.PHONE_DISPLAY}.`;

  const blocks = CATEGORIES.map((cat) => {
    const cards = SERVICES.filter((s) => s.category === cat.id)
      .map((s) => serviceCard(s, urls.service(s)))
      .join("\n");
    return `<section>
  <div class="wrap">
    <div class="section-head">
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

${ctaBand("Not sure which service you need?", "Call us and describe the problem. We will recommend the right fix and give you a flat-rate quote on the spot.")}`;

  const url = abs(urls.servicesIndex);
  return {
    type: "services", priority: "0.8", path: urls.servicesIndex, file: urls.servicesIndex, h1, title, description,
    html: layout.page({
      title, description, canonical: url, root, styles: OVERVIEW_STYLES, active: "services",
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

// The home page's service-area chips: one link per town hub.
function homeTownChips() {
  return TOWNS.map((t) => `<a class="town-chip" href="${urls.townHub(t)}">${esc(t.name)}</a>`).join("\n");
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

module.exports = { allPages, homeServiceCards, homeTownChips };
