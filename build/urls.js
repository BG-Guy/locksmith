// The URL formulas for every generated page — the single place that decides
// what a page's address is. Each slug is the phrase people type into Google:
//   service + "near" + town.
// All URLs are flat, lowercase, hyphenated, and end in a slash.

module.exports = {
  // Money page: one service in one town — /car-key-replacement-near-huntington/
  serviceInTown: (service, town) => `${service.slug}-near-${town.slug}/`,

  // Broad-match page: one service, no town — /car-key-replacement/
  service: (service) => `${service.slug}/`,

  // Town hub: every service in one town — /locksmith-services-near-huntington/
  townHub: (town) => `locksmith-services-near-${town.slug}/`,

  // Hand-made overview pages that are still generated from the data.
  servicesIndex: "services.html",
  locationsIndex: "locations.html",

  // A county's section on the locations page — "Nassau County" ->
  // "nassau-county", linked as locations.html#nassau-county
  countyAnchor: (county) => county.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
};
