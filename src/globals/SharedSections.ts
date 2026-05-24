import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const SharedSections: GlobalConfig = {
  slug: 'shared-sections',
  label: 'Shared Sections',
  admin: { group: 'Site Config' },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-shared-sections' }) }],
  },
  fields: [
    {
      type: 'collapsible',
      label: '"Who We Are / What You Can Expect" Section (used on every service page)',
      fields: [
        {
          name: 'expectItems',
          type: 'array',
          label: 'Items (4 shown)',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '"Why Choose Us" Section (used on every service page)',
      fields: [
        { name: 'whyHeading', type: 'text', label: 'Heading' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Default Orange Banner (used on service & category hub pages)',
      fields: [
        { name: 'orangeBannerHeading', type: 'text', label: 'Heading (HTML allowed)' },
        { name: 'orangeBannerBody', type: 'textarea', label: 'Body text' },
        { name: 'orangeBannerNote', type: 'text', label: 'Small note below body' },
        { name: 'orangeBannerCtaLabel', type: 'text', label: 'CTA button label' },
      ],
    },
  ],
}
