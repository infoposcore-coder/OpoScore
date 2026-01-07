// ===========================================
// OpoScore - Schema.org JSON-LD Components
// Para mejorar SEO y rich snippets
// ===========================================

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'OpoScore',
    url: 'https://oposcore.es',
    logo: 'https://oposcore.es/icons/icon-512x512.png',
    description: 'Academia de oposiciones online con IA predictiva. La primera plataforma que te dice objetivamente cuando estas listo para aprobar.',
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

export function CourseJsonLd({
  name,
  description,
  provider = 'OpoScore',
  url,
}: {
  name: string
  description: string
  provider?: string
  url?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: 'https://oposcore.es',
    },
    ...(url && { url }),
    inLanguage: 'es',
    courseMode: 'online',
    isAccessibleForFree: false,
    offers: {
      '@type': 'Offer',
      category: 'Subscription',
      priceCurrency: 'EUR',
      price: '19',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpoScore',
    url: 'https://oposcore.es',
    description: 'Academia de oposiciones online con IA predictiva',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://oposcore.es/buscar?q={search_term_string}',
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

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
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
