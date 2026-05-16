/**
 * update-locations-content.mjs
 *
 * Patches each /locations record with the new local-content fields:
 *   heroTagline, heroIntro, housingProfile, commonIssues, neighborhoods
 *
 * Usage:
 *   CMS_URL=https://loch-monster-electric-cms.vercel.app \
 *   CMS_EMAIL=ravi@10xtek.com CMS_PASSWORD='...' \
 *   node scripts/update-locations-content.mjs
 *
 * Env defaults to localhost:3001 if CMS_URL not set.
 */

const BASE = process.env.CMS_URL || 'http://localhost:3001'
const EMAIL = process.env.CMS_EMAIL || 'admin@lochmonsterelectric.com'
const PASSWORD = process.env.CMS_PASSWORD || ''

// ── Per-city content ────────────────────────────────────────────────────────
// Keys are location slugs. Each must map to the new fields.

const CONTENT = {
  'shoreview-mn': {
    heroTagline: 'Trusted electricians for Shoreview’s mid-century ramblers and modern infill homes.',
    heroIntro: 'From Snail Lake to Lake Owasso, we keep Shoreview homes safe, code-current, and ready for whatever the next Minnesota winter throws at them. Licensed, insured, and a phone call from your kitchen.',
    housingProfile: 'Shoreview’s housing stock is a true mix—1950s through 1970s ramblers and split-levels in the older core, with newer townhomes and custom builds threading through the infill lots. That age spread means we routinely see breaker panels nearing end of life, undersized service entrances for modern loads, and outdoor circuits that have weathered four decades of freeze-thaw. The newer construction brings the opposite problem: high-amperage demand for EV chargers, induction ranges, and finished basements that the original builder never planned for.',
    commonIssues: [
      {
        heading: 'Aging 100-amp panels at capacity',
        body: 'Most Shoreview homes built before 1980 came with 100-amp service that worked fine for a furnace, a fridge, and a dryer. Add an EV charger, a heat pump, and a home office, and the panel taps out. We size up to 200 amps without tearing the house apart.',
      },
      {
        heading: 'Knob-and-tube remnants in older basements',
        body: 'Pre-1955 homes around the Snail Lake corridor sometimes still have abandoned knob-and-tube runs spliced into modern circuits in the basement ceiling. We trace, isolate, and replace those sections so your insurance carrier and your inspector both sign off.',
      },
      {
        heading: 'Outdoor outlets and garage circuits failing in winter',
        body: 'Garage GFCIs, holiday-light circuits, and heated gutter feeds take a beating in Shoreview winters. We replace tripped or weather-damaged receptacles with cold-rated GFCIs and seal the boxes so moisture stops the cycle.',
      },
    ],
    neighborhoods: ['Snail Lake', 'Lake Owasso', 'Sunfish Lake', 'Turtle Lake', 'Island Lake'],
  },

  'apple-valley-mn': {
    heroTagline: 'Powering Apple Valley’s 1980s neighborhoods through their second-generation upgrades.',
    heroIntro: 'Apple Valley homes are hitting the age where the original panel, wiring, and outlets need a second look—especially as EVs, heat pumps, and home offices push electrical demand past what builders planned for in 1985.',
    housingProfile: 'Apple Valley’s residential core was built largely between 1978 and 1998, with a strong wave of late-90s expansion along the Diamond Path and Cedar corridors. Those homes were quality-built but use electrical conventions of their era: 150-amp panels, fewer dedicated kitchen circuits, and sparse exterior outlets. Newer construction around Cobblestone Lake and the southern edge tells a different story—250-amp service, generator transfer switches, and EV-ready garages from day one.',
    commonIssues: [
      {
        heading: 'Federal Pacific and Zinsco panel replacements',
        body: 'A handful of Apple Valley’s older subdivisions were wired with Federal Pacific Stab-Lok or Zinsco panels, both of which have documented breaker-trip failures. If your panel says FPE or has the dial-style breakers, we recommend replacement—and your insurer probably does too.',
      },
      {
        heading: 'EV charger installs in attached garages',
        body: 'Apple Valley is one of the highest EV-adoption suburbs in Dakota County. We run dedicated 240V circuits to Level 2 chargers, size the panel for current and future capacity, and pull the city permit. Most installs done in a single day.',
      },
      {
        heading: 'Kitchen and laundry circuit overloads',
        body: 'Kitchens wired in the 80s rarely have the dedicated 20-amp small-appliance circuits that modern code calls for. Tripping breakers when the microwave and coffee maker run together is the giveaway—we add the dedicated circuits without ripping out cabinets.',
      },
    ],
    neighborhoods: ['Cobblestone Lake', 'Diamond Path', 'Cedar Knolls', 'Pinewood', 'Palomino Hills', 'Greenleaf'],
  },

  'plymouth-mn': {
    heroTagline: 'Lake-area cottages, executive new builds, and everything between—one Plymouth electrician.',
    heroIntro: 'From the older Medicine Lake neighborhoods to the high-end builds in the Wayzata school district, Plymouth electrical needs run the full gamut. We cover all of it under one license and one truck.',
    housingProfile: 'Plymouth is the rare suburb where electrical work spans nearly a century of construction. Cottages and starter homes ring Medicine Lake and parts of Parkers Lake, many converted from seasonal use and still carrying remnants of mid-century wiring. The bulk of the city was built between 1985 and 2010, and the newest pockets—especially along the Vicksburg corridor—feature high-amperage service, smart-home pre-wires, and finished lower levels with theater and gym circuits we’re routinely called back to extend.',
    commonIssues: [
      {
        heading: 'Knob-and-tube remediation near Medicine Lake',
        body: 'The older cottages converted to year-round homes near Medicine Lake sometimes still have active knob-and-tube circuits buried in lath-and-plaster walls. We map the runs, isolate them safely, and replace with copper Romex without gutting finished spaces.',
      },
      {
        heading: 'Smart-home wiring and structured cabling',
        body: 'High-end Plymouth builds expect Lutron, Control4, Cat6, and whole-home audio pre-wires before drywall. We coordinate with builders and integrators so the rough-in matches the final scope and there are no surprise rip-outs at trim.',
      },
      {
        heading: 'Whole-home generator hookups',
        body: 'Outages from summer storms and ice loading drive a steady stream of Generac and Kohler installs in Plymouth. We handle the load calculation, transfer switch, gas-line coordination, and the city permit—plus the annual exercise inspection if you want us back.',
      },
    ],
    neighborhoods: ['Medicine Lake', 'Parkers Lake', 'Bass Lake', 'Wayzata School District', 'Vicksburg corridor', 'West Medicine Lake'],
  },

  'bloomington-mn': {
    heroTagline: 'First-ring electrician serving Bloomington’s post-war ramblers and Mall-area commercial sites.',
    heroIntro: 'Bloomington’s deep mix of 1950s ramblers, mid-century apartments, and modern commercial space keeps us busy across the city. Residential, HOA, and commercial under one Minnesota Master Electrician license.',
    housingProfile: 'Bloomington was developed in waves—compact post-war ramblers north of 90th Street, mid-century apartments and townhomes through the central corridors, and newer infill and commercial expansion around the Mall of America and the I-494 strip. Many of the older homes still have their original 1950s service panels and cloth-insulated wiring in the basement runs. The commercial inventory ranges from small storefronts that need lighting retrofits to office and warehouse spaces with three-phase service that we maintain on contract.',
    commonIssues: [
      {
        heading: 'Cloth-wire and fuse-box upgrades',
        body: 'A surprising number of Bloomington ramblers still operate on the original fuse box and cloth-insulated branch wiring from the 1950s. We upgrade to a modern breaker panel and replace the most-handled circuits (kitchens, bathrooms) without rewiring the whole house.',
      },
      {
        heading: 'Commercial LED retrofits',
        body: 'Storefronts along Lyndale, Penn, and Old Shakopee Road are seeing real ROI from LED retrofits—both the energy savings and the maintenance reduction. We replace fluorescent fixtures with high-output LEDs and recommission the lighting controls in the process.',
      },
      {
        heading: 'EV charger installs in townhomes and HOAs',
        body: 'Bloomington’s townhome HOAs are wrestling with shared-meter complications when residents request EV chargers. We work with the board, the electrical inspector, and the resident to find a clean install—either dedicated meter, sub-meter, or paid time-of-use.',
      },
    ],
    neighborhoods: ['East Bloomington', 'West Bloomington', 'Penn Lake', 'Oxboro', 'Mall of America area', 'Hyland Lake'],
  },

  'eagan-mn': {
    heroTagline: 'Eagan electrician for Lebanon Hills neighborhoods and Cedar Grove corridors alike.',
    heroIntro: 'Eagan grew up fast between 1975 and 2000, and a lot of that wiring is now in its second life. We help homeowners catch problems before they become emergencies—and respond fast when they already have.',
    housingProfile: 'Eagan’s residential build-out happened mostly between 1975 and the early 2000s. The bulk of the city is single-family on standard suburban lots, with denser townhome and apartment pockets along Yankee Doodle and Cliff Road. Newer construction continues along the southern and eastern edges. The older inventory frequently shows 150-amp service that is now stretched thin, original aluminum branch wiring in a small subset of the 1970s subdivisions, and original GFCI receptacles long past their useful life.',
    commonIssues: [
      {
        heading: 'Aluminum branch wiring remediation',
        body: 'A subset of Eagan homes built in the mid-1970s have aluminum branch wiring, which is safe when terminated correctly but fails when connections loosen. We apply COPALUM crimps or AlumiConn connectors at every outlet, switch, and fixture—the only fixes recognized by the CPSC.',
      },
      {
        heading: 'Hot-tub and pool circuit installs',
        body: 'Eagan’s deck culture means a lot of hot-tub installs, and tubs require a dedicated 240V GFCI-protected circuit and a disconnect within sight. We size the load, set the disconnect, and pull the permit so the inspection clears on the first visit.',
      },
      {
        heading: 'Sump-pump dedicated circuits',
        body: 'Eagan’s clay soils and seasonal high water tables make sump pumps mission-critical, and yet half the homes we visit have the sump on a shared basement circuit. We pull a dedicated circuit and add a battery-backup or generator-ready receptacle so a tripped breaker doesn’t flood the basement.',
      },
    ],
    neighborhoods: ['Cedar Grove', 'Lebanon Hills area', 'Lexington-Diffley', 'Pilot Knob', 'Wescott', 'Thomas Lake'],
  },

  'burnsville-mn': {
    heroTagline: 'Trusted Burnsville electrician for split-levels, lakeside homes, and Crystal Lake neighborhoods.',
    heroIntro: 'Burnsville’s housing mix—split-levels, two-stories, ramblers, and lakeside homes—keeps no two service calls the same. We bring the right gear for whatever the original builder left behind.',
    housingProfile: 'Burnsville built out across three big eras: ramblers in the 1960s, split-levels and two-stories through the 1970s and 80s, and townhome and condo developments through the 1990s along the Crystal Lake and Burnhaven corridors. The bones are good but the electrical conventions of each era left their mark—ungrounded two-prong outlets in the older ramblers, undersized panels in the 70s split-levels, and back-stabbed receptacles in the 80s developments that are now reaching failure age.',
    commonIssues: [
      {
        heading: 'Two-prong outlet retrofits',
        body: 'Many Burnsville ramblers still have ungrounded two-prong outlets throughout, which won’t pass modern code and won’t protect modern electronics. We either run a ground conductor or install GFCI protection with the appropriate "No Equipment Ground" labeling, depending on the circuit.',
      },
      {
        heading: 'Back-stabbed receptacle failures',
        body: 'A common Burnsville call: a string of dead outlets in a single room. Usually the cause is a back-stabbed receptacle (wire pushed into a spring clip instead of screwed to a terminal) that has finally loosened. We replace the offender and re-terminate with screw terminals so the same call doesn’t come back next year.',
      },
      {
        heading: 'Whole-home surge protection installs',
        body: 'Burnsville sits in a corridor that takes regular summer storm activity, and we see fried HVAC boards and fried garage-door openers every July. A whole-home surge protector at the panel ($300 install) saves a lot of $800 repairs.',
      },
    ],
    neighborhoods: ['Crystal Lake', 'Burnhaven', 'Sunset Pond', 'River Hills', 'Heart of the City', 'Buck Hill area'],
  },

  'white-bear-lake-mn': {
    heroTagline: 'Lakeside electrician for White Bear Lake’s converted cottages and year-round shoreline homes.',
    heroIntro: 'A lot of White Bear Lake started as seasonal cottages and turned into year-round homes—which means a lot of patched-together electrical work. We sort it out, pull the right permits, and make sure your home is ready for full-time living.',
    housingProfile: 'White Bear Lake’s waterfront and near-waterfront neighborhoods include a meaningful number of homes that began as summer cottages in the 1920s through 1950s, expanded over decades, and now serve as full-time residences. The downstream electrical story is predictable: undersized original panels, additions wired by different hands at different times, and outdoor circuits feeding docks, sheds, and detached garages that may or may not have been permitted. The newer subdivisions east of the lake follow modern conventions but the lake-adjacent stock keeps us learning every job.',
    commonIssues: [
      {
        heading: 'Dock and shoreline electrical',
        body: 'Dock circuits and lakeside outlets fall under specific NEC marina and equipotential bonding rules that most general electricians don’t handle weekly—we do. Proper bonding, GFCI protection, and weatherproof enclosures keep swimmers and pets safe.',
      },
      {
        heading: 'Combining mismatched additions',
        body: 'A cottage-to-year-round conversion in White Bear Lake usually has two or three electrical eras stacked on each other, sometimes with the original panel still feeding the original room layout. We rationalize the wiring, consolidate to a single modern panel, and label every circuit so future work is straightforward.',
      },
      {
        heading: 'Generator hookups for lake-front outages',
        body: 'Outages on the lake-front side of WBL can run long when storms knock down trees. We install transfer switches sized for the home and either a portable inlet or a permanent standby, with the appropriate fuel and venting compliance.',
      },
    ],
    neighborhoods: ['Downtown WBL', 'Birch Lake', 'Manitou Island area', 'Bald Eagle Lake side', 'Goose Lake', 'Mahtomedi border'],
  },

  'richfield-mn': {
    heroTagline: 'Richfield electrician for post-war ramblers, panel upgrades, and ADU electrical work.',
    heroIntro: 'Richfield’s grid of 1950s ramblers is one of the most consistent housing stocks in the metro—and a lot of them are getting their first major electrical refresh right now. We do the panel, the grounds, the GFCIs, and the inspection.',
    housingProfile: 'Richfield was built fast and densely in the late 1940s and 1950s, with block after block of one-and-a-half-story ramblers and small two-stories on tight lots. Most of those homes still have their original electrical service panel—often a 60-amp or 100-amp fuse box—and original two-wire ungrounded branch circuits in the older bedroom and living-room runs. The good news is that the layout is predictable, so a panel upgrade plus selective rewires usually solves 90% of the modern needs.',
    commonIssues: [
      {
        heading: 'Fuse-box to breaker-panel upgrades',
        body: 'A surprising fraction of Richfield homes still have a 1950s fuse box at the side of the house. We upgrade to a 200-amp breaker panel, replace the meter base and service entrance conductors if the utility requires it, and coordinate the disconnect with Xcel.',
      },
      {
        heading: 'GFCI and AFCI code compliance',
        body: 'Older Richfield kitchens, bathrooms, and basements lack the GFCI and AFCI protection modern code requires. We retrofit the protection at the panel or at the first device on each circuit, so a kitchen remodel or finished basement project will pass inspection without surprises.',
      },
      {
        heading: 'ADU and detached-garage electrical',
        body: 'Richfield is approving more accessory-dwelling and detached-garage conversions, and those require dedicated subpanels, GFCI-protected exterior runs, and proper grounding electrodes. We design and install the feed so the city permit clears.',
      },
    ],
    neighborhoods: ['East Richfield', 'West Richfield', 'Wood Lake area', 'Augsburg Park', 'Veterans Park', 'Cedar Avenue corridor'],
  },

  'maple-grove-mn': {
    heroTagline: 'Maple Grove’s go-to electrician for EV chargers, smart-home wiring, and lower-level finishes.',
    heroIntro: 'Maple Grove homes were built for a different electrical era than they’re living in now—EVs, induction ranges, and finished basements all push the original 1990s and 2000s electrical plans past their limits. We bring them up to today.',
    housingProfile: 'Most of Maple Grove’s residential inventory was built between 1990 and 2010, with the bulk in the Arbor Lakes, Rush Creek, and Edinburgh corridors. The construction quality is generally excellent, but electrical conventions of that era favored 200-amp panels that are now operating near their nameplate capacity—particularly in homes that have added EV chargers, electric ranges, or finished lower levels with theater rooms, gyms, and full kitchens.',
    commonIssues: [
      {
        heading: 'Panel capacity and load management',
        body: 'A 200-amp panel can power a typical Maple Grove home today, but adding an EV charger and an electric range often pushes the calculated load past code-allowed levels. We do the formal NEC load calc, recommend either a panel upgrade or a smart load-management device, and install the cleaner option for the long term.',
      },
      {
        heading: 'EV charger and Level 2 installs',
        body: 'Maple Grove sees high EV adoption, particularly Tesla and Rivian. We run dedicated 240V circuits from the main or sub-panel, mount the hardware, and pull the city permit—typically a same-day install if the panel has capacity.',
      },
      {
        heading: 'Finished-basement circuits and AFCI compliance',
        body: 'Lower-level finishes in Maple Grove almost always need additional circuits for media equipment, fridges, and HVAC accessories. Current code requires AFCI protection on bedroom and living-area circuits in the basement, which we install at the panel as we add the new branches.',
      },
    ],
    neighborhoods: ['Arbor Lakes', 'Rush Creek', 'Edinburgh', 'Weaver Lake', 'Pike Lake', 'Elm Creek'],
  },

  'new-brighton-mn': {
    heroTagline: 'New Brighton electrician for 1960s ramblers, Long Lake homes, and small-business commercial work.',
    heroIntro: 'New Brighton’s mid-century housing has a lot of life left in it—with the right electrical updates. We do the panel, the grounds, and the EV-ready retrofit without disturbing the rest of the house.',
    housingProfile: 'New Brighton’s residential core dates mostly from the 1960s and 1970s, with smaller pockets of 1950s and 1980s development. The classic New Brighton home is a one-and-a-half-story rambler or split-entry, often on a wooded lot, with a detached or tuck-under garage. Electrical service is typically 150-amp from that era, and many of the original kitchens and bathrooms still operate on their original two-wire, ungrounded branch circuits.',
    commonIssues: [
      {
        heading: 'Detached and tuck-under garage rewires',
        body: 'New Brighton garages are often wired with a single circuit shared from the house, which doesn’t support modern garage use (EV charger, freezer, workshop tools). We pull a dedicated 60-amp or 100-amp subpanel and run GFCI-protected circuits properly.',
      },
      {
        heading: 'Heat-pump and furnace circuit upgrades',
        body: 'A lot of New Brighton homeowners are switching from natural-gas furnaces to electric heat pumps, which need a dedicated high-amperage circuit and frequently a panel upgrade. We size the load, run the dedicated feed, and coordinate with the HVAC contractor.',
      },
      {
        heading: 'Whole-home surge and grounding repair',
        body: 'New Brighton’s rocky soils mean some original ground rods aren’t fully bonded to earth, and we see surge damage that proper grounding would have prevented. We test ground resistance, drive supplemental rods if needed, and install whole-home surge protection at the panel.',
      },
    ],
    neighborhoods: ['Long Lake', 'Hansen Park', 'Sunny Square', 'Lake Sunnen', 'Innsbruck', 'Old Highway 8'],
  },

  'mounds-view-mn': {
    heroTagline: 'Mounds View electrician for compact ramblers, basement finishes, and panel upgrades.',
    heroIntro: 'Mounds View homes are tight, well-built, and increasingly being upgraded for the next 30 years of service. We handle the electrical side: panel, grounding, GFCI, and the EV-ready future.',
    housingProfile: 'Mounds View’s residential inventory is dominated by small-to-mid-size ramblers and split-levels built between 1958 and 1975, with very little newer construction. The lots are compact and the homes were efficient by design, which means everything—kitchen, laundry, garage—was often crowded onto a handful of circuits. Modernizing a Mounds View home almost always means more circuits, not just bigger ones.',
    commonIssues: [
      {
        heading: 'Adding dedicated circuits to compact kitchens',
        body: 'Mounds View kitchens were often built with one or two circuits for everything, which trips constantly under modern small-appliance loads. We add the dedicated 20-amp small-appliance circuits, the dishwasher circuit, and the disposal circuit—without ripping out cabinets.',
      },
      {
        heading: 'Basement finishing and egress lighting',
        body: 'Finished basements in Mounds View require AFCI protection, proper egress-window lighting, and dedicated circuits for any added bedrooms. We design and install the rough-in to meet city code so the project sails through inspection.',
      },
      {
        heading: 'Original aluminum-clad SE cable',
        body: 'A subset of Mounds View homes have aluminum service-entrance cable feeding the meter base. The aluminum cable itself is fine if the connections are torqued and oxide-inhibited, but loose connections at the meter or the lugs are a common failure point we routinely correct.',
      },
    ],
    neighborhoods: ['Silver Lake', 'Edgewood Park', 'Mounds View Square', 'Bel Air', 'Long Lake Road corridor', 'Highway 10 corridor'],
  },

  'roseville-mn': {
    heroTagline: 'Roseville electrician for inner-ring ramblers, McCarrons-area homes, and Lexington corridor work.',
    heroIntro: 'Roseville sits in the sweet spot between old and new—older inner-ring housing meets active modernization. We do panel upgrades, EV chargers, and code-bringing-up-to-date work across the city.',
    housingProfile: 'Roseville’s housing inventory spans roughly 1948 through 1975, with the densest concentration of mid-century ramblers in the streets between Snelling and Lexington. Newer custom builds and infill development have changed the character in pockets, but the dominant home is still a 1950s rambler or 1960s split. The electrical legacy is consistent with that era: 100-amp service, fuse-box origins now upgraded to early breaker panels, and limited GFCI/AFCI coverage outside renovated kitchens and baths.',
    commonIssues: [
      {
        heading: 'Service upgrades from 100A to 200A',
        body: 'Roseville homeowners adding EV charging, electrification, or finishing a basement quickly run into a 100-amp panel that’s at capacity. We upgrade to 200-amp service, including a new meter base if the utility requires it, with minimal disruption to existing wiring.',
      },
      {
        heading: 'Knob-and-tube isolation in older homes',
        body: 'The oldest Roseville homes near Lake McCarrons sometimes still have active knob-and-tube circuits in attic and crawl-space runs. We map the live runs, deactivate them safely, and replace with modern Romex without major drywall demolition.',
      },
      {
        heading: 'GFCI retrofits for unfinished basements and garages',
        body: 'Modern code requires GFCI protection on all garage and unfinished-basement receptacles, and most Roseville homes don’t have it. We retrofit GFCI breakers or first-position GFCI outlets so each circuit is fully protected.',
      },
    ],
    neighborhoods: ['Lake McCarrons', 'Lexington-Owasso', 'Roselawn', 'Snelling corridor', 'Hamline neighborhood', 'Rosedale area'],
  },

  'brooklyn-park-mn': {
    heroTagline: 'Brooklyn Park electrician covering Edinburgh, Mississippi-side neighborhoods, and Champlin border.',
    heroIntro: 'Brooklyn Park is a city of contrasts—older near-river neighborhoods next to fast-growing modern subdivisions. We bring one license, one truck, and the right gear for both.',
    housingProfile: 'Brooklyn Park developed in two distinct waves: 1960s-70s suburban expansion in the south and central neighborhoods, then 1990s-2000s growth through Edinburgh and the northern portions. Near-river neighborhoods east of Highway 252 still have a meaningful share of post-war and mid-century homes. The newer half is well-built but increasingly facing capacity limits as homeowners add EVs, heat pumps, and finished lower levels.',
    commonIssues: [
      {
        heading: 'Older neighborhood panel and meter upgrades',
        body: 'The south and central Brooklyn Park neighborhoods often have 60- or 100-amp panels that no longer meet the demand. We upgrade to 200-amp service, replace the meter base, and coordinate with Xcel for the disconnect.',
      },
      {
        heading: 'EV charger installs in newer subdivisions',
        body: 'Edinburgh and northern Brooklyn Park have high EV-adoption rates. We run dedicated Level 2 chargers, often with hardwired connections to take advantage of the maximum 48-amp charging rate.',
      },
      {
        heading: 'Sub-panel installs for finished basements',
        body: 'Brooklyn Park basements being finished for in-law suites or rental use often need a dedicated sub-panel to support the kitchen, laundry, and HVAC additions. We size and install the sub-panel with the appropriate feeder and grounding.',
      },
    ],
    neighborhoods: ['Edinburgh', 'River Park', 'Brookdale area', 'Oak Grove', 'Mississippi Cove', 'Champlin border'],
  },

  'st-paul-mn': {
    heroTagline: 'St. Paul electrician for Summit Hill Victorians, Highland Park bungalows, and East Side homes.',
    heroIntro: 'St. Paul’s housing stock is some of the oldest in the metro, and that’s where we shine—plaster-and-lath, knob-and-tube, undersized panels. We respect old homes and bring the electrical up to today’s standards without ripping them apart.',
    housingProfile: 'St. Paul has one of the deepest historic housing inventories in the Upper Midwest, with Victorian-era homes on Summit Hill, Cathedral Hill duplexes, Craftsman bungalows through Highland Park and Macalester-Groveland, and post-war housing across the East Side. The electrical history layered into those homes is similarly deep—original knob-and-tube, 1940s remediation, 1970s renovations, and 2000s remodels all coexisting in the same walls.',
    commonIssues: [
      {
        heading: 'Knob-and-tube assessment and replacement',
        body: 'Many St. Paul homes built before 1940 still have active knob-and-tube circuits, particularly on second floors and in attic runs. Insurance carriers increasingly refuse to renew without remediation. We map the active runs, replace them safely, and document the work for your carrier.',
      },
      {
        heading: 'Service upgrades in historic homes',
        body: 'Upgrading service in a 1910 Summit Hill Victorian is a different job than upgrading a 1995 rambler—the meter location, the path to the panel, and the city historic-preservation requirements all change the approach. We’ve done dozens; we know the playbook.',
      },
      {
        heading: 'Duplex and triplex sub-metering',
        body: 'St. Paul has a large stock of legal duplexes and triplexes, and many still operate on a single meter with split bills. We add proper sub-meters, separate panels, or dedicated services so tenants pay their actual usage.',
      },
    ],
    neighborhoods: ['Summit Hill', 'Cathedral Hill', 'Highland Park', 'Macalester-Groveland', 'Como', 'Mac-Grove', 'East Side', 'West 7th'],
  },

  'eden-prairie-mn': {
    heroTagline: 'Eden Prairie electrician for executive homes, smart-home integrations, and high-amperage upgrades.',
    heroIntro: 'Eden Prairie homes are bigger than most—and so are the electrical loads. We do panel upgrades, generator hookups, EV charging, and Lutron/Control4 integrations the way the original builder should have.',
    housingProfile: 'Eden Prairie’s residential inventory leans heavily toward larger executive homes built between 1985 and 2015, with a meaningful concentration of custom builds and luxury lots near Bryant Lake, Lake Riley, and the Glen Lake corridor. Most homes have 200-amp or 400-amp service, but the demand on those panels has grown sharply with home theaters, gyms, heated driveways, hot tubs, and increasingly multiple EV chargers per household.',
    commonIssues: [
      {
        heading: 'Multi-EV-charger installs and load management',
        body: 'Two-EV households are common in Eden Prairie, and feeding two 48-amp chargers from a 200-amp panel almost always requires either a service upgrade or smart load-management. We do the formal load calc and install the right answer—often a load-sharing controller that costs less than a service upgrade.',
      },
      {
        heading: 'Standby generators for whole-home backup',
        body: 'Eden Prairie’s wooded lots and longer utility runs mean longer outages. We install Generac, Kohler, and Cummins air-cooled and liquid-cooled standby generators sized for whole-home loads, with automatic transfer switches and city-required permits.',
      },
      {
        heading: 'Lutron and Control4 retrofits',
        body: 'Existing Eden Prairie homes increasingly want professional lighting control retrofits. We install Lutron RadioRA 3 or HomeWorks alongside Control4 partners, including the neutral-wire retrofits where needed and the keypad rough-ins.',
      },
    ],
    neighborhoods: ['Bryant Lake', 'Lake Riley', 'Glen Lake', 'Hennepin Village', 'Bearpath', 'Edenvale', 'Round Lake'],
  },

  'minneapolis-mn': {
    heroTagline: 'Minneapolis electrician for bungalows, duplexes, urban remodels, and full historic-home rewires.',
    heroIntro: 'Minneapolis homes are a century old on average—and beautiful for it. We bring them up to today’s standards without sacrificing the character that makes them worth living in.',
    housingProfile: 'Minneapolis is dominated by Craftsman bungalows, four-squares, and small duplexes built between 1890 and 1940, with denser concentrations in Linden Hills, Powderhorn, Kingfield, Northeast, and the lakes neighborhoods. The original electrical was knob-and-tube, often partially or fully remediated over the decades but rarely with the documentation we’d like. The electrical work in a Minneapolis home is almost always part historian, part electrician.',
    commonIssues: [
      {
        heading: 'Full home rewires for insurance and remodels',
        body: 'Minneapolis insurance carriers are increasingly strict about knob-and-tube and old aluminum branch wiring. We do full rewires from the service entrance through every device, working through finished walls with minimal demolition—typical job runs 3 to 5 days.',
      },
      {
        heading: 'Duplex meter separation',
        body: 'Many Minneapolis duplexes were originally wired with a single meter, which complicates rental management and Xcel billing. We add a second meter base, separate the loads cleanly, and coordinate the disconnect and re-energize with Xcel.',
      },
      {
        heading: 'Attic and basement insulation interactions',
        body: 'When homeowners add insulation to a Minneapolis attic with active knob-and-tube, they create a fire hazard—the wiring is designed to dissipate heat through open air. We replace the K&T before the insulation goes in, or we map it and warn the insulation contractor.',
      },
    ],
    neighborhoods: ['Linden Hills', 'Powderhorn', 'Kingfield', 'Northeast', 'Como (Mpls)', 'Whittier', 'Lyn-Lake', 'Bryn Mawr', 'Longfellow'],
  },

  'maplewood-mn': {
    heroTagline: 'Maplewood electrician for the East Side mix—ramblers, splits, and Beaver Lake homes.',
    heroIntro: 'Maplewood’s housing variety makes every call a little different. We bring the right gear and the right experience for older ramblers, newer two-stories, and everything between.',
    housingProfile: 'Maplewood developed in roughly four waves, from 1950s ramblers in the southern neighborhoods near 3M, through 1960s and 70s expansion across the central city, into 1990s-2000s development on the northern edge. The variety means we see everything from cloth-wire fuse boxes to fully modern smart-home pre-wires, sometimes in adjacent houses on the same block.',
    commonIssues: [
      {
        heading: 'Mixed-era subpanel cleanup',
        body: 'Older Maplewood homes that have been added to multiple times often have a dizzying mix of subpanels, junction boxes, and abandoned circuits. We rationalize the wiring, label every breaker, and remove what’s no longer in use.',
      },
      {
        heading: 'Heat-pump and dual-fuel HVAC circuits',
        body: 'Maplewood is seeing strong adoption of cold-climate heat pumps. The electrical side requires a dedicated 240V circuit sized to the unit, and often a panel upgrade or load-management device to make room. We coordinate with the HVAC contractor end to end.',
      },
      {
        heading: 'Pool and hot-tub bonding',
        body: 'Maplewood’s backyard culture brings a steady stream of pool and hot-tub jobs, and proper equipotential bonding is mandatory for both. We bond the rebar, the pump, the heater, and any metal piping to a single ground reference, so the inspection passes and the equipment lasts.',
      },
    ],
    neighborhoods: ['Beaver Lake', 'Battle Creek', '3M area', 'Hillside', 'Maplewood Heights', 'Carver area'],
  },

  'woodbury-mn': {
    heroTagline: 'Woodbury electrician for newer construction, EV chargers, and lower-level expansions.',
    heroIntro: 'Woodbury is one of the newest suburbs in the metro, but newer doesn’t mean simpler—the demand on these panels keeps growing. We add capacity, add chargers, and make sure the next decade of upgrades has somewhere to go.',
    housingProfile: 'Woodbury is one of the youngest suburbs in the metro—the bulk of the residential inventory was built between 1995 and 2018, with continuing expansion on the eastern and southern edges. Construction quality is generally excellent, and most homes have 200-amp service from the start. The challenge is that load growth has outpaced what builders planned for, with two-EV households, full lower-level finishes, and heat-pump conversions all stacking on the same panel.',
    commonIssues: [
      {
        heading: 'Service capacity at 200 amps',
        body: 'A modern Woodbury home with two EVs, an electric range, a heat pump, and a finished basement frequently exceeds what a 200-amp panel can deliver under NEC load calc rules. We size up, install a smart load manager, or split the load between sub-panels—depending on which is cleaner long-term.',
      },
      {
        heading: 'EV-ready conduit and stub-outs',
        body: 'Woodbury homes built between 1995 and 2010 rarely have an EV-ready conduit in the garage. We run the conduit, set the disconnect, and stub out the wall for a future charger—so when the new car shows up, the install is a 90-minute job.',
      },
      {
        heading: 'Solar interconnections and battery storage',
        body: 'Woodbury is a strong residential-solar market, and proper interconnection requires utility approval, a dedicated PV disconnect, and supplemental grounding. We handle the electrical side—the panel, the disconnect, the grounding, and the inspection—while the solar contractor handles the array.',
      },
    ],
    neighborhoods: ['Carver Lake', 'Tamarack', 'Stonemill', 'Wedgewood', 'Eagle Valley', 'Powers Lake'],
  },
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) {
    throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  }
  const json = await res.json()
  if (!json.token) throw new Error('Login response had no token')
  return json.token
}

async function findIdBySlug(token, slug) {
  const res = await fetch(
    `${BASE}/api/locations?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const json = await res.json()
  return json?.docs?.[0]?.id ?? null
}

async function patchLocation(token, id, data) {
  const res = await fetch(`${BASE}/api/locations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`PATCH failed (${res.status}): ${await res.text()}`)
  }
  return res.json()
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Connecting to ${BASE}…`)
  const token = await login()
  console.log('✓ Logged in')

  let updated = 0
  let missing = 0
  for (const [slug, data] of Object.entries(CONTENT)) {
    const id = await findIdBySlug(token, slug)
    if (!id) {
      console.warn(`  [SKIP] ${slug} — no matching location`)
      missing++
      continue
    }
    await patchLocation(token, id, data)
    console.log(`  [OK] ${slug} (id ${id})`)
    updated++
  }

  console.log('')
  console.log(`Done. Updated ${updated}, skipped ${missing}.`)
}

main().catch((err) => {
  console.error('FAILED:', err.message)
  process.exit(1)
})
