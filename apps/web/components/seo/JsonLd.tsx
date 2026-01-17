/**
 * JSON-LD Structured Data Components
 * Para mejor SEO y Rich Snippets
 */

// ============================================
// ORGANIZATION
// ============================================

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'OpoScore',
    alternateName: 'Academia OpoScore',
    url: 'https://oposcore.es',
    logo: 'https://oposcore.es/icons/icon-512x512.svg',
    description: 'Academia de oposiciones online con IA predictiva. La primera plataforma que te dice objetivamente cuándo estás listo para aprobar.',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/oposcore',
      'https://instagram.com/oposcore',
      'https://linkedin.com/company/oposcore',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contacto@oposcore.es',
      contactType: 'customer service',
      availableLanguage: ['Spanish'],
      areaServed: 'ES',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Spain',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// WEBSITE
// ============================================

export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpoScore',
    alternateName: 'Academia OpoScore',
    url: 'https://oposcore.es',
    description: 'Academia de oposiciones online con IA predictiva. Tests ilimitados y predicción de aprobado.',
    inLanguage: 'es-ES',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://oposcore.es/oposiciones?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// COURSE (para páginas de oposiciones)
// ============================================

interface CourseJsonLdProps {
  name: string
  description: string
  url?: string
  provider?: string
  price?: number
  currency?: string
}

export function CourseJsonLd({
  name,
  description,
  url,
  provider = 'OpoScore',
  price = 19,
  currency = 'EUR',
}: CourseJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    ...(url && { url }),
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: 'https://oposcore.es',
    },
    inLanguage: 'es',
    courseMode: 'online',
    isAccessibleForFree: false,
    offers: {
      '@type': 'Offer',
      category: 'Subscription',
      price: String(price),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: url || 'https://oposcore.es/precios',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'P6M',
    },
    educationalLevel: 'beginner to advanced',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// FAQ
// ============================================

interface FAQItem {
  question: string
  answer: string
}

interface FAQJsonLdProps {
  faqs: FAQItem[]
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// SOFTWARE APPLICATION
// ============================================

export function SoftwareApplicationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpoScore',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Academia de oposiciones con IA. Tests ilimitados y predicción de aprobado.',
    downloadUrl: 'https://oposcore.es',
    featureList: [
      'Tests ilimitados',
      'Tutor IA 24/7',
      'Predicción de aprobado',
      'Flashcards con repetición espaciada',
      'Simulacros cronometrados',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// BREADCRUMB
// ============================================

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// REVIEW / TESTIMONIAL
// ============================================

interface Review {
  author: string
  rating: number
  text: string
  date?: string
}

interface ReviewJsonLdProps {
  reviews: Review[]
  itemName: string
  itemUrl: string
}

export function ReviewJsonLd({ reviews, itemName, itemUrl }: ReviewJsonLdProps) {
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    url: itemUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: reviews.length,
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: review.text,
      datePublished: review.date || new Date().toISOString().split('T')[0],
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// HOW TO (para tutoriales)
// ============================================

interface HowToStep {
  name: string
  text: string
  url?: string
  image?: string
}

interface HowToJsonLdProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string
}

export function HowToJsonLd({ name, description, steps, totalTime }: HowToJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && { image: step.image }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// EDUCATIONAL OCCUPATION (para oposiciones)
// ============================================

interface OccupationJsonLdProps {
  name: string
  description: string
  educationRequirements: string
  salary?: {
    min: number
    max: number
    currency?: string
  }
}

export function OccupationJsonLd({
  name,
  description,
  educationRequirements,
  salary,
}: OccupationJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    name,
    description,
    educationRequirements: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: educationRequirements,
    },
    occupationLocation: {
      '@type': 'Country',
      name: 'Spain',
    },
    ...(salary && {
      estimatedSalary: {
        '@type': 'MonetaryAmountDistribution',
        name: 'Salario anual',
        currency: salary.currency || 'EUR',
        minValue: salary.min,
        maxValue: salary.max,
        percentile10: salary.min,
        percentile90: salary.max,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
