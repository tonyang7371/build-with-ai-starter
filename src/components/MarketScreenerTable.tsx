import React, { useState } from 'react';
import { AssetQuote } from '../types/market';
import { ArrowUpRight, ArrowDownRight, ArrowUpDown, ChevronDown, ChevronUp, Star, TrendingUp, BarChart2 } from 'lucide-react';

interface MarketScreenerTableProps {
  quotes: AssetQuote[];
  onSelectQuote: (quote: AssetQuote) => void;
  onTradeQuote: (quote: AssetQuote) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  activeQuoteSymbol: string;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'rawVolume' | 'rawMarketCap' | 'peRatio';
type SortDirection = 'asc' | 'desc';

export const MarketScreenerTable: React.FC<MarketScreenerTableProps> = ({
  quotes,
  onSelectQuote,
  onTradeQuote,
  watchlist,
  onToggleWatchlist,
  activeQuoteSymbol,
}) => {
  const [sortField, setSortField] = useState<SortField>('rawMarketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    let aVal = a[sortField] ?? 0;
    let bVal = b[sortField] ?? 0;
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
      return sortDirection === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }
    return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  return (
    <div className="w-full bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Headers */}
          <thead>
            <tr className="border-b border-[#E0E3EB] bg-[#faf9ff] text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">
              <th className="py-3 px-3 text-center w-10">
                <span className="sr-only">Watch</span>
              </th>
              <th 
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 text-left cursor-pointer hover:text-[#131722] transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Symbol / Asset</span>
                  {sortField === 'symbol' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#2962FF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2962FF]" />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('price')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Price</span>
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#2962FF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2962FF]" />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('changePercent')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>24h Change</span>
                  {sortField === 'changePercent' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#2962FF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2962FF]" />
                  )}
                </div>
              </th>
              <th className="hidden md:table-cell py-3 px-4 text-center min-w-[130px]">
                <span>24h Range (Low — High)</span>
              </th>
              <th 
                onClick={() => handleSort('rawVolume')}
                className="hidden lg:table-cell py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Volume</span>
                  {sortField === 'rawVolume' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#2962FF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2962FF]" />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('rawMarketCap')}
                className="hidden sm:table-cell py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Market Cap</span>
                  {sortField === 'rawMarketCap' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#2962FF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2962FF]" />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('peRatio')}
                className="hidden xl:table-cell py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors select-none"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>P/E</span>
                  {sortField === 'peRatio' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#2962FF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2962FF]" />
                  )}
                </div>
              </th>
              <th className="hidden lg:table-cell py-3 px-4 text-center w-28">
                <span>7D Trend</span>
              </th>
              <th className="py-3 px-4 text-right w-28">
                <span>Action</span>
              </th>
            </tr>
          </thead>

          {/* Table Body: 44px Row Height with Hover State #F0F3FA */}
          <tbody className="divide-y divide-[#E0E3EB]">
            {sortedQuotes.map((quote) => {
              const isPositive = quote.change >= 0;
              const isWatched = watchlist.includes(quote.symbol);
              const isActive = activeQuoteSymbol === quote.symbol;

              // Calculate range bar percentage
              const rangeSpan = quote.dayHigh - quote.dayLow || 1;
              const currentPosition = Math.min(Math.max(((quote.price - quote.dayLow) / rangeSpan) * 100, 0), 100);

              // 7D Sparkline SVG Path
              const minVal = Math.min(...quote.sparkline);
              const maxVal = Math.max(...quote.sparkline);
              const valSpan = maxVal - minVal || 1;
              const sparkWidth = 64;
              const sparkHeight = 22;
              const points = quote.sparkline
                .map((val, i) => {
                  const x = (i / (quote.sparkline.length - 1)) * sparkWidth;
                  const y = sparkHeight - ((val - minVal) / valSpan) * (sparkHeight - 4) - 2;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(' ');

              return (
                <tr
                  key={quote.symbol}
                  onClick={() => onSelectQuote(quote)}
                  className={`h-11 transition-colors cursor-pointer group ${
                    isActive ? 'bg-[#F0F3FA] ring-1 ring-inset ring-[#2962FF]/40' : 'hover:bg-[#F0F3FA]'
                  }`}
                >
                  {/* Watchlist Toggle */}
                  <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleWatchlist(quote.symbol)}
                      className={`p-1 rounded-full transition-colors ${
                        isWatched ? 'text-[#EAB308]' : 'text-[#c3c5d8] hover:text-[#787B86]'
                      }`}
                      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isWatched ? 'fill-[#EAB308]' : ''}`} />
                    </button>
                  </td>

                  {/* Symbol & Company Name */}
                  <td className="py-2 px-4 text-left">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[10px] text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: quote.logoBg, color: quote.logoColor }}
                      >
                        {quote.symbol.slice(0, 3)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#131722] leading-tight group-hover:text-[#0049db] transition-colors">
                            {quote.symbol}
                          </span>
                          <span className="hidden sm:inline-block text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#E0E2EE] text-[#434656]">
                            {quote.sector}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#787B86] truncate max-w-[130px] sm:max-w-[180px] leading-tight">
                          {quote.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price (Tabular Numbers) */}
                  <td className="py-2 px-4 text-right">
                    <span className="font-semibold text-xs text-[#181b24] tabular-nums">
                      ${quote.price >= 1000 
                        ? quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : quote.price.toFixed(2)}
                    </span>
                  </td>

                  {/* 24h Change Delta Badge */}
                  <td className="py-2 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <div
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
                          isPositive
                            ? 'bg-[#089981]/10 text-[#089981]'
                            : 'bg-[#F23645]/10 text-[#F23645]'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}
                          {quote.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 24h Low / High Range Bar */}
                  <td className="hidden md:table-cell py-2 px-4">
                    <div className="flex flex-col gap-1 w-full max-w-[150px] mx-auto">
                      <div className="relative h-1.5 w-full bg-[#E0E3EB] rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-[#2962FF] rounded-full"
                          style={{ width: `${currentPosition}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] tabular-nums text-[#787B86]">
                        <span>${quote.dayLow.toFixed(2)}</span>
                        <span>${quote.dayHigh.toFixed(2)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="hidden lg:table-cell py-2 px-4 text-right text-xs tabular-nums text-[#5a5e6b]">
                    {quote.volume}
                  </td>

                  {/* Market Cap */}
                  <td className="hidden sm:table-cell py-2 px-4 text-right text-xs font-medium tabular-nums text-[#181b24]">
                    {quote.marketCap}
                  </td>

                  {/* P/E Ratio */}
                  <td className="hidden xl:table-cell py-2 px-4 text-right text-xs tabular-nums text-[#5a5e6b]">
                    {quote.peRatio !== undefined ? quote.peRatio.toFixed(1) : '—'}
                  </td>

                  {/* 7D Trend Sparkline */}
                  <td className="hidden lg:table-cell py-2 px-4 text-center">
                    <div className="flex justify-center">
                      <svg width={sparkWidth} height={sparkHeight} className="overflow-visible">
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
                  </td>

                  {/* Action Button: Pill primary / secondary button */}
                  <td className="py-2 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onTradeQuote(quote)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F3FA] hover:bg-[#131722] hover:text-white text-[#131722] transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedQuotes.length === 0 && (
        <div className="p-12 text-center text-[#787B86]">
          <p className="text-sm font-medium">No assets matching current filter.</p>
          <p className="text-xs mt-1">Try selecting a different market category or clearing the search.</p>
        </div>
      )}
    </div>
  );
};
