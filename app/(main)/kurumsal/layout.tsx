import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kurumsal',
  description: 'Özpolat İnşaat hakkında bilgi edinin. 2004 yılından bu yana güvenilir inşaat hizmetleri sunan firmamızın misyonu, vizyonu ve değerlerimizi keşfedin.',
  keywords: ['kurumsal', 'hakkımızda', 'özpolat inşaat', 'inşaat firması', 'misyon', 'vizyon', 'ankara müteahhit'],
  openGraph: {
    title: 'Kurumsal | Özpolat İnşaat',
    description: 'Özpolat İnşaat hakkında bilgi edinin. 2004 yılından bu yana güvenilir inşaat hizmetleri.',
    url: 'https://ozpolatinsaat.tr/kurumsal',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ozpolatinsaat.tr/kurumsal',
  },
};

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
