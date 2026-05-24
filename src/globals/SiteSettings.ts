import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Site Config',
    description: 'Contact info, social media links, business hours and license numbers shown in the header and footer.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-site-settings' }) }],
  },
  fields: [
    // ── Contact ──────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: 'Phone Number', defaultValue: '763-292-1191', admin: { width: '33%' } },
        { name: 'email', type: 'email', label: 'Email Address', defaultValue: 'service@lochmonsterelectric.com', admin: { width: '33%' } },
        { name: 'address', type: 'text', label: 'Business Address', defaultValue: '7600 W 27th St # 213, St Louis Park, MN 55426', admin: { width: '34%' } },
      ],
    },
    // ── Hours ─────────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'businessHours', type: 'text', label: 'Business Hours', defaultValue: 'Monday–Friday: 8:00 AM – 5:00 PM', admin: { width: '50%' } },
        { name: 'emergencyNote', type: 'text', label: 'Emergency Note', defaultValue: 'Emergency service available 24/7', admin: { width: '50%' } },
      ],
    },
    // ── Licenses ──────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'licenseMN', type: 'text', label: 'MN License Number', defaultValue: 'EA807591', admin: { width: '25%' } },
        { name: 'licenseWI', type: 'text', label: 'WI License Number', defaultValue: '1443 — EC', admin: { width: '25%' } },
        { name: 'serviceAreaNote', type: 'text', label: 'Service Area Note', defaultValue: 'Licensed Minnesota & Wisconsin Electrical Contractor Serving the Twin Cities Metro and Surrounding Areas', admin: { width: '50%' } },
      ],
    },
    // ── Social Media ──────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'facebook', type: 'text', label: 'Facebook URL', admin: { width: '20%', placeholder: 'https://facebook.com/...' } },
        { name: 'instagram', type: 'text', label: 'Instagram URL', admin: { width: '20%', placeholder: 'https://instagram.com/...' } },
        { name: 'x', type: 'text', label: 'X (Twitter) URL', admin: { width: '20%', placeholder: 'https://x.com/...' } },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL', admin: { width: '20%', placeholder: 'https://linkedin.com/...' } },
        { name: 'tiktok', type: 'text', label: 'TikTok URL', admin: { width: '20%', placeholder: 'https://tiktok.com/...' } },
        { name: 'youtube', type: 'text', label: 'YouTube URL', admin: { width: '20%', placeholder: 'https://youtube.com/@...' } },
      ],
    },
    // ── Footer ────────────────────────────────────────────────────────────────
    { name: 'copyrightName', type: 'text', label: 'Copyright Name', defaultValue: 'Loch Monster Electric', admin: { width: '33%' } },
  ],
}
