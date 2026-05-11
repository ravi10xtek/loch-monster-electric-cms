import React from 'react'

export const metadata = {
  title: 'LME CMS',
  description: 'Content management for Loch Monster Electric',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
