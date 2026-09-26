// SEO helpers: fill copy placeholders, build titles / meta descriptions /
// structured data, generate sitemap.xml / robots.txt / llms.txt / the
// dev-facing pages index, and check the rules the SEO strategy depends on.

const cfg = require("./config");

// ---------------------------------------------------------------- Placeholders

// "A and B" / "A, B, and C"
function joinList(items) {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// The values every {placeholder} in the service copy can take. `town` is a
// town record, or null for the broad "Long Island" version of a page.
function placeholderValues(town, service) {
  if (town) {
    return {
      town: town.name,
      inTown: `in ${town.name}`,
      InTown: `In ${town.name}`,
      townState: `${town.name}, ${cfg.REGION_STATE}`,
      homes: town.homes,
      callsFrom: `${town.name} and nearby ${joinList(town.nearby.slice(0, 2))}`,
      price: service.price,
    };
  }
  return {
    town: cfg.REGION,
    inTown: `on ${cfg.REGION}`,
    InTown: `On ${cfg.REGION}`,
    townState: `${cfg.REGION}, ${cfg.REGION_STATE}`,
    homes: "older colonials, ranches, condos, and newer builds across Nassau and Suffolk counties",
    callsFrom: "Nassau and Suffolk towns from Freeport to Riverhead",
    price: service.price,
  };
}

// Replace {name} tokens. An unknown token is a bug in the copy, so fail loudly.
function fill(text, values) {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Unknown placeholder ${match} in: ${text.slice(0, 60)}...`);
    return values[key];
  });
}

// ------------------------------------------------------------ Title and meta

// Titles must stay within 60 characters. Try the fullest version first and
// drop pieces (", NY", then the brand) until one fits.
function makeTitle(base, baseNoState) {
  const options = [
    `${base} | ${cfg.BRAND}`,
    `${baseNoState} | ${cfg.BRAND}`,
    base,
    baseNoState,
  ];
  return options.find((t) => t.length <= 60) || options[options.length - 1];
}

// Meta description: keyword lead + concrete specifics + trust signals + call.
function makeMeta(lead, specifics) {
  const full = `${lead} — ${specifics}. Same-day service · Licensed & insured · Free estimate. Call ${cfg.PHONE_DISPLAY}.`;
  if (full.length <= 160) return full;
  return `${lead} — ${specifics}. Licensed & insured · Free estimate. Call ${cfg.PHONE_DISPLAY}.`;
}

// ------------------------------------------------------------ Structured data

function areaServed(town) {
  return town
    ? { "@type": "City", name: `${town.name}, ${cfg.REGION_STATE}` }
    : { "@type": "AdministrativeArea", name: `${cfg.REGION}, ${cfg.REGION_STATE}` };
}

// One JSON-LD graph per page: the Locksmith business, the Service (when the
// page is about one), and the breadcrumb trail.
function schemaGraph({ url, town, serviceName, name, description, crumbs }) {
  const businessId = `${cfg.SITE_URL}/#business`;
  const graph = [
    {
      "@type": "Locksmith",
      "@id": businessId,
      name: cfg.BRAND,
      url: `${cfg.SITE_URL}/`,
      telephone: cfg.PHONE_DISPLAY,
      email: cfg.EMAIL,
      priceRange: "$$",
      areaServed: areaServed(town),
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    },
  ];
  if (serviceName) {
    graph.splice(1, 0, {
      "@type": "Service",
      serviceType: serviceName,
      name,
      description,
      url,
      provider: { "@id": businessId },
      areaServed: areaServed(town),
    });
  }
  // "<" is escaped so the JSON can never close its own <script> tag.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

// ----------------------------------------------------- Sitemap, robots, llms

function sitemapXml(entries) {
  const today = new Date().toISOString().slice(0, 10);
  const items = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${cfg.SITE_URL}/${e.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

// AI crawlers are explicitly welcome so the pages can be cited in AI search.
function robotsTxt() {
  const bots = ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Amazonbot", "CCBot", "anthropic-ai"];
  const rules = bots.map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n");
  return `User-agent: *\nAllow: /\n\n${rules}\n\nSitemap: ${cfg.SITE_URL}/sitemap.xml\n`;
}

// docs/ has to stay flat — the URL formula (/[service]-near-[town]/) is the
// whole point of the SEO strategy, so the generated pages can't be moved
// into a subfolder without changing every live URL. This is a categorized,
// scannable index instead, so a person can find a page without counting
// through 168 folders. Written to build/PAGES.md, next to the generator,
// not into docs/, since it's for developers, not site visitors.
function pagesIndexMd(services, towns, urls) {
  const lines = [
    "<!-- GENERATED by build/build.js. Do not edit by hand. -->",
    "# Generated pages",
    "",
    "docs/ has to stay flat for the URLs to work (see the home-service-SEO-",
    "strategy skill): every page below is a real directory directly under",
    "docs/, named exactly like its URL. This file is just an index so you",
    "can find one without scanning all of them in a file browser.",
    "",
    `${services.length} services × ${towns.length} towns = ${services.length * towns.length} service-in-town pages, plus ${services.length} no-town service pages and ${towns.length} town hub pages.`,
    "",
    "## Service pages (no town)",
    "",
    ...services.map((s) => `- [${s.name}](../docs/${urls.service(s)}index.html) — \`/${urls.service(s)}\``),
    "",
    "## Town hub pages",
    "",
    ...towns.map((t) => `- [${t.name}](../docs/${urls.townHub(t)}index.html) — \`/${urls.townHub(t)}\``),
    "",
    "## Service × town pages, grouped by service",
    "",
    ...services.flatMap((s) => [
      `### ${s.name} (${towns.length} towns)`,
      "",
      ...towns.map((t) => `- [${t.name}](../docs/${urls.serviceInTown(s, t)}index.html) — \`/${urls.serviceInTown(s, t)}\``),
      "",
    ]),
  ];
  return lines.join("\n");
}

// A plain-language summary of the business for AI search engines.
function llmsTxt(services, towns, urls) {
  const svcLines = services.map((s) => `- [${s.name}](${cfg.SITE_URL}/${urls.service(s)}): ${s.cardText}`).join("\n");
  const townLines = towns.map((t) => `- [${t.name}, ${t.county}](${cfg.SITE_URL}/${urls.townHub(t)})`).join("\n");
  return `# ${cfg.BRAND}

> Licensed and insured locksmith serving Nassau and Suffolk counties on Long Island, NY. Home, car, and commercial locksmith work, with same-day service and free estimates.

- Phone: ${cfg.PHONE_DISPLAY}
- Email: ${cfg.EMAIL}
- Hours: 24 hours a day, 7 days a week

## Services

${svcLines}

## Service areas

${townLines}
`;
}

// ------------------------------------------------------------------ Validation

const wordCount = (s) => s.trim().split(/\s+/).filter(Boolean).length;

// Checks the DATA (copy rules). Returns a list of error strings.
function validateData(services, towns) {
  const errors = [];
  const slugs = new Set();
  const townNames = towns.flatMap((t) => [t.name, ...t.nearby]);
  const bannedLiteral = new RegExp(`\\b(${[...new Set(townNames)].join("|")}|Nassau County|Suffolk County)\\b`);

  for (const s of services) {
    const tag = `service "${s.slug}"`;
    if (slugs.has(s.slug)) errors.push(`${tag}: duplicate slug`);
    slugs.add(s.slug);
    if (!/^[a-z0-9-]+$/.test(s.slug)) errors.push(`${tag}: slug must be lowercase-hyphenated`);
    if (s.includes.length < 4 || s.includes.length > 5) errors.push(`${tag}: needs 4-5 "includes" items`);
    if (!/\$\d/.test(s.price)) errors.push(`${tag}: price must contain a $ range`);
    if (!/\{price\}/.test(s.cost)) errors.push(`${tag}: cost section must use {price}`);
    for (const rel of s.related) {
      if (!services.some((o) => o.slug === rel)) errors.push(`${tag}: related "${rel}" does not exist`);
    }
    for (const field of ["h2Why", "why", "h2How", "how", "h2Cost", "cost", "h2Risk", "risk", "hero", "cardText", "meta"]) {
      const text = s[field];
      if (!text) { errors.push(`${tag}: missing ${field}`); continue; }
      if (bannedLiteral.test(text)) errors.push(`${tag}.${field}: hardcoded place name "${text.match(bannedLiteral)[0]}" — use a placeholder`);
      try { fill(text, placeholderValues(towns[0], s)); fill(text, placeholderValues(null, s)); }
      catch (e) { errors.push(`${tag}.${field}: ${e.message}`); }
    }
    for (const field of ["why", "how", "cost", "risk"]) {
      if (s[field] && wordCount(s[field]) < 50) errors.push(`${tag}.${field}: under 50 words`);
    }
    const body = ["why", "how", "cost", "risk"].reduce((n, f) => n + wordCount(s[f] || ""), 0);
    if (body < 250) errors.push(`${tag}: body copy is ${body} words (minimum 250)`);
  }

  const townSlugs = new Set();
  for (const t of towns) {
    if (townSlugs.has(t.slug)) errors.push(`town "${t.slug}": duplicate slug`);
    townSlugs.add(t.slug);
    if (t.nearby.length !== 4) errors.push(`town "${t.slug}": needs exactly 4 nearby communities`);
    for (const f of ["name", "county", "homes", "intro", "localNote"]) if (!t[f]) errors.push(`town "${t.slug}": missing ${f}`);
  }
  return errors;
}

module.exports = {
  joinList, placeholderValues, fill, makeTitle, makeMeta, schemaGraph,
  sitemapXml, robotsTxt, llmsTxt, pagesIndexMd, validateData, wordCount,
};
