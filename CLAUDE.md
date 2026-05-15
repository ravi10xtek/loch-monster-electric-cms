# LME CMS

Payload CMS v3 for Loch Monster Electric. Manages all content for the companion Next.js website at `../Loch Monster Electric`.

## Stack

- **CMS:** Payload CMS v3
- **Framework:** Next.js 15 (Payload runs as a Next.js app)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase in production)
- **Hosting:** Vercel (or Railway — see deployment notes)

## Local Development

```bash
npm install
npm run dev        # http://localhost:3001/admin
```

Requires a running PostgreSQL database. Set `DATABASE_URI` in `.env.local`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Secret key for Payload auth — use a long random string in production |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of this CMS (used for media URLs and API calls) |
| `LME_SITE_URL` | URL of the website — used for live preview and ISR revalidation |
| `LME_REVALIDATE_SECRET` | Shared secret for ISR webhook — must match `REVALIDATION_SECRET` in the website |
| `DATAFORSEO_LOGIN` | DataForSEO account email (can also be set in Admin > SEO Settings) |
| `DATAFORSEO_PASSWORD` | DataForSEO account password (can also be set in Admin > SEO Settings) |
| `GOOGLE_PSI_API_KEY` | Google PageSpeed Insights API key (can also be set in Admin > SEO Settings) |

## Project Structure

```
src/
  collections/       # Payload collection configs (one file per collection)
  globals/           # Payload global configs (one file per global)
  components/        # Custom React components for the admin UI
  lib/
    dataforseo.ts    # DataForSEO API client (competitor research)
    revalidate.ts    # Webhook helper — triggers ISR on the website after saves
  app/
    (payload)/       # Payload's built-in admin and API routes — do not edit
    api/seo/         # Custom SEO API routes (audit, competitor sync, discovery)
  payload.config.ts  # Main Payload configuration
  payload-types.ts   # Auto-generated TypeScript types — do not edit manually
```

## Collections

| Slug | Purpose |
|---|---|
| `locations` | Service area cities — each generates a `/service-areas/[city]` page |
| `services` | Individual electrical services |
| `service-hubs` | Service category landing pages (e.g. residential electrical) |
| `category-hubs` | Top-level category pages |
| `posts` | Blog/journal posts |
| `page-seo` | SEO metadata per page (title, description, OG image) |
| `pages` | Block-based custom pages via the page builder |
| `faqs` | FAQ entries shared across the site |
| `media` | Uploaded images and files |
| `users` | CMS admin users |
| `contact-submissions` | Contact form submissions from the website |
| `seo-audits` | PageSpeed Insights audit results per page |
| `competitors` | Tracked competitor domains and their keyword data |

## Globals

| Slug | Purpose |
|---|---|
| `home-page` | Homepage content blocks |
| `about-page` | About Us page content |
| `contact-page` | Contact page content |
| `pricing-page` | Pricing Estimates page content |
| `service-areas-page` | Service Areas hub page content |
| `shared-sections` | Content reused across multiple pages (e.g. footer CTA) |
| `seo-settings` | DataForSEO/PSI API credentials, seed keywords, target location |

## SEO Tools

The SEO layer lives in `src/app/api/seo/` and `src/lib/dataforseo.ts`.

### Run a site audit
```bash
npm run seo:audit
# or audit a single page:
npm run seo:audit -- --url /about-us
```
Calls the Google PageSpeed Insights API for each page and saves results to the `seo-audits` collection. Results appear in the dashboard widget on the admin home screen.

Requires `GOOGLE_PSI_API_KEY` (env var or Admin > SEO Settings).

### Discover competitors
```bash
npm run seo:discover
```
Searches DataForSEO using the seed keywords in SEO Settings and returns domains appearing in local SERPs. Review the output and manually add the ones you want to track in Admin > Competitors.

### Sync a competitor
```
POST /api/seo/sync-competitor  { "competitorId": "<id>" }
```
Pulls ranked keywords for a saved Competitor record from DataForSEO, computes keyword gaps vs. LME's target list, and updates the record.

## Key Conventions

- **One collection/global per file** in `src/collections/` and `src/globals/`
- **`admin.group`** — use `'SEO'` for SEO-related collections/globals so they appear grouped in the sidebar
- **`payload-types.ts` is auto-generated** — never edit it manually; run `npm run generate:types` to regenerate after schema changes
- **`importMap.js` is auto-generated** — Payload regenerates it on `npm run dev`; never edit manually
- **Custom admin components** go in `src/components/` and must be registered in `payload.config.ts` under `admin.components`
- **Revalidation** — `src/lib/revalidate.ts` is called by collection/global hooks after saves to trigger ISR on the website. Add it to new collections that have corresponding website pages.

## Adding a New Collection

1. Create `src/collections/MyCollection.ts`
2. Import and add to `collections: [...]` in `src/payload.config.ts`
3. Run `npm run generate:types` to update `payload-types.ts`
4. If it has corresponding website pages, add a revalidation hook and an entry in the website's `COLLECTION_MAP` (`app/api/revalidate/route.js`)

## Live Preview

Live preview is enabled for globals and `service-hubs` / `category-hubs` collections. The preview URL is configured in `payload.config.ts` under `admin.livePreview.url`. To add preview support for a new collection, add it to the `collections` array there and create a preview route in the website at `app/preview/[collection]/[slug]/`.

## Deployment Notes

- Payload v3 with PostgreSQL works on Vercel — use the Supabase transaction pooler URI for `DATABASE_URI`
- The SEO audit route uses the Google PSI API (pure HTTP fetch) — fully compatible with Vercel serverless
- Media uploads go to `./media` locally; configure an S3/R2 adapter for production storage
