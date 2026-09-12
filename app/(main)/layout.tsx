import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 pb-nav">{children}</main>
      <BottomNav />
    </div>
  );
}
