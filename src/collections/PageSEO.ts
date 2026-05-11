import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

// One record per static page — editors can update meta without a code deploy

export const PageSEO: CollectionConfig = {
  slug: 'page-seo',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'metaTitle'],
    description: 'SEO metadata for static pages (Home, About, Pricing, etc.).',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Revalidate the specific page whose SEO was updated
        await revalidate({ collection: 'page-seo', slug: doc.slug })
      },
    ],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Page path without leading slash. e.g. "/" for home, "about-us", "pricing-estimates"',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'Full title tag. e.g. "Licensed Electricians Minneapolis | Loch Monster Electric"',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: '150–160 characters for best results.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Social share image (1200×630px recommended).',
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: {
        description: 'Only set if this page has a non-standard canonical URL.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check to add noindex,nofollow (e.g. thank-you pages).',
      },
    },
  ],
}
