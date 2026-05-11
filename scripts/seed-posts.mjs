/**
 * seed-posts.mjs
 * Seeds the 5 existing journal posts into the Payload CMS.
 *
 * Run from the lme-cms root:
 *   node scripts/seed-posts.mjs
 *
 * Env vars (optional — defaults to local dev values):
 *   CMS_URL      e.g. http://localhost:3001
 *   CMS_EMAIL    admin email
 *   CMS_PASSWORD admin password
 */

const BASE     = process.env.CMS_URL      || 'http://localhost:3001'
const EMAIL    = process.env.CMS_EMAIL    || 'admin@lochmonsterelectric.com'
const PASSWORD = process.env.CMS_PASSWORD || 'LMEadmin2025!'

// ── Minimal Lexical JSON builders ──────────────────────────────────────────

const text = (str, bold = false) => ({
  detail: 0, format: bold ? 1 : 0, mode: 'normal', style: '',
  text: str, type: 'text', version: 1,
})

const paragraph = (...children) => ({
  children: children.flat(),
  direction: 'ltr', format: '', indent: 0,
  type: 'paragraph', version: 1,
})

const heading = (tag, str) => ({
  children: [text(str)],
  direction: 'ltr', format: '', indent: 0,
  tag, type: 'heading', version: 1,
})

const listItem = (children, value) => ({
  children: children.flat(),
  direction: 'ltr', format: '', indent: 0,
  type: 'listitem', value, version: 1,
})

const orderedList = (...items) => ({
  children: items.map((ch, i) => listItem(ch, i + 1)),
  direction: 'ltr', format: '', indent: 0,
  listType: 'number', start: 1, tag: 'ol',
  type: 'list', version: 1,
})

const lexicalDoc = (...children) => ({
  root: {
    children: children.flat(),
    direction: 'ltr', format: '', indent: 0,
    type: 'root', version: 1,
  },
})

// ── Post data (mirrors app/data/journal.js in the LME website) ────────────

