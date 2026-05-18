import type { CollectionConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'serviceType', 'completedAt'],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'projects' as never }) }],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'category', type: 'select', required: true,
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Team & Events', value: 'team-events' },
      ],
    },
    { name: 'serviceType', type: 'text', label: 'Service Type', admin: { placeholder: 'e.g. 200A Panel Upgrade' } },
    { name: 'location', type: 'text', admin: { placeholder: 'e.g. Minneapolis, MN' } },
    { name: 'completedAt', type: 'date', label: 'Completion Date' },
    { name: 'excerpt', type: 'textarea', label: 'Short Description' },
    {
      name: 'coverImage', type: 'upload', relationTo: 'media', required: true, label: 'Cover Image',
      admin: { components: { afterInput: ['@/components/GenerateImageButton#GenerateImageButton'] } },
    },
    {
      name: 'photos', type: 'array', label: 'Project Photos',
      fields: [
        {
          name: 'image', type: 'upload', relationTo: 'media', required: true,
          admin: { components: { afterInput: ['@/components/GenerateImageButton#GenerateImageButton'] } },
        },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
