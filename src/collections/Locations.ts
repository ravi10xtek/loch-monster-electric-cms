import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    group: 'Service Areas',
    useAsTitle: 'name',
    defaultColumns: ['name', 'state', 'county', 'slug'],
    description: 'Service area cities. Each generates a /service-areas/[slug] page.',
    livePreview: {
      url: ({ data }) =>
        `${process.env.LME_SITE_URL || 'http://localhost:3000'}/preview/location/${data?.slug ?? ''}`,
    },
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        await revalidate({ collection: 'locations', slug: doc.slug })
      },
    ],
  },
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
              admin: { description: 'Shown in the "Your Local X Electrician" section below the hero.' },
            },
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
            { name: 'cityImage', type: 'upload', relationTo: 'media', label: 'City Photo (shown in local section)' },
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
          label: 'Local Content',
          fields: [
            {
              name: 'heroTagline',
              type: 'text',
              admin: { description: 'Short hook in the hero, under the city name. ~10–14 words.' },
            },
            {
              name: 'heroIntro',
              type: 'textarea',
              admin: { description: 'Hero body paragraph. 1–2 sentences setting the local angle.' },
            },
            {
              name: 'housingProfile',
              type: 'textarea',
              admin: { description: 'Short paragraph about the city\'s housing stock and how it shapes electrical work.' },
            },
            {
              name: 'commonIssues',
              type: 'json',
              admin: {
                description: 'Array of {heading, body} objects — common electrical issues in this city. 3 recommended.',
              },
            },
            {
              name: 'neighborhoods',
              type: 'json',
              admin: {
                description: 'Array of strings — specific neighborhoods served. 4–6 recommended.',
              },
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
