import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  subsets: ['latin'], 
  weights: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  title: 'AI Meme Generator - Create Viral Memes Instantly',
  description: 'Stay on top of the trend with instant laughs! Generate hilarious AI-powered memes in seconds and share them across all social media platforms.',
  keywords: 'meme generator, AI memes, viral content, social media, trending, funny, instant memes',
  openGraph: {
    title: 'AI Meme Generator - Create Viral Memes Instantly',
    description: 'Generate hilarious AI-powered memes in seconds and share them across all social media platforms.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594736797933-d0ca9c799d10?w=1200&h=630&fit=crop&auto=format',
        width: 1200,
        height: 630,
        alt: 'AI Meme Generator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Meme Generator - Create Viral Memes Instantly',
    description: 'Generate hilarious AI-powered memes in seconds and share them across all social media platforms.',
    images: ['https://images.unsplash.com/photo-1594736797933-d0ca9c799d10?w=1200&h=630&fit=crop&auto=format']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        {children}
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}