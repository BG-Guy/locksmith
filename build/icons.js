// Icon helper: an <svg> that points at one symbol in the shared sprite
// (docs/components/icons/icons.svg), plus which icon each service and each
// service category uses. Icons are decorative — hidden from screen readers —
// so always put the meaning in visible text next to them.
//
// The link checker (check-links.js) fails the build if a page points at a
// symbol id the sprite doesn't have, so a typo can't ship a blank icon.

const SPRITE = "components/icons/icons.svg";

// `root` is the path back to the site root ("" or "../"), like everywhere
// else in the templates. `className` adds a modifier class for sizing.
function icon(name, { root = "", className = "" } = {}) {
  const cls = className ? `icon ${className}` : "icon";
  return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="${root}${SPRITE}#${name}"></use></svg>`;
}

// One icon per service, keyed by slug (see services-data.js). Named after
// what the drawing shows, so a symbol can be reused elsewhere.
const SERVICE_ICONS = {
  "home-lockout-service": "house-key",
  "car-lockout-service": "car-lock",
  "lock-rekeying": "key-rotate",
  "lock-installation": "lever-lock",
  "deadbolt-installation": "deadbolt",
  "smart-lock-installation": "keypad",
  "safe-installation": "safe",
  "car-key-replacement": "car-key",
  "key-fob-programming": "key-fob",
  "ignition-repair": "ignition",
  "master-key-systems": "key-ring",
  "panic-bar-installation": "panic-bar",
};

// One icon per service category (see CATEGORIES in services-data.js).
const CATEGORY_ICONS = {
  emergency: "bolt",
  residential: "home",
  automotive: "car",
  commercial: "building",
};

module.exports = { icon, SERVICE_ICONS, CATEGORY_ICONS };
