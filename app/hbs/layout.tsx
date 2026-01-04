import { LanguageProvider } from '@/contexts/LanguageContext';
import HBSHeader from '@/components/hbs/HBSHeader';
import HBSFooter from '@/components/hbs/HBSFooter';

export default function HBSLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-100">
        <HBSHeader />
        <main>{children}</main>
        <HBSFooter />
      </div>
    </LanguageProvider>
  );
}