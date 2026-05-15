import type { CollectionConfig } from 'payload'

export const Competitors: CollectionConfig = {
  slug: 'competitors',
  labels: { singular: 'Competitor', plural: 'Competitors' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'estimatedMonthlyTraffic', 'lastSynced'],
    group: 'SEO',
  },
  access: { read: ({ req }) => !!req.user },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Business Name',
    },
    {
      name: 'domain',
      type: 'text',
      required: true,
      label: 'Domain (e.g. example.com)',
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Primary Location',
    },
    {
      name: 'estimatedMonthlyTraffic',
      type: 'number',
      label: 'Est. Monthly Traffic',
    },
    {
      name: 'lastSynced',
      type: 'date',
      label: 'Last Synced',
      admin: { date: { displayFormat: 'MMM d, yyyy h:mm a' } },
    },
    {
      name: 'topKeywords',
      type: 'array',
      label: 'Top Ranked Keywords',
      admin: { description: 'Keywords this competitor ranks for — populated by DataForSEO sync.' },
      fields: [
        { name: 'keyword', type: 'text', label: 'Keyword' },
        { name: 'position', type: 'number', label: 'Position' },
        { name: 'searchVolume', type: 'number', label: 'Monthly Search Volume' },
        { name: 'url', type: 'text', label: 'Ranking URL' },
      ],
    },
    {
      name: 'keywordGaps',
      type: 'array',
      label: 'Keyword Gaps (They Rank, We Don\'t)',
      admin: { description: 'Keywords where this competitor has rankings but LME does not.' },
      fields: [
        { name: 'keyword', type: 'text', label: 'Keyword' },
        { name: 'searchVolume', type: 'number', label: 'Monthly Search Volume' },
        { name: 'competitorPosition', type: 'number', label: 'Their Position' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
  ],
}
