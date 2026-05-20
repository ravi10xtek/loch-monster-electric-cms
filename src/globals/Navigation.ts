import type { GlobalConfig } from 'payload'
import { revalidate } from '../lib/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Settings',
    description: 'Edit the site nav bar: top-level links, service mega menus, and mobile menu.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidate({ collection: 'global-navigation' }) }],
  },
  fields: [
    // ── Top navigation links ───────────────────────────────────────────────
    {
      name: 'topLinks',
      type: 'array',
      label: 'Top Navigation Links',
      admin: { description: 'Non-dropdown links shown in the nav bar (Pricing, Journal, Media, etc.).' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },

    // ── Service mega menus ─────────────────────────────────────────────────
    {
      name: 'serviceMenus',
      type: 'array',
      label: 'Service Mega Menus',
      admin: { description: 'The three service dropdowns (Residential, Commercial, HOA). Each has hub categories and individual services.' },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          admin: { description: 'Internal key: residential | commercial | hoa' },
        },
        { name: 'label', type: 'text', required: true, admin: { description: 'Nav label e.g. RESIDENTIAL' } },
        { name: 'topHref', type: 'text', required: true, admin: { description: 'Link for the nav label itself' } },
        {
          name: 'hubs',
          type: 'array',
          label: 'Hub Categories',
          admin: { description: 'Left column of the mega menu (e.g. Electrical Repairs, Electrical Upgrades).' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            {
              name: 'services',
              type: 'array',
              label: 'Services',
              admin: { description: 'Right column items shown when this hub is hovered.' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },

    // ── Mobile navigation ──────────────────────────────────────────────────
    {
      name: 'mobileLinks',
      type: 'array',
      label: 'Mobile Navigation Links',
      admin: { description: 'Links shown in the hamburger menu on mobile.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
