import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kurumsal',
  description: 'Özpolat İnşaat hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz ile 2004 yılından bu yana güvenilir inşaat hizmetleri sunuyoruz.',
  openGraph: {
    title: 'Kurumsal | Özpolat İnşaat',
    description: 'Özpolat İnşaat hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz.',
  },
};

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

