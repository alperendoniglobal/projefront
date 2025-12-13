import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projelerimiz',
  description: 'Özpolat İnşaat tarafından tamamlanan ve devam eden projeler. Konut, ticari, sağlık ve altyapı projelerimizi inceleyin.',
  openGraph: {
    title: 'Projelerimiz | Özpolat İnşaat',
    description: 'Özpolat İnşaat tarafından tamamlanan ve devam eden projeler.',
  },
};

export default function ProjelerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

