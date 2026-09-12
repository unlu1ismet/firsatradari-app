'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';

interface ProductItem {
  id: number;
  title: string;
  brand: string;
  imageUrl: string;
  lowestPrice: number | null;
  originalPrice: number | null;
  isFakeDiscount: boolean;
  isAllTimeLow: boolean;
  merchantCount: number;
  category: string;
}

const sortOptions = [
  { value: 'discount', label: 'En Çok İndirim' },
  { value: 'price', label: 'En Düşük Fiyat' },
  { value: 'allTimelow', label: 'Dip Fiyatlar' },
];

export function HomeContent() {
  const searchParams = useSearchParams();
  const q = searchParams?.get('q') ?? '';
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState('discount');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r?.json?.())
      .then((d: any) => setCategories(d?.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (sort) params.set('sort', sort);
    if (selectedCategory) params.set('category', selectedCategory);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r?.json?.())
      .then((d: any) => setProducts(d?.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q, sort, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <FadeIn>
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
            Türkiye'nin <span className="text-primary">En Ucuz</span> Fiyatlarını Keşfedin
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Amazon, Trendyol, Hepsiburada, A101, BİM ve Şok arasında anlık fiyat karşılaştırması yapın.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <Button
              size="sm"
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className="shrink-0"
            >
              Tümü
            </Button>
            {(categories ?? []).map((cat: string) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className="shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1.5">
              {sortOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={sort === opt.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSort(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {q && (
        <FadeIn>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            <span>"{q}" için sonuçlar ({products?.length ?? 0} ürün)</span>
          </div>
        </FadeIn>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : (products?.length ?? 0) === 0 ? (
        <FadeIn>
          <div className="text-center py-16 space-y-3">
            <Search className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium">Ürün bulunamadı</p>
            <p className="text-sm text-muted-foreground">Farklı bir arama terimi deneyin.</p>
          </div>
        </FadeIn>
      ) : (
        <Stagger staggerDelay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {(products ?? []).map((p: ProductItem) => (
              <StaggerItem key={p.id}>
                <ProductCard
                  id={p.id}
                  title={p.title}
                  brand={p.brand}
                  imageUrl={p.imageUrl}
                  lowestPrice={p.lowestPrice}
                  originalPrice={p.originalPrice}
                  isFakeDiscount={p.isFakeDiscount}
                  isAllTimeLow={p.isAllTimeLow}
                  merchantCount={p.merchantCount}
                />
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      )}
    </div>
  );
}