const posts = [
  {
    slug: 'why-are-my-lights-flickering',
    title: 'Why Are My Lights Flickering? Causes, Dangers, and Fixes for Minnesota & Wisconsin Homes',
    excerpt: "Flickering lights aren't just a nuisance — they're often an early sign of electrical issues. Learn what causes light flicker in Minnesota and Wisconsin homes, from loose bulbs to wiring or panel problems, and when to call a licensed electrician.",
    publishedAt: '2025-10-23T00:00:00.000Z',
    readTime: '8 min read',
    tags: ['safety', 'guides'],
    coverGradient: 'linear-gradient(135deg,#2a1d10 0%,#5a3618 50%,#1f1408 100%)',
    featured: true,
    toc: [
      'Why Are My Lights Flickering In My House?',
      'Loose Or Faulty Light Bulbs',
      'When Flickering Lights Point To Bigger Electrical Problems',
      'When To Call An Electrician For Flickering Lights',
      "Don't Ignore The Flicker — Call Loch Monster Electric",
    ],
    // Original HTML preserved — will be patched into bodyHtml directly
    bodyHtml: `
<p>Step into your living room in St. Paul, Hudson, or Baldwin, flip on a light switch — and instead of steady light, you see a faint flicker. Maybe it's the lamp in the corner, the kitchen overhead, or a whole circuit that pulses every few seconds. You've seen it before. Maybe you've even gotten used to it. But flickering lights aren't normal, and in Minnesota homes — where we run furnaces, baseboard heaters, and high-draw appliances all winter — they're often the first sign that something in your electrical system needs attention.</p>

<h2>Why Are My Lights Flickering In My House?</h2>
<p>Flickering lights fall into two broad categories: harmless and fixable yourself, or a symptom of something more serious. Knowing which you're dealing with starts with understanding the most common causes.</p>

<h2>Loose Or Faulty Light Bulbs</h2>
<p>Loose or faulty bulbs are one of the most common — and least dangerous — causes of flickering. In many cases, it's as simple as a bulb that needs a half-turn to seat correctly in the socket. LED bulbs on dimmer switches not rated for LED loads are another frequent culprit — the dimmer can't regulate the current properly, causing the flicker you see.</p>

<div class="jp-diy-box">
  <p class="jp-diy-label">Homeowner Fix (Step-By-Step):</p>
  <ol>
    <li><strong>Turn Off The Power</strong> to the fixture in question at the breaker.</li>
    <li>Wait for the bulb to cool completely before touching it.</li>
    <li>Gently twist the bulb clockwise until it snugs firmly into the socket.</li>
    <li>If it continues to flicker, replace the bulb before calling an electrician.</li>
    <li>Inspect the socket for burn marks. If you see scorching, stop — call us.</li>
  </ol>
</div>

<h2>When Flickering Lights Point To Bigger Electrical Problems</h2>
<p>If tightening the bulb doesn't fix it, the problem is likely upstream. Loose wiring connections — at the fixture, the switch, the outlet, or inside the breaker panel — are one of the leading causes of house fires in Minnesota. They cause arcing: tiny electrical sparks that generate heat inside your walls without any visible warning.</p>
<p>Other culprits include voltage fluctuations from large appliances cycling on and off (furnaces, refrigerators, A/C units), failing breakers that don't hold load properly, or an overloaded circuit where too many devices share a single 15-amp breaker.</p>

<h2>When To Call An Electrician For Flickering Lights</h2>
<p>Call us — don't wait — if you notice any of the following: flickering happens throughout multiple rooms at the same time, lights dim or brighten noticeably when an appliance kicks on, you hear buzzing or crackling near switches or outlets, or you see any discoloration around faceplates. These are signs of active wiring problems, not quirks to live with.</p>

<h2>Don't Ignore The Flicker — Call Loch Monster Electric</h2>
<p>Loch Monster Electric serves homeowners across the Twin Cities metro — from Shoreview and White Bear Lake to Bloomington and Eden Prairie. If your lights are flickering and you're not sure why, give us a call at 763-292-1191. We'll diagnose the cause, explain what we found in plain language, and fix it right the first time.</p>

<h2>Frequently Asked Questions About Flickering Lights</h2>
<div class="jp-faq">
  <div class="acc-item">
    <button class="acc-btn">What Electrical Services Affect Flicker?</button>
    <div class="acc-body"><p>Loose connections, failing breakers, overloaded circuits, and incompatible dimmer switches are the most common electrical causes of light flicker in residential homes.</p></div>
  </div>
  <div class="acc-item">
    <button class="acc-btn">Why Are My Lights Flickering?</button>
    <div class="acc-body"><p>The most likely causes are a loose bulb, a loose wiring connection, a dimmer incompatibility, or a circuit that's drawing more load than the breaker can comfortably handle.</p></div>
  </div>
  <div class="acc-item">
    <button class="acc-btn">Do I Need My Electrical Panel Upgraded?</button>
    <div class="acc-body"><p>If flickering is widespread and happens when appliances cycle on, your panel may not have enough capacity for your home's current load. A licensed electrician can run a load calculation to find out.</p></div>
  </div>
  <div class="acc-item">
    <button class="acc-btn">Why Are My Lights Flickering After Electrical Service?</button>
    <div class="acc-body"><p>If flickering starts after recent electrical work, a connection may not have been fully tightened. Call the electrician who did the work — or call us for a second opinion.</p></div>
  </div>
</div>

<h2>Glossary Of Electrical Terms</h2>
<div class="jp-glossary">
  <div class="jp-glossary-term">
    <strong>Arcing</strong>
    <p>An electrical discharge between two conductors. A sign of a loose or damaged connection that can cause fires inside walls.</p>
  </div>
  <div class="jp-glossary-term">
    <strong>Circuit Breaker</strong>
    <p>A safety device that interrupts electrical flow when a circuit is overloaded or short-circuited to prevent damage or fire.</p>
  </div>
  <div class="jp-glossary-term">
    <strong>Circuit Overload</strong>
    <p>When the total load on a circuit exceeds its rated capacity, causing the breaker to trip or wiring to overheat.</p>
  </div>
</div>
`,
    body: lexicalDoc(
      paragraph(text("Step into your living room in St. Paul, Hudson, or Baldwin, flip on a light switch — and instead of steady light, you see a faint flicker. Flickering lights aren't normal — they're often the first sign that something in your electrical system needs attention.")),
      heading('h2', 'Why Are My Lights Flickering In My House?'),
      paragraph(text("Flickering lights fall into two broad categories: harmless and fixable yourself, or a symptom of something more serious.")),
      heading('h2', 'Loose Or Faulty Light Bulbs'),
      paragraph(text("Loose or faulty bulbs are one of the most common — and least dangerous — causes of flickering. LED bulbs on dimmer switches not rated for LED loads are another frequent culprit.")),
      heading('h2', 'Homeowner Fix (Step-By-Step)'),
      orderedList(
        [text('Turn Off The Power', true), text(' to the fixture in question at the breaker.')],
        [text('Wait for the bulb to cool completely before touching it.')],
        [text('Gently twist the bulb clockwise until it snugs firmly into the socket.')],
        [text('If it continues to flicker, replace the bulb before calling an electrician.')],
        [text('Inspect the socket for burn marks. If you see scorching, stop — call us.')],
      ),
      heading('h2', 'When Flickering Lights Point To Bigger Electrical Problems'),
      paragraph(text("If tightening the bulb doesn't fix it, the problem is likely upstream. Loose wiring connections are one of the leading causes of house fires in Minnesota.")),
      heading('h2', 'When To Call An Electrician For Flickering Lights'),
      paragraph(text("Call us — don't wait — if flickering happens throughout multiple rooms, lights dim when an appliance kicks on, or you hear buzzing near switches or outlets.")),
      heading('h2', "Don't Ignore The Flicker — Call Loch Monster Electric"),
      paragraph(text("Loch Monster Electric serves homeowners across the Twin Cities metro. Give us a call at 763-292-1191 and we'll diagnose the cause and fix it right the first time.")),
    ),
  },
  {
    slug: 'panel-upgrades-when-your-home-needs-more-power',
    title: 'Panel Upgrades: When Your Home Is Asking for More Power',
    excerpt: "Older panels weren't built for modern loads — EVs, heat pumps, induction ranges, hot tubs. We'll walk through how to spot the signs your panel is at its limit and what a clean, code-compliant upgrade looks like.",
    publishedAt: '2025-10-15T00:00:00.000Z',
    readTime: '6 min read',
    tags: ['upgrades', 'warnings'],
    coverGradient: 'linear-gradient(135deg,#1a2230 0%,#2c3e55 50%,#d77a3c 100%)',
    featured: false,
    toc: [
      'Signs Your Panel Is At Its Limit',
      'What a 200-Amp Upgrade Looks Like',
      'How Long Does a Panel Upgrade Take?',
      'Cost of a Panel Upgrade in Minnesota',
    ],
    bodyHtml: `
<p>Your electrical panel is the central nervous system of your home. When it's undersized or aging, every circuit in your house feels it — tripping breakers, warm outlets, appliances that won't run at full capacity. In the Twin Cities, where we're adding EV chargers, heat pumps, and induction ranges to homes that were wired for far less, panel upgrades have become one of our most common service calls.</p>

<h2>Signs Your Panel Is At Its Limit</h2>
<p>Breakers that trip frequently, lights that dim when the furnace kicks on, a panel that runs warm to the touch, or a fuse box rather than a breaker panel are all signs that your electrical service needs attention. Homes built before 1990 with original 100-amp service are especially likely candidates.</p>

<h2>What a 200-Amp Upgrade Looks Like</h2>
<p>A full panel upgrade involves pulling the utility meter, replacing the service entrance cable if needed, installing a new 200-amp (or higher) panel with arc-fault and ground-fault breakers per current Minnesota code, and labeling every circuit. The utility company coordinates the power shutoff. Most jobs take one day.</p>

<h2>How Long Does a Panel Upgrade Take?</h2>
<p>Most residential panel replacements take 4–8 hours for the electrical work itself. Add time for the utility company to disconnect and reconnect power — typically 1–3 hours depending on your utility's schedule. We coordinate all of that on your behalf.</p>

<h2>Cost of a Panel Upgrade in Minnesota</h2>
<p>Panel upgrades in the Twin Cities typically run $1,800–$4,500 depending on amperage, the condition of the existing service entrance, and whether any sub-panels or wiring updates are needed. We provide written estimates before any work starts.</p>
`,
    body: lexicalDoc(
      paragraph(text("Your electrical panel is the central nervous system of your home. In the Twin Cities, where we're adding EV chargers, heat pumps, and induction ranges, panel upgrades have become one of our most common service calls.")),
      heading('h2', 'Signs Your Panel Is At Its Limit'),
      paragraph(text("Breakers that trip frequently, lights that dim when the furnace kicks on, a panel that runs warm to the touch, or a fuse box rather than a breaker panel are all signs that your electrical service needs attention.")),
      heading('h2', 'What a 200-Amp Upgrade Looks Like'),
      paragraph(text("A full panel upgrade involves pulling the utility meter, replacing the service entrance cable if needed, installing a new 200-amp panel with arc-fault and ground-fault breakers per current Minnesota code, and labeling every circuit.")),
      heading('h2', 'How Long Does a Panel Upgrade Take?'),
      paragraph(text("Most residential panel replacements take 4–8 hours for the electrical work itself. Add time for the utility company to disconnect and reconnect power — typically 1–3 hours.")),
      heading('h2', 'Cost of a Panel Upgrade in Minnesota'),
      paragraph(text("Panel upgrades in the Twin Cities typically run $1,800–$4,500 depending on amperage, the condition of the existing service entrance, and whether any sub-panels or wiring updates are needed.")),
    ),
  },
  {
    slug: 'ev-charger-installation-at-home-what-you-actually-need',
    title: 'EV Charger Installation at Home: What You Actually Need',
    excerpt: "Level 2 charging changes how you live with an electric vehicle. Here's the real-world breakdown of circuits, panels, permits, and pricing for installing a home EV charger in the Twin Cities metro.",
    publishedAt: '2025-10-08T00:00:00.000Z',
    readTime: '5 min read',
    tags: ['upgrades', 'guides'],
    coverGradient: 'linear-gradient(135deg,#c8c8c8 0%,#8e8e8e 50%,#4a4a4a 100%)',
    featured: false,
    toc: [
      'Level 1 vs Level 2 Charging',
      'What Circuit Does an EV Charger Need?',
      'Do You Need a Permit?',
      'Cost of EV Charger Installation in Minnesota',
    ],
    bodyHtml: `
<p>Buying an EV is the easy part. Figuring out how to charge it at home — reliably, overnight, without tripping a breaker — is where homeowners in the Twin Cities start calling us. Here's what you actually need to know before scheduling an install.</p>

<h2>Level 1 vs Level 2 Charging</h2>
<p>Level 1 charging uses a standard 120V outlet and adds about 4–5 miles of range per hour. For most drivers who commute 30–40 miles a day, Level 1 is too slow. Level 2 charging uses 240V and adds 20–30 miles per hour, fully charging most EVs overnight.</p>

<h2>What Circuit Does an EV Charger Need?</h2>
<p>Most Level 2 chargers require a dedicated 240V, 50-amp circuit with a NEMA 14-50 outlet or hardwired connection. The run from your panel to the garage, the condition of your panel, and whether you need a sub-panel all affect the scope and cost of the job.</p>

<h2>Do You Need a Permit?</h2>
<p>Yes — in all Minnesota municipalities we serve, a permit is required for new 240V circuit installation. We handle permit pulling and inspection scheduling on your behalf as part of every EV charger install.</p>

<h2>Cost of EV Charger Installation in Minnesota</h2>
<p>A straightforward EV charger install in the Twin Cities runs $400–$900 for labor and materials if your panel has capacity. Add $800–$2,000 if the panel needs upgrading. We'll scope it accurately before we start.</p>
`,
    body: lexicalDoc(
      paragraph(text("Buying an EV is the easy part. Figuring out how to charge it at home — reliably, overnight, without tripping a breaker — is where homeowners in the Twin Cities start calling us.")),
      heading('h2', 'Level 1 vs Level 2 Charging'),
      paragraph(text("Level 1 adds about 4–5 miles of range per hour. Level 2 uses 240V and adds 20–30 miles per hour, fully charging most EVs overnight.")),
      heading('h2', 'What Circuit Does an EV Charger Need?'),
      paragraph(text("Most Level 2 chargers require a dedicated 240V, 50-amp circuit. The run from your panel to the garage and your panel's capacity affect the scope and cost of the job.")),
      heading('h2', 'Do You Need a Permit?'),
      paragraph(text("Yes — in all Minnesota municipalities we serve, a permit is required for new 240V circuit installation. We handle permit pulling and inspection scheduling on your behalf.")),
      heading('h2', 'Cost of EV Charger Installation in Minnesota'),
      paragraph(text("A straightforward install runs $400–$900 if your panel has capacity. Add $800–$2,000 if the panel needs upgrading.")),
    ),
  },
  {
    slug: 'electrical-safety-checklist-mn-homeowners',
    title: 'Electrical Safety Checklist Every MN Homeowner Should Know',
    excerpt: "Outdated outlets, missing GFCIs, scorched switches — small things that quietly become big problems. Use this homeowner-friendly checklist to spot what needs attention before it turns into an emergency call.",
    publishedAt: '2025-09-30T00:00:00.000Z',
    readTime: '4 min read',
    tags: ['safety', 'compliance'],
    coverGradient: 'linear-gradient(135deg,#20283a 0%,#3a4d70 50%,#c66a35 100%)',
    featured: false,
    toc: [
      'Inside the Panel',
      'Outlets and Switches',
      'GFCI and AFCI Protection',
      'When to Schedule an Inspection',
    ],
    bodyHtml: `
<p>Most electrical problems don't announce themselves dramatically. They build quietly — a breaker that trips a little too often, an outlet that stopped working last year, a switch plate that runs slightly warm. This checklist covers the most common things we flag during inspections on Twin Cities homes.</p>

<h2>Inside the Panel</h2>
<p>Check that your breaker panel is labeled, that no breakers are in a permanently-tripped position, and that there's no visible rust or burn marks inside. Double-tapped breakers (two wires on one breaker terminal) are a code violation in most configurations and a common fire risk in older homes.</p>

<h2>Outlets and Switches</h2>
<p>Any outlet or switch with a cover plate that's warm, discolored, or cracked needs immediate attention. Two-prong ungrounded outlets are a safety issue and limit your ability to use modern appliances safely. We can replace them with grounded receptacles or GFCI-protected outlets.</p>

<h2>GFCI and AFCI Protection</h2>
<p>Every kitchen, bathroom, garage, basement, and outdoor outlet in Minnesota homes built after 2002 is required to have GFCI protection. AFCI protection is required on all bedroom circuits. If your home doesn't have these — and many older homes don't — it's worth adding them.</p>

<h2>When to Schedule an Inspection</h2>
<p>We recommend a full electrical inspection every 10 years for homes under 40 years old, every 5 years for older homes, and any time you're buying or selling. Inspections typically run 2–3 hours and include a written report of any deficiencies found.</p>
`,
    body: lexicalDoc(
      paragraph(text("Most electrical problems don't announce themselves dramatically. This checklist covers the most common things we flag during inspections on Twin Cities homes.")),
      heading('h2', 'Inside the Panel'),
      paragraph(text("Check that your breaker panel is labeled, no breakers are permanently tripped, and there's no visible rust or burn marks inside. Double-tapped breakers are a common fire risk in older homes.")),
      heading('h2', 'Outlets and Switches'),
      paragraph(text("Any outlet or switch with a cover plate that's warm, discolored, or cracked needs immediate attention. Two-prong ungrounded outlets are a safety issue we can easily fix.")),
      heading('h2', 'GFCI and AFCI Protection'),
      paragraph(text("Every kitchen, bathroom, garage, basement, and outdoor outlet in Minnesota homes built after 2002 is required to have GFCI protection. AFCI protection is required on all bedroom circuits.")),
      heading('h2', 'When to Schedule an Inspection'),
      paragraph(text("We recommend a full electrical inspection every 10 years for homes under 40 years old, every 5 years for older homes, and any time you're buying or selling.")),
    ),
  },
  {
    slug: 'smart-home-wiring-what-to-plan-before-drywall',
    title: 'Smart Home Wiring: What to Plan Before the Drywall Goes Up',
    excerpt: "A little planning during a remodel saves a lot of patching later. Here's what to wire for — from smart switches to networked lighting — so your home is ready for whatever you add next.",
    publishedAt: '2025-09-22T00:00:00.000Z',
    readTime: '5 min read',
    tags: ['guides', 'products'],
    coverGradient: 'linear-gradient(135deg,#0e1c2e 0%,#1a3454 50%,#ed8b3f 100%)',
    featured: false,
    toc: [
      'Smart Switch Wiring Requirements',
      'Low-Voltage and Data Runs',
      'Lighting Zones and Scene Control',
      'What to Ask Your Electrician Before Closing Walls',
    ],
    bodyHtml: `
<p>The best time to plan smart home wiring is before the drywall goes up — not after. Whether you're doing a full remodel or just opening a wall for another reason, adding the right infrastructure now costs a fraction of what it costs to retrofit later.</p>

<h2>Smart Switch Wiring Requirements</h2>
<p>Most smart switches require a neutral wire at the switch location — something many older homes don't have. If you're upgrading to smart switches as part of a remodel, we run neutral wires to every switch box that needs one.</p>

<h2>Low-Voltage and Data Runs</h2>
<p>Ethernet runs to every room — even if you don't think you'll use wired connections — are worth doing while walls are open. A hard-wired connection to a TV, gaming console, or home office setup will always be faster and more reliable. We coordinate low-voltage rough-in alongside our electrical work.</p>

<h2>Lighting Zones and Scene Control</h2>
<p>Planning lighting zones before walls close lets you design how your home is lit — separate control for accent lights, task lights, and overhead fixtures — rather than putting everything on one switch.</p>

<h2>What to Ask Your Electrician Before Closing Walls</h2>
<p>Ask about dedicated circuits for home office equipment, in-wall speaker wire runs, low-voltage conduit for future flexibility, and USB outlet locations in bedrooms and kitchens. These are easy to add during rough-in and expensive to add later.</p>
`,
    body: lexicalDoc(
      paragraph(text("The best time to plan smart home wiring is before the drywall goes up. Adding the right infrastructure now costs a fraction of what it costs to retrofit later.")),
      heading('h2', 'Smart Switch Wiring Requirements'),
      paragraph(text("Most smart switches require a neutral wire at the switch location — something many older homes don't have. We run neutral wires to every switch box that needs one during a remodel.")),
      heading('h2', 'Low-Voltage and Data Runs'),
      paragraph(text("Ethernet runs to every room are worth doing while walls are open. A hard-wired connection will always be faster and more reliable. We coordinate low-voltage rough-in alongside our electrical work.")),
      heading('h2', 'Lighting Zones and Scene Control'),
      paragraph(text("Planning lighting zones before walls close lets you design how your home is lit — separate control for accent lights, task lights, and overhead fixtures.")),
      heading('h2', 'What to Ask Your Electrician Before Closing Walls'),
      paragraph(text("Ask about dedicated circuits for home office equipment, in-wall speaker wire runs, low-voltage conduit for future flexibility, and USB outlet locations in bedrooms and kitchens.")),
    ),
  },
]

