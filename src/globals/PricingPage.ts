import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const PricingPage: GlobalConfig = {
  slug: 'pricing-page',
  label: 'Pricing & Estimates Page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-pricing-page' }) }],
  },
  fields: [
    // ── Hero ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Hero Section',
      fields: [
        { name: 'heroEyebrow', type: 'text', label: 'Eyebrow' },
        {
          name: 'heroTitleLines',
          type: 'array',
          label: 'Title Lines',
          maxRows: 3,
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'heroTagline', type: 'text', label: 'Tagline' },
        { name: 'heroBody', type: 'textarea', label: 'Body' },
        { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Background Image' },
      ],
    },
    // ── Pricing Overview Cards ───────────────────────────────────
    {
      type: 'collapsible',
      label: 'Pricing Overview Cards',
      fields: [
        { name: 'pricingHeading', type: 'text', label: 'Section Heading' },
        {
          name: 'pricingCards',
          type: 'array',
          label: 'Cards',
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'badgeText', type: 'text' },
            { name: 'badgeStyle', type: 'select', options: [{ label: 'Orange', value: 'orange' }, { label: 'Outline', value: 'outline' }] },
            { name: 'anchor', type: 'text' },
            { name: 'featured', type: 'checkbox', defaultValue: false },
            {
              name: 'items',
              type: 'array',
              label: 'Bullet Points',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
    // ── Detailed Tier Sections ───────────────────────────────────
    {
      type: 'collapsible',
      label: 'Detailed Tier Sections',
      fields: [
        {
          name: 'tiers',
          type: 'array',
          label: 'Tiers',
          maxRows: 4,
          fields: [
            { name: 'id', type: 'text', required: true, admin: { description: 'Anchor ID, e.g. time-materials' } },
            { name: 'label', type: 'text', required: true },
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text', required: true },
            { name: 'headingOrange', type: 'text', label: 'Heading Orange Part' },
            { name: 'body', type: 'textarea', required: true },
            { name: 'payFor', type: 'text', label: 'Pay-For Label' },
            { name: 'gradient', type: 'text', defaultValue: 'linear-gradient(160deg,#1a1a1a,#2e2e2e)' },
            {
              name: 'bullets',
              type: 'array',
              label: 'Bullet Points',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'notes',
              type: 'array',
              label: 'Note Paragraphs',
              fields: [{ name: 'text', type: 'textarea', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
