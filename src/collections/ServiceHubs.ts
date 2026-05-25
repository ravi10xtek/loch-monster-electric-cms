import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

// One document per hub page: residential, commercial, hoa
export const ServiceHubs: CollectionConfig = {
  slug: 'service-hubs',
  admin: {
    group: 'Services',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    description: 'The three main service hub pages: Residential, Commercial, and HOA.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      async ({ doc }) => { revalidate({ collection: 'pages', slug: doc.slug }) },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. Residential Electrical Services' } },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Residential', value: 'residential-electrical-services' },
        { label: 'Commercial', value: 'commercial-electrical-services' },
        { label: 'HOA', value: 'hoa-electrical-services' },
      ],
    },
    // ── Hero ───────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Hero',
      fields: [
        { name: 'heroEyebrow', type: 'text' },
        {
          name: 'heroTitleLines',
          type: 'array',
          maxRows: 3,
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'heroTagline', type: 'text' },
        { name: 'heroBody', type: 'textarea', label: 'Body Paragraph 1' },
        { name: 'heroBody2', type: 'textarea', label: 'Body Paragraph 2 (optional)' },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero Background Image',
          admin: {
            components: {
              afterInput: ['@/components/GenerateImageButton#GenerateImageButton'],
            },
          },
        },
      ],
    },
    // ── What We Handle Section ─────────────────────────────────
    {
      type: 'collapsible',
      label: 'What We Handle Section',
      fields: [
        { name: 'whatEyebrow', type: 'text', label: 'Eyebrow' },
        { name: 'whatHeading', type: 'text', label: 'Heading' },
        { name: 'whatBody', type: 'textarea', label: 'Body' },
        { name: 'whatCta', type: 'text', label: 'CTA Label' },
        {
          name: 'tabs',
          type: 'array',
          label: 'Service Tabs',
          maxRows: 4,
          fields: [
            { name: 'id', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'heading', type: 'text', label: 'Tab Heading' },
            { name: 'body', type: 'textarea', label: 'Tab Body' },
            { name: 'href', type: 'text' },
            {
              name: 'cards',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
                { name: 'href', type: 'text', label: 'Card Link URL' },
                { name: 'color', type: 'text', defaultValue: '#2a2a2a' },
                { name: 'gradient', type: 'text', defaultValue: 'linear-gradient(160deg,#191919,#333)' },
                {
                  name: 'image', type: 'upload', relationTo: 'media', label: 'Card Photo',
                  admin: {
                    components: {
                      afterInput: ['@/components/GenerateImageButton#GenerateImageButton'],
                    },
                  },
                },
              ],
            },
          ],
        },
        { name: 'ctaCardLabel', type: 'text', label: 'CTA Card Label' },
      ],
    },
  ],
}
