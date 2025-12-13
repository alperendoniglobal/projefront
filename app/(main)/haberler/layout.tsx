import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haberler',
  description: 'Özpolat İnşaat\'tan son haberler ve duyurular. Projelerimiz, başarılarımız ve sektörel gelişmeler hakkında bilgi edinin.',
  openGraph: {
    title: 'Haberler | Özpolat İnşaat',
    description: 'Özpolat İnşaat\'tan son haberler ve duyurular.',
  },
};

export default function HaberlerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

