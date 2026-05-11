import type { CollectionConfig } from 'payload'

// Mirrors the structure in lme-site/app/data/journal.js
// so migration is a direct seed from the static file

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
  fields: [
    // ── Core ────────────────────────────────────────────
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
        description: 'URL-friendly identifier. e.g. why-are-my-lights-flickering',
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

    // ── Taxonomy ─────────────────────────────────────────
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
        description: 'Show this post as the featured article on the journal index.',
      },
    },

    // ── Display ──────────────────────────────────────────
    {
      name: 'readTime',
      type: 'text',
      admin: {
        description: 'e.g. "8 min read"',
      },
    },
    {
      name: 'coverGradient',
      type: 'text',
      admin: {
        description: 'CSS gradient used as placeholder until a real cover image is uploaded.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image for the post. Overrides coverGradient when set.',
      },
    },

    // ── Content ──────────────────────────────────────────
    {
      name: 'toc',
      type: 'array',
      admin: {
        description: 'Table of contents items (in order).',
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
    },

    // ── SEO ──────────────────────────────────────────────
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
        description: 'Meta description for search engines (150–160 chars).',
      },
    },

    // ── Publishing ───────────────────────────────────────
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
      },
    },
  ],
}
