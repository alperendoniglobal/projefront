import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

interface Project {
  id: string;
  updatedAt: string;
}

interface News {
  slug: string;
  updatedAt: string;
}

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getNews(): Promise<News[]> {
  try {
    const res = await fetch(`${API_URL}/api/news`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ozpolatinsaat.tr';

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/kurumsal`, priority: 0.9 },
    { url: `${baseUrl}/projeler`, priority: 0.9 },
    { url: `${baseUrl}/haberler`, priority: 0.8 },
    { url: `${baseUrl}/galeri`, priority: 0.7 },
    { url: `${baseUrl}/kariyer`, priority: 0.7 },
    { url: `${baseUrl}/iletisim`, priority: 0.8 },
  ];

  const staticUrls = staticPages.map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page.priority,
  }));

  // Dynamic project pages
  const projects = await getProjects();
  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projeler/${project.id}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic news pages
  const news = await getNews();
  const newsUrls = news.map((item) => ({
    url: `${baseUrl}/haberler/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...projectUrls, ...newsUrls];
}
