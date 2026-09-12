'use client';

import { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productTitle: string;
  currentPrice: number;
}

export function AlertModal({ open, onOpenChange, productId, productTitle, currentPrice }: AlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9).toString());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tracked-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, targetPrice: parseFloat(targetPrice) }),
      });
      if (res?.ok) {
        toast.success('Fiyat alarmı kuruldu!');
        onOpenChange(false);
      } else {
        toast.error('Bir hata oluştu.');
      }
    } catch {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Fiyat Alarmı Kur
          </DialogTitle>
          <DialogDescription className="text-sm">
            {productTitle} için hedef fiyat belirleyin.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Mevcut En Düşük Fiyat</Label>
            <p className="text-lg font-bold text-primary">{currentPrice?.toLocaleString?.('tr-TR')} ₺</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Hedef Fiyat (₺)</Label>
            <Input
              id="target"
              type="number"
              value={targetPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetPrice(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
            Alarmı Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
