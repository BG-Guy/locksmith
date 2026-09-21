// The services the business offers, with the SEO copy for each. Source of
// truth for every service page and every service card. Edit the words here,
// then run `npm run build`.
//
// Each service is written ONCE with placeholders; the build fills them in for
// every town so no place name is ever hardcoded in shared copy:
//   {town}      "Huntington"           | "Long Island"
//   {inTown}    "in Huntington"        | "on Long Island"
//   {InTown}    "In Huntington"        | "On Long Island"
//   {townState} "Huntington, NY"       | "Long Island, NY"
//   {homes}     the town's housing/business mix (see locations-data.js)
//   {callsFrom} "Huntington and nearby Huntington Station and Melville"
//   {price}     this service's price range (the `price` field below)
//
// Copy structure (the four sections every page uses, in order):
//   why  = why you need it       (search intent, local texture)
//   how  = how we do it          (process + the one pro-only step)
//   cost = cost and how long it lasts (a real $ range, lifespan)
//   risk = what happens if you wait / do it yourself
//
// PRICES ARE ESTIMATES. Confirm every `price` with the owner before launch.

const CATEGORIES = [
  { id: "emergency", label: "Emergency" },
  { id: "residential", label: "Residential" },
  { id: "automotive", label: "Automotive" },
  { id: "commercial", label: "Commercial" },
];

