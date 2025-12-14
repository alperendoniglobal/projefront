import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kariyer',
  description: 'Özpolat İnşaat\'ta kariyer fırsatları. Açık pozisyonları inceleyin ve ekibimize katılın. Mühendis, teknisyen ve idari pozisyonlar.',
  keywords: ['kariyer', 'iş ilanları', 'açık pozisyonlar', 'inşaat işleri', 'mühendis ilanları', 'özpolat kariyer'],
  openGraph: {
    title: 'Kariyer | Özpolat İnşaat',
    description: 'Özpolat İnşaat\'ta kariyer fırsatları. Açık pozisyonları inceleyin ve ekibimize katılın.',
    url: 'https://ozpolatinsaat.tr/kariyer',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ozpolatinsaat.tr/kariyer',
  },
};

export default function KariyerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
