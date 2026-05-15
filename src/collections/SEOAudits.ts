import type { CollectionConfig } from 'payload'

export const SEOAudits: CollectionConfig = {
  slug: 'seo-audits',
  labels: { singular: 'SEO Audit', plural: 'SEO Audits' },
  admin: {
    useAsTitle: 'url',
    defaultColumns: ['url', 'pageName', 'seoScore', 'performanceScore', 'auditedAt'],
    group: 'SEO',
  },
  access: { read: ({ req }) => !!req.user },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Page URL',
    },
    {
      name: 'pageName',
      type: 'text',
      label: 'Page Name',
    },
    {
      name: 'auditedAt',
      type: 'date',
      label: 'Audited At',
      admin: { date: { displayFormat: 'MMM d, yyyy h:mm a' } },
    },
    {
      name: 'seoScore',
      type: 'number',
      label: 'SEO Score',
      min: 0,
      max: 100,
    },
    {
      name: 'performanceScore',
      type: 'number',
      label: 'Performance Score',
      min: 0,
      max: 100,
    },
    {
      name: 'accessibilityScore',
      type: 'number',
      label: 'Accessibility Score',
      min: 0,
      max: 100,
    },
    {
      name: 'bestPracticesScore',
      type: 'number',
      label: 'Best Practices Score',
      min: 0,
      max: 100,
    },
    {
      name: 'issues',
      type: 'array',
      label: 'Issues Found',
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'SEO', value: 'seo' },
            { label: 'Performance', value: 'performance' },
            { label: 'Accessibility', value: 'accessibility' },
            { label: 'Best Practices', value: 'best-practices' },
          ],
        },
        { name: 'id', type: 'text', label: 'Audit ID' },
        { name: 'title', type: 'text', label: 'Issue' },
        { name: 'description', type: 'textarea', label: 'Description' },
        {
          name: 'severity',
          type: 'select',
          options: [
            { label: 'Error', value: 'error' },
            { label: 'Warning', value: 'warning' },
            { label: 'Info', value: 'info' },
          ],
        },
      ],
    },
    {
      name: 'rawData',
      type: 'json',
      label: 'Raw Lighthouse Data',
      admin: { condition: () => false },
    },
  ],
}
