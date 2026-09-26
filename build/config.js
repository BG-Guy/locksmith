// Site-wide constants shared by every generator in build/.
// Change the business details here once; every generated page picks them up.

const path = require("path");

module.exports = {
  // Absolute base URL used for canonicals, the sitemap, and structured data.
  // TODO: replace with the real domain once the site has one.
  SITE_URL: "https://bg-guy.github.io/locksmith",

  BRAND: "Haven Locksmith",
  PHONE_DISPLAY: "(516) 555-0142",
  PHONE_TEL: "+15165550142",
  EMAIL: "info@havenlocksmith.com",

  // The one region the business serves, used on pages that have no town.
  REGION: "Long Island",
  REGION_STATE: "NY",

  // The published site: generated pages are written here, next to the hand-made ones.
  ROOT_DIR: path.join(__dirname, "..", "docs"),
};