const SERVICES = [
  // ---------------------------------------------------------------- Emergency
  {
    slug: "home-lockout-service",
    name: "Home Lockout Service",
    category: "emergency",
    cardText:
      "Locked out of your house or apartment? A technician gets you back inside without damaging the door or the lock.",
    hero: "Non-destructive entry for houses, condos, and apartments {inTown}, with a flat-rate price confirmed before we start.",
    includes: [
      "Non-destructive door entry",
      "ID and ownership check before opening",
      "Lock inspection after entry",
      "Spare key or rekey on the spot if needed",
      "Flat-rate quote before work",
    ],
    meta: "non-destructive entry, flat-rate price",
    related: ["lock-rekeying", "deadbolt-installation", "lock-installation"],
    price: "$75 to $200",
    h2Why: "Locked Out of Your Home {inTown}? Get Back Inside Without Damage",
    why: `Most lockout calls start the same way: keys left inside, a key that snapped in the lock, a lost set, or a door that swelled shut in humid weather. {InTown} you will find {homes}, and nearly all of them use standard pin-tumbler cylinders that a trained locksmith can open without drilling. The bigger risk is going after the door yourself: pried frames, cracked jambs, and broken glass cost far more than the call. If a child, a pet, or something on the stove is behind the door, call right away and tell us so we can prioritize.`,
    h2How: "How We Handle Home Lockouts {inTown}",
    how: `We start by confirming that you live at the property and the door is yours, with ID, a utility bill, or mail, because a locksmith should never open a door for a stranger. Then we look at the lock and pick the gentlest method: picking or bypass tools for most cylinder and deadbolt locks, and latch tools for spring latches. Drilling is a last resort, and we tell you before we do it. Once you are in, we check the lock for wear and offer a spare key or a quick rekey if your keys are lost. Most home lockouts take 15 to 30 minutes once we arrive.`,
    h2Cost: "Home Lockout Service Cost {inTown}, and What Changes the Price",
    cost: `A typical home lockout {inTown} runs {price}, depending on the type of lock, how the door is set up, and the time of day. Standard cylinder and deadbolt locks sit at the low end; high-security cylinders, multipoint door locks, and doors with damaged hardware cost more. The price covers the visit, the entry, and a check of the lock. We quote a flat rate before starting, so there is no hourly billing and no surprises. If a lock has to be replaced afterward, that is quoted separately and only with your approval.`,
    h2Risk: "What Happens If You Force the Door Instead",
    risk: `It is tempting to try a credit card, a screwdriver, or a shoulder. It usually goes wrong: a bent latch, a split door frame, a broken window, or a lock that now jams for good. A pried steel door or a cracked wood jamb often costs several times what a lockout call does, and a broken window leaves the house open until it is fixed. For anyone in {callsFrom}, calling a locksmith protects the door and the lock. If a key broke off inside the lock, stop turning it, because that pushes the piece deeper; we can usually extract it during the same visit.`,
  },
  {
    slug: "car-lockout-service",
    name: "Car Lockout Service",
    category: "emergency",
    cardText:
      "Keys locked in the car? We unlock most vehicles without scratching the paint or damaging the door.",
    hero: "Damage-free vehicle entry for cars, SUVs, and trucks {inTown}, at your driveway, parking spot, or roadside.",
    includes: [
      "Damage-free vehicle entry",
      "Cars, SUVs, and trucks",
      "Door and trunk unlock",
      "Key check after entry",
      "Flat-rate quote before work",
    ],
    meta: "damage-free vehicle entry, flat-rate price",
    related: ["car-key-replacement", "key-fob-programming", "ignition-repair"],
    price: "$75 to $175",
    h2Why: "Keys Locked in Your Car {inTown}? Skip the Coat Hanger",
    why: `Keys locked in the car, a dead key fob battery, or a lost key are some of the most common reasons people call a locksmith: parking lots, driveways, train station lots, and the shoulder of a busy road. Newer vehicles are harder to open than older ones, with side airbags in the doors, tight weatherstripping, and electronics that the wrong tool can upset. That is why a trained technician with the right wedges and reach tools beats a hanger every time. Waiting in a car park or on a roadside, especially after dark, is also a safety issue.`,
    h2How: "How We Unlock a Car {inTown} Without Damaging It",
    how: `We confirm the vehicle is yours with ID and a registration or insurance card, then pick the method that fits the car: an air wedge to open a small gap in the door frame and a long-reach tool to press the unlock control, or lock-picking tools for vehicles that allow it. We protect the paint and weatherstripping with door guards, never force the window down, and check that the door still seals afterward. If the key is lost rather than locked inside, we can go straight to replacing it. Most vehicle lockouts take 10 to 20 minutes once we arrive.`,
    h2Cost: "Car Lockout Service Cost {inTown}, and What Affects It",
    cost: `A car lockout {inTown} typically runs {price}, depending on the vehicle, the location, and the time of day. Older cars with simple locks are quick; newer models, luxury brands, and vehicles with high-security locks take longer and cost more. The quote is a flat rate given before we start, and it includes the visit and the entry. That is usually far less than a tow to a dealer, a repaired door, or a replaced window.`,
    h2Risk: "Why Prying or Breaking In Costs More Than the Call",
    risk: `A wedge and a coat hanger in the wrong hands can tear weatherstripping, bend the door frame, scratch the paint, or trip the alarm, and a smashed window means a repair bill, glass in the seats, and an open car until the glass is replaced. If a child or a pet is inside a hot car, call 911 first. For lockouts anywhere in {callsFrom}, a technician is the fastest, safest, and usually cheapest way back into your vehicle.`,
  },

  // -------------------------------------------------------------- Residential
  {
    slug: "lock-rekeying",
    name: "Lock Rekeying",
    category: "residential",
    cardText:
      "Moved in, lost a key, or changed roommates? Rekeying makes old keys stop working without replacing the lock.",
    hero: "New pins and new keys in your existing locks {inTown}, so every old key stops working.",
    includes: [
      "Rekey every lock on the property",
      "One key for all doors on request",
      "New keys cut on site",
      "Old keys stop working",
      "Flat rate per lock or per home",
    ],
    meta: "old keys stop working, new keys cut on site",
    related: ["lock-installation", "deadbolt-installation", "smart-lock-installation"],
    price: "$20 to $50 per lock",
    h2Why: "Why Rekey Your Locks {inTown} After a Move or a Lost Key",
    why: `You cannot know who has a copy of the keys to a home you just bought or rented: previous owners, tenants, contractors, cleaners, a neighbor. The same goes after a breakup, a roommate moving out, an employee leaving, or a lost or stolen key ring. {InTown} you will find {homes}, and in most of them the existing locks are perfectly good. Rekeying resets who has access without buying new hardware.`,
    h2How: "How Lock Rekeying Works {inTown}",
    how: `A lock opens when pins of different lengths line up with the cuts on the right key. To rekey, we take the cylinder apart, replace the pins with a new combination, and cut new keys to match. The lock stays on the door; the old key simply stops working. We can rekey every lock on the property to the same key, so one key opens the front door, back door, and garage entry, and you carry fewer keys. We also check each lock for wear and flag any that should be replaced instead. A typical home takes about 30 to 60 minutes.`,
    h2Cost: "Lock Rekeying Cost {inTown} vs. Replacing the Locks",
    cost: `Rekeying {inTown} typically runs {price}, plus a small service charge for the visit, so a whole house usually costs far less than a full set of new deadbolts. Rekeying is the better value when your locks are in good shape; replacement makes sense when a lock is worn, damaged, or you want a higher security grade. We tell you which one fits before you pay, and we quote a flat rate up front. Rekeyed locks last as long as the original hardware.`,
    h2Risk: "The Risk of Leaving Old Keys Active",
    risk: `Every key ever cut for your locks keeps working until you rekey them. A previous tenant's spare, a contractor's copy, or a key from a lost ring can open your door at any time, and nothing looks forced, so you may never know it happened. For homeowners and landlords in {callsFrom}, rekeying on moving day is a small cost that closes that gap immediately.`,
  },
  {
    slug: "lock-installation",
    name: "Lock Installation",
    category: "residential",
    cardText:
      "Worn, broken, or outdated locks replaced with new hardware that fits your door and your budget.",
    hero: "New knobs, levers, and entry locks installed and keyed {inTown}, with the old hardware removed.",
    includes: [
      "Removal of the old lock",
      "Knob, lever, or entry set installed",
      "Door prep and strike plate check",
      "New keys cut on site",
      "Function test on every lock",
    ],
    meta: "knobs, levers, and entry sets keyed on site",
    related: ["deadbolt-installation", "lock-rekeying", "smart-lock-installation"],
    price: "$85 to $200 per lock, plus the hardware",
    h2Why: "When to Replace a Lock {inTown} Instead of Repairing It",
    why: `A lock that sticks, turns hard, spins freely, or no longer latches is telling you something. So is a key that needs jiggling, a knob that wobbles, or hardware that is decades old. {InTown} you will find {homes}, and much of the original hardware in older homes is well past its useful life. Replacing a worn lock restores smooth operation, and it is the right moment to move up to a higher security grade and match the finish across the house.`,
    h2How: "How We Install and Replace Locks {inTown}",
    how: `We measure the door prep first, meaning the bore hole, backset, and door thickness, so the new lock fits without re-drilling wherever possible. We remove the old lock, install the new one, check the strike plate and latch alignment, and test the lock with the door open and closed. Keys are cut on site and can be matched to your other locks so one key fits all. If the door is damaged or the latch hole is off, we correct it rather than leaving you with a lock that sticks. Most single-lock replacements take 20 to 40 minutes.`,
    h2Cost: "Lock Installation Cost {inTown}, and How Long Locks Last",
    cost: `Lock installation {inTown} typically runs {price}, depending on the grade of lock and the condition of the door, with hardware priced separately so you can choose. A quality residential lock commonly lasts 10 years or more with normal use, though exterior locks near the water can wear faster because of salt air. We quote a flat labor rate before the work starts, and we will tell you if a cheaper repair would do the job.`,
    h2Risk: "The Cost of Putting Off a Failing Lock",
    risk: `A failing lock rarely fails at a convenient time. It jams when you are running late, stops latching and leaves the door unsecured overnight, or the key snaps in the cylinder. A lock that does not fully latch can be pushed open, and a forced or damaged door usually costs more than replacing the lock would have. For homes in {callsFrom}, replacing worn hardware on your schedule beats an emergency call later.`,
  },
  {
    slug: "deadbolt-installation",
    name: "Deadbolt Installation",
    category: "residential",
    cardText:
      "Reinforced deadbolts and strike plates that make entry doors much harder to kick in or force.",
    hero: "Grade 1 or 2 deadbolts with reinforced strike plates {inTown}, installed to resist kick-ins and forced entry.",
    includes: [
      "Grade 1 or 2 deadbolt options",
      "Reinforced strike plate",
      "Long screws into the wall stud",
      "Door and frame alignment check",
      "Keyed to match your other locks",
    ],
    meta: "reinforced strike plate, resists kick-ins",
    related: ["lock-installation", "lock-rekeying", "smart-lock-installation"],
    price: "$100 to $250 per door",
    h2Why: "Why a Better Deadbolt Matters {inTown}",
    why: `Most forced entries are simple kick-ins: the door frame splits at the strike plate, which is usually held by short screws into thin wood. A basic knob lock, or a deadbolt with a weak strike, gives way in seconds. {InTown} you will find {homes}, and many original entry doors still carry hardware that has not changed since the house was built. A properly installed deadbolt with a reinforced strike and long screws is one of the most effective security upgrades for the money.`,
    h2How: "How We Install a Reinforced Deadbolt {inTown}",
    how: `We choose a deadbolt with a solid bolt and a full one-inch throw, and install it so it sits square in the door. The key step is the strike: we replace the flimsy factory plate with a reinforced strike and drive long screws through the jamb and into the wall stud, which spreads the force of a kick across the framing instead of the thin trim. We check the door for warping, adjust the alignment so the bolt throws smoothly, and can key the new deadbolt to match your other locks. A single deadbolt usually takes about 45 to 60 minutes.`,
    h2Cost: "Deadbolt Installation Cost {inTown} and Expected Lifespan",
    cost: `Deadbolt installation {inTown} typically runs {price}, depending on the grade of the lock, whether a new hole must be bored, and the condition of the frame. A good deadbolt lasts 15 years or more. We quote a flat rate up front, and hardware options are shown at the estimate so you can pick your grade and finish.`,
    h2Risk: "What Happens to a Door With Weak Hardware",
    risk: `Weak hardware fails under force it should have resisted: a boot to the door, a shoulder, a pry bar. The frame splits, the door swings in, and the repair often costs more than the deadbolt upgrade would have. Beyond the bill, a forced entry leaves a household feeling unsafe in its own home. Homeowners in {callsFrom} can close this gap in a single visit.`,
  },
  {
    slug: "smart-lock-installation",
    name: "Smart Lock Installation",
    category: "residential",
    cardText:
      "Keypad and Wi-Fi smart locks installed, paired, and tested so you can stop carrying keys.",
    hero: "Keypad, Bluetooth, and Wi-Fi smart locks installed {inTown}, paired to your phone, and tested on your door.",
    includes: [
      "Removal of your existing lock",
      "Smart lock installation and alignment",
      "App setup and phone pairing",
      "User codes programmed",
      "Backup key and battery check",
    ],
    meta: "keypad and Wi-Fi locks installed and paired",
    related: ["deadbolt-installation", "lock-installation", "lock-rekeying"],
    price: "$120 to $300, plus the lock",
    h2Why: "Why Homeowners Are Switching to Smart Locks {inTown}",
    why: `Smart locks solve everyday headaches: no more hiding keys under the mat, no chasing spares when the kids or the dog walker need in, and no rekeying when a guest or contractor is finished. You can create a temporary code, see when the door is used, and lock up from your phone. {InTown} you will find {homes}, and a smart deadbolt fits standard doors and can replace an existing deadbolt without new drilling in most cases.`,
    h2How: "How We Install and Set Up a Smart Lock {inTown}",
    how: `We check that the door and bolt line up first, because a smart lock cannot run smoother than the door it sits on. We remove the old deadbolt, install the smart lock, and adjust the strike so the motor throws the bolt freely. Then we pair it with your phone, set up user codes, connect it to your home Wi-Fi hub if it uses one, and test the keypad, the app, and the backup key. We walk you through adding and deleting codes, and we can help you pick a model that works with your smart-home setup.`,
    h2Cost: "Smart Lock Installation Cost {inTown}, and Battery Life",
    cost: `Smart lock installation {inTown} typically runs {price} in labor, with the lock itself priced separately depending on brand and features. Most models run on AA batteries that commonly last six months to a year and warn you long before they die. A quality smart lock often lasts 5 to 10 years, and the door hardware stays in service after that. We quote a flat labor rate before starting.`,
    h2Risk: "The Risks of a Poorly Installed Smart Lock",
    risk: `A smart lock installed on a door that binds will burn through batteries, strain the motor, and eventually lock you out. Models bought online sometimes arrive without the right adapter for your door, and codes that are never removed give former guests and workers access forever. Proper installation and setup avoid these problems, so for homes in {callsFrom} the lock works the way it should from day one.`,
  },
  {
    slug: "safe-installation",
    name: "Safe Installation",
    category: "residential",
    cardText:
      "Home and business safes delivered, anchored, and set up so they stay put and stay locked.",
    hero: "Gun safes, fire safes, and wall or floor safes installed {inTown}, anchored, and set up with your combination.",
    includes: [
      "Safe delivery and positioning",
      "Anchoring to floor or wall",
      "Combination or electronic lock setup",
      "Wall and floor safe installation",
      "Lock testing and code walkthrough",
    ],
    meta: "safes anchored and set up, home and business",
    related: ["deadbolt-installation", "master-key-systems", "lock-installation"],
    price: "$150 to $500 in labor",
    h2Why: "Why a Safe Is Only Secure When It Is Installed Right",
    why: `A safe protects documents, cash, jewelry, firearms, and irreplaceable keepsakes, but only if it stays where you put it and opens for the right person. A lightweight safe left unanchored can be carried out of a house whole. Safes can also be awkward to move into place, and the lock, whether a mechanical dial or an electronic keypad, must be set up properly and tested. Homeowners and small businesses {inTown} have a locksmith position, anchor, and program the safe so it does the job it was bought for.`,
    h2How: "How We Install and Anchor a Safe {inTown}",
    how: `We help you choose the best spot, such as a closet, a corner, or a floor location that keeps the safe out of view and leaves room for the door to swing open. We position the safe, anchor it through the floor or wall into solid structure with the right hardware, and set the combination or program the electronic lock with your codes. We test the lock repeatedly, then walk you through changing the code and replacing the batteries. Wall and floor safes are set into the framing or slab and finished cleanly.`,
    h2Cost: "Safe Installation Cost {inTown}, and How Long Safes Last",
    cost: `Safe installation {inTown} typically runs {price}, depending on the size and weight of the safe, the stairs or turns it has to be moved through, and how it is anchored. The safe itself is priced separately. A quality safe lasts for decades, though electronic keypads need fresh batteries and occasional service. We give a flat rate for the installation before we begin.`,
    h2Risk: "What Happens to an Unanchored Safe",
    risk: `A heavy-looking safe is not necessarily a secure one. Small and mid-size safes that are not anchored can be tipped, carried out, and opened somewhere else with time and tools. A safe with a poorly set lock can also lock out its own owner. Getting the location, the anchoring, and the lock right at installation avoids both problems for homes and businesses in {callsFrom}.`,
  },

  // --------------------------------------------------------------- Automotive
  {
    slug: "car-key-replacement",
    name: "Car Key Replacement",
    category: "automotive",
    cardText:
      "Lost every key or only have one? We cut and program replacement car keys, including transponder keys, on site.",
    hero: "Transponder and laser-cut car keys cut and programmed {inTown}, at your vehicle, often without a tow to the dealer.",
    includes: [
      "Transponder key cutting and programming",
      "Laser-cut and standard keys",
      "All-keys-lost situations",
      "Spare key duplication",
      "Programming done at your vehicle",
    ],
    meta: "transponder keys cut and programmed on site",
    related: ["key-fob-programming", "ignition-repair", "car-lockout-service"],
    price: "$150 to $400",
    h2Why: "Lost Your Car Key {inTown}? You Do Not Need a Tow to the Dealer",
    why: `Modern car keys are not just cut metal: most contain a transponder chip that has to match the car's computer, and many also have laser-cut edges. Losing your only key, breaking one in the ignition, or a key that has stopped starting the car all lead to the same place: a replacement that must be cut and programmed. Many people assume the dealer is the only option, which means a tow and a wait. A mobile locksmith can come to you, whether you are in a driveway, a lot, or a garage.`,
    h2How: "How We Make and Program a New Car Key {inTown}",
    how: `We verify ownership with ID and registration, look up the key type for your make, model, and year, and cut the blade by code or by decoding the lock when no key exists. Then we program the transponder chip to your vehicle so it starts the engine, and test every function before we leave. If you have no working key at all, that is fine; we can generate a new one. It is also the best time to add a spare, which costs much less than making a key from scratch later. Most keys are finished in under an hour at your vehicle.`,
    h2Cost: "Car Key Replacement Cost {inTown} vs. the Dealer",
    cost: `Replacement car keys {inTown} typically run {price}, depending on the make, the year, and whether it is a basic transponder key, a laser-cut key, or a smart key. Luxury and newer push-button start models cost more. Compare quotes: mobile service avoids the tow and the dealer's wait, and adding a second key while we are there is cheaper than starting over later. We give a flat price before cutting anything.`,
    h2Risk: "What Happens If You Have Only One Key",
    risk: `With one key, one loss puts you in an all-keys-lost situation, which costs more and takes longer than duplicating a key you still have. A worn key can also fail without warning at the worst time, and the chip in a damaged key can stop communicating with the car. For drivers in {callsFrom}, a spare is cheap insurance, and if it is already too late we can still get you moving.`,
  },
  {
    slug: "key-fob-programming",
    name: "Key Fob Programming",
    category: "automotive",
    cardText:
      "Dead, lost, or new key fobs and remotes programmed to your vehicle at your location.",
    hero: "Remote, key fob, and smart key programming {inTown} for most makes and models, done where your car is parked.",
    includes: [
      "Key fob and remote programming",
      "New fob supply and pairing",
      "Smart key and push-button start support",
      "Lost fobs erased from the car's memory",
      "Battery replacement and testing",
    ],
    meta: "remote and smart-key fobs programmed on site",
    related: ["car-key-replacement", "ignition-repair", "car-lockout-service"],
    price: "$75 to $250",
    h2Why: "Key Fob Not Working {inTown}? Programming Usually Fixes It",
    why: `A fob that has stopped unlocking doors or starting the car is usually one of three things: a dead battery, a fob that lost its pairing after a battery change or a hard drop, or a fob that has simply worn out. New and replacement fobs also have to be programmed to the vehicle before they will work. If a fob is lost, the sensible step is to erase it from the car's memory so nobody can use it. All of that is quick work for a locksmith who comes to you.`,
    h2How: "How We Program a Key Fob {inTown}",
    how: `We start with a diagnosis: battery first, then pairing, then the fob's electronics. If the fob only needs a fresh battery, that is the fix. If it needs programming, we connect diagnostic equipment to the vehicle, put it in programming mode for your make, and pair the fob. Lost fobs are erased from the car's memory so they no longer work. We test lock, unlock, trunk, and start functions before finishing. Many fobs are programmed in 20 to 40 minutes.`,
    h2Cost: "Key Fob Programming Cost {inTown}, and What Changes It",
    cost: `Key fob programming {inTown} typically runs {price}, depending on the make, the year, and whether you supply the fob or we do. Programming a fob you already have sits at the lower end; supplying a new smart key for a push-button start vehicle costs more. Dealers often require an appointment and sometimes a tow, while mobile programming comes to you and gives a flat price before we start.`,
    h2Risk: "The Risk of Ignoring a Failing Fob",
    risk: `A fob that works only some of the time will eventually stop working altogether, often when the car is far from home or the dealer is closed. A lost fob that is still active in the vehicle's memory can be used by whoever finds it and the car. Programming a new fob and removing the old one solves both problems. Whether you are in {callsFrom}, it is a short visit that can prevent a much bigger headache.`,
  },
  {
    slug: "ignition-repair",
    name: "Ignition Repair",
    category: "automotive",
    cardText:
      "Key won't turn, stuck in the ignition, or worn out? Ignition cylinders repaired or replaced on site.",
    hero: "Worn, stuck, or broken ignition cylinders repaired or replaced {inTown}, with keys cut and programmed to match.",
    includes: [
      "Ignition cylinder diagnosis",
      "Cylinder repair or replacement",
      "Broken key extraction",
      "Key cutting and transponder programming",
      "Steering wheel lock release",
    ],
    meta: "ignition cylinders repaired or replaced on site",
    related: ["car-key-replacement", "key-fob-programming", "car-lockout-service"],
    price: "$150 to $450",
    h2Why: "When Your Key Will Not Turn the Ignition {inTown}",
    why: `A key that will not turn, sticks, or comes out only with a fight is usually a worn ignition cylinder, a worn key, or a steering wheel lock that has engaged. Years of use, a heavy key ring hanging from the ignition, and a worn key all wear down the pins inside the cylinder. Sometimes the cylinder fails suddenly, but more often it gets steadily worse. A locksmith who can repair or replace it on site saves you a tow and a dealer visit.`,
    h2How: "How We Repair or Replace an Ignition Cylinder {inTown}",
    how: `First we try the simple fixes: a worn key replaced with a fresh cut, a steering lock released, and the cylinder cleaned and lubricated. If the cylinder is worn or damaged, we remove it, rebuild it or fit a replacement, cut new keys to match, and program the transponder to the vehicle where required. A broken key stuck in the ignition is extracted first. We test the start, accessory, and off positions before finishing. Most jobs are done within an hour or two at your vehicle.`,
    h2Cost: "Ignition Repair Cost {inTown}, and Repair vs. Replace",
    cost: `Ignition repair {inTown} typically runs {price}, depending on the vehicle, how worn the cylinder is, and whether new keys are needed. A simple worn-key fix is at the low end; a full replacement with programmed keys costs more, though usually less than a dealer visit plus a tow. We diagnose first, tell you which it is, and give a flat price before the work starts. A repaired or replaced cylinder should last for years, especially with a single key on the ring.`,
    h2Risk: "Why a Sticking Ignition Should Not Wait",
    risk: `A sticking ignition rarely gets better. It can strand you without warning, leave a key jammed in the cylinder, or leave the steering wheel locked with the engine off. A worn cylinder that is forced can snap the key inside, which turns a small repair into a bigger one. If your key has started to stick or turn hard, get it looked at now rather than after a breakdown, wherever you are in {callsFrom}.`,
  },

  // --------------------------------------------------------------- Commercial
  {
    slug: "master-key-systems",
    name: "Master Key Systems",
    category: "commercial",
    cardText:
      "One master key for managers and separate keys for each tenant, office, or door.",
    hero: "Layered key systems {inTown} for offices, buildings, and rentals, with restricted keys that cannot be copied at a hardware store.",
    includes: [
      "System design for your building",
      "Master, sub-master, and individual keys",
      "Existing locks rekeyed to the system",
      "Restricted keyways on request",
      "Key records for future expansion",
    ],
    meta: "one master key, separate keys for each door",
    related: ["panic-bar-installation", "lock-rekeying", "lock-installation"],
    price: "$150 and up, depending on the number of locks",
    h2Why: "Why Businesses and Landlords {inTown} Use Master Key Systems",
    why: `A building with a dozen doors and a dozen key rings is a management problem: managers carrying a pocketful of keys, staff sharing copies, and no record of who can open what. A master key system fixes that. Each person gets one key that opens exactly the doors they should, and a master key opens them all. Businesses, medical offices, multi-tenant buildings, and landlords with several units {inTown} use these systems to control access without carrying dozens of keys.`,
    h2How: "How We Design and Install a Master Key System {inTown}",
    how: `We walk the building, count the doors, and map who needs access to what. From that we design a hierarchy: individual keys for each door, sub-master keys for departments or floors, and a grand master for management. We then rekey your existing locks to the system, or replace locks that cannot be rekeyed, and cut the keys. Restricted keyways can be added so keys cannot be duplicated at a hardware store without authorization. We keep a key record so future locks and keys can be added to the same system.`,
    h2Cost: "Master Key System Cost {inTown} and What Drives It",
    cost: `A master key system {inTown} typically runs {price}, driven mainly by the number of locks, the number of key levels, and whether restricted keyways are used. Rekeying existing locks is far cheaper than replacing them, so we start there. Once installed, the system lasts as long as the locks themselves, and expanding it later costs much less than starting over. We give a flat quote after a walk-through.`,
    h2Risk: "What Happens When Keys Are Not Controlled",
    risk: `When employees, tenants, and contractors all carry unmanaged copies, you lose track of who can get into the building, and rekeying everything after each departure gets expensive. A lost key can mean changing the whole building rather than one lock. A system built around a controlled key hierarchy limits the fallout when a key goes missing. Business owners in {callsFrom} who set it up early avoid the costly rekey-everything cycle.`,
  },
  {
    slug: "panic-bar-installation",
    name: "Panic Bar Installation",
    category: "commercial",
    cardText:
      "Panic bars and exit devices installed and adjusted so emergency exits open with one push.",
    hero: "Exit devices {inTown} for storefronts, offices, and stairwells, installed and adjusted so doors open freely from the inside and stay secure outside.",
    includes: [
      "Panic bar and exit device installation",
      "Door and frame preparation",
      "Exterior trim, cylinder, or key access",
      "Latch and strike adjustment",
      "Function test from both sides",
    ],
    meta: "exit devices installed for safe, secure doors",
    related: ["master-key-systems", "lock-installation", "deadbolt-installation"],
    price: "$200 to $600 per door in labor",
    h2Why: "Why Businesses {inTown} Need Working Panic Bars",
    why: `Commercial doors that people use to leave in an emergency need hardware that opens with a single push, without a key or special knowledge. Stores, restaurants, offices, schools, and places of worship {inTown} rely on panic bars and exit devices so occupants can get out quickly while the door stays secure from the outside. Devices wear out, doors settle, and latches drift out of alignment, so a bar that once worked smoothly begins to stick. Requirements depend on the building type, so check with your local building or fire code official.`,
    h2How: "How We Install and Adjust Exit Devices {inTown}",
    how: `We select a device that fits the door type and how it is used, prepare the door and frame, and mount the bar at the right height. We fit the latch and strike so the door closes and latches every time, and add an exterior trim, a keyed cylinder, or fob access where the door has to be entered from outside. We test the door from both sides and confirm the bar releases with a single push before we leave. Existing devices can often be adjusted or repaired rather than replaced.`,
    h2Cost: "Panic Bar Installation Cost {inTown}, and How Long It Lasts",
    cost: `Installing a panic bar {inTown} typically runs {price}, with the device itself priced by grade and finish. Commercial-grade exit devices commonly last 10 years or more with regular service, and periodic adjustments keep them working smoothly. We quote a flat rate after seeing the door, and we can service existing devices too.`,
    h2Risk: "The Risk of a Sticking or Blocked Exit Door",
    risk: `An exit device that sticks, latches partway, or needs force to open is a safety problem in an emergency, and it can also mean a code violation and liability for the building owner. A device that is not properly secured from the outside leaves the business open to a break-in. Fixing it before there is a problem protects both people and property for businesses in {callsFrom}.`,
  },
];

module.exports = { CATEGORIES, SERVICES };
