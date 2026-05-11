import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero Section', plural: 'Hero Sections' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the title, e.g. "Residential Electrical Services"' } },
    {
      name: 'titleLines',
      type: 'array',
      label: 'Title Lines',
      maxRows: 3,
      admin: { description: 'Each line renders on its own row in large type' },
      fields: [{ name: 'line', type: 'text', required: true }],
    },
    { name: 'tagline', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'ctaLabel', type: 'text', defaultValue: 'CALL NOW — 763-292-1191' },
    { name: 'ctaHref', type: 'text', defaultValue: '/contact-us' },
    { name: 'backgroundGradient', type: 'text', defaultValue: 'linear-gradient(135deg,#1a1a1a 0%,#2e2e2e 100%)', admin: { description: 'CSS gradient string' } },
    {
      name: 'breadcrumb',
      type: 'array',
      admin: { description: 'Leave empty for no breadcrumb' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', admin: { description: 'Leave empty for the current (last) crumb' } },
      ],
    },
  ],
}

export const WhenDoYouNeedBlock: Block = {
  slug: 'when-do-you-need',
  labels: { singular: 'When Do You Need', plural: 'When Do You Need Sections' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'gradient', type: 'text', defaultValue: 'linear-gradient(160deg,#111,#2a2a2a)' },
    { name: 'color', type: 'text', defaultValue: '#1a1a1a' },
    {
      name: 'scenarios',
      type: 'array',
      required: true,
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
}

export const ServicesGridBlock: Block = {
  slug: 'services-grid',
  labels: { singular: 'Services Grid', plural: 'Services Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'heading', type: 'text', required: true },
        { name: 'tagline', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'href', type: 'text' },
        { name: 'color', type: 'text', defaultValue: '#1a1a1a' },
        { name: 'gradient', type: 'text', defaultValue: 'linear-gradient(160deg,#111,#2a2a2a)' },
      ],
    },
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ Section', plural: 'FAQ Sections' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'FREQUENTLY ASKED QUESTIONS' },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

export const CTABannerBlock: Block = {
  slug: 'cta-banner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: "Ready to Get Started? Let's Talk." },
    { name: 'subheading', type: 'text' },
    { name: 'ctaLabel', type: 'text', defaultValue: 'CALL NOW — 763-292-1191' },
    { name: 'ctaHref', type: 'text', defaultValue: 'tel:7632921191' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'orange',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'Rich Text', plural: 'Rich Text Sections' },
  fields: [
    { name: 'content', type: 'richText', required: true },
  ],
}

export const ImageTextBlock: Block = {
  slug: 'image-text',
  labels: { singular: 'Image + Text', plural: 'Image + Text Sections' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaHref', type: 'text' },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Image Left', value: 'left' },
        { label: 'Image Right', value: 'right' },
      ],
    },
  ],
}

export const WhyChooseUsBlock: Block = {
  slug: 'why-choose-us',
  labels: { singular: 'Why Choose Us', plural: 'Why Choose Us Sections' },
  fields: [], // renders the static component, no fields needed
}

export const ServiceAreasBlock: Block = {
  slug: 'service-areas',
  labels: { singular: 'Service Areas', plural: 'Service Areas Sections' },
  fields: [], // renders the static component, no fields needed
}

export const ExpectBlock: Block = {
  slug: 'expect',
  labels: { singular: 'What to Expect', plural: 'What to Expect Sections' },
  fields: [
    {
      name: 'dark',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Use dark background' },
    },
  ],
}

export const ALL_BLOCKS = [
  HeroBlock,
  WhenDoYouNeedBlock,
  ServicesGridBlock,
  FAQBlock,
  CTABannerBlock,
  RichTextBlock,
  ImageTextBlock,
  WhyChooseUsBlock,
  ServiceAreasBlock,
  ExpectBlock,
]
