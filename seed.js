#!/usr/bin/env node
/**
 * seed.js — Populate LME CMS globals and FAQs with the current hardcoded fallback content.
 *
 * Usage:
 *   node seed.js --email=admin@example.com --password=yourpassword
 *
 * Or set env vars:
 *   PAYLOAD_EMAIL=admin@example.com PAYLOAD_PASSWORD=yourpassword node seed.js
 */

const CMS = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

// ── CLI args ────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('='))
)
const EMAIL    = args.email    || process.env.PAYLOAD_EMAIL
const PASSWORD = args.password || process.env.PAYLOAD_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node seed.js --email=<email> --password=<password>')
  process.exit(1)
}

// ── Helpers ─────────────────────────────────────────────────────────────────
async function login() {
  const res = await fetch(`${CMS}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const json = await res.json()
  if (!json.token) throw new Error(`Login failed: ${JSON.stringify(json)}`)
  console.log('✓ Logged in')
  return json.token
}

async function patchGlobal(token, slug, data) {
  const res = await fetch(`${CMS}/api/globals/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`POST ${slug} failed: ${JSON.stringify(json)}`)
  console.log(`✓ Seeded global: ${slug}`)
}

async function createFAQ(token, doc) {
  const res = await fetch(`${CMS}/api/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(doc),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(`POST faq failed: ${JSON.stringify(json)}`)
  }
}

async function countFAQs(token) {
  const res = await fetch(`${CMS}/api/faqs?limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const json = await res.json()
  return json.totalDocs || 0
}

async function createDoc(token, collection, data) {
  const res = await fetch(`${CMS}/api/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(`POST ${collection} failed: ${JSON.stringify(json)}`)
  }
}

async function countDocs(token, collection) {
  const res = await fetch(`${CMS}/api/${collection}?limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const json = await res.json()
  return json.totalDocs || 0
}

// ── Seed data ────────────────────────────────────────────────────────────────

const HOME_PAGE = {
  heroTitleLines: [
    { line: 'PROFESSIONAL ELECTRICAL' },
    { line: 'SERVICES FOR MINNESOTA' },
    { line: 'AND WISCONSIN' },
  ],
  heroTagline: 'Serving Homes, Businesses & HOAs Across the Twin Cities',
  heroBody: "When something electrical goes wrong, it can throw your whole day off. That's where we come in. Loch Monster Electric helps homeowners, businesses, and community associations keep their power safe, reliable, and up to code — without the runaround.",
  servicesTabs: [
    {
      id: 'residential',
      label: 'RESIDENTIAL',
      heading: 'KEEPING THE LIGHTS ON —\nAND EVERYTHING ELSE.',
      body: 'From panel upgrades and rewiring to EV chargers and modern lighting, we help homeowners keep their electrical systems safe, reliable, and ready for their unique life inside.',
      cta: 'ALL RESIDENTIAL SERVICES ›',
      ctaCard: 'ALL RESIDENTIAL\nSERVICES',
      ctaHref: '/residential-electrical-services',
      cards: [
        { color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)', label: 'ELECTRICAL REPAIRS', body: 'Fast diagnostics and reliable repairs for outlets, breakers, wiring, and more.', href: '/residential-electrical-services/electrical-repairs' },
        { color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)', label: 'ELECTRICAL UPGRADES', body: 'Panel upgrades, rewiring, and service upgrades to power your modern home.', href: '/residential-electrical-services/electrical-upgrades' },
        { color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)', label: 'INSTALLATIONS', body: 'EV chargers, ceiling fans, smart home devices, lighting, and new circuits.', href: '/residential-electrical-services/installations' },
        { color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)', label: 'SAFETY & COMPLIANCE', body: 'Inspections, code corrections, GFCI/AFCI upgrades, and smoke detector systems.', href: '/residential-electrical-services/safety-compliance' },
      ],
    },
    {
      id: 'commercial',
      label: 'COMMERCIAL',
      heading: 'COMMERCIAL ELECTRICAL SERVICES THAT KEEP YOUR BUSINESS RUNNING.',
      body: 'From office buildouts and lighting retrofits to panel upgrades and code compliance, we keep your business powered and protected.',
      cta: 'ALL COMMERCIAL SERVICES ›',
      ctaCard: 'ALL COMMERCIAL\nSERVICES',
      ctaHref: '/commercial-electrical-services',
      cards: [
        { color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)', label: 'COMMERCIAL REPAIRS', body: 'Emergency response, diagnostics, and maintenance contracts to keep your business running.', href: '/commercial-electrical-services/commercial-repairs' },
        { color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)', label: 'POWER & DISTRIBUTION', body: 'Panel upgrades, three-phase power, and load calculations for demanding commercial needs.', href: '/commercial-electrical-services/power-distribution' },
        { color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)', label: 'LIGHTING SYSTEMS', body: 'Commercial lighting installs, parking lot lighting, and LED retrofits that cut energy costs.', href: '/commercial-electrical-services/lighting-systems' },
        { color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)', label: 'COMPLIANCE & INFRASTRUCTURE', body: 'Code corrections, tenant build-outs, and generator installs for compliant, resilient buildings.', href: '/commercial-electrical-services/compliance-infrastructure' },
      ],
    },
    {
      id: 'hoa',
      label: 'HOA',
      heading: 'HOA ELECTRICAL MANAGEMENT MADE SIMPLE.',
      body: 'We work with HOAs and property managers to keep common areas, amenities, and residential units safe and up to code.',
      cta: 'HOA SERVICES ›',
      ctaCard: 'ALL HOA\nSERVICES',
      ctaHref: '/hoa-electrical-services',
      cards: [
        { color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)', label: 'COMMON AREAS', body: 'Hallway, lobby, exterior, and amenity electrical kept safe and well-lit year-round.', href: '/hoa-electrical-services/hoa-common-areas' },
        { color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)', label: 'EMERGENCY REPAIRS', body: '24/7 response for power outages, storm damage, and urgent electrical failures.', href: '/hoa-electrical-services/hoa-emergency-repairs' },
        { color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)', label: 'EV CHARGING', body: 'EV station installation, load management, and permit handling for your community.', href: '/hoa-electrical-services/hoa-ev-charging' },
        { color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)', label: 'INSPECTIONS', body: 'Annual inspections, code compliance checks, and ongoing maintenance contracts.', href: '/hoa-electrical-services/hoa-inspections' },
      ],
    },
  ],
  bannerHeading: "WHERE MINNESOTA & WISCONSIN LIVE, WORK & MANAGE—WE'RE THERE",
  bannerBody: "If you've got an emergency—sparking wires, no power, or something that just doesn't feel right—call our 24/7 emergency line. We'll get someone out as soon as possible.",
  bannerNote: 'WE RESPOND FAST. NO RUNAROUND.',
  bannerCtaLabel: 'CALL NOW!  763-292-1191',
  expectItems: [
    { text: 'Time And Materials Pricing—So You Only Pay For What Your Job Actually Needs.' },
    { text: 'Licensed And Insured Electricians Who Treat Your Home Or Building With Respect' },
    { text: "Clear Communication—We'll Walk You Through What We're Doing And Why" },
    { text: "Local Folks Who Care About Doing Things The Right Way—Not Just The Fast Way" },
  ],
  pricingHeading: 'HOW WE PRICE JOBS',
  pricingCards: [
    {
      featured: true,
      badgeText: 'FOR MOST JOBS',
      badgeStyle: 'orange',
      title: 'TIME & MATERIALS',
      anchor: '#time-materials',
      items: [
        { text: 'Transparent hourly rate—no flat-rate guesswork.' },
        { text: 'Itemized materials list on every invoice.' },
        { text: 'No hidden fees or surprise charges.' },
        { text: 'Perfect for repairs, troubleshooting & small jobs.' },
        { text: 'We diagnose, fix it, and give you an honest bill.' },
      ],
    },
    {
      badgeText: '$1,200+',
      badgeStyle: 'outline',
      title: 'LARGER PROJECTS',
      anchor: '#larger-projects',
      items: [
        { text: 'Detailed written estimate before any work starts.' },
        { text: 'Milestone-based billing—pay as we progress.' },
        { text: 'Clearly defined scope, timeline, and deliverables.' },
        { text: 'Best for panel replacements & whole-home rewires.' },
        { text: 'Free on-site walk-through and consultation.' },
      ],
    },
    {
      title: 'FOLLOW-UP VISITS',
      anchor: '#follow-up-visits',
      items: [
        { text: 'Priority scheduling for existing customers.' },
        { text: 'Reduced diagnosis time—we already know your home.' },
        { text: 'Same crew that did the original work.' },
        { text: 'No need to re-explain the project from scratch.' },
        { text: 'Discounted return-visit rate for past clients.' },
      ],
    },
    {
      title: 'WANT TO SAVE ON THE FINAL INVOICE? HANDLE THE CLEANUP.',
      anchor: '#handle-cleanup',
      items: [
        { text: 'You handle debris removal after the job.' },
        { text: 'Reduced labor cost reflected on your invoice.' },
        { text: 'Same quality electrical work, lower total bill.' },
        { text: 'Optional add-on to any pricing tier.' },
      ],
    },
  ],
  storyEyebrow: 'Our Story',
  storyHeading: 'FROM PIPES TO POWER—SAME CREW, SAME HEART.',
  storyParagraphs: [
    { text: "Loch Monster started in plumbing. One truck. One goal: do the kind of work we'd want done in our own homes. Over the years, customers kept asking the same thing: \"Do you guys do electrical too?\" Now we do." },
    { text: "Loch Monster Electric brings the same mindset to wiring — honest pricing, respectful service, and a crew that shows up when they say they will. Different trade. Same commitment to doing the job right." },
  ],
  storyCtaLabel: 'READ MORE',
  storyCtaHref: '/about-us',
  whyHeading: 'WE OFFER A WIDE RANGE OF ELECTRICAL SERVICES, FROM NEW CONSTRUCTION TO TROUBLESHOOTING.',
}

const ABOUT_PAGE = {
  heroTitle: 'FROM PIPES TO POWER—SAME CREW, SAME HEART.',
  heroAuthor: 'By Mike Lochner Jr.',
  heroParagraphs: [
    { text: 'Because we kept hearing it.' },
    { text: '"Do you do electrical?"' },
    { text: '"I wish you could just handle the whole thing."' },
    { text: "So now we can. If we're already the crew you trust for plumbing, it makes sense to handle the rest. Remodels, panel upgrades, service calls—we've got the team, the tools, and the mindset to do it right. Different trade. Same neighbors. Same you." },
  ],
  storyEyebrow: 'About Loch Monster Electric',
  storyHeading: "WORK WE'D WANT IN OUR OWN HOME.",
  storyParagraphs: [
    { text: "We started with plumbing. One truck, one guy, and one goal: take care of people and do the kind of work we'd want done in our own homes. Over the years, customers kept asking — and we kept hearing the same things done." },
    { text: "Turns out, when you show up, do good work, and treat folks right — they ask if you do other things too." },
    { text: "So yeah… now we do electrical." },
    { text: "Loch Monster Electric is the same Loch Monster mindset, just with wires instead of water. Same crew (well, different licenses). Same commitment to showing up when we say we will. Same honest pricing — time and materials, so you only pay for what the job actually saves. Same respect for your time, your home, and your budget." },
    { text: "We're not trying to be the biggest company in town — we're focused on being the most legendary. The crew you call first. The one you tell your neighbors about. The one you know will handle it right, every time." },
  ],
  storyCtaLabel: 'BOOK NOW',
  storyCtaHref: '/#contact',
  storyCtaSecondaryLabel: 'OUR PRICING',
  storyCtaSecondaryHref: '/pricing-estimates',
  bannerHeading: "WHERE MINNESOTA & WISCONSIN LIVE, WORK & MANAGE—WE'RE THERE",
  bannerBody: "If you've got an emergency—sparking wires, no power, or something that just doesn't feel right—call our 24/7 emergency line. We'll get someone out as soon as possible.",
}

const CONTACT_PAGE = {
  heading: "LET'S TALK",
  bodyParagraphs: [
    { text: 'Call, text, email, or fill out the form—whatever works for you.' },
    { text: "Whether you've got a small repair, a bigger project, or something that suddenly stopped working—reach out. We're here to help." },
    { text: "At Loch Monster Electric, you'll always talk to a real team member who knows the work. No call centers. No bots. No runaround." },
  ],
  phone: '763-292-1191',
  phoneHref: 'tel:7632921191',
  email: 'service@lochmonsterelectric.com',
  address: '7600 W 27th St # 213,\nSt Louis Park, MN 55426',
}

const PRICING_PAGE = {
  heroEyebrow: 'Pricing & Estimates',
  heroTitleLines: [
    { line: 'PRICING &' },
    { line: 'ESTIMATES' },
  ],
  heroTagline: 'Honest Work. Clear Costs. No Surprises.',
  heroBody: "We don't want customers on your doorstep at 7am yelling about their invoice. We'll show you exactly what we plan to charge before we start, and if something changes on-site, we call you first—every time.",
  pricingHeading: 'HOW WE PRICE JOBS',
  pricingCards: [
    {
      featured: true,
      badgeText: 'FOR MOST JOBS',
      badgeStyle: 'orange',
      title: 'TIME & MATERIALS',
      anchor: '#time-materials',
      items: [
        { text: 'Transparent hourly rate—no flat-rate guesswork.' },
        { text: 'Itemized materials list on every invoice.' },
        { text: 'No hidden fees or surprise charges.' },
        { text: 'Perfect for repairs, troubleshooting & small jobs.' },
        { text: 'We diagnose, fix it, and give you an honest bill.' },
      ],
    },
    {
      badgeText: '$1,200+',
      badgeStyle: 'outline',
      title: 'LARGER PROJECTS',
      anchor: '#larger-projects',
      items: [
        { text: 'Detailed written estimate before any work starts.' },
        { text: 'Milestone-based billing—pay as we progress.' },
        { text: 'Clearly defined scope, timeline, and deliverables.' },
        { text: 'Best for panel replacements & whole-home rewires.' },
        { text: 'Free on-site walk-through and consultation.' },
      ],
    },
    {
      title: 'FOLLOW-UP VISITS',
      anchor: '#follow-up-visits',
      items: [
        { text: 'Priority scheduling for existing customers.' },
        { text: 'Reduced diagnosis time—we already know your home.' },
        { text: 'Same crew that did the original work.' },
        { text: 'No need to re-explain the project from scratch.' },
        { text: 'Discounted return-visit rate for past clients.' },
      ],
    },
    {
      title: 'WANT TO SAVE ON THE FINAL INVOICE? HANDLE THE CLEANUP.',
      anchor: '#handle-cleanup',
      items: [
        { text: 'You handle debris removal after the job.' },
        { text: 'Reduced labor cost reflected on your invoice.' },
        { text: 'Same quality electrical work, lower total bill.' },
        { text: 'Optional add-on to any pricing tier.' },
      ],
    },
  ],
  tiers: [
    {
      id: 'time-materials',
      label: 'Time & Materials',
      gradient: 'linear-gradient(160deg,#1a1a1a,#2e2e2e)',
      eyebrow: 'For Most Jobs',
      heading: 'TIME & ',
      headingOrange: 'MATERIALS',
      body: 'This is how we price the majority of our work—repairs, small installs, troubleshooting, and general service calls.',
      payFor: 'You Pay For:',
      bullets: [
        { text: 'The actual time our licensed electrician spends on-site' },
        { text: 'The real cost of materials used to complete your job' },
        { text: 'A flat service charge (charged once per invoice—whether we fix one thing or five)' },
      ],
      notes: [
        { text: "We're happy to give good-faith estimates over the phone based on what you describe." },
        { text: "There's no \"We'll See When We Get There\" approach. If we can give you a reasonable range, we will." },
      ],
    },
    {
      id: 'larger-projects',
      label: 'Larger Projects',
      gradient: 'linear-gradient(160deg,#1a2a1a,#2e3e2e)',
      eyebrow: '$1,200+',
      heading: 'LARGER ',
      headingOrange: 'PROJECTS',
      body: 'When the job is a larger-scale operation—whole-home rewiring, panel replacements, new construction rough-in—we offer a clear written estimate before any work begins.',
      payFor: "What's Included:",
      bullets: [
        { text: 'Detailed written estimate before any work starts' },
        { text: 'Milestone-based billing so you pay as we progress' },
        { text: 'Clearly defined scope, timeline, and deliverables' },
        { text: 'Free on-site walk-through and consultation included' },
        { text: 'Best for panel replacements, whole-home rewires, and new builds' },
      ],
      notes: [
        { text: "We're happy to give good-faith estimates over the phone." },
      ],
    },
    {
      id: 'follow-up-visits',
      label: 'Follow-Up Visits',
      gradient: 'linear-gradient(160deg,#1a1a2a,#1a2a3a)',
      eyebrow: 'We Are At Your Door Step',
      heading: 'FOLLOW-UP ',
      headingOrange: 'VISITS',
      body: 'This is how we price return visits for existing customers—faster, cheaper, and handled by the same crew who already knows your home.',
      payFor: 'What You Get:',
      bullets: [
        { text: 'Priority scheduling for existing customers' },
        { text: 'Reduced diagnosis time—we already know your home' },
        { text: 'Same crew that handled the original work returns' },
        { text: 'No need to re-explain the project from scratch' },
        { text: 'Discounted return-visit rate for past clients' },
      ],
      notes: [
        { text: "Thanks to our approach, if we can give you a transparent range, we will." },
      ],
    },
    {
      id: 'handle-cleanup',
      label: 'Handle The Cleanup',
      gradient: 'linear-gradient(160deg,#2a1a1a,#3a2a1a)',
      eyebrow: 'Handle The Cleanup.',
      heading: 'WANT TO SAVE ON ',
      headingOrange: 'THE FINAL INVOICE?',
      body: 'When the job wraps up, debris removal is optional. Take it on yourself and we reflect the savings directly on your invoice.',
      payFor: 'How It Works:',
      bullets: [
        { text: 'You handle debris removal after the job wraps up' },
        { text: 'Reduced labor cost reflected directly on your invoice' },
        { text: 'Same quality electrical work—lower total bill' },
        { text: 'Optional add-on available on any pricing tier' },
        { text: 'Discuss it with your electrician before work starts' },
      ],
      notes: [
        { text: "We'll walk you through exactly what 'cleanup' means for your specific job." },
      ],
    },
  ],
}

const SERVICE_AREAS_PAGE = {
  heroHeading: 'WE SERVE THE ENTIRE TWIN CITIES METRO',
  heroSubheading: 'Keeping the Lights On, the Heat, and the Wi-Fi.',
  heroBody: "Your home runs on electricity—and when something goes wrong, it can throw your whole day off. That's why Loch Monster Electric is here to make sure your power's reliable, your setup's safe, and your stress level stays nice and low.",
  bannerHeading: "WHERE MINNESOTA & WISCONSIN LIVE, WORK & MANAGE—WE'RE THERE",
  bannerBody: "If you've got an emergency—sparking wires, no power, or something that just doesn't feel right—call our 24/7 emergency line. We'll get someone out as soon as possible.",
}

const FAQS = [
  { question: 'WHAT ELECTRICAL SERVICES DO YOU OFFER?', answer: 'We offer a full range of electrical services including repairs, panel upgrades, EV charger installation, new circuits, lighting, smart home wiring, and safety inspections for residential, commercial, and HOA clients throughout the Twin Cities metro.', tags: ['home', 'general'], sortOrder: 1 },
  { question: 'WHY ARE MY LIGHTS FLICKERING?', answer: "Flickering lights can be caused by loose connections, overloaded circuits, or issues with your electrical panel. If you notice frequent flickering, it's best to have a licensed electrician inspect your system to prevent potential hazards.", tags: ['home', 'general', 'residential'], sortOrder: 2 },
  { question: 'HOW DO I KNOW IF MY ELECTRICAL PANEL NEEDS AN UPGRADE?', answer: "Signs include frequently tripping breakers, flickering lights, burning smells near the panel, a panel over 25 years old, or adding large appliances or EV charging to your home. We'll do a free on-site evaluation and walk you through your options.", tags: ['home', 'general', 'residential'], sortOrder: 3 },
  { question: 'DO YOU OFFER FINANCING FOR ELECTRICIAN SERVICES?', answer: "We don't offer in-house financing today, but we can point you toward trusted third-party financing options that work well for larger projects like panel replacements or whole-home rewires. Just ask when you call.", tags: ['home', 'general', 'pricing'], sortOrder: 4 },
  { question: 'DO YOU SERVICE COMMERCIAL AND HOA PROPERTIES?', answer: 'Yes. We work with property managers, HOAs, and commercial owners across the Twin Cities metro — from emergency repairs to scheduled maintenance, panel work, lighting, and code corrections.', tags: ['home', 'general', 'commercial', 'hoa'], sortOrder: 5 },
  { question: 'WHAT AREAS DO YOU SERVICE?', answer: "We serve the entire Twin Cities metro — Minneapolis, St. Paul, and surrounding suburbs including Maple Grove, Woodbury, Eden Prairie, Shoreview, and more — plus parts of western Wisconsin.", tags: ['home', 'general', 'service-areas'], sortOrder: 6 },
  { question: 'HOW MUCH DOES AN ELECTRICIAN COST?', answer: "Our pricing is time and materials — you pay for the actual time spent and the real cost of parts. We give good-faith phone estimates and always call you before adding scope. No flat-rate guessing games.", tags: ['pricing', 'general'], sortOrder: 7 },
  { question: 'DO YOU OFFER FREE ESTIMATES?', answer: "We give good-faith estimates over the phone for most jobs. For larger projects ($1,200+), we offer a free on-site walk-through and written estimate before any work begins.", tags: ['pricing', 'general'], sortOrder: 8 },
  { question: 'ARE YOU LICENSED AND INSURED?', answer: "Yes. Loch Monster Electric holds a Minnesota Electrical Contractor license (EA807591) and a Wisconsin Electrical Contractor license (1443 — EC). We're fully insured for residential, commercial, and HOA work.", tags: ['general', 'residential', 'commercial'], sortOrder: 9 },
]

const SERVICE_HUBS = [
  {
    title: 'Residential Electrical Services',
    slug: 'residential-electrical-services',
    heroEyebrow: 'Residential',
    heroTitleLines: [{ line: 'RESIDENTIAL' }, { line: 'ELECTRICAL SERVICES' }],
    heroTagline: 'Keeping the Lights On, And the Heat, and the Wi-Fi.',
    heroBody: "Rome wasn't built in a day—and when something goes wrong, it can throw your whole day off. That's why Loch Monster Electric is here to make sure your power is safe, your setup is solid, and your home stays right—and done right. We work with homeowners across the Twin Cities to fix the little things before they turn into big ones, and handle the big ones when they show up.",
    whatEyebrow: 'What We Handle',
    whatHeading: 'FIX ELECTRICAL ISSUES BEFORE THEY TURN INTO BIGGER PROBLEMS.',
    whatBody: 'From panel upgrades and rewiring to light fixtures, EV chargers, and smart home setups—we make homes work the way they should.',
    whatCta: 'ALL RESIDENTIAL SERVICES ›',
    ctaCardLabel: 'ALL ELECTRICAL\nSERVICES',
    tabs: [
      { id: 'repairs', label: 'ELECTRICAL REPAIRS', href: '/residential-electrical-services/electrical-repairs', cards: [
        { label: 'OUTLET & SWITCH REPAIR', body: 'Fast diagnosis and repair of dead outlets, faulty switches, and wiring issues throughout your home.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'CIRCUIT BREAKER REPAIR', body: 'Tripping breakers, overloaded panels, and fuse box problems diagnosed and fixed right.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'EMERGENCY ELECTRICAL REPAIR', body: "Sparking wires, no power, burning smells—we respond fast when it can't wait until Monday.", color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'SAFETY & COMPLIANCE', body: 'Inspections, code corrections, GFCI/AFCI upgrades, and smoke detector systems.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'upgrades', label: 'ELECTRICAL UPGRADES', href: '/residential-electrical-services/electrical-upgrades', cards: [
        { label: 'PANEL UPGRADES', body: 'Replace outdated panels and fuse boxes with modern, code-compliant electrical service.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'SERVICE UPGRADES', body: "Increase your home's electrical capacity to handle modern loads—EVs, heat pumps, and more.", color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'WHOLE-HOME REWIRING', body: 'Safely replace aging or aluminum wiring throughout your home, room by room or all at once.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'SUBPANEL INSTALLATION', body: 'Add a subpanel for a garage, workshop, or addition without overloading your main panel.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'installations', label: 'INSTALLATIONS', href: '/residential-electrical-services/installations', cards: [
        { label: 'EV CHARGER INSTALLATION', body: 'Level 2 home charger installation—circuit, permit, and inspection handled start to finish.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'SMART HOME WIRING', body: 'Smart switches, thermostats, doorbells, and whole-home networking wired correctly the first time.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'LIGHTING & CEILING FANS', body: 'Recessed lighting, fixtures, ceiling fans, and dimmers installed cleanly and to code.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'NEW CIRCUITS', body: 'Add dedicated circuits for appliances, home offices, hot tubs, or any high-draw equipment.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'safety', label: 'SAFETY & COMPLIANCE', href: '/residential-electrical-services/safety-compliance', cards: [
        { label: 'GFCI / AFCI UPGRADES', body: 'Protect kitchens, bathrooms, and bedrooms with modern arc and ground fault protection.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'SMOKE & CO DETECTORS', body: 'Hardwired detector installation and interconnection throughout your home for full coverage.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'CODE INSPECTIONS', body: 'Pre-sale, post-purchase, or routine inspections to make sure your home is safe and up to code.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'SURGE PROTECTION', body: 'Whole-home surge protection to guard your appliances, electronics, and HVAC from power spikes.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
    ],
  },
  {
    title: 'Commercial Electrical Services',
    slug: 'commercial-electrical-services',
    heroEyebrow: 'Commercial',
    heroTitleLines: [{ line: 'COMMERCIAL' }, { line: 'ELECTRICAL SERVICES' }],
    heroTagline: 'Powering Your Business Without the Downtime.',
    heroBody: "Your business can't afford to stop. Whether it's a tripped breaker at the worst time, a lighting retrofit that needs to be done over a weekend, or a full office buildout from the ground up—Loch Monster Electric shows up ready to work around your schedule.",
    whatEyebrow: 'What We Handle',
    whatHeading: 'KEEP YOUR BUSINESS RUNNING WITHOUT ELECTRICAL SURPRISES.',
    whatBody: 'From office buildouts and lighting retrofits to panel upgrades and code compliance—we keep your business powered and protected.',
    whatCta: 'ALL COMMERCIAL SERVICES ›',
    ctaCardLabel: 'ALL COMMERCIAL\nSERVICES',
    tabs: [
      { id: 'buildouts', label: 'OFFICE BUILDOUTS', href: '/commercial-electrical-services/compliance-infrastructure', cards: [
        { label: 'TENANT IMPROVEMENTS', body: 'Electrical for new or renovated commercial spaces—circuits, panels, lighting, and data drops.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'NEW CIRCUIT INSTALLATION', body: 'Dedicated circuits for equipment, workstations, signage, and specialty commercial loads.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'COMMERCIAL WIRING', body: 'Rough-in and finish wiring for new construction and major renovation projects.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'DATA & LOW VOLTAGE', body: 'Structured cabling, access control wiring, and low-voltage systems for modern workplaces.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'lighting', label: 'LIGHTING RETROFITS', href: '/commercial-electrical-services/lighting-systems', cards: [
        { label: 'LED RETROFITS', body: 'Upgrade fluorescent and HID fixtures to energy-efficient LED—lower bills, better light quality.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'EXTERIOR LIGHTING', body: 'Parking lot, signage, and security lighting installed and maintained for your property.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'EMERGENCY LIGHTING', body: 'Code-compliant emergency and exit lighting installation and annual testing.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'LIGHTING CONTROLS', body: 'Occupancy sensors, dimmers, and automated lighting systems to cut energy costs.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'panels', label: 'PANEL UPGRADES', href: '/commercial-electrical-services/power-distribution', cards: [
        { label: 'PANEL REPLACEMENT', body: 'Replace outdated commercial panels with properly rated equipment sized for your load.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'LOAD BALANCING', body: 'Diagnose and correct overloaded circuits and unbalanced loads before they become problems.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'SUBPANEL INSTALLATION', body: 'Add subpanels for expansion, equipment zones, or secondary spaces in your building.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'SERVICE UPGRADES', body: "Increase your building's electrical service capacity to support business growth.", color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'compliance', label: 'CODE COMPLIANCE', href: '/commercial-electrical-services/compliance-infrastructure', cards: [
        { label: 'CODE CORRECTIONS', body: 'Identify and correct NEC violations before they become inspection failures or liability issues.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'INSPECTION PREP', body: 'Get your building ready for city inspections with a thorough pre-inspection walkthrough.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'ARC FAULT PROTECTION', body: 'AFCI breaker upgrades for commercial spaces where code requires arc fault protection.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'GROUNDING & BONDING', body: 'Proper grounding and bonding to protect equipment, personnel, and your building.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
    ],
  },
  {
    title: 'HOA Electrical Services',
    slug: 'hoa-electrical-services',
    heroEyebrow: 'HOA & Property Management',
    heroTitleLines: [{ line: 'HOA ELECTRICAL' }, { line: 'SERVICES' }],
    heroTagline: "Managing Common Areas Has Enough Headaches. Electrical Isn't One of Them.",
    heroBody: "HOAs and property managers have a lot to keep track of. When electrical issues come up in common areas, amenities, or tenant units, you need someone who shows up on time, communicates clearly, and gets it done right the first time.",
    whatEyebrow: 'What We Handle',
    whatHeading: 'ELECTRICAL MANAGEMENT BUILT FOR HOAS AND PROPERTY MANAGERS.',
    whatBody: "We work on a schedule that fits your operations—minimizing disruption to residents and keeping your properties safe and up to code.",
    whatCta: 'HOA SERVICES ›',
    ctaCardLabel: 'ALL HOA\nSERVICES',
    tabs: [
      { id: 'common', label: 'COMMON AREAS', href: '/hoa-electrical-services/hoa-common-areas', cards: [
        { label: 'HALLWAY & LOBBY LIGHTING', body: 'Interior common area lighting kept bright, efficient, and compliant for residents and guests.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'EXTERIOR & PARKING LIGHTING', body: 'Parking lot, walkway, and entry lighting installed and maintained for safety and security.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'AMENITY ELECTRICAL', body: 'Pool, clubhouse, fitness center, and shared space electrical kept safe and operational.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'COMMON AREA REPAIRS', body: 'Fast turnaround on outlets, switches, panels, and wiring issues in shared spaces.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'emergency', label: 'EMERGENCY REPAIRS', href: '/hoa-electrical-services/hoa-emergency-repairs', cards: [
        { label: '24/7 EMERGENCY RESPONSE', body: "Around-the-clock emergency electrical service for HOAs and property managers who can't wait.", color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'POWER RESTORATION', body: 'Rapid diagnosis and restoration of power outages affecting units or common areas.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'HAZARD REPAIR', body: 'Sparking wires, burning smells, and exposed conductors addressed immediately and safely.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'STORM DAMAGE REPAIR', body: 'Post-storm electrical assessment and repair to get your property back online fast.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'ev', label: 'EV CHARGING', href: '/hoa-electrical-services/hoa-ev-charging', cards: [
        { label: 'EV STATION INSTALLATION', body: 'Level 2 EV charger installation in parking areas—single units or multi-port stations.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'LOAD MANAGEMENT', body: "Smart load management systems that balance EV charging demand with your building's capacity.", color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'PERMIT & INSPECTION', body: "Full permit pulling and city inspection coordination so you don't have to deal with the paperwork.", color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'BILLING INTEGRATION', body: 'Help selecting and installing EV charging systems with resident billing and usage tracking.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
      { id: 'inspections', label: 'INSPECTIONS', href: '/hoa-electrical-services/hoa-inspections', cards: [
        { label: 'ANNUAL INSPECTIONS', body: 'Scheduled annual electrical inspections for common areas, panels, and shared systems.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
        { label: 'CODE COMPLIANCE CHECKS', body: 'Keep your property current with NEC code requirements and avoid liability exposure.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
        { label: 'MAINTENANCE CONTRACTS', body: 'Ongoing maintenance agreements for predictable budgeting and priority scheduling.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        { label: 'DOCUMENTATION & REPORTS', body: 'Written inspection reports and electrical documentation for board meetings and insurance.', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
      ]},
    ],
  },
]

const CATEGORY_HUBS = [
  // ── Residential ────────────────────────────────────────────────────────────
  { title: 'Electrical Repairs', slug: 'electrical-repairs', parentHub: 'residential-electrical-services', heroEyebrow: 'Residential Electrical Services', heroTitleLines: [{ line: 'ELECTRICAL' }, { line: 'REPAIRS' }], heroTagline: 'Keeping the Lights On, And the Heat, and the Wi-Fi.', heroBody: "From a dead outlet to a breaker that keeps tripping, electrical problems don't wait for a convenient time. Loch Monster Electric diagnoses and fixes residential electrical issues across the Twin Cities—fast, clean, and done right the first time.", subServices: [
    { label: 'Outlet & Switch Repair', heading: 'OUTLET & SWITCH REPAIR', tagline: 'Dead outlet or faulty switch? We diagnose and fix it right—no guesswork.', body: "Your home relies on dozens of outlets and switches every single day—and when something goes wrong, it can stop you in your tracks. We diagnose and repair dead outlets, faulty switches, loose connections, and damaged wiring quickly and safely.", readMoreHref: '/residential-electrical-services/electrical-repairs/outlet-switch-repair', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Circuit Breaker Repair', heading: 'CIRCUIT BREAKER REPAIR', tagline: "A breaker that keeps tripping is telling you something's wrong. Let's fix it.", body: "A breaker that trips once is doing its job. A breaker that trips constantly is telling you something's wrong. We diagnose overloaded circuits, faulty breakers, and wiring issues—and fix them before they become bigger problems.", readMoreHref: '/residential-electrical-services/electrical-repairs/circuit-breaker-repair', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Emergency Electrical Repair', heading: 'EMERGENCY ELECTRICAL REPAIR', tagline: "Sparking wires or sudden power loss? We respond 24/7—no waiting until Monday.", body: "Sparking outlets, burning smells, sudden loss of power—these aren't things you wait on. Our emergency electrical service is available 24/7 for situations that can't wait until Monday.", readMoreHref: '/residential-electrical-services/electrical-repairs/emergency-electrical-repair', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'Electrical Upgrades', slug: 'electrical-upgrades', parentHub: 'residential-electrical-services', heroEyebrow: 'Residential Electrical Services', heroTitleLines: [{ line: 'ELECTRICAL' }, { line: 'UPGRADES' }], heroTagline: 'Power Your Modern Home Without Compromising Safety.', heroBody: "Today's homes run on more power than ever—EVs, heat pumps, induction ranges, home offices. If your electrical system is struggling to keep up, Loch Monster Electric can bring it up to speed.", subServices: [
    { label: 'Electrical Panel Upgrade', heading: 'ELECTRICAL PANEL UPGRADE', tagline: "Outdated or undersized panel? We'll size it right and bring it fully up to code.", body: "An outdated or undersized panel is one of the most common causes of electrical problems in older homes. We replace worn-out panels, upgrade service capacity, and install modern, code-compliant equipment that can handle your home's current and future demands.", readMoreHref: '/residential-electrical-services/electrical-upgrades/electrical-panel-upgrade', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Whole-Home Rewiring', heading: 'WHOLE-HOME REWIRING', tagline: 'Old wiring is a real safety risk. We replace it safely—room by room or all at once.', body: 'Aluminum wiring, cloth-insulated wire, or just decades of aging copper—older wiring presents real safety risks. We safely replace outdated wiring throughout your home, room by room or all at once.', readMoreHref: '/residential-electrical-services/electrical-upgrades/whole-home-rewiring', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Surge Protection', heading: 'SURGE PROTECTION', tagline: 'One power surge can destroy thousands in appliances. Whole-home protection stops it.', body: "A single power surge can destroy appliances, electronics, and HVAC equipment worth thousands of dollars. Whole-home surge protection defends everything plugged into your home from voltage spikes.", readMoreHref: '/residential-electrical-services/electrical-upgrades/surge-protection', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'Electrical Installations', slug: 'installations', parentHub: 'residential-electrical-services', heroEyebrow: 'Residential Electrical Services', heroTitleLines: [{ line: 'ELECTRICAL' }, { line: 'INSTALLATIONS' }], heroTagline: 'New Circuits, New Devices, Done Right From the Start.', heroBody: "Whether you're adding an EV charger, upgrading your lighting, or setting up smart home devices, the electrical work behind it matters. Loch Monster Electric handles residential installations of all sizes—cleanly wired, properly permitted where required, and built to last.", subServices: [
    { label: 'Ceiling Fan Installation', heading: 'CEILING FAN INSTALLATION', tagline: 'Installed on the right box, wired correctly, with separate fan and light control.', body: "A ceiling fan is one of the most energy-efficient comfort upgrades you can add to any room. We install ceiling fans on existing boxes, upgrade older boxes that aren't rated for fan support, and run new wiring where needed.", readMoreHref: '/residential-electrical-services/installations/ceiling-fan-installation', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'EV Charger Installation', heading: 'EV CHARGER INSTALLATION', tagline: 'Level 2 home charger done right—circuit, panel check, permit, and inspection handled.', body: "A Level 2 home EV charger changes the way you live with an electric vehicle. We handle the circuit, the panel capacity check, the charger mounting, and the permit—start to finish.", readMoreHref: '/residential-electrical-services/installations/ev-charger-installation', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Smart Home Wiring', heading: 'SMART HOME WIRING', tagline: "Smart devices work the way they're supposed to when a licensed pro wires them right.", body: "Smart switches, thermostats, doorbells, security cameras, and whole-home audio—done right, it's a seamless experience. We wire smart home systems properly from the start so everything works the way it's supposed to.", readMoreHref: '/residential-electrical-services/installations/smart-home-wiring', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'Safety & Compliance', slug: 'safety-compliance', parentHub: 'residential-electrical-services', heroEyebrow: 'Residential Electrical Services', heroTitleLines: [{ line: 'SAFETY &' }, { line: 'COMPLIANCE' }], heroTagline: "Don't Wait for Something to Go Wrong to Make It Right.", heroBody: "Most electrical hazards don't announce themselves—they build quietly until something fails. Loch Monster Electric helps homeowners stay ahead of problems with safety upgrades, code corrections, and professional inspections.", subServices: [
    { label: 'GFCI / AFCI Installation', heading: 'GFCI / AFCI INSTALLATION', tagline: 'Modern arc and ground fault protection where the code requires it—installed and certified.', body: 'GFCI outlets protect against electrocution in wet areas like kitchens and bathrooms. AFCI breakers protect against arc faults—one of the leading causes of home electrical fires. Both are required by current code in new construction and many renovations.', readMoreHref: '/residential-electrical-services/safety-compliance/gfci-afci-installation', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Electrical Inspections', heading: 'ELECTRICAL INSPECTIONS', tagline: "Get a clear picture of what's safe, what's outdated, and what needs attention.", body: "Whether you're buying a home, preparing for a sale, or just haven't had your electrical system looked at in years, a professional inspection gives you a clear picture of what's safe, what's outdated, and what needs attention.", readMoreHref: '/residential-electrical-services/safety-compliance/electrical-inspections', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
  ]},
  // ── Commercial ─────────────────────────────────────────────────────────────
  { title: 'Commercial Repairs', slug: 'commercial-repairs', parentHub: 'commercial-electrical-services', heroEyebrow: 'Commercial Electrical Services', heroTitleLines: [{ line: 'COMMERCIAL' }, { line: 'REPAIRS' }], heroTagline: "When Something Goes Down at Your Business, Every Minute Counts.", heroBody: "Electrical problems at a commercial property don't just cause inconvenience—they cost money. Loch Monster Electric responds fast to commercial electrical issues, works around your schedule to minimize disruption, and fixes problems right the first time.", subServices: [
    { label: 'Emergency Commercial Electrical', heading: 'EMERGENCY COMMERCIAL ELECTRICAL', tagline: 'Power outages and panel failures cost you money. We respond fast—24/7.', body: 'Power outages, equipment failures, sparking panels—commercial electrical emergencies need a fast, professional response. We offer 24/7 emergency service for commercial properties throughout the Twin Cities.', readMoreHref: '/commercial-electrical-services/commercial-repairs/emergency-commercial-electrical', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Maintenance Contracts', heading: 'MAINTENANCE CONTRACTS', tagline: 'Proactive maintenance prevents the failures that shut businesses down.', body: "Proactive maintenance prevents the kind of failures that shut businesses down. Our commercial maintenance contracts include scheduled inspections, priority emergency response, and detailed documentation for your records.", readMoreHref: '/commercial-electrical-services/commercial-repairs/maintenance-contracts', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
  ]},
  { title: 'Power & Distribution', slug: 'power-distribution', parentHub: 'commercial-electrical-services', heroEyebrow: 'Commercial Electrical Services', heroTitleLines: [{ line: 'POWER &' }, { line: 'DISTRIBUTION' }], heroTagline: 'Give Your Building the Electrical Infrastructure It Actually Needs.', heroBody: "Commercial power distribution is more complex than residential—and getting it wrong is costly. Loch Monster Electric designs and installs commercial power systems that are properly sized, code-compliant, and built to grow with your business.", subServices: [
    { label: 'Commercial Panel Upgrades', heading: 'COMMERCIAL PANEL UPGRADES', tagline: 'Undersized panels limit your business and create real liability. We size it right.', body: 'An undersized or aging commercial panel limits what your business can do and creates real safety risks. We assess your current electrical load, specify the right replacement equipment, and handle the full installation.', readMoreHref: '/commercial-electrical-services/power-distribution/commercial-panel-upgrades', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Three-Phase Power', heading: 'THREE-PHASE POWER', tagline: 'Heavy equipment and large HVAC systems run better on three-phase. We install it.', body: 'Heavy equipment, industrial machinery, and large HVAC systems often require three-phase power to run efficiently. We install three-phase service for commercial and light industrial applications.', readMoreHref: '/commercial-electrical-services/power-distribution/three-phase-power', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Load Calculations', heading: 'LOAD CALCULATIONS', tagline: "Know exactly what your electrical system can handle before you overload it.", body: "Before any major electrical project, a proper load calculation tells you exactly what your building's electrical system can handle—and what it can't. We perform detailed load calculations for new builds, renovations, and before adding major equipment.", readMoreHref: '/commercial-electrical-services/power-distribution/load-calculations', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'Lighting Systems', slug: 'lighting-systems', parentHub: 'commercial-electrical-services', heroEyebrow: 'Commercial Electrical Services', heroTitleLines: [{ line: 'LIGHTING' }, { line: 'SYSTEMS' }], heroTagline: 'Better Light. Lower Bills. Code-Compliant From Day One.', heroBody: "Lighting affects how your customers feel in your space, how safely your employees work, and how much you spend on electricity every month. Loch Monster Electric installs and upgrades commercial lighting systems of all types.", subServices: [
    { label: 'Commercial Lighting Installation', heading: 'COMMERCIAL LIGHTING INSTALLATION', tagline: 'Properly wired, evenly distributed lighting built around how your business operates.', body: "From office and retail to warehouse and restaurant, we install commercial lighting that works for your space—properly wired, evenly distributed, and built around how your business actually operates.", readMoreHref: '/commercial-electrical-services/lighting-systems/commercial-lighting-installation', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Parking Lot Lighting', heading: 'PARKING LOT LIGHTING', tagline: 'Well-lit parking is a safety and liability issue. We keep your property covered after dark.', body: 'Well-lit parking is a safety and liability issue for any commercial property. We install and maintain parking lot lighting—pole lights, wall packs, canopy lights, and controls.', readMoreHref: '/commercial-electrical-services/lighting-systems/parking-lot-lighting', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'LED Retrofits', heading: 'LED RETROFITS', tagline: 'Cut your energy bill without sacrificing light quality. LED upgrades pay for themselves.', body: "Replacing fluorescent and HID lighting with LED is one of the fastest ways to cut your energy bill without sacrificing light quality. We handle commercial LED retrofit projects of any size.", readMoreHref: '/commercial-electrical-services/lighting-systems/led-retrofits', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'Compliance & Infrastructure', slug: 'compliance-infrastructure', parentHub: 'commercial-electrical-services', heroEyebrow: 'Commercial Electrical Services', heroTitleLines: [{ line: 'COMPLIANCE &' }, { line: 'INFRASTRUCTURE' }], heroTagline: "Built Right, Inspected Right, Done Right.", heroBody: "Commercial electrical compliance isn't optional—and cutting corners creates liability that follows your business for years. Loch Monster Electric handles code corrections, tenant improvements, and infrastructure projects with the same attention to detail we bring to every job.", subServices: [
    { label: 'Code Violation Corrections', heading: 'CODE VIOLATION CORRECTIONS', tagline: 'Failed inspection or inherited violations? We identify, document, and correct them.', body: 'Failed inspection? Inherited a building with deferred maintenance? We identify NEC code violations, document what needs to be corrected, and complete the work to get your property into compliance.', readMoreHref: '/commercial-electrical-services/compliance-infrastructure/code-violation-corrections', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Tenant Build-Outs', heading: 'TENANT BUILD-OUTS', tagline: "New tenant moving in? We handle all electrical and coordinate with your GC to hit your date.", body: "New tenant moving in? We handle all electrical for commercial tenant improvements—circuits, panels, lighting, data drops, and specialty systems—coordinated with your general contractor.", readMoreHref: '/commercial-electrical-services/compliance-infrastructure/tenant-build-outs', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Generator Installation', heading: 'GENERATOR INSTALLATION', tagline: 'When the grid goes down, a properly installed generator keeps your business running.', body: "When the power goes out, a properly installed generator keeps your business running. We install standby and portable generator systems for commercial properties—including the transfer switch, utility coordination, and load planning.", readMoreHref: '/commercial-electrical-services/compliance-infrastructure/generator-installation', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  // ── HOA ────────────────────────────────────────────────────────────────────
  { title: 'HOA Common Areas', slug: 'hoa-common-areas', parentHub: 'hoa-electrical-services', heroEyebrow: 'HOA Electrical Services', heroTitleLines: [{ line: 'COMMON AREA' }, { line: 'ELECTRICAL' }], heroTagline: 'Keep Shared Spaces Safe, Functional, and Up to Code.', heroBody: "Common areas are the first impression residents and guests have of your community. Loch Monster Electric keeps HOA common area electrical systems—lighting, panels, amenities, and shared equipment—safe, reliable, and maintained without disrupting daily life.", subServices: [
    { label: 'Hallway & Lobby Lighting', heading: 'HALLWAY & LOBBY LIGHTING', tagline: 'Bright, efficient common area lighting that reflects well on your community.', body: "Interior common area lighting does more than illuminate a hallway—it affects how residents and guests feel about your community. We install, upgrade, and maintain lobby, corridor, stairwell, and common room lighting.", readMoreHref: '/hoa-electrical-services/common-areas/hallway-lobby-lighting', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Exterior & Parking Lighting', heading: 'EXTERIOR & PARKING LIGHTING', tagline: 'Safe, well-lit parking and walkways for residents and guests after dark.', body: 'Parking lot and exterior lighting is a safety and security necessity for any HOA. We install wall packs, pole lights, pathway lighting, and entry lighting—and maintain existing systems so residents always have a well-lit environment after dark.', readMoreHref: '/hoa-electrical-services/common-areas/exterior-parking-lighting', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Amenity Electrical', heading: 'AMENITY ELECTRICAL', tagline: 'Pool, clubhouse, fitness center—amenity electrical kept safe and available year-round.', body: 'Pool equipment, clubhouse panels, fitness center circuits, mailroom outlets—HOA amenity electrical requires coordination and reliability. We maintain and upgrade the electrical systems behind your community amenities.', readMoreHref: '/hoa-electrical-services/common-areas/amenity-electrical', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'HOA Emergency Repairs', slug: 'hoa-emergency-repairs', parentHub: 'hoa-electrical-services', heroEyebrow: 'HOA Electrical Services', heroTitleLines: [{ line: 'EMERGENCY' }, { line: 'REPAIRS' }], heroTagline: "When Residents Are Affected, You Can't Wait Until Morning.", heroBody: "Electrical emergencies in an HOA affect more than one unit—they affect your entire community. Loch Monster Electric provides 24/7 emergency response for HOAs and property managers.", subServices: [
    { label: '24/7 Emergency Response', heading: '24/7 EMERGENCY RESPONSE', tagline: 'Direct line to a licensed electrician—any time, any day, no runaround.', body: "Electrical emergencies don't follow business hours. Our 24/7 emergency line connects you directly with someone who can dispatch a licensed electrician to your property—any time, any day.", readMoreHref: '/hoa-electrical-services/emergency-repairs/247-emergency-response', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Power Restoration', heading: 'POWER RESTORATION', tagline: 'Fast diagnosis and restoration for outages affecting units or common areas.', body: "Outages affecting common areas or multiple units need fast, professional diagnosis. We locate the source of the failure—whether it's a tripped main, a failed breaker, damaged wiring, or a utility issue—and restore power safely.", readMoreHref: '/hoa-electrical-services/emergency-repairs/power-restoration', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Storm Damage Repair', heading: 'STORM DAMAGE REPAIR', tagline: 'Post-storm electrical assessment and repair with documentation for insurance.', body: 'Minnesota storms can do serious electrical damage—downed lines, flooded panels, and blown equipment. We provide post-storm electrical assessment and repair for HOA properties, documenting damage for insurance purposes.', readMoreHref: '/hoa-electrical-services/emergency-repairs/storm-damage-repair', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'HOA EV Charging', slug: 'hoa-ev-charging', parentHub: 'hoa-electrical-services', heroEyebrow: 'HOA Electrical Services', heroTitleLines: [{ line: 'EV CHARGING' }, { line: 'STATIONS' }], heroTagline: 'Give Residents the Amenity They Actually Want.', heroBody: "EV ownership is growing fast—and residents in HOA communities increasingly expect charging access. Loch Monster Electric designs and installs EV charging infrastructure for multifamily and HOA properties.", subServices: [
    { label: 'EV Station Installation', heading: 'EV STATION INSTALLATION', tagline: 'From single Level 2 units to multi-port shared stations—installed right and looking professional.', body: 'From single Level 2 units to multi-port shared charging stations, we install EV charging infrastructure in HOA parking areas that works reliably and looks professional.', readMoreHref: '/hoa-electrical-services/ev-charging/ev-station-installation', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Load Management', heading: 'LOAD MANAGEMENT', tagline: "Smart systems that balance EV demand with your building's capacity—no expensive upgrades.", body: "Adding multiple EV chargers to an existing building requires careful load planning. We assess your current electrical capacity, specify smart load management systems that balance EV demand against your building's other loads.", readMoreHref: '/hoa-electrical-services/ev-charging/load-management', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Permit & Inspection', heading: 'PERMIT & INSPECTION', tagline: 'We pull permits, coordinate city inspections, and get everything signed off correctly.', body: 'EV charging installations for multifamily properties require permits and inspections in most municipalities. We handle all permit applications, coordinate city inspections, and make sure every installation is signed off correctly.', readMoreHref: '/hoa-electrical-services/ev-charging/permit-inspection', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
  { title: 'HOA Inspections & Maintenance', slug: 'hoa-inspections', parentHub: 'hoa-electrical-services', heroEyebrow: 'HOA Electrical Services', heroTitleLines: [{ line: 'INSPECTIONS &' }, { line: 'MAINTENANCE' }], heroTagline: 'Stay Ahead of Problems Before They Affect Your Residents.', heroBody: "Deferred electrical maintenance is how small issues become expensive emergencies—and HOA boards get calls they don't want. Loch Monster Electric provides scheduled inspections, compliance documentation, and maintenance contracts.", subServices: [
    { label: 'Annual Inspections', heading: 'ANNUAL INSPECTIONS', tagline: 'Written reports your board can use for budgeting, insurance, and liability protection.', body: "A scheduled annual electrical inspection covers common area panels, wiring, lighting systems, and shared electrical equipment. We document current condition, flag anything that needs attention, and provide a written report.", readMoreHref: '/hoa-electrical-services/inspections/annual-inspections', color: '#1a1a1a', gradient: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { label: 'Code Compliance Checks', heading: 'CODE COMPLIANCE CHECKS', tagline: 'Keep your property current with NEC code and prioritize repairs by safety risk.', body: 'Electrical codes update on a regular cycle, and older properties often have systems that no longer meet current requirements. We assess your property against current NEC standards and identify what needs to be corrected.', readMoreHref: '/hoa-electrical-services/inspections/code-compliance-checks', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
    { label: 'Maintenance Contracts', heading: 'MAINTENANCE CONTRACTS', tagline: 'Priority scheduling, predictable costs, and a crew that already knows your property.', body: 'A maintenance contract with Loch Monster Electric means priority scheduling, predictable costs, and a crew that already knows your property. We offer annual and multi-year agreements that include scheduled inspections and priority emergency response.', readMoreHref: '/hoa-electrical-services/inspections/maintenance-contracts', color: '#2a1a1a', gradient: 'linear-gradient(160deg,#1f0d0d,#3a2a2a)' },
  ]},
]

// ── Main ─────────────────────────────────────────────────────────────────────
const SHARED_SECTIONS = {
  expectItems: [
    { text: 'Time And Materials Pricing—So You Only Pay For What Your Job Actually Needs.' },
    { text: 'Licensed And Insured Electricians Who Treat Your Home Or Building With Respect' },
    { text: 'Clear Communication—We\'ll Walk You Through What We\'re Doing And Why' },
    { text: 'Local Folks Who Care About Doing Things The Right Way—Not Just The Fast Way' },
  ],
  whyHeading: 'WE OFFER A WIDE RANGE OF ELECTRICAL SERVICES, FROM NEW CONSTRUCTION TO TROUBLESHOOTING.',
  orangeBannerHeading: 'WHERE <span class="ob-white">MINNESOTA</span> &amp; WISCONSIN<br /><span class="ob-white">LIVE, WORK &amp; MANAGE</span>&mdash;WE\'RE THERE',
  orangeBannerBody: "If you've got an emergency—sparking wires, no power, or something that just doesn't feel right—call our 24/7 emergency line. We'll get someone out as soon as possible.",
  orangeBannerNote: 'WE RESPOND FAST. NO RUNAROUND.',
  orangeBannerCtaLabel: '📞 CALL NOW!  763-292-1191',
}

async function main() {
  console.log(`Connecting to CMS at ${CMS}…\n`)

  const token = await login()

  await patchGlobal(token, 'home-page', HOME_PAGE)
  await patchGlobal(token, 'about-page', ABOUT_PAGE)
  await patchGlobal(token, 'contact-page', CONTACT_PAGE)
  await patchGlobal(token, 'pricing-page', PRICING_PAGE)
  await patchGlobal(token, 'service-areas-page', SERVICE_AREAS_PAGE)
  await patchGlobal(token, 'shared-sections', SHARED_SECTIONS)

  const existing = await countFAQs(token)
  if (existing > 0) {
    console.log(`\n⚠ FAQs collection already has ${existing} document(s) — skipping FAQ seed to avoid duplicates.`)
    console.log('  Delete existing FAQs in the CMS admin first if you want to re-seed.')
  } else {
    console.log('\nSeeding FAQs…')
    for (const faq of FAQS) {
      await createFAQ(token, faq)
    }
    console.log(`✓ Created ${FAQS.length} FAQs`)
  }

  const existingHubs = await countDocs(token, 'service-hubs')
  if (existingHubs > 0) {
    console.log(`\n⚠ service-hubs already has ${existingHubs} doc(s) — skipping.`)
    console.log('  Delete existing service hubs in the CMS admin first if you want to re-seed.')
  } else {
    console.log('\nSeeding service hubs…')
    for (const hub of SERVICE_HUBS) {
      await createDoc(token, 'service-hubs', hub)
    }
    console.log(`✓ Created ${SERVICE_HUBS.length} service hubs`)
  }

  const existingCategoryHubs = await countDocs(token, 'category-hubs')
  if (existingCategoryHubs > 0) {
    console.log(`\n⚠ category-hubs already has ${existingCategoryHubs} doc(s) — skipping.`)
    console.log('  Delete existing category hubs in the CMS admin first if you want to re-seed.')
  } else {
    console.log('\nSeeding category hubs…')
    for (const hub of CATEGORY_HUBS) {
      await createDoc(token, 'category-hubs', hub)
    }
    console.log(`✓ Created ${CATEGORY_HUBS.length} category hubs`)
  }

  console.log('\n✅ Seed complete.')
}

main().catch(err => {
  console.error('\n❌', err.message)
  process.exit(1)
})
