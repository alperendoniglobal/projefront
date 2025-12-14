import { Metadata, ResolvingMetadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
}

async function getNews(slug: string): Promise<News | null> {
  try {
    const res = await fetch(`${API_URL}/api/news/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const newsItem = await getNews(slug);

  if (!newsItem) {
    return {
      title: 'Haber Bulunamadı',
    };
  }

  const imageUrl = newsItem.image?.startsWith('http') 
    ? newsItem.image 
    : `${API_URL}${newsItem.image}`;

  return {
    title: newsItem.title,
    description: newsItem.excerpt?.slice(0, 160) || newsItem.title,
    keywords: [newsItem.title, 'haber', 'duyuru', 'özpolat inşaat haberleri'],
    openGraph: {
      title: `${newsItem.title} | Özpolat İnşaat`,
      description: newsItem.excerpt?.slice(0, 160),
      url: `https://ozpolatinsaat.tr/haberler/${slug}`,
      type: 'article',
      publishedTime: newsItem.date,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: newsItem.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: newsItem.title,
      description: newsItem.excerpt?.slice(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://ozpolatinsaat.tr/haberler/${slug}`,
    },
  };
}

export default function HaberDetayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

