import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

// One document per category hub: electrical-repairs, electrical-upgrades, etc.
export const CategoryHubs: CollectionConfig = {
  slug: 'category-hubs',
  admin: {
    group: 'Services',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'parentHub'],
    description: 'Category hub pages sitting between the main hub and individual service pages.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      async ({ doc }) => { await revalidate({ collection: 'category-hubs', slug: doc.slug }) },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Tab Card Image',
      admin: {
        description: 'Image shown on the "Our Electrical Services" tab card (homepage + service detail pages). Landscape crop recommended.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL segment, e.g. electrical-repairs' },
    },
    {
      name: 'parentHub',
      type: 'select',
      required: true,
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
        { name: 'heroBody', type: 'textarea' },
        { name: 'heroBody2', type: 'textarea', label: 'Hero Body (2nd paragraph)' },
        { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Background Image' },
      ],
    },
    // ── Sub-Service Sections ───────────────────────────────────
    {
      type: 'collapsible',
      label: 'Sub-Service Sections',
      fields: [
        {
          name: 'subServices',
          type: 'array',
          label: 'Sub-Services',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'heading', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
            { name: 'body', type: 'textarea', required: true },
            { name: 'readMoreHref', type: 'text', label: 'Read More URL' },
            { name: 'color', type: 'text', defaultValue: '#1a1a1a' },
            { name: 'gradient', type: 'text', defaultValue: 'linear-gradient(160deg,#111,#2a2a2a)' },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Section Photo' },
          ],
        },
      ],
    },
  ],
}
