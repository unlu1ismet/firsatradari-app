'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop?.();
        scannerRef.current.clear?.();
        scannerRef.current = null;
      }
    } catch {}
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      if (!containerRef.current) return;

      const scanner = new Html5Qrcode('barcode-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText: string) => {
          onScan?.(decodedText);
          stopScanner();
        },
        () => {}
      );
      setScanning(true);
    } catch (err: any) {
      setError('Kamera erişimi sağlanamadı. Lütfen kamera izinlerinizi kontrol edin veya barkodu elle girin.');
      setScanning(false);
    }
  }, [onScan, stopScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="space-y-3">
      <div
        id="barcode-reader"
        ref={containerRef}
        className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-muted min-h-[200px] flex items-center justify-center"
      >
        {!scanning && !error && (
          <div className="text-center p-6">
            <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Barkod taramak için kamerayı başlatın</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-center gap-2">
        {!scanning ? (
          <Button onClick={startScanner} className="gap-2">
            <Camera className="w-4 h-4" />
            Kamerayı Başlat
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopScanner} className="gap-2">
            <X className="w-4 h-4" />
            Kamerayı Kapat
          </Button>
        )}
      </div>
    </div>
  );
}
