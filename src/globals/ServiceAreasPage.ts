import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const ServiceAreasPage: GlobalConfig = {
  slug: 'service-areas-page',
  label: 'Service Areas Page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { revalidate({ collection: 'global-service-areas-page' }) }],
  },
  fields: [
    // ── Hero ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Hero Section',
      fields: [
        { name: 'heroHeading', type: 'text', label: 'Hero Heading' },
        { name: 'heroSubheading', type: 'text', label: 'Hero Subheading' },
        { name: 'heroBody', type: 'textarea', label: 'Hero Body' },
        { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Background Image' },
      ],
    },
    { name: 'bannerHeading', type: 'text', label: 'Orange Banner Heading' },
    { name: 'bannerBody', type: 'textarea', label: 'Orange Banner Body' },
  ],
}
