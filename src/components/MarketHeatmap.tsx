import React from 'react';
import { SectorItem, AssetQuote } from '../types/market';
import { ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface MarketHeatmapProps {
  sectors: SectorItem[];
  onSelectSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  sectors,
  onSelectSymbol,
}) => {
  // Helper to get heat color
  const getTileBg = (change: number) => {
    if (change >= 3) return 'bg-[#089981] text-white';
    if (change >= 1.5) return 'bg-[#089981]/85 text-white';
    if (change > 0) return 'bg-[#089981]/50 text-white';
    if (change === 0) return 'bg-[#787B86]/40 text-white';
    if (change >= -1.5) return 'bg-[#F23645]/50 text-white';
    if (change >= -3) return 'bg-[#F23645]/85 text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 lg:p-6 shadow-2xs flex flex-col gap-5">
      {/* Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E3EB]">
        <div>
          <h2 className="font-display font-bold text-lg text-[#131722] tracking-tight">
            S&P 500 Sector Treemap Heatmap
          </h2>
          <p className="text-xs text-[#787B86] mt-0.5">
            Area corresponds to market capitalization; shading reflects real-time 24h percentage return.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono tabular-nums shrink-0">
          <span className="text-[#F23645] font-semibold">-3.0%</span>
          <div className="flex h-3 w-28 rounded-full overflow-hidden border border-[#E0E3EB]">
            <div className="flex-1 bg-[#F23645]" />
            <div className="flex-1 bg-[#F23645]/60" />
            <div className="flex-1 bg-[#787B86]/40" />
            <div className="flex-1 bg-[#089981]/60" />
            <div className="flex-1 bg-[#089981]" />
          </div>
          <span className="text-[#089981] font-semibold">+3.0%</span>
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sector) => {
          const isSectorGreen = sector.changePercent >= 0;
          return (
            <div
              key={sector.name}
              className="rounded-xl border border-[#E0E3EB] bg-[#faf9ff] p-3 flex flex-col gap-2.5"
            >
              {/* Sector Title & Performance Badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-bold text-[#131722]">
                  {sector.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                    isSectorGreen
                      ? 'bg-[#089981]/10 text-[#089981]'
                      : 'bg-[#F23645]/10 text-[#F23645]'
                  }`}
                >
                  {isSectorGreen ? '+' : ''}{sector.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Companies Blocks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {sector.companies.map((comp) => {
                  const tileStyle = getTileBg(comp.changePercent);
                  return (
                    <button
                      key={comp.symbol}
                      onClick={() => onSelectSymbol(comp.symbol)}
                      className={`p-2 rounded-lg flex flex-col justify-between text-left transition-all hover:scale-[1.02] hover:shadow-xs cursor-pointer ${tileStyle}`}
                      style={{
                        minHeight: comp.marketCap > 1000 ? '78px' : '62px',
                        gridColumn: comp.marketCap > 2000 ? 'span 2' : 'span 1',
                      }}
                      title={`${comp.name} (${comp.symbol}): $${comp.price.toFixed(2)} (${comp.changePercent >= 0 ? '+' : ''}${comp.changePercent}%) · Cap: $${comp.marketCap}B`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs tracking-tight">
                          {comp.symbol}
                        </span>
                        <span className="text-[10px] opacity-90">
                          ${comp.marketCap}B
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-[11px] font-semibold tabular-nums opacity-95">
                          ${comp.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] font-bold tabular-nums">
                          {comp.changePercent >= 0 ? '+' : ''}{comp.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
