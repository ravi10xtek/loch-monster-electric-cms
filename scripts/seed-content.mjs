/**
 * seed-content.mjs
 * Imports CMS content from the LME web copy docs.
 * Run: node scripts/seed-content.mjs
 * Requires the CMS running at http://localhost:3001
 */

const CMS = 'http://localhost:3001'
const EMAIL = process.env.PAYLOAD_SEED_EMAIL || 'admin@lochmonsterelectric.com'
const PASSWORD = process.env.PAYLOAD_SEED_PASSWORD || ''

// ─── Auth ────────────────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${CMS}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) {
    console.error('Login failed. Set PAYLOAD_SEED_EMAIL and PAYLOAD_SEED_PASSWORD env vars.')
    console.error(JSON.stringify(data, null, 2))
    process.exit(1)
  }
  console.log('✓ Logged in')
  return data.token
}

async function api(token, method, path, body) {
  const res = await fetch(`${CMS}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) {
    console.error(`  ✗ ${method} ${path}`, JSON.stringify(data?.errors || data, null, 2))
  }
  return data
}

// Upsert: find by field=value, PATCH if found, POST if not
async function upsert(token, collection, whereField, whereValue, payload) {
  const qs = `where[${whereField}][equals]=${encodeURIComponent(whereValue)}&limit=1`
  const existing = await api(token, 'GET', `/api/${collection}?${qs}`)
  if (existing?.docs?.[0]?.id) {
    const id = existing.docs[0].id
    await api(token, 'PATCH', `/api/${collection}/${id}`, payload)
    console.log(`  ↺ Updated ${collection}: ${whereValue}`)
  } else {
    await api(token, 'POST', `/api/${collection}`, payload)
    console.log(`  + Created ${collection}: ${whereValue}`)
  }
}

// ─── Content ─────────────────────────────────────────────────────────────────

// ── Shared Sections ──────────────────────────────────────────────────────────
async function seedSharedSections(token) {
  console.log('\n── Shared Sections ──')
  await api(token, 'PATCH', '/api/globals/shared-sections', {
    expectItems: [
      { text: 'Transparent Pricing: Time and materials billing ensures you only pay for the actual work your project requires.' },
      { text: 'Professional Respect: Licensed and insured experts who treat your property with the care and attention it deserves.' },
      { text: 'Clear Communication: We explain the "what" and the "why" of every repair, so you\'re never left in the dark.' },
      { text: 'Local Integrity: Midwest professionals focused on doing the job right—not just finishing the job quickly.' },
    ],
    whyHeading: 'We offer a wide range of electrical services. Solid, professional work from your local experts.',
    orangeBannerHeading: 'WHERE <span class="ob-white">MINNESOTA</span> &amp; WISCONSIN<br /><span class="ob-white">LIVE, WORK &amp; MANAGE</span> WE\'RE THERE',
    orangeBannerBody: "If you've got an emergency—sparking wires, no power, or something that just doesn't feel right—call our 24/7 emergency line. We'll get someone out as soon as possible.",
    orangeBannerNote: 'WE RESPOND FAST. NO RUNAROUND.',
    orangeBannerCtaLabel: '📞 CALL NOW!  763-292-1191',
  })
  console.log('  ↺ Shared Sections updated')
}

// ── Residential Service Hub ───────────────────────────────────────────────────
async function seedResidentialHub(token) {
  console.log('\n── Residential Service Hub ──')
  await upsert(token, 'service-hubs', 'slug', 'residential-electrical-services', {
    title: 'Residential Electrical Services',
    slug: 'residential-electrical-services',
    heroEyebrow: 'Residential Electrical Services',
    heroTitleLines: [
      { line: 'Keeping the Lights On.' },
      { line: 'And the Heat. And the Wi-Fi.' },
    ],
    heroTagline: 'Your home runs on electricity. When it glitches, we fix it fast.',
    heroBody: "Your home runs on electricity, and when it glitches, your whole day stops. Whether it's a quick fix or a major upgrade, we're here to keep your setup safe and your stress low. Serving homeowners across the Twin Cities, we handle the small fixes, the big jobs, and modernizations with clear, direct communication. Whether you're dealing with flickering lights, mystery outlets, or adding an EV charger in the garage, we'll get it sorted—fast and without guesswork.",
    whatHeading: 'What We Handle',
    tabs: [
      {
        id: 'repairs',
        label: 'ELECTRICAL REPAIRS',
        href: '/residential-electrical-services/electrical-repairs',
        cards: [
          { label: 'Outlet & Switch Repair', body: 'Fast diagnostics and reliable repairs for outlets, switches, and everything connected to them.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
          { label: 'Circuit Breaker Repair', body: 'Tripping breakers, dead circuits, and panel issues diagnosed and fixed right.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
          { label: 'Emergency Electrical Repair', body: '24/7 emergency response for sparking wires, power outages, and urgent electrical failures.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        ],
      },
      {
        id: 'upgrades',
        label: 'ELECTRICAL UPGRADES',
        href: '/residential-electrical-services/electrical-upgrades',
        cards: [
          { label: 'Panel Upgrades & Swaps', body: 'Modernize your electrical panel to safely power today\'s appliances and tomorrow\'s additions.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
          { label: 'Dedicated Appliance Circuits', body: 'Separate circuits for high-draw appliances keep your system safe and your breakers from tripping.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
          { label: 'Solar Power Hookups', body: 'Connect your solar array to your home\'s electrical system safely and to code.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        ],
      },
      {
        id: 'installations',
        label: 'INSTALLATIONS',
        href: '/residential-electrical-services/installations',
        cards: [
          { label: 'EV Charger Installation', body: 'Level 2 home chargers installed with proper load calculation and permitting handled.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
          { label: 'Lighting & Ceiling Fans', body: 'New fixtures, recessed lighting, dimmer switches, and ceiling fans installed cleanly.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
          { label: 'Generator & Transfer Switch Installs', body: 'Whole-home or partial backup power installed safely with automatic transfer switches.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        ],
      },
      {
        id: 'safety',
        label: 'SAFETY & COMPLIANCE',
        href: '/residential-electrical-services/safety-compliance',
        cards: [
          { label: 'Whole-Home Safety Inspections', body: 'Thorough inspections that identify hidden risks before they become expensive problems.', color: '#2a2a2a', gradient: 'linear-gradient(160deg,#191919,#333)' },
          { label: 'Code Violation Corrections', body: 'We identify and correct violations so your home meets current Minnesota electrical code.', color: '#1a2a1a', gradient: 'linear-gradient(160deg,#0d1f0d,#2a3a2a)' },
          { label: 'Surge Protection Systems', body: 'Whole-home surge protection installed at the panel to protect every appliance you own.', color: '#1a1a2a', gradient: 'linear-gradient(160deg,#0d0d1f,#2a2a3a)' },
        ],
      },
    ],
  })
}

// ── Residential FAQs ──────────────────────────────────────────────────────────
async function seedResidentialFAQs(token) {
  console.log('\n── Residential FAQs ──')

  // Delete existing residential FAQs to avoid duplicates on re-run
  const existing = await api(token, 'GET', '/api/faqs?where[tags][in]=residential&limit=100')
  for (const doc of existing?.docs || []) {
    await api(token, 'DELETE', `/api/faqs/${doc.id}`)
    console.log(`  - Removed old FAQ: ${doc.question?.slice(0, 50)}`)
  }

  const faqs = [
    {
      question: 'What residential electrical services do you offer?',
      answer: 'We provide full-scale electrical support for Twin Cities homeowners, ranging from small outlet repairs and flickering light fixes to major projects. Our expertise includes panel upgrades, EV charger installations, and smart home setups. Whether you\'re modernizing an older home or need urgent troubleshooting, we deliver safe, reliable solutions with transparent Time & Materials pricing.',
      tags: ['residential'],
      sortOrder: 10,
    },
    {
      question: 'Why are my lights flickering?',
      answer: 'Flickering lights usually signal a loose bulb, a faulty switch, or a more serious issue like an overloaded circuit or outdated wiring. In the Twin Cities, temperature shifts can also impact external connections. If tightening the bulb doesn\'t work, it\'s best to have a professional technician inspect your system to prevent potential fire hazards or electrical surges.',
      tags: ['residential'],
      sortOrder: 20,
    },
    {
      question: 'How do I know if my electrical panel needs an upgrade?',
      answer: "If your breakers trip frequently, your lights dim when the AC kicks on, or you're still using a fuse box, it's time for an upgrade. Modern homes demand more power for appliances and tech than older panels can safely provide. We'll assess your current capacity and ensure your system meets modern safety codes and performance needs.",
      tags: ['residential'],
      sortOrder: 30,
    },
    {
      question: 'Do you offer financing for electrical services?',
      answer: "We prioritize transparency and honesty in our pricing. While we primarily operate on a Time & Materials basis to ensure you only pay for the actual work performed, we understand that major upgrades—like full rewiring or panel swaps—are significant investments. Contact our team directly to discuss current payment options and how we can help manage your project's budget.",
      tags: ['residential'],
      sortOrder: 40,
    },
    {
      question: 'Is my home ready for a Level 2 EV charger?',
      answer: "Most older Twin Cities homes require a panel upgrade or a dedicated 240V circuit to handle Level 2 charging safely. Charging from a standard outlet can take days, while a professional Level 2 install does the job overnight. We'll perform a load calculation to ensure your home powers your vehicle without overloading your existing system.",
      tags: ['residential'],
      sortOrder: 50,
    },
    {
      question: 'What are the most common electrical code violations in Minnesota?',
      answer: 'Common local violations include ungrounded outlets, missing GFCI protection in kitchens or bathrooms, and overcrowded junction boxes. In Minnesota, specific codes also require weatherproof covers for outdoor receptacles and proper AFCI protection to prevent house fires. We identify these "silent" risks during our safety inspections to keep your property compliant and your family safe.',
      tags: ['residential'],
      sortOrder: 60,
    },
    {
      question: 'Do I need a whole-home surge protector?',
      answer: "With more people using sensitive smart home tech and home office gear, a single power strip isn't enough. Whole-home surge protectors are installed directly at your electrical panel to block massive spikes from lightning or utility shifts. It's a proactive fix that protects every appliance in your house from expensive, permanent damage.",
      tags: ['residential'],
      sortOrder: 70,
    },
    {
      question: 'Why should I choose Time & Materials over a fixed-price quote?',
      answer: 'Fixed-price quotes often include "padded" costs to cover unknowns, meaning you might overpay for a simple job. With our transparent Time & Materials model, you pay only for the actual hours worked and parts used. It\'s the most honest way to do business, ensuring you get high-quality work without paying for "just in case" markups.',
      tags: ['residential'],
      sortOrder: 80,
    },
  ]

  for (const faq of faqs) {
    await api(token, 'POST', '/api/faqs', faq)
    console.log(`  + FAQ: ${faq.question.slice(0, 60)}`)
  }
}

// ── PageSEO ───────────────────────────────────────────────────────────────────
async function seedPageSEO(token) {
  console.log('\n── Page SEO ──')
  await upsert(token, 'page-seo', 'path', '/residential-electrical-services', {
    path: '/residential-electrical-services',
    metaTitle: 'Residential Electrical Services | Twin Cities, Minnesota',
    metaDescription: 'Professional residential electrical services across the Twin Cities. From EV chargers to repairs, we offer transparent Time & Materials pricing. Get it sorted today.',
  })
}

// ─── Run ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!PASSWORD) {
    console.error('Set PAYLOAD_SEED_PASSWORD to your CMS admin password.')
    console.error('  PAYLOAD_SEED_PASSWORD=yourpassword node scripts/seed-content.mjs')
    process.exit(1)
  }

  const token = await login()
  await seedSharedSections(token)
  await seedResidentialHub(token)
  await seedResidentialFAQs(token)
  await seedPageSEO(token)
  console.log('\n✓ Done.')
}

main().catch((err) => { console.error(err); process.exit(1) })
