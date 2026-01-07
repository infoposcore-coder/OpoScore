import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "OpoScore - Academia de Oposiciones con IA",
    template: "%s | OpoScore",
  },
  description:
    "La primera academia que te dice objetivamente cuándo estás listo para aprobar, usando ciencia de datos e inteligencia artificial.",
  keywords: [
    "oposiciones",
    "academia online",
    "preparar oposiciones",
    "auxiliar administrativo",
    "test oposiciones",
    "IA oposiciones",
  ],
  authors: [{ name: "OpoScore" }],
  creator: "OpoScore",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OpoScore",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://oposcore.es",
    siteName: "OpoScore",
    title: "OpoScore - Academia de Oposiciones con IA",
    description:
      "La primera academia que te dice objetivamente cuándo estás listo para aprobar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpoScore - Academia de Oposiciones con IA",
    description:
      "La primera academia que te dice objetivamente cuándo estás listo para aprobar.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
        >
          Saltar al contenido principal
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
