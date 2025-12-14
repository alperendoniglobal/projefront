import { Metadata, ResolvingMetadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ozpolatinsaat.tr/backend';

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  year: string;
  category: string;
  image: string;
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_URL}/api/projects/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: 'Proje Bulunamadı',
    };
  }

  const imageUrl = project.image?.startsWith('http') 
    ? project.image 
    : `${API_URL}${project.image}`;

  return {
    title: project.title,
    description: project.description?.slice(0, 160) || `${project.title} - ${project.location} - Özpolat İnşaat`,
    keywords: [project.title, project.location, 'inşaat projesi', 'özpolat', project.category === 'devam-eden' ? 'devam eden proje' : 'tamamlanan proje'],
    openGraph: {
      title: `${project.title} | Özpolat İnşaat`,
      description: project.description?.slice(0, 160),
      url: `https://ozpolatinsaat.tr/projeler/${id}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description?.slice(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://ozpolatinsaat.tr/projeler/${id}`,
    },
  };
}

export default function ProjeDetayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

