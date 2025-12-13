import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ozpolatinsaat.tr';

  // Static pages
  const staticPages = [
    '',
    '/kurumsal',
    '/projeler',
    '/kariyer',
    '/haberler',
    '/iletisim',
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }));

  return staticUrls;
}

