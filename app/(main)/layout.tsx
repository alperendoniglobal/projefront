import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SiteProvider } from '@/lib/context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </SiteProvider>
  );
}

