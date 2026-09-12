'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Bell, TrendingDown, AlertTriangle, Share2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import { MerchantList } from '@/components/merchant-list';
import { PriceChart } from '@/components/price-chart';
import { AlertModal } from '@/components/alert-modal';

interface MerchantPriceItem {
  id: number;
  merchantName: string;
  price: number;
  originalPrice: number | null;
  stockStatus: string;
  productUrl: string;
  isFlyerDeal: boolean;
}

interface PriceHistoryPoint {
  date: string;
  price: number;
}

interface ProductData {
  id: number;
  barcode: string;
  title: string;
  brand: string;
  category: string;
  imageUrl: string;
  lowestHistoricalPrice: number;
  merchantPrices: MerchantPriceItem[];
  priceHistory: PriceHistoryPoint[];
  isFakeDiscount: boolean;
  isAllTimeLow: boolean;
}

export function UrunDetail({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((r) => r?.json?.())
      .then((d: any) => setProduct(d?.product ?? null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Yükleniyor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-lg font-medium">Ürün bulunamadı</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
        </Button>
      </div>
    );
  }

  const inStockPrices = (product?.merchantPrices ?? []).filter((mp: MerchantPriceItem) => mp?.stockStatus === 'in_stock');
  const cheapest = [...inStockPrices].sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0))?.[0];
  const cheapestPrice = cheapest?.price ?? 0;
  const mostExpensive = [...inStockPrices].sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0))?.[0];
  const savings = mostExpensive && cheapest ? mostExpensive.price - cheapest.price : 0;

  const handleShare = async () => {
    try {
      if (navigator?.share) {
        await navigator.share({
          title: product?.title ?? 'FırsatRadarı',
          text: `${product?.title} - En ucuz fiyat: ${cheapestPrice?.toLocaleString?.('tr-TR')} ₺`,
          url: window?.location?.href,
        });
      }
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
        <ArrowLeft className="w-4 h-4" /> Geri
      </Button>

      {/* Product Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-48 aspect-square bg-muted rounded-xl shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 100vw, 192px"
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.brand}</Badge>
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight">{product.title}</h1>
            <p className="text-xs text-muted-foreground font-mono">Barkod: {product.barcode}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {product.isFakeDiscount && (
                <Badge className="bg-amber-500 text-white flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Sahte İndirim: Fiyat önce şişirildi
                </Badge>
              )}
              {product.isAllTimeLow && (
                <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Son 30 Günün En Düşük Fiyatı
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="pt-2">
              <p className="text-3xl font-bold text-primary">
                {cheapestPrice?.toLocaleString?.('tr-TR')} ₺
              </p>
              {savings > 0 && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  İnternette {savings?.toLocaleString?.('tr-TR')} ₺ daha ucuz!
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={() => setAlertOpen(true)} className="gap-2">
                <Bell className="w-4 h-4" />
                Fiyat Alarmı Kur
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Price Chart */}
      <SlideIn from="bottom" delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-primary" />
              Fiyat Geçmişi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PriceChart data={product?.priceHistory ?? []} />
          </CardContent>
        </Card>
      </SlideIn>

      {/* Merchant Comparison */}
      <SlideIn from="bottom" delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Satıcı Karşılaştırması</CardTitle>
          </CardHeader>
          <CardContent>
            <MerchantList prices={product?.merchantPrices ?? []} productId={product.id} />
          </CardContent>
        </Card>
      </SlideIn>

      {/* Alert Modal */}
      <AlertModal
        open={alertOpen}
        onOpenChange={setAlertOpen}
        productId={product.id}
        productTitle={product.title}
        currentPrice={cheapestPrice}
      />
    </div>
  );
}
