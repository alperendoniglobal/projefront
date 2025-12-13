import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri | Özpolat İnşaat',
  description: 'Özpolat İnşaat projelerinden, şantiyelerinden ve etkinliklerinden fotoğraflar. Galeri sayfamızda çalışmalarımızı inceleyin.',
  keywords: ['galeri', 'fotoğraflar', 'inşaat projeleri', 'şantiye', 'özpolat inşaat'],
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

