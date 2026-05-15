import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const PSI_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const CATEGORIES = ['seo', 'performance', 'accessibility', 'best-practices']

type IssueCategory = 'seo' | 'performance' | 'accessibility' | 'best-practices'
type IssueSeverity = 'error' | 'warning' | 'info'

type AuditResult = {
  url: string
  pageName: string
  seoScore: number
  performanceScore: number
  accessibilityScore: number
  bestPracticesScore: number
  issues: { category: IssueCategory; id: string; title: string; description: string; severity: IssueSeverity }[]
}

async function auditWithPSI(url: string, apiKey: string): Promise<AuditResult> {
  // PSI requires multiple `category` params — URLSearchParams can't do that, so build manually
  const psiUrl =
    `${PSI_API}?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}` +
    CATEGORIES.map((c) => `&category=${c}`).join('')

  const res = await fetch(psiUrl)
  if (!res.ok) throw new Error(`PSI API error for ${url}: ${res.status} ${res.statusText}`)

  const data = await res.json()
  const lhr = data.lighthouseResult

  const score = (cat: string) =>
    Math.round((lhr.categories?.[cat]?.score ?? 0) * 100)

  const issues: AuditResult['issues'] = []
  for (const [id, audit] of Object.entries<any>(lhr.audits ?? {})) {
    if (audit.score === null || audit.score === 1 || audit.scoreDisplayMode === 'informative') continue
    const severity = audit.score === 0 ? 'error' : audit.score < 0.9 ? 'warning' : 'info'

    // Map audit to a category
    const auditRef = Object.entries<any>(lhr.categories ?? {}).find(([, cat]) =>
      cat.auditRefs?.some((r: any) => r.id === id),
    )
    const category = (auditRef ? auditRef[0] : 'seo') as IssueCategory
    const issueSeverity = severity as IssueSeverity

    issues.push({
      category,
      id,
      title: audit.title ?? id,
      description: (audit.description ?? '').replace(/\[.*?\]\(.*?\)/g, '').trim(),
      severity: issueSeverity,
    })
  }

  const pathname = new URL(url).pathname
  return {
    url,
    pageName: pathname === '/' ? 'Home' : pathname.replace(/^\//, '').replace(/-/g, ' '),
    seoScore: score('seo'),
    performanceScore: score('performance'),
    accessibilityScore: score('accessibility'),
    bestPracticesScore: score('best-practices'),
    issues: issues.slice(0, 30),
  }
}

/**
 * POST /api/seo/run-audit
 * Body: { url: string } — audit a single page (Vercel-safe, ~3s per call)
 * OR:  { urls: string[] } — audit multiple pages sequentially
 * If neither provided, audits all known pages derived from the site URL in SEO Settings.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'seo-settings' })

    const apiKey = settings.googlePsiApiKey || process.env.GOOGLE_PSI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google PSI API key not configured. Add it in SEO Settings or set GOOGLE_PSI_API_KEY env var.' },
        { status: 400 },
      )
    }

    const siteUrl = (settings.siteUrl ?? 'http://localhost:3000').replace(/\/$/, '')

    let urls: string[]
    try {
      const body = await req.json()
      if (body.url) urls = [body.url]
      else if (body.urls?.length) urls = body.urls
      else urls = []
    } catch {
      urls = []
    }

    if (!urls.length) {
      const staticPaths = [
        '/',
        '/about-us',
        '/contact-us',
        '/pricing-estimates',
        '/residential-electrical-services',
        '/commercial-electrical-services',
        '/hoa-electrical-services',
        '/service-areas',
      ]
      const locations = await payload.find({ collection: 'locations', limit: 100, select: { slug: true } })
      const locationPaths = (locations.docs as any[]).map((l) => `/service-areas/${l.slug}`)
      urls = [...staticPaths, ...locationPaths].map((p) => `${siteUrl}${p}`)
    }

    const results: AuditResult[] = []

    for (const url of urls) {
      const result = await auditWithPSI(url, apiKey)
      results.push(result)

      const existing = await payload.find({
        collection: 'seo-audits',
        where: { url: { equals: url } },
        limit: 1,
      })
      if (existing.docs.length) {
        await payload.delete({ collection: 'seo-audits', id: existing.docs[0].id })
      }
      await payload.create({
        collection: 'seo-audits',
        data: { ...result, auditedAt: new Date().toISOString() },
      })
    }

    return NextResponse.json({
      success: true,
      audited: results.length,
      urls: results.map((r) => ({
        url: r.url,
        seoScore: r.seoScore,
        performanceScore: r.performanceScore,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
