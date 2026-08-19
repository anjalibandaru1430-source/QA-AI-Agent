import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  sparklineData?: number[];
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  sparklineData = [30, 40, 35, 50, 49, 60, 70, 91],
  subtitle,
}) => {
  // Simple inline SVG sparkline generator
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = sparklineData
    .map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card hoverable className="p-4 bg-slate-900/80 border-slate-800 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-white tracking-tight font-mono">{value}</span>
            {change && (
              <span
                className={clsx(
                  'inline-flex items-center text-xs font-medium gap-0.5',
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
        </div>

        <div className="p-2.5 rounded-lg bg-slate-800/80 text-emerald-400 border border-slate-700/60 group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="mt-3 flex items-center justify-end">
        <svg width={width} height={height} className="overflow-visible">
          <polyline
            fill="none"
            stroke={isPositive ? '#10b981' : '#f43f5e'}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </Card>
  );
};
