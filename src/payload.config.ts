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
import { ContactSubmissions } from './collections/ContactSubmissions'
import { FAQs } from './collections/FAQs'
import { ServiceHubs } from './collections/ServiceHubs'
import { CategoryHubs } from './collections/CategoryHubs'
import { SEOAudits } from './collections/SEOAudits'
import { Competitors } from './collections/Competitors'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { PricingPage } from './globals/PricingPage'
import { ServiceAreasPage } from './globals/ServiceAreasPage'
import { SharedSections } from './globals/SharedSections'
import { SEOSettings } from './globals/SEOSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUri =
  process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',

  admin: {
    user: Users.slug,
    theme: 'dark',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— LME CMS',
    },
    components: {
      beforeDashboard: ['@/components/SEODashboard#SEODashboard'],
    },
    livePreview: {
      url: ({ globalConfig, collectionConfig, data }) => {
        const site = process.env.LME_SITE_URL || 'http://localhost:3000'
        if (globalConfig?.slug) {
          return `${site}/preview/global/${globalConfig.slug}`
        }
        if (collectionConfig?.slug === 'service-hubs') {
          return `${site}/preview/service-hub/${data?.slug}`
        }
        if (collectionConfig?.slug === 'category-hubs') {
          return `${site}/preview/category-hub/${data?.slug}`
        }
        return site
      },
      globals: ['home-page', 'about-page', 'contact-page', 'pricing-page', 'service-areas-page', 'shared-sections'],
      collections: ['service-hubs', 'category-hubs'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  collections: [Posts, Media, PageSEO, Users, Locations, Services, Pages, ContactSubmissions, FAQs, ServiceHubs, CategoryHubs, SEOAudits, Competitors],

  globals: [HomePage, AboutPage, ContactPage, PricingPage, ServiceAreasPage, SharedSections, SEOSettings],

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
      connectionString: databaseUri,
      max: process.env.VERCEL ? 1 : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.VERCEL ? { rejectUnauthorized: false } : undefined,
    },
  }),

  sharp,
})
