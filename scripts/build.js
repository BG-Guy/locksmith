// Static site generator — assembles the root-level HTML pages (index.html,
// about.html, services.html, contact.html) from the reusable pieces in
// components/ and the per-page content in pages/, using the per-page
// metadata in data/pages.json.
//
// Shared markup (header, footer, page hero, CTA band) lives in one file
// instead of being copy-pasted across every page. The output is still
// plain static HTML — nothing here runs in the browser.
//
// Zero dependencies, same philosophy as scripts/dev-server.js.
// Usage: node scripts/build.js  (or `npm run build`)

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const NAV_ITEMS = ["home", "services", "about", "contact"];

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(data, key) ? data[key] : ""
  );
}

function buildHead(page) {
  return render(read("components/head.html"), {
    TITLE: page.title,
    DESCRIPTION: page.description,
  });
}

function buildHeader(page) {
  const data = {
    HEADER_CTA_HREF: page.headerCta.href,
    HEADER_CTA_LABEL: page.headerCta.label,
  };
  NAV_ITEMS.forEach((id) => {
    data[`${id.toUpperCase()}_ACTIVE`] = id === page.activeNav ? ' class="active"' : "";
  });
  return render(read("components/header.html"), data);
}

function buildPageHero(page) {
  if (!page.pageHero) return "";
  return render(read("components/page-hero.html"), {
    HERO_EYEBROW: page.pageHero.eyebrow,
    HERO_TITLE: page.pageHero.title,
    HERO_LEDE: page.pageHero.lede,
  });
}

function buildCtaBand(page) {
  if (!page.ctaBand) return "";
  return render(read("components/cta-band.html"), {
    CTA_WRAP_CLASS: page.ctaBand.wrapClass,
    CTA_TITLE: page.ctaBand.title,
    CTA_TEXT: page.ctaBand.text,
    CTA_HREF: page.ctaBand.href,
    CTA_LABEL: page.ctaBand.label,
  });
}

function buildPage(page) {
  const blocks = [
    page.hasPreloader ? read("components/preloader.html") : "",
    buildHeader(page),
    buildPageHero(page),
    read(page.contentFile),
    buildCtaBand(page),
    read("components/footer.html"),
  ]
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  const html = `<!DOCTYPE html>
<html lang="en">
${buildHead(page).trim()}
<body>

${blocks.join("\n\n")}

</body>
</html>
`;

  fs.writeFileSync(path.join(ROOT, page.outputFile), html);
  console.log(`Built ${page.outputFile}`);
}

const pagesConfig = JSON.parse(read("data/pages.json"));

Object.values(pagesConfig).forEach(buildPage);
