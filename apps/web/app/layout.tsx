import type { Metadata, Viewport } from "next"
import { Inter, DM_Serif_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd"

// Fuente principal - Sans serif para cuerpo
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

// Fuente secundaria - Serif para títulos premium
const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://oposcore.es"),
  title: {
    default: "OpoScore - Academia de Oposiciones con IA | Predice tu Aprobado",
    template: "%s | OpoScore",
  },
  description:
    "La primera academia de oposiciones que te dice objetivamente cuándo estás listo para aprobar. Tests ilimitados, tutor IA 24/7 y sistema de predicción basado en datos.",
  keywords: [
    "oposiciones",
    "academia oposiciones online",
    "preparar oposiciones",
    "auxiliar administrativo",
    "test oposiciones",
    "IA oposiciones",
    "academia oposiciones",
    "oposiciones estado",
    "tramitacion procesal",
    "oposiciones correos",
    "simulacros oposiciones",
    "tests oposiciones gratis",
  ],
  authors: [{ name: "OpoScore", url: "https://oposcore.es" }],
  creator: "OpoScore",
  publisher: "OpoScore",
  manifest: "/manifest.json",
  category: "education",
  classification: "Academia de Oposiciones Online",
  referrer: "origin-when-cross-origin",
  generator: "Next.js",
  applicationName: "OpoScore",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OpoScore",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://oposcore.es",
    siteName: "OpoScore",
    title: "OpoScore - Academia de Oposiciones con IA",
    description:
      "La primera academia que te dice objetivamente cuándo estás listo para aprobar. Predicción basada en datos, tests ilimitados y tutor IA.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpoScore - Academia de Oposiciones con IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@oposcore",
    creator: "@oposcore",
    title: "OpoScore - Academia de Oposiciones con IA",
    description:
      "La primera academia que te dice objetivamente cuándo estás listo para aprobar.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://oposcore.es",
    languages: {
      "es-ES": "https://oposcore.es",
    },
  },
  verification: {
    // google: "tu-codigo-de-verificacion",
    // yandex: "tu-codigo-yandex",
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch para servicios externos */}
        <link rel="dns-prefetch" href="https://api.stripe.com" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OpoScore" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Structured Data */}
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {/* Skip to main content - Accesibilidad */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Saltar al contenido principal
        </a>

        <Providers>
          <main id="main-content" className="relative">
            {children}
          </main>
        </Providers>

        {/* Noscript fallback */}
        <noscript>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-8 text-center">
            <div>
              <h1 className="text-2xl font-bold mb-4">JavaScript Requerido</h1>
              <p className="text-muted-foreground">
                OpoScore necesita JavaScript para funcionar correctamente.
                Por favor, habilita JavaScript en tu navegador.
              </p>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  )
}