// ── Main ───────────────────────────────────────────────────────────────────

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error(`  ✗ ${res.status} ${path}`, JSON.stringify(body).slice(0, 200))
    return null
  }
  return body
}

async function login() {
  console.log(`Logging in as ${EMAIL}…`)
  const data = await api('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!data?.token) throw new Error('Login failed — check CMS_EMAIL and CMS_PASSWORD')
  console.log('  ✓ Authenticated\n')
  return data.token
}

async function seedPost(token, post) {
  const { bodyHtml, body, toc, ...rest } = post

  console.log(`Creating: ${post.slug}`)

  // Step 1 — create with Lexical body (hook will convert body → bodyHtml automatically)
  const created = await api('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      ...rest,
      status: 'published',
      toc: toc.map(item => ({ item })),
      body,
      bodyHtml: bodyHtml.trim(),
    }),
  })

  if (!created?.doc?.id) {
    console.log('  ✗ Failed to create post')
    return
  }

  const id = created.doc.id
  console.log(`  ✓ Created (id: ${id})`)

  // Step 2 — PATCH to overwrite bodyHtml with the original hand-crafted HTML.
  // The beforeChange hook only reconverts when data.body is present.
  // Since we're only sending bodyHtml here, the hook leaves it untouched.
  const patched = await api(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ bodyHtml: bodyHtml.trim() }),
  })

  if (patched?.doc) {
    console.log('  ✓ bodyHtml updated with original HTML\n')
  } else {
    console.log('  ✗ bodyHtml patch failed\n')
  }
}

async function run() {
  const token = await login()

  for (const post of posts) {
    await seedPost(token, post)
  }

  console.log('✅  Seed complete! All posts are in Supabase.')
  console.log(`   Visit ${BASE}/admin/collections/posts to review them.`)
}

run().catch(err => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
