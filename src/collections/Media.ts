import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'SEO & Settings',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'createdAt'],
    description: 'Name files descriptively before uploading, e.g. "panel-upgrade-minneapolis.jpg" not "IMG_3847.jpg".',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' && args.req?.file?.name) {
          const original: string = args.req.file.name
          const lastDot = original.lastIndexOf('.')
          const ext = lastDot >= 0 ? original.slice(lastDot + 1).toLowerCase() : ''
          const base = lastDot >= 0 ? original.slice(0, lastDot) : original
          const sanitized = base
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
          args.req.file.name = ext ? `${sanitized}.${ext}` : sanitized
        }
        return args
      },
    ],
    afterChange: [
      // When a media file is replaced or its alt/caption changes, the
      // collections that reference it don't fire their own afterChange.
      // We don't know which docs reference this media, so we tell the
      // website to revalidate broadly via a 'media' collection signal.
      async () => {
        await revalidate({ collection: 'media' as never })
      },
    ],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'hero',
        width: 1920,
        height: 800,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
    ],
    formatOptions: {
      format: 'webp',
      options: { quality: 90 },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for screen readers and SEO, e.g. "Electrician installing panel in Minneapolis home".' },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
