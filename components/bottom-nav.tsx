'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, ScanBarcode, ShoppingBag, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Keşfet' },
  { href: '/barkod', icon: ScanBarcode, label: 'Barkod Oku' },
  { href: '/aktuel', icon: ShoppingBag, label: 'Aktüel' },
  { href: '/takiplerim', icon: Bell, label: 'Takiplerim' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[64px]',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
