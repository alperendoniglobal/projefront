import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { WebSiteJsonLd } from '@/components/SEO/JsonLd';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ozpolatinsaat.tr'),
  title: {
    default: 'Özpolat İnşaat | Güvenilir İnşaat ve Taahhüt Hizmetleri',
    template: '%s | Özpolat İnşaat',
  },
  description:
    'Özpolat İnşaat, 2004 yılından bu yana Türkiye genelinde konut, ticari ve altyapı projelerinde kaliteli inşaat hizmetleri sunmaktadır. Güvenilir, deneyimli ve yenilikçi çözümler.',
  keywords: [
    'inşaat',
    'inşaat şirketi',
    'müteahhit',
    'konut projesi',
    'altyapı',
    'taahhüt',
    'Ankara inşaat',
    'Türkiye inşaat',
    'Özpolat İnşaat',
    'bina yapım',
    'yol yapım',
    'peyzaj',
  ],
  authors: [{ name: 'Özpolat İnşaat' }],
  creator: 'Özpolat İnşaat',
  publisher: 'Özpolat İnşaat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://ozpolatinsaat.tr',
    siteName: 'Özpolat İnşaat',
    title: 'Özpolat İnşaat | Güvenilir İnşaat ve Taahhüt Hizmetleri',
    description:
      'Özpolat İnşaat, 2004 yılından bu yana Türkiye genelinde konut, ticari ve altyapı projelerinde kaliteli inşaat hizmetleri sunmaktadır.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Özpolat İnşaat',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Özpolat İnşaat | Güvenilir İnşaat ve Taahhüt Hizmetleri',
    description:
      'Özpolat İnşaat, 2004 yılından bu yana Türkiye genelinde konut, ticari ve altyapı projelerinde kaliteli inşaat hizmetleri sunmaktadır.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://ozpolatinsaat.tr',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4A853" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Özpolat İnşaat',
              url: 'https://ozpolatinsaat.tr',
              logo: 'https://ozpolatinsaat.tr/logo.png',
              description:
                'Özpolat İnşaat, 2004 yılından bu yana Türkiye genelinde konut, ticari ve altyapı projelerinde kaliteli inşaat hizmetleri sunmaktadır.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ankara',
                addressCountry: 'TR',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+90-312-000-0000',
                contactType: 'customer service',
                availableLanguage: ['Turkish'],
              },
              sameAs: [
                'https://facebook.com/ozpolatinsaat',
                'https://instagram.com/ozpolatinsaat',
                'https://linkedin.com/company/ozpolatinsaat',
                'https://twitter.com/ozpolatinsaat',
              ],
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <WebSiteJsonLd />
        {children}
      </body>
    </html>
  );
}
