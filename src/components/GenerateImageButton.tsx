'use client'

import React, { useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

// Props injected by Payload v3 for afterInput components
interface GenerateImageButtonProps {
  path: string
  [key: string]: unknown
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40)
}

function buildPromptSuggestion(fields: Record<string, { value: unknown }>): string {
  const parts: string[] = []

  // Helper to extract string value
  const str = (key: string): string => {
    const val = fields[key]?.value
    if (!val) return ''
    if (typeof val === 'string') return val.trim()
    return ''
  }

  // Helper to extract array-of-{line} value (heroTitle, heroTitleLines)
  const lines = (key: string): string => {
    const val = fields[key]?.value
    if (!val || !Array.isArray(val)) return ''
    return val
      .map((item: unknown) => (typeof item === 'object' && item !== null ? (item as any).line ?? '' : ''))
      .filter(Boolean)
      .join(' ')
      .trim()
  }

  // Collect available context in priority order
  const title =
    str('title') ||
    str('name') ||
    lines('heroTitle') ||
    lines('heroTitleLines')

  const tagline = str('heroTagline')
  const eyebrow = str('heroEyebrow')
  const body = str('heroBody') || str('excerpt') || str('whenHeading')
  const slug = str('slug')

  if (title) parts.push(title)
  if (eyebrow && eyebrow !== title) parts.push(eyebrow)
  if (tagline) parts.push(tagline)
  if (body) parts.push(body.slice(0, 120))
  if (!parts.length && slug) parts.push(slug.replace(/-/g, ' '))

  const context = parts.join('. ').trim() || 'electrical contractor services'

  return `Professional electrical contractor photo for: ${context}. Cinematic lighting, photorealistic, clean composition.`
}

export function GenerateImageButton({ path }: GenerateImageButtonProps) {
  const { setValue } = useField<number | string | null>({ path })
  const allFields = useFormFields((fields) => fields)

  const [expanded, setExpanded] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = () => {
    const suggestion = buildPromptSuggestion(allFields as unknown as Record<string, { value: unknown }>)
    setPrompt(suggestion)
    setError(null)
    setExpanded(true)
  }

  const handleCancel = () => {
    setExpanded(false)
    setError(null)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    const altText = prompt.trim().slice(0, 125)
    const filename = slugify(prompt)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), altText, filename }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`)
      }

      // Set the upload field to the new media doc ID
      setValue(data.id)
      setExpanded(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        marginTop: '8px',
        fontFamily: 'inherit',
      }}
    >
      {!expanded ? (
        <button
          type="button"
          onClick={handleOpen}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--color-base-800, #1a1a2e)',
            background: 'var(--color-base-100, #f0f0f0)',
            border: '1px solid var(--color-base-300, #d0d0d0)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background =
              'var(--color-base-150, #e4e4e4)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background =
              'var(--color-base-100, #f0f0f0)'
          }}
        >
          ✨ Generate with AI
        </button>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            background: 'var(--color-base-50, #f8f8f8)',
            border: '1px solid var(--color-base-300, #d0d0d0)',
            borderRadius: '6px',
          }}
        >
          <label
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-base-600, #555)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Image prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '13px',
              fontFamily: 'inherit',
              border: '1px solid var(--color-base-300, #d0d0d0)',
              borderRadius: '4px',
              background: 'var(--color-base-0, #fff)',
              color: 'var(--color-base-800, #1a1a2e)',
              resize: 'vertical',
              boxSizing: 'border-box',
              opacity: loading ? 0.6 : 1,
            }}
          />
          {error && (
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: 'var(--color-error-500, #ef4444)',
              }}
            >
              {error}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#fff',
                background: loading
                  ? 'var(--color-base-400, #999)'
                  : 'var(--color-success-500, #22c55e)',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-base-600, #555)',
                background: 'transparent',
                border: '1px solid var(--color-base-300, #d0d0d0)',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
