import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bize Ulaşın',
  description: 'Özpolat İnşaat ile iletişime geçin. Adres, telefon, e-posta bilgilerimiz ve iletişim formu ile bize ulaşabilirsiniz.',
  openGraph: {
    title: 'Bize Ulaşın | Özpolat İnşaat',
    description: 'Özpolat İnşaat ile iletişime geçin.',
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

