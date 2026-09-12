'use client';

import { ExternalLink, Check, XCircle, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateAffiliateLink } from '@/lib/affiliate';

interface MerchantPriceItem {
  id: number;
  merchantName: string;
  price: number;
  originalPrice: number | null;
  stockStatus: string;
  productUrl: string;
  isFlyerDeal: boolean;
}

interface MerchantListProps {
  prices: MerchantPriceItem[];
  productId: number;
}

export function MerchantList({ prices, productId }: MerchantListProps) {
  const sorted = [...(prices ?? [])].sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
  const cheapest = sorted?.[0];

  const trackClick = async (merchantName: string) => {
    try {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantName, productId }),
      });
    } catch {}
  };

  return (
    <div className="space-y-2">
      {sorted.map((mp, i) => {
        const isCheapest = mp?.id === cheapest?.id;
        const isInStock = mp?.stockStatus === 'in_stock';
        const discount = (mp?.originalPrice && mp?.price && mp.originalPrice > mp.price)
          ? Math.round((1 - mp.price / mp.originalPrice) * 100)
          : 0;

        return (
          <div
            key={mp.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              isCheapest ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0">
                <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{mp.merchantName}</p>
                  {isCheapest && (
                    <Badge className="bg-primary text-primary-foreground text-[10px]">En Ucuz</Badge>
                  )}
                  {mp.isFlyerDeal && (
                    <Badge variant="secondary" className="text-[10px] flex items-center gap-0.5">
                      <Tag className="w-3 h-3" /> Aktüel
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isInStock ? (
                    <span className="flex items-center gap-0.5 text-xs text-green-600"><Check className="w-3 h-3" /> Stokta</span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-xs text-destructive"><XCircle className="w-3 h-3" /> Tükendi</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-base font-bold">{mp?.price?.toLocaleString?.('tr-TR')} ₺</p>
                {discount > 0 && mp.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">{mp.originalPrice.toLocaleString('tr-TR')} ₺</p>
                )}
              </div>
              <Button
                size="sm"
                variant={isCheapest ? 'default' : 'outline'}
                asChild
                onClick={() => trackClick(mp.merchantName)}
              >
                <a
                  href={generateAffiliateLink(mp.merchantName, mp.productUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Satın Al</span>
                </a>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
