import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Us Page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-contact-page' }) }],
  },
  fields: [
    // ── Hero ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Hero Section',
      fields: [
        { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Background Image' },
      ],
    },
    { name: 'heading', type: 'text', label: 'Main Heading', defaultValue: "LET'S TALK" },
    {
      name: 'bodyParagraphs',
      type: 'array',
      label: 'Body Paragraphs',
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    { name: 'phone', type: 'text', label: 'Phone Number', defaultValue: '763-292-1191' },
    { name: 'phoneHref', type: 'text', label: 'Phone href', defaultValue: 'tel:7632921191' },
    { name: 'email', type: 'email', label: 'Email Address' },
    { name: 'address', type: 'textarea', label: 'Address' },
    { name: 'formHeader', type: 'text', label: 'Form Header', defaultValue: 'Phone Is Usually The Fastest Way To Reach You, But We\'re Happy To Follow Up However Works Best.' },
  ],
}
