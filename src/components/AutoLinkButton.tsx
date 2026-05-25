'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

/**
 * Button placed below the Posts.body field. Calls /api/posts/[id]/auto-link
 * which walks the Lexical body and wraps the first occurrence of each
 * glossary term and service name in a link node.
 */
export function AutoLinkButton() {
  const docInfo = useDocumentInfo()
  const id = (docInfo as any)?.id

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)

  const handleClick = async () => {
    if (!id) {
      setMessage({ text: 'Save the post first before auto-linking.', type: 'info' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/posts/${id}/auto-link`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ text: data.error || `Request failed (${res.status})`, type: 'error' })
      } else if (data.linksAdded === 0) {
        setMessage({ text: data.message || 'No matches found.', type: 'info' })
      } else {
        setMessage({ text: data.message, type: 'success' })
        // Reload after a moment so the editor shows the new links
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : 'Network error',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const colorMap = {
    success: 'var(--color-success-500, #22c55e)',
    info:    'var(--color-base-600, #555)',
    error:   'var(--color-error-500, #ef4444)',
  }

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '12px',
        background: 'var(--color-base-50, #f8f8f8)',
        border: '1px solid var(--color-base-300, #d0d0d0)',
        borderRadius: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading || !id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            background: loading || !id ? 'var(--color-base-400, #999)' : 'var(--color-success-500, #22c55e)',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !id ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Linking…' : '🔗 Auto-link glossary & services'}
        </button>
        <span style={{ fontSize: '12px', color: 'var(--color-base-600, #555)' }}>
          Wraps the first occurrence of each glossary term and service name in a link. Existing links are preserved.
        </span>
      </div>
      {message && (
        <p
          style={{
            margin: '10px 0 0',
            fontSize: '12px',
            fontWeight: 500,
            color: colorMap[message.type],
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
