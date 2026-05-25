/**
 * auto-link.ts — walks a Lexical body tree and wraps the first occurrence
 * of each known glossary term / service name in a link node.
 *
 * Existing links are preserved (text already inside a link node is skipped).
 */

import type { Payload } from 'payload'

// ── Static glossary list ─────────────────────────────────────────────────
// Mirrors the TERMS array in lme-site/app/components/GlossaryPage.jsx
// Keep in sync if glossary terms change.
const GLOSSARY_TERMS: { keyword: string; anchor: string }[] = [
  { keyword: 'AFCI',                anchor: 'afci' },
  { keyword: 'Arc Fault Circuit Interrupter', anchor: 'afci' },
  { keyword: 'amperage',            anchor: 'amperage' },
  { keyword: 'amps',                anchor: 'amperage' },
  { keyword: 'bonding',             anchor: 'bonding' },
  { keyword: 'circuit breaker',     anchor: 'circuit-breaker' },
  { keyword: 'conduit',             anchor: 'conduit' },
  { keyword: 'dedicated circuit',   anchor: 'dedicated-circuit' },
  { keyword: 'GFCI',                anchor: 'gfci' },
  { keyword: 'Ground Fault Circuit Interrupter', anchor: 'gfci' },
  { keyword: 'grounding',           anchor: 'grounding' },
  { keyword: 'hot wire',            anchor: 'hot-wire' },
  { keyword: 'junction box',        anchor: 'junction-box' },
  { keyword: 'kilowatt-hour',       anchor: 'kilowatt-hour' },
  { keyword: 'kWh',                 anchor: 'kilowatt-hour' },
  { keyword: 'load calculation',    anchor: 'load-calculation' },
  { keyword: 'load center',         anchor: 'load-center' },
  { keyword: 'NEC',                 anchor: 'nec-code' },
  { keyword: 'National Electrical Code', anchor: 'nec-code' },
  { keyword: 'neutral wire',        anchor: 'neutral-wire' },
  { keyword: 'outlet',              anchor: 'outlet' },
  { keyword: 'receptacle',          anchor: 'outlet' },
  { keyword: 'panel upgrade',       anchor: 'panel-upgrade' },
  { keyword: 'Romex',               anchor: 'romex' },
  { keyword: 'service entrance',    anchor: 'service-entrance' },
  { keyword: 'short circuit',       anchor: 'short-circuit' },
  { keyword: 'three-phase power',   anchor: 'three-phase-power' },
  { keyword: 'three-phase',         anchor: 'three-phase-power' },
  { keyword: 'transformer',         anchor: 'transformer' },
  { keyword: 'voltage',             anchor: 'voltage' },
  { keyword: 'volts',               anchor: 'voltage' },
  { keyword: 'wattage',             anchor: 'wattage' },
  { keyword: 'watts',               anchor: 'wattage' },
]

interface Keyword {
  keyword: string
  url: string
  type: 'glossary' | 'service'
}

/**
 * Builds the keyword → URL map. Glossary terms are static; services come
 * from the Payload Services collection.
 */
export async function buildKeywords(payload: Payload): Promise<Keyword[]> {
  const keywords: Keyword[] = []

  // Glossary terms
  for (const { keyword, anchor } of GLOSSARY_TERMS) {
    keywords.push({
      keyword,
      url: `/electrical-glossary#${anchor}`,
      type: 'glossary',
    })
  }

  // Service pages — fetched from CMS
  try {
    const services = await payload.find({
      collection: 'services',
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })

    for (const svc of services.docs as any[]) {
      const title = (svc.title || svc.name || '').trim()
      const slug  = svc.slug
      const parentHub = svc.parentHub
      if (!title || !slug || !parentHub) continue

      // Map hub slug to URL prefix (mirrors lme-site/app/sitemap.js HUB_PARENT)
      const HUB_PARENT: Record<string, string> = {
        'electrical-repairs':        'residential-electrical-services',
        'electrical-upgrades':       'residential-electrical-services',
        'installations':             'residential-electrical-services',
        'safety-compliance':         'residential-electrical-services',
        'commercial-repairs':        'commercial-electrical-services',
        'power-distribution':        'commercial-electrical-services',
        'lighting-systems':          'commercial-electrical-services',
        'compliance-infrastructure': 'commercial-electrical-services',
        'hoa-common-areas':          'hoa-electrical-services',
        'hoa-emergency-repairs':     'hoa-electrical-services',
        'hoa-ev-charging':           'hoa-electrical-services',
        'hoa-inspections':           'hoa-electrical-services',
      }
      const parent = HUB_PARENT[parentHub]
      if (!parent) continue

      keywords.push({
        keyword: title,
        url: `/${parent}/${parentHub}/${slug}`,
        type: 'service',
      })
    }
  } catch (err) {
    console.error('[auto-link] Failed to fetch services:', err)
  }

  // Sort longest first so "panel upgrade" matches before "panel"
  keywords.sort((a, b) => b.keyword.length - a.keyword.length)
  return keywords
}

