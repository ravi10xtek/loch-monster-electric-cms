import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-home-page' }) }],
  },
  fields: [
    // ── Hero ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Hero Section',
      fields: [
        {
          name: 'heroTitleLines',
          type: 'array',
          label: 'Title Lines',
          maxRows: 3,
          admin: { description: 'Each line renders on its own row. First word(s) white, rest orange — use the site style.' },
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'heroTagline', type: 'text', label: 'Tagline' },
        { name: 'heroBody', type: 'textarea', label: 'Body' },
        { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Background Image' },
      ],
    },
    // ── Services Section ─────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Services Section',
      fields: [
        {
          name: 'servicesTabs',
          type: 'array',
          label: 'Tabs',
          maxRows: 3,
          fields: [
            { name: 'id', type: 'text', required: true, admin: { description: 'e.g. residential, commercial, hoa' } },
            { name: 'label', type: 'text', required: true },
            { name: 'heading', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
            { name: 'cta', type: 'text', label: 'CTA Link Label' },
            { name: 'ctaHref', type: 'text', label: 'CTA Link URL' },
            { name: 'ctaCard', type: 'text', label: 'CTA Card Label' },
            {
              name: 'cards',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
                { name: 'href', type: 'text' },
                { name: 'color', type: 'text', defaultValue: '#2a2a2a' },
                { name: 'gradient', type: 'text', defaultValue: 'linear-gradient(160deg,#191919,#333)' },
              ],
            },
          ],
        },
      ],
    },
    // ── Orange Banner ────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Orange Banner',
      fields: [
        { name: 'bannerHeading', type: 'text', label: 'Heading' },
        { name: 'bannerBody', type: 'textarea', label: 'Body' },
        { name: 'bannerNote', type: 'text', label: 'Small Note' },
        { name: 'bannerCtaLabel', type: 'text', label: 'CTA Label' },
      ],
    },
    // ── Expect Section ───────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'What to Expect Section',
      fields: [
        {
          name: 'expectItems',
          type: 'array',
          label: 'Trust Items',
          maxRows: 4,
          admin: { description: 'The 4 trust signals shown with orange icons.' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    // ── Pricing Section ──────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Pricing Section',
      fields: [
        { name: 'pricingHeading', type: 'text', label: 'Section Heading' },
        {
          name: 'pricingCards',
          type: 'array',
          label: 'Pricing Cards',
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'badgeText', type: 'text', label: 'Badge Text' },
            { name: 'badgeStyle', type: 'select', options: [{ label: 'Orange', value: 'orange' }, { label: 'Outline', value: 'outline' }] },
            { name: 'anchor', type: 'text', label: 'Anchor ID (e.g. #time-materials)' },
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
    // ── Our Story ────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Our Story Section',
      fields: [
        { name: 'storyEyebrow', type: 'text', label: 'Eyebrow' },
        { name: 'storyHeading', type: 'text', label: 'Heading' },
        {
          name: 'storyParagraphs',
          type: 'array',
          label: 'Paragraphs',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'storyCtaLabel', type: 'text', label: 'CTA Label' },
        { name: 'storyCtaHref', type: 'text', label: 'CTA URL' },
      ],
    },
    // ── Why Choose Us ────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Why Choose Us Section',
      fields: [
        { name: 'whyHeading', type: 'text', label: 'Heading' },
      ],
    },
  ],
}
