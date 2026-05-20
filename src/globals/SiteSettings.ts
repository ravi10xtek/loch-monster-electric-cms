import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Contact info, social media links, business hours and license numbers shown in the header and footer.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-site-settings' }) }],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        { name: 'phone', type: 'text', label: 'Phone Number', defaultValue: '763-292-1191' },
        { name: 'email', type: 'email', label: 'Email Address', defaultValue: 'service@lochmonsterelectric.com' },
        { name: 'address', type: 'text', label: 'Business Address', defaultValue: '7600 W 27th St # 213, St Louis Park, MN 55426' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Business Hours',
      fields: [
        { name: 'businessHours', type: 'text', label: 'Regular Hours', defaultValue: 'Monday–Friday: 8:00 AM – 5:00 PM' },
        { name: 'emergencyNote', type: 'text', label: 'Emergency Note', defaultValue: 'Emergency service available 24/7' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Licenses',
      fields: [
        { name: 'licenseMN', type: 'text', label: 'Minnesota License', defaultValue: 'EA807591' },
        { name: 'licenseWI', type: 'text', label: 'Wisconsin License', defaultValue: '1443 — EC' },
        { name: 'serviceAreaNote', type: 'text', label: 'Service Area Note', defaultValue: 'Licensed Minnesota & Wisconsin Electrical Contractor Serving the Twin Cities Metro and Surrounding Areas' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social Media',
      fields: [
        { name: 'facebook', type: 'text', label: 'Facebook URL', admin: { placeholder: 'https://facebook.com/...' } },
        { name: 'instagram', type: 'text', label: 'Instagram URL', admin: { placeholder: 'https://instagram.com/...' } },
        { name: 'x', type: 'text', label: 'X (Twitter) URL', admin: { placeholder: 'https://x.com/...' } },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL', admin: { placeholder: 'https://linkedin.com/...' } },
        { name: 'tiktok', type: 'text', label: 'TikTok URL', admin: { placeholder: 'https://tiktok.com/...' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Footer',
      fields: [
        { name: 'copyrightName', type: 'text', label: 'Copyright Name', defaultValue: 'Loch Monster Electric' },
      ],
    },
  ],
}
