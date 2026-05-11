import type { CollectionConfig } from 'payload'
import { ALL_BLOCKS } from '../blocks'
import { revalidate } from '../lib/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Block-based pages. Each page is a slug + an ordered list of blocks.',
    livePreview: {
      url: ({ data }) =>
        `${process.env.LME_SITE_URL || 'http://localhost:3000'}/preview/${data?.slug ?? ''}`,
    },
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        await revalidate({ collection: 'pages', slug: doc.slug })
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path without leading slash. e.g. "services/ev-chargers" or "about-loch-monster"',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: ALL_BLOCKS,
      admin: { description: 'Build the page by adding and reordering blocks.' },
    },
    // SEO tab
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text' },
            { name: 'seoDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
            {
              name: 'noIndex',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
