'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ScanBarcode, Search, Loader2, PackageX, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import Image from 'next/image';

const BarcodeScanner = dynamic(
  () => import('@/components/barcode-scanner').then((m) => m.BarcodeScanner),
  { ssr: false, loading: () => <div className="h-[200px] bg-muted rounded-xl animate-pulse" /> }
);

interface FoundProduct {
  id: number;
  title: string;
  brand: string;
  imageUrl: string;
  merchantPrices: any[];
}

const demoBarcodes = [
  { label: 'Philips Airfryer', code: '8690123456017' },
  { label: 'Sony WH-1000XM5', code: '8690123456048' },
  { label: 'Logitech G305', code: '8690123456055' },
  { label: 'JBL Flip 6', code: '8690123456147' },
];

export function BarkodContent() {
  const router = useRouter();
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<FoundProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  const lookupBarcode = useCallback(async (code: string) => {
    if (!code?.trim()) return;
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setScannedCode(code);

    try {
      const res = await fetch(`/api/products/barcode/${encodeURIComponent(code)}`);
      const data = await res?.json?.();
      if (data?.found && data?.product) {
        setProduct(data.product);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupBarcode(manualCode);
  };

  const cheapest = product?.merchantPrices?.filter((mp: any) => mp?.stockStatus === 'in_stock')?.sort((a: any, b: any) => (a?.price ?? 0) - (b?.price ?? 0))?.[0];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <FadeIn>
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <ScanBarcode className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">Barkod Okuyucu</h1>
          <p className="text-sm text-muted-foreground">
            Ürün barkodunu okutun veya elle girin, anında fiyat karşılaştırması yapın.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <BarcodeScanner onScan={lookupBarcode} />
      </FadeIn>

      <FadeIn delay={0.15}>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <Input
            value={manualCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualCode(e.target.value)}
            placeholder="Barkod numarasını girin (EAN-13)"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Örnek barkodları deneyin:</p>
          <div className="flex flex-wrap gap-2">
            {demoBarcodes.map((d) => (
              <Badge
                key={d.code}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setManualCode(d.code);
                  lookupBarcode(d.code);
                }}
              >
                {d.label}
              </Badge>
            ))}
          </div>
        </div>
      </FadeIn>

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Barkod aranıyor...</p>
        </div>
      )}

      {product && !loading && (
        <FadeIn>
          <Card className="overflow-hidden">
            <div className="flex gap-4 p-4">
              <div className="relative w-24 h-24 bg-muted rounded-lg shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-contain p-2"
                  onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <p className="font-medium text-sm line-clamp-2">{product.title}</p>
                {cheapest && (
                  <div className="mt-2">
                    <p className="text-lg font-bold text-primary">
                      {cheapest.price?.toLocaleString?.('tr-TR')} ₺
                    </p>
                    <Badge className="bg-primary text-primary-foreground text-[10px] mt-1">
                      En ucuz: {cheapest.merchantName}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <CardContent className="pt-0 pb-4">
              <p className="text-xs text-muted-foreground mb-2">
                {product?.merchantPrices?.length ?? 0} satıcıda bulundu
              </p>
              <Button className="w-full gap-2" onClick={() => router.push(`/urun/${product.id}`)}>
                Detaylı Karşılaştırma
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {notFound && !loading && (
        <FadeIn>
          <Card className="text-center p-6">
            <PackageX className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Ürün Bulunamadı</p>
            <p className="text-sm text-muted-foreground mt-1">
              "{scannedCode}" barkodu ile eşleşen ürün yok.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => router.push(`/?q=${scannedCode}`)}>
              <Search className="w-4 h-4 mr-2" />
              Bu kodu arayarak deneyin
            </Button>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
