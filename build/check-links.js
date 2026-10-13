// Link checker: confirms every local href/src in every HTML file points to
// a file (or a folder with an index.html) that exists, and that every icon
// reference (icons.svg#name) names a symbol the sprite really has. Catches a
// wrong URL or a blank icon before it ships. Runs at the end of
// `npm run build`, or on its own:
//   node build/check-links.js

const fs = require("fs");
const path = require("path");

const SKIP_DIRS = new Set(["node_modules", ".git", "build"]);

// All .html files under `dir`.
function findHtmlFiles(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findHtmlFiles(full, found);
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

// The ids defined in an SVG sprite file, read once per file.
const spriteIdCache = new Map();
function spriteIds(file) {
  if (!spriteIdCache.has(file)) {
    const svg = fs.readFileSync(file, "utf8");
    spriteIdCache.set(file, new Set([...svg.matchAll(/<symbol[^>]*\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return spriteIdCache.get(file);
}

// Returns { checked, broken: ["page.html -> missing/link/"] }.
function checkLinks(rootDir) {
  const broken = [];
  let checked = 0;
  for (const file of findHtmlFiles(rootDir)) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const raw = match[1];
      if (/^(https?:|mailto:|tel:|#|data:|\/\/)/.test(raw)) continue; // not a local file
      const ref = raw.split("#")[0].split("?")[0];
      if (!ref) continue;
      checked++;
      const target = path.resolve(path.dirname(file), ref);
      const exists =
        fs.existsSync(target) &&
        (fs.statSync(target).isFile() || fs.existsSync(path.join(target, "index.html")));
      if (!exists) broken.push(`${path.relative(rootDir, file)} -> ${raw}`);
      // An icon reference must also name a symbol that exists in the sprite.
      const fragment = raw.split("#")[1];
      if (exists && fragment && ref.endsWith(".svg") && !spriteIds(target).has(fragment)) {
        broken.push(`${path.relative(rootDir, file)} -> ${raw} (no such icon in ${path.basename(ref)})`);
      }
    }
  }
  return { checked, broken };
}

module.exports = { checkLinks };

if (require.main === module) {
  const { checked, broken } = checkLinks(path.join(__dirname, "..", "docs"));
  console.log(`Checked ${checked} local links.`);
  if (broken.length) {
    console.error(`${broken.length} broken:\n  ${broken.join("\n  ")}`);
    process.exit(1);
  }
  console.log("No broken links.");
}
