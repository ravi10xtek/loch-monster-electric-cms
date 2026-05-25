import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'tags', 'sortOrder'],
    description: 'Site-wide FAQ items. Tag each question to control which pages it appears on.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      async () => {
        revalidate({ collection: 'faqs', slug: '' })
      },
    ],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      required: true,
      admin: {
        description: 'Which pages this question appears on. A question can have multiple tags.',
      },
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'HOA', value: 'hoa' },
        { label: 'Service Areas', value: 'service-areas' },
        { label: 'General (all pages)', value: 'general' },
        { label: 'Electrical Repairs', value: 'electrical-repairs' },
        { label: 'Electrical Upgrades', value: 'electrical-upgrades' },
        { label: 'Installations', value: 'installations' },
        { label: 'Safety & Compliance', value: 'safety-compliance' },
        { label: 'Commercial Repairs', value: 'commercial-repairs' },
        { label: 'Power & Distribution', value: 'power-distribution' },
        { label: 'Lighting Systems', value: 'lighting-systems' },
        { label: 'Compliance & Infrastructure', value: 'compliance-infrastructure' },
        { label: 'HOA Common Areas', value: 'hoa-common-areas' },
        { label: 'HOA Emergency Repairs', value: 'hoa-emergency-repairs' },
        { label: 'HOA EV Charging', value: 'hoa-ev-charging' },
        { label: 'HOA Inspections', value: 'hoa-inspections' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first. Use 10, 20, 30... to leave room for reordering.',
      },
    },
  ],
}
