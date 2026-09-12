'use client';

import { useEffect, useState } from 'react';
import { Bell, Trash2, LinkIcon, CheckCircle2, Clock, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

interface TrackedItem {
  id: number;
  productId: number;
  targetPrice: number;
  status: string;
  createdAt: string;
  product: {
    id: number;
    title: string;
    brand: string;
    imageUrl: string;
  };
  currentPrice: number | null;
}

export function TakiplerimContent() {
  const router = useRouter();
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/tracked-items')
      .then((r) => r?.json?.())
      .then((d: any) => setItems(d?.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id: number) => {
    try {
      await fetch(`/api/tracked-items?id=${id}`, { method: 'DELETE' });
      setItems((prev) => (prev ?? []).filter((i: TrackedItem) => i?.id !== id));
      toast.success('Takip kaldırıldı.');
    } catch {
      toast.error('Bir hata oluştu.');
    }
  };

  const addByUrl = async () => {
    if (!urlInput?.trim()) return;
    setUrlLoading(true);
    try {
      const res = await fetch('/api/tracked-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productUrl: urlInput, targetPrice: 0 }),
      });
      if (res?.ok) {
        toast.success('Ürün takibe alındı!');
        setUrlInput('');
        fetchItems();
      } else {
        toast.error('Ürün çözümlenemedi.');
      }
    } catch {
      toast.error('Bağlantı hatası.');
    } finally {
      setUrlLoading(false);
    }
  };

  const reachedCount = (items ?? []).filter((i: TrackedItem) => i?.status === 'reached')?.length ?? 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <FadeIn>
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <Bell className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">Takiplerim</h1>
          <p className="text-sm text-muted-foreground">
            Fiyat alarmlarınızı yönetin ve ürün URL'si yapıştırarak takip başlatın.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardContent className="p-4 space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <LinkIcon className="w-4 h-4 text-primary" />
              Ürün URL'si ile Takip Başlat
            </Label>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
                placeholder="https://www.trendyol.com/..."
                className="flex-1"
              />
              <Button onClick={addByUrl} disabled={urlLoading}>
                {urlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ekle'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Amazon, Trendyol, Hepsiburada, A101 veya herhangi bir ürün linkini yapıştırın.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {!loading && (items?.length ?? 0) > 0 && (
        <FadeIn delay={0.15}>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{items?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Toplam Takip</p>
            </div>
            <div className="flex-1 bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{reachedCount}</p>
              <p className="text-xs text-muted-foreground">Hedefe Ulaştı</p>
            </div>
          </div>
        </FadeIn>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (items?.length ?? 0) === 0 ? (
        <FadeIn>
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Henüz takip yok</p>
            <p className="text-sm text-muted-foreground mt-1">
              Bir ürün sayfasından "Fiyat Alarmı Kur" ile başlayabilirsiniz.
            </p>
          </div>
        </FadeIn>
      ) : (
        <Stagger staggerDelay={0.05}>
          <div className="space-y-3">
            {(items ?? []).map((item: TrackedItem) => {
              const isReached = item?.status === 'reached';
              return (
                <StaggerItem key={item.id}>
                  <Card className={isReached ? 'border-primary/30 bg-primary/5' : ''}>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div
                          className="relative w-16 h-16 bg-muted rounded-lg shrink-0 cursor-pointer"
                          onClick={() => router.push(`/urun/${item?.product?.id}`)}
                        >
                          <Image
                            src={item?.product?.imageUrl ?? ''}
                            alt={item?.product?.title ?? ''}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{item?.product?.brand}</p>
                          <p
                            className="text-sm font-medium line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => router.push(`/urun/${item?.product?.id}`)}
                          >
                            {item?.product?.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Mevcut</p>
                              <p className="text-sm font-bold">
                                {item?.currentPrice != null ? `${item.currentPrice.toLocaleString('tr-TR')} ₺` : '—'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground">Hedef</p>
                              <p className="text-sm font-bold text-primary">
                                {item?.targetPrice?.toLocaleString?.('tr-TR')} ₺
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {isReached ? (
                              <Badge className="bg-primary text-primary-foreground text-[10px] flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Hedefe Ulaşıldı!
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] flex items-center gap-0.5">
                                <Clock className="w-3 h-3" /> Bekleniyor
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              deleteItem(item.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.push(`/urun/${item?.product?.id}`)}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </div>
        </Stagger>
      )}
    </div>
  );
}
