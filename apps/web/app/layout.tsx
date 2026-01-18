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
  metadataBase: new URL("https://opometrics.es"),
  title: {
    default: "OpoMetrics - Predicción ML para Oposiciones | Machine Learning Real",
    template: "%s | OpoMetrics",
  },
  description:
    "Plataforma de oposiciones con predicción basada en Machine Learning. Algoritmos reales (Random Forest, XGBoost, Ensemble) que calculan tu probabilidad de aprobar con 87% de precisión.",
  keywords: [
    "oposiciones machine learning",
    "predicción oposiciones",
    "analytics oposiciones",
    "IA oposiciones",
    "academia oposiciones online",
    "test oposiciones",
    "auxiliar administrativo",
    "oposiciones estado",
    "random forest oposiciones",
    "métricas oposiciones",
    "simulacros oposiciones",
    "predicción aprobado",
  ],
  authors: [{ name: "OpoMetrics", url: "https://opometrics.es" }],
  creator: "OpoMetrics",
  publisher: "OpoMetrics",
  manifest: "/manifest.json",
  category: "education",
  classification: "Academia de Oposiciones Online",
  referrer: "origin-when-cross-origin",
  generator: "Next.js",
  applicationName: "OpoMetrics",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OpoMetrics",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://opometrics.es",
    siteName: "OpoMetrics",
    title: "OpoMetrics - Predicción ML para Oposiciones",
    description:
      "Machine Learning real para oposiciones. Algoritmos Random Forest, XGBoost y Ensemble que predicen tu aprobado con 87% de precisión.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpoMetrics - Academia de Oposiciones con IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@opometrics",
    creator: "@opometrics",
    title: "OpoMetrics - Academia de Oposiciones con IA",
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
    canonical: "https://opometrics.es",
    languages: {
      "es-ES": "https://opometrics.es",
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
        <meta name="apple-mobile-web-app-title" content="OpoMetrics" />

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
                OpoMetrics necesita JavaScript para funcionar correctamente.
                Por favor, habilita JavaScript en tu navegador.
              </p>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  )
}
