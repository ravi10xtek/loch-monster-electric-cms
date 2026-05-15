import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <span style={{
      display: 'inline-block',
      background: color,
      color: '#fff',
      borderRadius: 4,
      padding: '2px 8px',
      fontWeight: 700,
      fontSize: 13,
      minWidth: 36,
      textAlign: 'center',
    }}>
      {score}
    </span>
  )
}

export async function SEODashboard() {
  const payload = await getPayload({ config })

  const [audits, competitors, pageSEO] = await Promise.all([
    payload.find({ collection: 'seo-audits', limit: 50, sort: '-auditedAt' }),
    payload.find({ collection: 'competitors', limit: 20 }),
    payload.find({ collection: 'page-seo', limit: 100 }),
  ])

  const auditDocs = audits.docs as any[]
  const competitorDocs = competitors.docs as any[]
  const pageSEODocs = pageSEO.docs as any[]

  // SEO completeness check
  const incomplete = pageSEODocs.filter(
    (p) => !p.metaDescription || !p.metaTitle || !p.ogImage,
  )

  const avgSeo = auditDocs.length
    ? Math.round(auditDocs.reduce((s, d) => s + (d.seoScore ?? 0), 0) / auditDocs.length)
    : null
  const avgPerf = auditDocs.length
    ? Math.round(auditDocs.reduce((s, d) => s + (d.performanceScore ?? 0), 0) / auditDocs.length)
    : null

  const totalGaps = competitorDocs.reduce((s, c) => s + (c.keywordGaps?.length ?? 0), 0)

  const cardStyle: React.CSSProperties = {
    background: 'var(--theme-elevation-100)',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: 8,
    padding: '16px 20px',
    flex: '1 1 180px',
    minWidth: 160,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--theme-elevation-500)',
    marginBottom: 6,
  }

  const valueStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1,
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>SEO Overview</h3>
        {auditDocs.length > 0 && (
          <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>
            Last audit: {new Date(auditDocs[0].auditedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={labelStyle}>Avg SEO Score</div>
          <div style={valueStyle}>{avgSeo !== null ? `${avgSeo}/100` : '—'}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Avg Performance</div>
          <div style={valueStyle}>{avgPerf !== null ? `${avgPerf}/100` : '—'}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Incomplete Page SEO</div>
          <div style={{ ...valueStyle, color: incomplete.length > 0 ? '#ef4444' : '#22c55e' }}>
            {incomplete.length} / {pageSEODocs.length}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Competitors Tracked</div>
          <div style={valueStyle}>{competitorDocs.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Total Keyword Gaps</div>
          <div style={{ ...valueStyle, color: totalGaps > 0 ? '#f59e0b' : 'inherit' }}>
            {totalGaps}
          </div>
        </div>
      </div>

      {/* Incomplete SEO pages */}
      {incomplete.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#ef4444' }}>
            Pages missing SEO fields
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {incomplete.map((p: any) => (
              <span key={p.id} style={{
                background: 'var(--theme-elevation-100)',
                border: '1px solid #ef444440',
                borderRadius: 4,
                padding: '3px 10px',
                fontSize: 12,
              }}>
                {p.title || p.pageIdentifier || p.id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Audit results table */}
      {auditDocs.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Page Audit Results</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--theme-elevation-200)', textAlign: 'left' }}>
                  <th style={{ padding: '6px 10px 6px 0', fontWeight: 600, color: 'var(--theme-elevation-500)' }}>Page</th>
                  <th style={{ padding: '6px 10px', fontWeight: 600, color: 'var(--theme-elevation-500)' }}>SEO</th>
                  <th style={{ padding: '6px 10px', fontWeight: 600, color: 'var(--theme-elevation-500)' }}>Perf</th>
                  <th style={{ padding: '6px 10px', fontWeight: 600, color: 'var(--theme-elevation-500)' }}>A11y</th>
                  <th style={{ padding: '6px 10px', fontWeight: 600, color: 'var(--theme-elevation-500)' }}>Issues</th>
                </tr>
              </thead>
              <tbody>
                {auditDocs.map((doc: any) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}>
                    <td style={{ padding: '7px 10px 7px 0', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.pageName || doc.url}
                    </td>
                    <td style={{ padding: '7px 10px' }}><ScoreBadge score={doc.seoScore ?? 0} /></td>
                    <td style={{ padding: '7px 10px' }}><ScoreBadge score={doc.performanceScore ?? 0} /></td>
                    <td style={{ padding: '7px 10px' }}><ScoreBadge score={doc.accessibilityScore ?? 0} /></td>
                    <td style={{ padding: '7px 10px', color: 'var(--theme-elevation-500)' }}>
                      {(doc.issues ?? []).filter((i: any) => i.severity === 'error').length} errors,&nbsp;
                      {(doc.issues ?? []).filter((i: any) => i.severity === 'warning').length} warnings
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {auditDocs.length === 0 && (
        <div style={{ color: 'var(--theme-elevation-500)', fontSize: 13, fontStyle: 'italic' }}>
          No audits yet. Run <code style={{ fontFamily: 'monospace' }}>npm run seo:audit</code> to get started.
        </div>
      )}
    </div>
  )
}
