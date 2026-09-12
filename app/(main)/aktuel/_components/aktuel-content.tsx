'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, BellRing, Check, CalendarDays, ArrowRight, Tag, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

interface FlyerDeal {
  id: number;
  merchantName: string;
  flyerPrice: number;
  originalPrice: number | null;
  flyerDate: string | null;
  product: {
    id: number;
    title: string;
    brand: string;
    imageUrl: string;
    category: string;
  };
  bestOnlinePrice: number | null;
  isMarketCheaper: boolean;
}

const marketTabs = [
  { key: 'A101', label: 'A101', flyerDay: 'Perşembe' },
  { key: 'BİM', label: 'BİM', flyerDay: 'Cuma' },
  { key: 'Şok', label: 'Şok', flyerDay: 'Çarşamba' },
];

export function AktuelContent() {
  const router = useRouter();
  const [deals, setDeals] = useState<FlyerDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('A101');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/flyer-deals?merchant=${encodeURIComponent(activeTab)}`)
      .then((r) => r?.json?.())
      .then((d: any) => setDeals(d?.deals ?? []))
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => {
    fetch('/api/flyer-reminder')
      .then((r) => r?.json?.())
      .then((d: any) => {
        const names = (d?.reminders ?? []).map((r: any) => r?.merchantName).filter(Boolean);
        setReminders(names);
      })
      .catch(() => {});
  }, []);

  const setReminder = async (merchant: string) => {
    try {
      const res = await fetch('/api/flyer-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantName: merchant }),
      });
      if (res?.ok) {
        setReminders((prev) => [...(prev ?? []), merchant]);
        toast.success(`${merchant} aktüel hatırlatıcısı kuruldu!`);
      }
    } catch {
      toast.error('Bir hata oluştu.');
    }
  };

  const currentMarket = marketTabs.find((m) => m.key === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <FadeIn>
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <ShoppingBag className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">Aktüel Ürünler Radarı</h1>
          <p className="text-sm text-muted-foreground">
            Haftalık market aktüel fırsatlarını karşılaştırın: market mi ucuz, internet mi?
          </p>
        </div>
      </FadeIn>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          {marketTabs.map((m) => (
            <TabsTrigger key={m.key} value={m.key}>{m.label}</TabsTrigger>
          ))}
        </TabsList>

        {marketTabs.map((market) => (
          <TabsContent key={market.key} value={market.key} className="mt-4 space-y-4">
            <FadeIn>
              <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    Sonraki aktüel: <strong>{market.flyerDay}</strong>
                  </span>
                </div>
                {reminders?.includes(market.key) ? (
                  <Badge className="bg-primary/10 text-primary border-0 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Hatırlatıcı Aktif
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setReminder(market.key)} className="gap-1">
                    <BellRing className="w-3.5 h-3.5" />
                    Hatırlatıcı Kur
                  </Button>
                )}
              </div>
            </FadeIn>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (deals?.length ?? 0) === 0 ? (
              <FadeIn>
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium">Bu hafta aktüel ürün bulunamadı</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {market.flyerDay} günü yeni aktüel ürünler gelecek.
                  </p>
                </div>
              </FadeIn>
            ) : (
              <Stagger staggerDelay={0.05}>
                <div className="space-y-3">
                  {(deals ?? []).map((deal: FlyerDeal) => (
                    <StaggerItem key={deal.id}>
                      <Card
                        variant="interactive"
                        className="cursor-pointer"
                        onClick={() => router.push(`/urun/${deal?.product?.id}`)}
                      >
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="relative w-20 h-20 bg-muted rounded-lg shrink-0">
                              <Image
                                src={deal?.product?.imageUrl ?? ''}
                                alt={deal?.product?.title ?? ''}
                                fill
                                className="object-contain p-2"
                                sizes="80px"
                                onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">{deal?.product?.brand}</p>
                              <p className="text-sm font-medium line-clamp-2">{deal?.product?.title}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> Market
                                  </p>
                                  <p className="text-sm font-bold">{deal?.flyerPrice?.toLocaleString?.('tr-TR')} ₺</p>
                                </div>
                                {deal?.bestOnlinePrice != null && (
                                  <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Globe className="w-3 h-3" /> İnternet
                                    </p>
                                    <p className="text-sm font-bold">{deal.bestOnlinePrice.toLocaleString('tr-TR')} ₺</p>
                                  </div>
                                )}
                              </div>
                              <div className="mt-1.5">
                                {deal?.isMarketCheaper ? (
                                  <Badge className="bg-primary text-primary-foreground text-[10px]">Market dip fiyat!</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-[10px]">İnternette daha ucuz</Badge>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground self-center shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </div>
              </Stagger>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
