import type { CollectionConfig } from 'payload'
import {
  convertLexicalToHTML,
  convertLexicalNodesToHTML,
  defaultHTMLConverters,
} from '@payloadcms/richtext-lexical'
import type { HTMLConverter } from '@payloadcms/richtext-lexical'
import { revalidate } from '../lib/revalidate'

// Mirrors the structure in lme-site/app/data/journal.js
// so migration is a direct seed from the static file.
//
// bodyHtml is auto-generated from body on every save — the LME site
// reads this field so it can use dangerouslySetInnerHTML without
// pulling in the Lexical runtime.

// ── Extra HTML converters not included in defaultHTMLConverters ───────────

// Shared helper — renders a node's children array to an HTML string
async function childrenToHTML(args: any): Promise<string> {
  return convertLexicalNodesToHTML({
    converters: args.converters,
    currentDepth: args.currentDepth,
    depth: args.depth,
    draft: args.draft,
    lexicalNodes: args.node.children ?? [],
    overrideAccess: args.overrideAccess,
    parent: { ...args.node, parent: args.parent },
    req: args.req,
    showHiddenFields: args.showHiddenFields,
  })
}

const HeadingHTMLConverter: HTMLConverter<any> = {
  nodeTypes: ['heading'],
  converter: async (args) => {
    const tag = args.node.tag || 'h2'
    const inner = await childrenToHTML(args)
    return `<${tag}>${inner}</${tag}>`
  },
}

const ListHTMLConverter: HTMLConverter<any> = {
  nodeTypes: ['list'],
  converter: async (args) => {
    const tag = args.node.tag || 'ul'
    const inner = await childrenToHTML(args)
    return `<${tag}>${inner}</${tag}>`
  },
}

const ListItemHTMLConverter: HTMLConverter<any> = {
  nodeTypes: ['listitem'],
  converter: async (args) => {
    const inner = await childrenToHTML(args)
    return `<li>${inner}</li>`
  },
}

const LinkHTMLConverter: HTMLConverter<any> = {
  nodeTypes: ['link'],
  converter: async (args) => {
    const url = args.node.fields?.url || args.node.url || '#'
    const newTab = args.node.fields?.newTab
    const rel = newTab ? ' rel="noopener noreferrer"' : ''
    const target = newTab ? ' target="_blank"' : ''
    const inner = await childrenToHTML(args)
    return `<a href="${url}"${target}${rel}>${inner}</a>`
  },
}

// Upload / inline image nodes — outputs <img> with optional <figure> wrapper.
// node.value may be a full media object (sent by the browser editor) or just
// an ID string — we fall back to a DB fetch when the URL isn't present.
const UploadHTMLConverter: HTMLConverter<any> = {
  nodeTypes: ['upload'],
  converter: async (args) => {
    const node = args.node
    const req  = args.req

    let media: any = node.value

    // node.value is a numeric or string ID in Payload v3 Lexical.
    // Fetch the full media document so we can get the URL.
    if (!media?.url && req?.payload) {
      // value can be a string ID, numeric ID, or { id } object
      const mediaId = typeof media === 'object' ? media?.id : (media != null ? String(media) : undefined)
      if (mediaId) {
        try {
          media = await req.payload.findByID({
            collection: 'media',
            id: mediaId,
            depth: 0,
            overrideAccess: true,
          })
        } catch {
          return ''
        }
      }
    }

    if (!media?.url) return ''

    const cmsBase = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
    const src = media.url.startsWith('http') ? media.url : `${cmsBase}${media.url}`
    const alt = media.alt || media.filename || ''

    // Editor-set fields (width, align, caption)
    const widthPct = node.fields?.width  || '100'
    const align    = node.fields?.align  || 'center'
    const caption  = node.fields?.caption || media.caption || ''

    // Build inline style from width + alignment
    let style = `width:${widthPct}%;`
    if (align === 'center') {
      style += 'display:block;margin-left:auto;margin-right:auto;'
    } else if (align === 'left') {
      style += 'float:left;margin:0 1.5rem 1rem 0;'
    } else if (align === 'right') {
      style += 'float:right;margin:0 0 1rem 1.5rem;'
    }

    const img = `<img src="${src}" alt="${alt}" loading="lazy" style="${style}" class="jp-inline-img" />`

    if (caption) {
      return `<figure class="jp-inline-figure" style="${align === 'center' ? 'text-align:center;' : ''}">${img}<figcaption>${caption}</figcaption></figure>`
    }
    return img
  },
}

const allConverters: HTMLConverter<any>[] = [
  ...defaultHTMLConverters,
  HeadingHTMLConverter,
  ListHTMLConverter,
  ListItemHTMLConverter,
  LinkHTMLConverter,
  UploadHTMLConverter,
]

// ── Collection ────────────────────────────────────────────────────────────

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'tags'],
    description: 'Journal posts for the Loch Monster Electric blog.',
    livePreview: {
      url: ({ data }) =>
        `${process.env.LME_SITE_URL || 'http://localhost:3000'}/preview/post/${data?.slug ?? ''}`,
    },
  },
  access: {
    read: () => true,
  },

  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        // Only reconvert when body actually changed (or on first create).
        // This lets the seed script PATCH bodyHtml without it being overwritten.
        const bodyChanged =
          operation === 'create' ||
          JSON.stringify(data.body) !== JSON.stringify(originalDoc?.body)

        if (bodyChanged && data.body) {
          try {
            data.bodyHtml = await convertLexicalToHTML({
              converters: allConverters,
              data: data.body,
              req,
              depth: 1,
              overrideAccess: true,
            })
          } catch (err) {
            console.error('[Posts] Lexical → HTML conversion failed:', err)
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        // Bust the ISR cache for this post and the journal index
        await revalidate({ collection: 'posts', slug: doc.slug })
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

            // ── FAQ ──────────────────────────────────────
            {
              name: 'faqTitle',
              type: 'text',
              label: 'FAQ Section Title',
              defaultValue: 'Frequently Asked Questions',
              admin: {
                description: 'Heading shown above the FAQ accordion. Defaults to "Frequently Asked Questions".',
              },
            },
            {
              name: 'faq',
              type: 'array',
              label: 'FAQ',
              admin: {
                description:
                  'Accordion FAQ shown below the article body. Leave empty to hide the section.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Question',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  label: 'Answer',
                },
              ],
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
                components: {
                  afterInput: ['@/components/GenerateImageButton#GenerateImageButton'],
                },
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
