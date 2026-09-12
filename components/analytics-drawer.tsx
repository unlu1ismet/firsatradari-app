'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { BarChart3, MousePointerClick, Coins } from 'lucide-react';

interface MerchantStat {
  merchantName: string;
  clicks: number;
  estimatedCommission: number;
}

interface AnalyticsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalyticsDrawer({ open, onOpenChange }: AnalyticsDrawerProps) {
  const [stats, setStats] = useState<MerchantStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/analytics')
      .then((r) => r?.json?.())
      .then((d: any) => setStats(d?.stats ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const totalClicks = (stats ?? []).reduce((s: number, m: MerchantStat) => s + (m?.clicks ?? 0), 0);
  const totalCommission = (stats ?? []).reduce((s: number, m: MerchantStat) => s + (m?.estimatedCommission ?? 0), 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Komisyon Analitik
          </SheetTitle>
          <SheetDescription>Tıklama ve tahmini komisyon verileri</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3 text-center">
              <MousePointerClick className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{totalClicks}</p>
              <p className="text-xs text-muted-foreground">Toplam Tıklama</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{totalCommission?.toLocaleString?.('tr-TR')} ₺</p>
              <p className="text-xs text-muted-foreground">Tahmini Komisyon</p>
            </div>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Yükleniyor...</p>
          ) : (
            <div className="space-y-2">
              {(stats ?? []).map((m: MerchantStat) => (
                <div key={m.merchantName} className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                  <div>
                    <p className="font-medium text-sm">{m.merchantName}</p>
                    <p className="text-xs text-muted-foreground">{m?.clicks ?? 0} tıklama</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{m?.estimatedCommission?.toLocaleString?.('tr-TR')} ₺</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