/**
 * Walks the Lexical body tree and wraps the first occurrence of each
 * keyword in a link node. Mutates by returning a new tree.
 *
 * Returns { body, linksAdded } where linksAdded is the count of new links.
 */
export function autoLinkBody(body: any, keywords: Keyword[]): { body: any; linksAdded: number } {
  if (!body || !body.root) return { body, linksAdded: 0 }

  // Track which keywords have been used — first occurrence only
  const used = new Set<string>()
  let linksAdded = 0

  // Walk the tree depth-first, transforming children arrays in place
  function walk(node: any, inLink: boolean): any {
    if (!node) return node

    // Don't link inside existing links
    const insideLink = inLink || node.type === 'link'

    if (Array.isArray(node.children)) {
      const newChildren: any[] = []
      for (const child of node.children) {
        if (child.type === 'text' && !insideLink) {
          const transformed = transformText(child)
          for (const n of transformed) newChildren.push(n)
        } else {
          newChildren.push(walk(child, insideLink))
        }
      }
      return { ...node, children: newChildren }
    }

    return node
  }

  function transformText(textNode: any): any[] {
    let text: string = textNode.text || ''
    if (!text.trim()) return [textNode]

    const result: any[] = []
    let cursor = 0

    while (cursor < text.length) {
      // Find earliest match of any unused keyword in the remaining text
      let earliestIdx = -1
      let earliestKw: Keyword | null = null
      let earliestLen = 0

      const remaining = text.slice(cursor)
      const lowerRemaining = remaining.toLowerCase()

      for (const kw of keywords) {
        if (used.has(kw.keyword.toLowerCase())) continue
        const kwLower = kw.keyword.toLowerCase()

        // Word-boundary aware search
        const matchIdx = findWholeWord(lowerRemaining, kwLower)
        if (matchIdx === -1) continue

        if (earliestIdx === -1 || matchIdx < earliestIdx ||
           (matchIdx === earliestIdx && kw.keyword.length > earliestLen)) {
          earliestIdx = matchIdx
          earliestKw  = kw
          earliestLen = kw.keyword.length
        }
      }

      if (earliestKw === null || earliestIdx === -1) {
        // No more matches — emit remaining text as a single text node
        if (cursor < text.length) {
          result.push({ ...textNode, text: text.slice(cursor) })
        }
        break
      }

      // Emit text before match
      if (earliestIdx > 0) {
        result.push({ ...textNode, text: remaining.slice(0, earliestIdx) })
      }

      // Emit the link node (preserve original case from source text)
      const matchedText = remaining.slice(earliestIdx, earliestIdx + earliestKw.keyword.length)
      result.push({
        type: 'link',
        version: 2,
        fields: {
          linkType: 'custom',
          newTab: false,
          url: earliestKw.url,
        },
        children: [{ ...textNode, text: matchedText, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
      })

      used.add(earliestKw.keyword.toLowerCase())
      linksAdded++
      cursor += earliestIdx + earliestKw.keyword.length
    }

    return result.length > 0 ? result : [textNode]
  }

  const newRoot = walk(body.root, false)
  return { body: { ...body, root: newRoot }, linksAdded }
}

/**
 * Whole-word case-insensitive search. Returns index or -1.
 * Both haystack and needle are expected to be lowercased.
 */
function findWholeWord(haystack: string, needle: string): number {
  let from = 0
  while (true) {
    const idx = haystack.indexOf(needle, from)
    if (idx === -1) return -1
    const before = idx > 0 ? haystack[idx - 1] : ''
    const after  = idx + needle.length < haystack.length ? haystack[idx + needle.length] : ''
    const isBoundary = (ch: string) => ch === '' || /[^a-z0-9]/i.test(ch)
    if (isBoundary(before) && isBoundary(after)) return idx
    from = idx + 1
  }
}
