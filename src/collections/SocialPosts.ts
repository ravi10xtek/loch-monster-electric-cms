import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const SocialPosts: CollectionConfig = {
  slug: 'social-posts',
  admin: {
    group: 'Content',
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'postType', 'platform', 'publishedAt'],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'social-posts' }) }],
  },
  fields: [
    {
      name: 'postType', type: 'select', required: true,
      options: [{ label: 'Static Post', value: 'static' }, { label: 'Reel / Video', value: 'reel' }],
    },
    {
      name: 'platform', type: 'select', required: true, defaultValue: 'facebook',
      options: [
        { label: 'Facebook', value: 'facebook' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
      ],
    },
    {
      name: 'thumbnail', type: 'upload', relationTo: 'media', required: true, label: 'Thumbnail Image',
      admin: { components: { afterInput: ['@/components/GenerateImageButton#GenerateImageButton'] } },
    },
    { name: 'caption', type: 'textarea', required: true },
    { name: 'postUrl', type: 'text', required: true, label: 'Post URL' },
    { name: 'publishedAt', type: 'date', required: true, label: 'Published Date' },
  ],
}
