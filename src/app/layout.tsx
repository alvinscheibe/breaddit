import '@/styles/globals.css'
import React from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/providers';

export const metadata = {
  title: 'Breaddit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({
  children, authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode,
}) {
  return (
    <html lang='en' className={cn('bg-white text-slate-900 antialiased light', inter.className)}>
      <body className={'min-h-screen pt-12 bg-slate-50 antialiased'}>
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className={'container max-w-7xl mx-auto h-full pt-12'}>
            {children}
          </div>
  
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
