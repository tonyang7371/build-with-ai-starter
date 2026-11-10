import React from 'react';
import { MarketIndex } from '../types/market';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface IndexTickerStripProps {
  indices: MarketIndex[];
  selectedIndex: string | null;
  onSelectIndex: (index: MarketIndex) => void;
}

export const IndexTickerStrip: React.FC<IndexTickerStripProps> = ({
  indices,
  selectedIndex,
  onSelectIndex,
}) => {
  return (
    <div className="w-full bg-[#FFFFFF] border-b border-[#E0E3EB] overflow-x-auto no-scrollbar py-2 px-4 lg:px-8">
      <div className="flex items-center gap-3 min-w-max">
        {indices.map((idx) => {
          const isPositive = idx.change >= 0;
          const isSelected = selectedIndex === idx.symbol;

          // Render a simple SVG sparkline path
          const min = Math.min(...idx.sparkline);
          const max = Math.max(...idx.sparkline);
          const range = max - min || 1;
          const width = 48;
          const height = 18;
          const points = idx.sparkline
            .map((val, i) => {
              const x = (i / (idx.sparkline.length - 1)) * width;
              const y = height - ((val - min) / range) * (height - 4) - 2;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <button
              key={idx.symbol}
              onClick={() => onSelectIndex(idx)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#F0F3FA] border-[#2962FF] shadow-xs'
                  : 'bg-white border-[#E0E3EB] hover:border-[#D1D4DC] hover:bg-[#F0F3FA]'
              }`}
            >
              {/* 28px Index Circle Badge */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[11px] shrink-0 shadow-2xs"
                style={{ backgroundColor: idx.badgeBg, color: idx.badgeColor }}
              >
                {idx.shortCode}
              </div>

              {/* Index Name & Price */}
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-semibold text-[#181b24] tracking-tight whitespace-nowrap">
                  {idx.name}
                </span>
                <span className="text-xs font-semibold tabular-nums text-[#181b24] leading-tight">
                  {idx.price >= 1000 ? idx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : idx.price.toFixed(2)}
                </span>
              </div>

              {/* Mini Sparkline */}
              <div className="hidden sm:block shrink-0 px-1">
                <svg width={width} height={height} className="overflow-visible">
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>

              {/* Price Delta Badge (10% opacity tint + solid colored text & arrow) */}
              <div
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
                  isPositive
                    ? 'bg-[#089981]/10 text-[#089981]'
                    : 'bg-[#F23645]/10 text-[#F23645]'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3 shrink-0 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 shrink-0 stroke-[2.5]" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {idx.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
