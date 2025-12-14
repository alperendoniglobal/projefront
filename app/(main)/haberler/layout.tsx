import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haberler',
  description: 'Özpolat İnşaat\'tan son haberler ve duyurular. İnşaat sektöründeki gelişmeler, proje haberleri ve şirket duyuruları.',
  keywords: ['inşaat haberleri', 'şirket haberleri', 'proje duyuruları', 'özpolat haberler', 'ankara inşaat haberleri'],
  openGraph: {
    title: 'Haberler | Özpolat İnşaat',
    description: 'Özpolat İnşaat\'tan son haberler ve duyurular.',
    url: 'https://ozpolatinsaat.tr/haberler',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ozpolatinsaat.tr/haberler',
  },
};

export default function HaberlerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
