import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Us Page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-about-page' }) }],
  },
  fields: [
    // ── Hero ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Hero Section',
      fields: [
        { name: 'heroTitle', type: 'text', label: 'Heading' },
        { name: 'heroAuthor', type: 'text', label: 'Author Line' },
        {
          name: 'heroParagraphs',
          type: 'array',
          label: 'Body Paragraphs',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Background Image' },
      ],
    },
    // ── Story Section ────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Story Section',
      fields: [
        { name: 'storyEyebrow', type: 'text', label: 'Eyebrow' },
        { name: 'storyHeading', type: 'text', label: 'Heading' },
        {
          name: 'storyParagraphs',
          type: 'array',
          label: 'Paragraphs',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'storyCtaLabel', type: 'text', label: 'Primary CTA Label' },
        { name: 'storyCtaHref', type: 'text', label: 'Primary CTA URL' },
        { name: 'storyCtaSecondaryLabel', type: 'text', label: 'Secondary CTA Label' },
        { name: 'storyCtaSecondaryHref', type: 'text', label: 'Secondary CTA URL' },
      ],
    },
    // ── Orange Banner ────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Orange Banner',
      fields: [
        { name: 'bannerHeading', type: 'text', label: 'Heading' },
        { name: 'bannerBody', type: 'textarea', label: 'Body' },
      ],
    },
  ],
}
