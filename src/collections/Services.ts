import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Services',
    useAsTitle: 'title',
    defaultColumns: ['title', 'parentCategory', 'parentHub', 'slug'],
    description: 'Individual service pages (panel upgrades, EV chargers, etc.)',
    livePreview: {
      url: ({ data }) =>
        `${process.env.LME_SITE_URL || 'http://localhost:3000'}/preview/service/${data?.slug ?? ''}`,
    },
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Revalidate by tag — services live at nested paths we don't track here
        await revalidate({ collection: 'services', slug: doc.slug })
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'Display name, e.g. Panel Upgrades' },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: { description: 'URL slug, e.g. panel-upgrades' },
            },
            {
              name: 'parentCategory',
              type: 'select',
              required: true,
              options: [
                { label: 'Residential', value: 'residential-electrical-services' },
                { label: 'Commercial', value: 'commercial-electrical-services' },
                { label: 'HOA', value: 'hoa-electrical-services' },
              ],
            },
            {
              name: 'parentHub',
              type: 'select',
              required: true,
              options: [
                { label: 'Electrical Repairs', value: 'electrical-repairs' },
                { label: 'Electrical Upgrades', value: 'electrical-upgrades' },
                { label: 'Installations', value: 'installations' },
                { label: 'Safety & Compliance', value: 'safety-compliance' },
                { label: 'Commercial Repairs', value: 'commercial-repairs' },
                { label: 'Compliance & Infrastructure', value: 'compliance-infrastructure' },
                { label: 'Lighting Systems', value: 'lighting-systems' },
                { label: 'Power Distribution', value: 'power-distribution' },
                { label: 'HOA Common Areas', value: 'hoa-common-areas' },
                { label: 'HOA Emergency Repairs', value: 'hoa-emergency-repairs' },
                { label: 'HOA EV Charging', value: 'hoa-ev-charging' },
                { label: 'HOA Inspections', value: 'hoa-inspections' },
              ],
            },
            // Hero fields
            {
              name: 'heroEyebrow',
              type: 'text',
              label: 'Hero Eyebrow',
              admin: { description: 'e.g. Electrical Repairs' },
            },
            {
              name: 'heroTitle',
              type: 'array',
              label: 'Hero Title Lines',
              maxRows: 3,
              admin: {
                description:
                  'Each line becomes a separate span. First line is white, rest are orange.',
              },
              fields: [{ name: 'line', type: 'text', required: true }],
            },
            { name: 'heroTagline', type: 'text', label: 'Hero Tagline' },
            { name: 'heroBody', type: 'textarea', label: 'Hero Body' },
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
            // When Do You Need section
            {
              name: 'whenHeading',
              type: 'text',
              label: 'When Do You Need — Heading',
              admin: { description: 'e.g. AN OUTLET & SWITCH REPAIR?' },
            },
            {
              name: 'whenGradient',
              type: 'text',
              label: 'When Section Gradient',
              admin: {
                description:
                  'CSS gradient for the image panel, e.g. linear-gradient(160deg,#111,#2a2a2a)',
              },
            },
            {
              name: 'whenColor',
              type: 'text',
              label: 'When Section Fallback Color',
              admin: { description: 'Hex fallback, e.g. #1a1a1a' },
            },
            {
              name: 'whenImage',
              type: 'upload',
              relationTo: 'media',
              label: 'When Section Photo',
              admin: {
                components: {
                  afterInput: ['@/components/GenerateImageButton#GenerateImageButton'],
                },
              },
            },
            {
              name: 'scenarios',
              type: 'array',
              label: 'When Do You Need — Scenarios',
              maxRows: 5,
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text', label: 'Meta Title' },
            { name: 'seoDescription', type: 'textarea', label: 'Meta Description' },
          ],
        },
      ],
    },
  ],
}
