import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { PageSEO } from './collections/PageSEO'
import { Users } from './collections/Users'
import { Locations } from './collections/Locations'
import { Services } from './collections/Services'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— LME CMS',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  collections: [Posts, Media, PageSEO, Users, Locations, Services, Pages],

  globals: [],

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
                label: 'Caption (optional)',
              },
              {
                name: 'width',
                type: 'select',
                label: 'Width',
                defaultValue: '100',
                options: [
                  { label: 'Full width (100%)', value: '100' },
                  { label: 'Large (75%)',        value: '75'  },
                  { label: 'Medium (50%)',        value: '50'  },
                  { label: 'Small (25%)',         value: '25'  },
                ],
              },
              {
                name: 'align',
                type: 'select',
                label: 'Alignment',
                defaultValue: 'center',
                options: [
                  { label: 'Centre',      value: 'center' },
                  { label: 'Left (wrap)', value: 'left'   },
                  { label: 'Right (wrap)', value: 'right' },
                ],
              },
            ],
          },
        },
      }),
    ],
  }),

  secret: process.env.PAYLOAD_SECRET || 'lme-cms-dev-secret',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 10,
    },
  }),

  sharp,
})
