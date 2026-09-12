'use client';

import { useState } from 'react';
import { Search, ScanBarcode, BarChart3, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMounted } from '@/components/client-only';
import { AnalyticsDrawer } from '@/components/analytics-drawer';

export function TopBar() {
  const [query, setQuery] = useState('');
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const mounted = useMounted();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query?.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="flex items-center gap-1.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ScanBarcode className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">FırsatRadarı</span>
          </button>

          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Ürün, marka veya model ara..."
              className="pl-9 h-9"
            />
          </form>

          <Button variant="ghost" size="icon-sm" onClick={() => router.push('/barkod')} aria-label="Barkod Oku">
            <ScanBarcode className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon-sm" onClick={() => setAnalyticsOpen(true)} aria-label="Analitik">
            <BarChart3 className="w-5 h-5" />
          </Button>

          {mounted && (
            <Button variant="ghost" size="icon-sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Tema değiştir">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </header>
      <AnalyticsDrawer open={analyticsOpen} onOpenChange={setAnalyticsOpen} />
    </>
  );
}
