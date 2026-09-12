'use client';

import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';

interface PricePoint {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
}

export function PriceChart({ data }: PriceChartProps) {
  const [range, setRange] = useState<30 | 60>(30);

  const filtered = useMemo(() => {
    const arr = data ?? [];
    if (range === 60) return arr;
    return arr.slice(Math.max(0, arr.length - 30));
  }, [data, range]);

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  };

  const formatTL = (v: number) => v?.toLocaleString?.('tr-TR') + ' ₺';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant={range === 30 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setRange(30)}
        >
          30 Gün
        </Button>
        <Button
          variant={range === 60 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setRange(60)}
        >
          60 Gün
        </Button>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tickLine={false}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v: number) => `${Math.round(v / 1000)}K`}
              tickLine={false}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <Tooltip
              formatter={(value: any) => [formatTL(value as number), 'Fiyat']}
              labelFormatter={formatDate}
              contentStyle={{ fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(152, 76%, 36%)"
              strokeWidth={2}
              fill="url(#priceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
