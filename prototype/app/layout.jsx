// app/layout.jsx
import React from 'react'

export const metadata = {
  title: 'Orbitless Chat',
  description: 'Simple WebRTC P2P chat using Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
