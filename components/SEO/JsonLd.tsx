'use client';

// JSON-LD Şema Tipleri
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProjectSchema {
  name: string;
  description: string;
  image: string;
  location: string;
  dateCreated: string;
}

export interface NewsSchema {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
}

// LocalBusiness JSON-LD (İletişim sayfası için)
export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://ozpolatinsaat.tr/#organization',
    name: 'Özpolat İnşaat',
    image: 'https://ozpolatinsaat.tr/logo.png',
    url: 'https://ozpolatinsaat.tr',
    telephone: '+90-312-000-0000',
    email: 'info@ozpolatinsaat.tr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'İlkbahar Mahallesi 610 sokak no 12',
      addressLocality: 'Çankaya',
      addressRegion: 'Ankara',
      postalCode: '06550',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.9035099,
      longitude: 32.62347815,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Turkey',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb JSON-LD
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Project JSON-LD (Proje detay sayfası için)
export function ProjectJsonLd({ project }: { project: ProjectSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    image: project.image,
    creator: {
      '@type': 'Organization',
      name: 'Özpolat İnşaat',
      url: 'https://ozpolatinsaat.tr',
    },
    locationCreated: {
      '@type': 'Place',
      name: project.location,
    },
    dateCreated: project.dateCreated,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// News Article JSON-LD (Haber detay sayfası için)
export function NewsArticleJsonLd({ news }: { news: NewsSchema }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.headline,
    description: news.description,
    image: news.image,
    datePublished: news.datePublished,
    dateModified: news.dateModified,
    author: {
      '@type': 'Organization',
      name: 'Özpolat İnşaat',
      url: 'https://ozpolatinsaat.tr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Özpolat İnşaat',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ozpolatinsaat.tr/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://ozpolatinsaat.tr/haberler',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ JSON-LD (SSS sayfası için)
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite JSON-LD (Ana sayfa için - Arama kutusu)
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Özpolat İnşaat',
    url: 'https://ozpolatinsaat.tr',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ozpolatinsaat.tr/projeler?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

