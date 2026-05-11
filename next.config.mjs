import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // instrumentation.ts is stable in Next.js 15 — no experimental flag needed
}

export default withPayload(nextConfig)
