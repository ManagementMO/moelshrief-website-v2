import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import JsonLd from "@/components/JsonLd"
import { Analytics } from "@vercel/analytics/next"
import { Analytics } from "@vercel/analytics/react"

import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mohammed Elshrief | Data Artisan & Full Stack Developer",
  description: "Portfolio of Mohammed Elshrief, a Data Artisan and Full Stack Developer specializing in Excel/VBA, Python, and web development. View my projects in finance, productivity tools, and AI applications.",
  keywords: [
    "Mohammed Elshrief",
    "Mo Elshrief",
    "Data Artisan",
    "Full Stack Developer",
    "Excel Developer",
    "VBA Developer",
    "Python Developer",
    "Portfolio",
    "Web Development",
    "Financial Tools",
    "Productivity Tools",
    "AI Development",
    "Toronto Developer",
    "Canadian Developer"
  ],
  authors: [{ name: "Mohammed Elshrief" }],
  creator: "Mohammed Elshrief",
  publisher: "Mohammed Elshrief",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moelshrief.wiki",
    title: "Mohammed Elshrief | Data Artisan & Full Stack Developer",
    description: "Portfolio of Mohammed Elshrief, a Data Artisan and Full Stack Developer specializing in Excel/VBA, Python, and web development.",
    siteName: "Mohammed Elshrief Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mohammed Elshrief - Data Artisan & Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Elshrief | Data Artisan & Full Stack Developer",
    description: "Portfolio of Mohammed Elshrief, a Data Artisan and Full Stack Developer specializing in Excel/VBA, Python, and web development.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // You'll need to add this later
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://moelshrief.wiki" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <JsonLd />
      </head>
      <body className={inter.className}>{children}
      <Analytics />
      </body>
    </html>
  )
} 