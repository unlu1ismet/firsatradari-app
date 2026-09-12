'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TrendingDown, AlertTriangle, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HoverLift } from '@/components/ui/animate';

interface ProductCardProps {
  id: number;
  title: string;
  brand: string;
  imageUrl: string;
  lowestPrice: number | null;
  originalPrice: number | null;
  isFakeDiscount?: boolean;
  isAllTimeLow?: boolean;
  merchantCount: number;
}

export function ProductCard({ id, title, brand, imageUrl, lowestPrice, originalPrice, isFakeDiscount, isAllTimeLow, merchantCount }: ProductCardProps) {
  const router = useRouter();

  const discount = (originalPrice && lowestPrice && originalPrice > lowestPrice)
    ? Math.round((1 - lowestPrice / originalPrice) * 100)
    : 0;

  const formatTL = (v: number) => v.toLocaleString('tr-TR') + ' ₺';

  return (
    <HoverLift>
      <Card
        variant="interactive"
        className="cursor-pointer overflow-hidden h-full"
        onClick={() => router.push(`/urun/${id}`)}
      >
        <div className="relative aspect-square bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain p-3"
            sizes="(max-width: 640px) 50vw, 25vw"
            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
          />
          {discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
              %{discount}
            </Badge>
          )}
          {isFakeDiscount && (
            <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] flex items-center gap-0.5">
              <AlertTriangle className="w-3 h-3" /> Sahte İndirim
            </Badge>
          )}
          {isAllTimeLow && (
            <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[10px] flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> Dip Fiyat
            </Badge>
          )}
        </div>
        <CardContent className="p-3 space-y-1">
          <p className="text-xs text-muted-foreground">{brand}</p>
          <p className="text-sm font-medium line-clamp-2 leading-tight">{title}</p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-bold text-primary">{lowestPrice != null ? formatTL(lowestPrice) : '—'}</span>
            {originalPrice != null && originalPrice > (lowestPrice ?? 0) && (
              <span className="text-xs text-muted-foreground line-through">{formatTL(originalPrice)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-0.5">
            <Tag className="w-3 h-3" />
            <span>{merchantCount} satıcı</span>
          </div>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
