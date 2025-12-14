import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projeler',
  description: 'Özpolat İnşaat tarafından tamamlanan ve devam eden tüm inşaat projelerini inceleyin. Konut, ticari, altyapı ve kamu projeleri.',
  keywords: ['inşaat projeleri', 'konut projeleri', 'tamamlanan projeler', 'devam eden projeler', 'ankara inşaat projeleri', 'özpolat projeler'],
  openGraph: {
    title: 'Projeler | Özpolat İnşaat',
    description: 'Özpolat İnşaat tarafından tamamlanan ve devam eden tüm inşaat projelerini inceleyin.',
    url: 'https://ozpolatinsaat.tr/projeler',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ozpolatinsaat.tr/projeler',
  },
};

export default function ProjelerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
