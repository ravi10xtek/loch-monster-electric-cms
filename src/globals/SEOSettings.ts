import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO Settings',
  admin: {
    group: 'SEO',
    description: 'DataForSEO credentials, target keywords, and audit configuration.',
  },
  fields: [
    {
      name: 'googlePsiApiKey',
      type: 'text',
      label: 'Google PageSpeed Insights API Key',
      admin: {
        description: 'Get a free key at console.cloud.google.com → PageSpeed Insights API. Leave blank to use GOOGLE_PSI_API_KEY env var.',
        placeholder: 'Uses GOOGLE_PSI_API_KEY env var if empty',
      },
    },
    {
      name: 'dataForSeoLogin',
      type: 'text',
      label: 'DataForSEO Login (email)',
      admin: {
        description: 'Leave blank to use DATAFORSEO_LOGIN env var.',
        placeholder: 'Uses DATAFORSEO_LOGIN env var if empty',
      },
    },
    {
      name: 'dataForSeoPassword',
      type: 'text',
      label: 'DataForSEO Password',
      admin: {
        description: 'Leave blank to use DATAFORSEO_PASSWORD env var.',
        placeholder: 'Uses DATAFORSEO_PASSWORD env var if empty',
      },
    },
    {
      name: 'siteUrl',
      type: 'text',
      label: 'Site URL to Audit',
      defaultValue: 'http://localhost:3000',
      admin: { description: 'The live or staging URL Lighthouse will crawl.' },
    },
    {
      name: 'targetLocationCode',
      type: 'number',
      label: 'DataForSEO Location Code',
      defaultValue: 1023191,
      admin: {
        description: 'DataForSEO location code for SERP lookups. Default: Sacramento, CA (1023191).',
      },
    },
    {
      name: 'targetKeywords',
      type: 'array',
      label: 'Seed Keywords',
      admin: {
        description: 'Keywords used to discover local competitors and track rankings.',
      },
      fields: [
        { name: 'keyword', type: 'text', label: 'Keyword', required: true },
      ],
    },
    {
      name: 'lmeKeywords',
      type: 'array',
      label: 'LME Target Keywords',
      admin: {
        description: 'Keywords LME is actively targeting — used to find gaps vs. competitors.',
      },
      fields: [
        { name: 'keyword', type: 'text', label: 'Keyword', required: true },
        { name: 'priority', type: 'select', options: [
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' },
        ]},
      ],
    },
  ],
}
