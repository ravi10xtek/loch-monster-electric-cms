import '@payloadcms/next/css'

import { RootLayout as PayloadRootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import type { ServerFunctionClient } from 'payload'

import { importMap } from './(payload)/admin/importMap.js'

export const metadata = {
  title: 'LME CMS',
  description: 'Content management for Loch Monster Electric',
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return PayloadRootLayout({
    children,
    config,
    importMap,
    serverFunction,
  })
}
