import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kariyer',
  description: 'Özpolat İnşaat kariyer fırsatları. Dinamik ekibimize katılın ve birlikte büyüyelim. Açık pozisyonlarımızı inceleyin.',
  openGraph: {
    title: 'Kariyer | Özpolat İnşaat',
    description: 'Özpolat İnşaat kariyer fırsatları. Açık pozisyonlarımızı inceleyin.',
  },
};

export default function KariyerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

