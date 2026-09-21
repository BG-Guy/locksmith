// The service areas: one record per town. Source of truth for every
// location page. Add a town here and rebuild — no other file needs editing.
//
// Fields:
//   slug       URL piece, e.g. "bay-shore" -> /locksmith-services-near-bay-shore/
//   name       display name
//   county     shown on the locations page and in schema
//   nearby     4 adjacent communities (named in copy; linked when they are
//              also one of our towns)
//   homes      noun phrase for the local housing/business mix; slots into
//              the sentence "In <town> you will find <homes>."
//   intro      unique paragraph at the top of the town page
//   localNote  unique local paragraph added to the "why you need it" section
//              of every service page in this town (keeps pages from being
//              copies of each other)
//
// The facts below are general local knowledge. Have the owner confirm the
// town list and the nearby communities before launch.

const TOWNS = [
  {
    slug: "hempstead",
    name: "Hempstead",
    county: "Nassau County",
    nearby: ["Uniondale", "West Hempstead", "Roosevelt", "Garden City"],
    homes: "older single-family houses, multifamily buildings, and downtown storefronts",
    intro:
      "Hempstead is a busy Nassau County village with older single-family homes, apartment buildings, and a downtown of storefronts and offices. That mix brings calls of every kind: lockouts at houses and apartments, rekeying for landlords between tenants, and business locks and exit devices downtown. Guardian Locksmith serves Hempstead and the neighboring communities of Uniondale, West Hempstead, and Roosevelt.",
    localNote:
      "Hempstead has many multifamily buildings and rental properties, which makes rekeying between tenants and apartment lockouts a regular need in the village.",
  },
  {
    slug: "levittown",
    name: "Levittown",
    county: "Nassau County",
    nearby: ["Hicksville", "East Meadow", "Wantagh", "Bethpage"],
    homes: "postwar Cape Cod and ranch-style homes built in the late 1940s and early 1950s",
    intro:
      "Levittown is the classic postwar Long Island suburb: thousands of Cape Cod and ranch-style homes built in the late 1940s and early 1950s. After nearly eight decades, much of the original door hardware is worn out, and many owners are swapping old knobs for reinforced deadbolts and smart locks. Guardian Locksmith helps Levittown homeowners with lockouts, rekeying, and lock upgrades, along with nearby Hicksville, East Meadow, Wantagh, and Bethpage.",
    localNote:
      "The original Cape Cods and ranches in Levittown are now nearly eight decades old, and much of their first-generation door hardware has worn out. Upgrading it is one of the simplest ways to improve security.",
  },
  {
    slug: "garden-city",
    name: "Garden City",
    county: "Nassau County",
    nearby: ["Hempstead", "Mineola", "Uniondale", "Franklin Square"],
    homes: "large older colonial, Tudor, and Georgian-style houses on tree-lined streets",
    intro:
      "Garden City is a planned village dating to the 19th century, known for large older homes on tree-lined streets, a walkable downtown around Franklin Avenue, and nearby offices and campuses. Older homes here often have distinctive hardware owners want to keep, while the business district needs commercial locks and access control. Guardian Locksmith serves Garden City along with Hempstead, Mineola, Uniondale, and Franklin Square.",
    localNote:
      "Larger, older homes in Garden City tend to have several exterior doors and older hardware, so rekeying the whole house to a single key is a popular fix here.",
  },
  {
    slug: "freeport",
    name: "Freeport",
    county: "Nassau County",
    nearby: ["Baldwin", "Merrick", "Roosevelt", "Bellmore"],
    homes: "canal-front houses, older village homes, and waterfront businesses",
    intro:
      "Freeport sits on the South Shore, with residential streets, working marinas, and the Nautical Mile of waterfront restaurants along Woodcleft Avenue. Salt air and dampness are hard on exterior locks, latches, and keys, and the restaurants and marine businesses need dependable commercial hardware. Guardian Locksmith serves Freeport and neighboring Baldwin, Merrick, Roosevelt, and Bellmore.",
    localNote:
      "Salt air off the canals and the bay is hard on exterior locks and latches, so cylinders near the water tend to corrode and stiffen sooner. It is worth having exterior locks in Freeport checked before they fail.",
  },
  {
    slug: "massapequa",
    name: "Massapequa",
    county: "Nassau County",
    nearby: ["Massapequa Park", "Seaford", "Amityville", "Farmingdale"],
    homes: "postwar family homes and canal-front houses",
    intro:
      "Massapequa is a South Shore community of postwar family neighborhoods and canal-front homes, close to the Massapequa Preserve. Homeowners here call for lockouts, rekeying after buying a house, and better exterior locks for waterfront properties. Guardian Locksmith serves Massapequa and nearby Massapequa Park, Seaford, Amityville, and Farmingdale.",
    localNote:
      "As on the rest of the South Shore, salt air near the canals wears down exterior locks, so waterfront homes in Massapequa often benefit from corrosion-resistant hardware.",
  },
  {
    slug: "huntington",
    name: "Huntington",
    county: "Suffolk County",
    nearby: ["Huntington Station", "Melville", "Cold Spring Harbor", "Northport"],
    homes: "historic colonials near the village, newer homes toward Huntington Station and Melville, and village businesses",
    intro:
      "Huntington is a North Shore town with a walkable village of shops and restaurants, historic homes near the harbor, and newer neighborhoods toward Huntington Station and Melville. Older houses often have original hardware that deserves careful work, while village businesses need reliable locks and exit devices. Guardian Locksmith serves Huntington and nearby Huntington Station, Melville, Cold Spring Harbor, and Northport.",
    localNote:
      "Historic homes near Huntington Village often have older doors and hardware, so new locks should be matched to the door rather than forced into a standard fit.",
  },
  {
    slug: "babylon",
    name: "Babylon",
    county: "Suffolk County",
    nearby: ["West Babylon", "North Babylon", "Lindenhurst", "Amityville"],
    homes: "older village houses, bay-front homes, and small businesses",
    intro:
      "Babylon is a South Shore village on the Great South Bay, with older village homes, waterfront properties, and small businesses along Montauk Highway and near the LIRR station. That means everything from apartment lockouts to storefront locks. Guardian Locksmith serves Babylon and nearby West Babylon, North Babylon, Lindenhurst, and Amityville.",
    localNote:
      "Bayside homes in Babylon deal with salt air and moisture, which can stiffen or corrode exterior locks over time.",
  },
  {
    slug: "smithtown",
    name: "Smithtown",
    county: "Suffolk County",
    nearby: ["Kings Park", "Nesconset", "Commack", "Hauppauge"],
    homes: "larger-lot colonials and ranches, plus Main Street businesses",
    intro:
      "Smithtown is a North Shore town of larger-lot colonials and ranches, quiet residential streets, and a Main Street of local businesses. Homes here often have attached garages, side doors, and several entrances, which means more locks to manage. Guardian Locksmith serves Smithtown and nearby Kings Park, Nesconset, Commack, and Hauppauge.",
    localNote:
      "With several entrances per house, rekeying every lock to one key is a practical fix in Smithtown, especially after a move.",
  },
  {
    slug: "patchogue",
    name: "Patchogue",
    county: "Suffolk County",
    nearby: ["East Patchogue", "Blue Point", "Bellport", "Medford"],
    homes: "village houses, apartments above storefronts, and waterfront homes",
    intro:
      "Patchogue is a South Shore village on the Great South Bay, known for a walkable downtown of restaurants, shops, and a historic theater, plus apartments above storefronts and waterfront homes. That mix brings apartment and storefront lockouts, tenant turnover, and business lock work. Guardian Locksmith serves Patchogue and nearby East Patchogue, Blue Point, Bellport, and Medford.",
    localNote:
      "Apartments above downtown storefronts turn over often, so rekeying between tenants is a regular need in Patchogue.",
  },
  {
    slug: "bay-shore",
    name: "Bay Shore",
    county: "Suffolk County",
    nearby: ["Brightwaters", "West Islip", "Islip", "Brentwood"],
    homes: "South Shore homes, marina-side properties, and downtown businesses",
    intro:
      "Bay Shore is a South Shore community on the Great South Bay, home to marinas, the ferry terminals for Fire Island, a busy downtown, and residential neighborhoods. Boaters and ferry passengers get locked out of cars, and year-round residents call for rekeying and lock upgrades. Guardian Locksmith serves Bay Shore and nearby Brightwaters, West Islip, Islip, and Brentwood.",
    localNote:
      "Drivers who leave cars near the Bay Shore ferry terminals for the day sometimes return to a dead key fob or keys locked inside, and salt air near the bay is also hard on exterior locks.",
  },
  {
    slug: "islip",
    name: "Islip",
    county: "Suffolk County",
    nearby: ["Bay Shore", "East Islip", "Islip Terrace", "Great River"],
    homes: "bay-side homes, quiet residential blocks, and Montauk Highway businesses",
    intro:
      "Islip is a South Shore community on the Great South Bay with older bay-side homes, quiet residential blocks, and businesses along Montauk Highway. Lockouts, rekeying after a move, and lock upgrades are the usual calls, along with car key and fob work for commuters. Guardian Locksmith serves Islip and nearby Bay Shore, East Islip, Islip Terrace, and Great River.",
    localNote:
      "Bay-side moisture and salt air affect exterior locks in Islip, so older cylinders and latches are worth checking during any visit.",
  },
  {
    slug: "riverhead",
    name: "Riverhead",
    county: "Suffolk County",
    nearby: ["Calverton", "Aquebogue", "Jamesport", "Wading River"],
    homes: "farmhouses, newer subdivisions, and Route 58 retail businesses",
    intro:
      "Riverhead is the Suffolk County seat, with farmland and wineries close by, newer subdivisions, older farmhouses, and a busy retail corridor along Route 58. Homes here often sit on larger lots with sheds and outbuildings, and the businesses need reliable commercial locks. Guardian Locksmith serves Riverhead and nearby Calverton, Aquebogue, Jamesport, and Wading River.",
    localNote:
      "Properties in Riverhead often include gates, sheds, and outbuildings as well as the house, so locks keyed alike to share one key are a common request.",
  },
];

module.exports = { TOWNS };
