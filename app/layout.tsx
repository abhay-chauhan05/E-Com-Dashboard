// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Product Dashboard',
  description: 'Manage your products efficiently',
}

import ThemeToggle from '@/components/ThemeToggle'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Inline script to set theme early and avoid FOUC */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){} })()` }} />

        <Providers>
          <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
          {children}
        </Providers>
      </body>
    </html>
  )
}
