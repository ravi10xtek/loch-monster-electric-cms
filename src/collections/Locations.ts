import type { CollectionConfig } from 'payload'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'state', 'county', 'slug'],
    description: 'Service area cities. Each generates a /service-areas/[slug] page.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'state',
              type: 'text',
              required: true,
              admin: { description: 'Two-letter state code, e.g. MN' },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: { description: 'URL slug, e.g. shoreview-mn' },
            },
            {
              name: 'county',
              type: 'text',
              admin: { description: 'e.g. Ramsey County' },
            },
            { name: 'lat', type: 'number' },
            { name: 'lng', type: 'number' },
            {
              name: 'blurb',
              type: 'textarea',
              required: true,
              admin: { description: 'City-specific paragraph shown on the location page.' },
            },
            {
              name: 'nearby',
              type: 'relationship',
              relationTo: 'locations',
              hasMany: true,
              maxRows: 5,
              admin: { description: 'Up to 5 nearby cities (for internal linking).' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: { description: 'Overrides default title if set.' },
            },
            { name: 'metaDescription', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
