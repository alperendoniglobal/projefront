import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Özpolat İnşaat ile iletişime geçin. Ankara merkezli ofisimize ulaşın, teklif alın veya sorularınızı iletin.',
  keywords: ['iletişim', 'adres', 'telefon', 'e-posta', 'özpolat iletişim', 'ankara inşaat iletişim', 'teklif al'],
  openGraph: {
    title: 'İletişim | Özpolat İnşaat',
    description: 'Özpolat İnşaat ile iletişime geçin. Teklif alın veya sorularınızı iletin.',
    url: 'https://ozpolatinsaat.tr/iletisim',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ozpolatinsaat.tr/iletisim',
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
