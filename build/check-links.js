// Link checker: confirms every local href/src in every HTML file points to
// a file (or a folder with an index.html) that exists. Catches a wrong URL
// before it ships. Runs at the end of `npm run build`, or on its own:
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
