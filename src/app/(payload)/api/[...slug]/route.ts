import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'
import config from '@payload-config'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
// OPTIONS handler is required for CORS preflight — without it Next.js
// auto-responds 204 with no CORS headers, blocking all cross-origin
// POST/PATCH/DELETE requests (e.g. useLivePreview).
export const OPTIONS = REST_OPTIONS(config)
