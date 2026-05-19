import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const MediaPage: GlobalConfig = {
  slug: 'media-page',
  label: 'Media Page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-media-page' }) }],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero Section',
      fields: [
        { name: 'heroEyebrow', type: 'text', label: 'Eyebrow', defaultValue: 'Our Work' },
        {
          name: 'heroTitleLines',
          type: 'array',
          label: 'Title Lines',
          maxRows: 3,
          admin: { description: 'First line renders white, second line renders orange.' },
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'heroTagline', type: 'text', label: 'Tagline' },
        { name: 'heroBody', type: 'textarea', label: 'Body Text' },
        { name: 'heroCta1Label', type: 'text', label: 'CTA 1 Label', defaultValue: 'VIEW PROJECTS' },
        { name: 'heroCta1Href', type: 'text', label: 'CTA 1 URL', defaultValue: '#projects' },
        { name: 'heroCta2Label', type: 'text', label: 'CTA 2 Label', defaultValue: 'FOLLOW US' },
        { name: 'heroCta2Href', type: 'text', label: 'CTA 2 URL', defaultValue: '#stay-connected' },
        { name: 'heroFormTitle', type: 'text', label: 'Form Heading', defaultValue: 'GET A FREE ESTIMATE' },
        { name: 'heroFormSubtitle', type: 'text', label: 'Form Subtitle', defaultValue: 'Fast response. No obligation.' },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero Background Image',
          admin: { components: { afterInput: ['@/components/GenerateImageButton#GenerateImageButton'] } },
        },
      ],
    },
  ],
}
