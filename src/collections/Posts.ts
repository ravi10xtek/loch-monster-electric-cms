import type { CollectionConfig } from 'payload'
import { convertLexicalToHTML, defaultHTMLConverters } from '@payloadcms/richtext-lexical'

// Mirrors the structure in lme-site/app/data/journal.js
// so migration is a direct seed from the static file.
//
// bodyHtml is auto-generated from body on every save — the LME site
// reads this field so it can use dangerouslySetInnerHTML without
// pulling in the Lexical runtime.

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'tags'],
    description: 'Journal posts for the Loch Monster Electric blog.',
  },
  access: {
    read: () => true,
  },

  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.body) {
          try {
            data.bodyHtml = await convertLexicalToHTML({
              converters: defaultHTMLConverters,
              data: data.body,
            })
          } catch (err) {
            console.error('[Posts] Lexical → HTML conversion failed:', err)
          }
        }
        return data
      },
    ],
  },

  fields: [
    // ── Tabs ─────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── CONTENT TAB ────────────────────────────────
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'URL-friendly identifier, e.g. why-are-my-lights-flickering',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short summary shown on journal index and sidebar cards.',
              },
            },
            {
              name: 'toc',
              type: 'array',
              label: 'Table of Contents',
              admin: {
                description: 'Heading items shown in the article sidebar (in order).',
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                },
              ],
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
              label: 'Body',
            },
            {
              name: 'bodyHtml',
              type: 'textarea',
              admin: {
                readOnly: true,
                description:
                  '⚙️ Auto-generated from Body on save. Read by the LME website — do not edit manually.',
              },
            },
          ],
        },

        // ── MEDIA TAB ──────────────────────────────────
        {
          label: 'Media',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Hero image for the post. Overrides the gradient cover when set.',
              },
            },
            {
              name: 'coverGradient',
              type: 'text',
              admin: {
                description:
                  'CSS gradient used as a placeholder until a real cover image is uploaded. e.g. linear-gradient(135deg,#1a1a2e,#16213e)',
              },
            },
          ],
        },

        // ── TAXONOMY TAB ───────────────────────────────
        {
          label: 'Taxonomy',
          fields: [
            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Guides', value: 'guides' },
                { label: 'Warnings', value: 'warnings' },
                { label: 'Safety', value: 'safety' },
                { label: 'Upgrades', value: 'upgrades' },
                { label: 'Compliance', value: 'compliance' },
                { label: 'Products', value: 'products' },
                { label: 'Insurance', value: 'insurance' },
              ],
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Pin this post as the featured article on the journal index.',
              },
            },
            {
              name: 'readTime',
              type: 'text',
              admin: {
                description: 'e.g. "8 min read"',
              },
            },
          ],
        },

        // ── SEO TAB ────────────────────────────────────
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: {
                description: 'Overrides the default "<title> | Loch Monster Electric" if set.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: {
                description: 'Meta description for search engines (150–160 chars recommended).',
              },
            },
          ],
        },

        // ── SETTINGS TAB ───────────────────────────────
        {
          label: 'Settings',
          fields: [
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              defaultValue: 'draft',
              required: true,
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'Set the publish date. Shown on the article header.',
              },
            },
          ],
        },
      ],
    },
  ],
}
