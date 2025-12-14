import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri',
  description: 'Özpolat İnşaat proje galerisi. Tamamlanan ve devam eden projelerimizin fotoğraflarını inceleyin.',
  keywords: ['galeri', 'proje fotoğrafları', 'inşaat görselleri', 'özpolat galeri', 'proje görselleri'],
  openGraph: {
    title: 'Galeri | Özpolat İnşaat',
    description: 'Özpolat İnşaat proje galerisi. Projelerimizin fotoğraflarını inceleyin.',
    url: 'https://ozpolatinsaat.tr/galeri',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ozpolatinsaat.tr/galeri',
  },
};

export default function GaleriLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
