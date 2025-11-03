import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nodelo — Build product-grade apps. Fast.",
  description:
    "Nodelo builds end-to-end web apps for startups and teams. Fast delivery, production-ready code, and optional audited smart contracts.",
  generator: "Nodelo",
  openGraph: {
    title: "Nodelo — Build product-grade apps. Fast.",
    description:
      "Nodelo builds end-to-end web apps for startups and teams. Fast delivery, production-ready code, and optional audited smart contracts.",
    images: ["/nodelo-web-development.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nodelo — Build product-grade apps. Fast.",
    description: "Nodelo builds end-to-end web apps for startups and teams.",
  },
  icons: {
    icon: "/logo3.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <Suspense>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-nodelo-500 focus:text-white focus:rounded-md"
            >
              Skip to content
            </a>
          </Suspense>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
