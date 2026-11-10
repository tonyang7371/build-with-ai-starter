import React, { useState, useMemo } from 'react';
import { AssetQuote, Candle } from '../types/market';
import { ArrowUpRight, ArrowDownRight, BarChart2, TrendingUp, Sliders, Layers, Zap, Info } from 'lucide-react';

interface ChartTerminalProps {
  quote: AssetQuote;
  onTradeQuote: (quote: AssetQuote, side: 'buy' | 'sell') => void;
  onOpenOrderBook: () => void;
}

type TimeFrame = '1D' | '5D' | '1M' | '3M' | '1Y' | '5Y' | 'ALL';
type ChartType = 'candles' | 'area' | 'line';

export const ChartTerminal: React.FC<ChartTerminalProps> = ({
  quote,
  onTradeQuote,
  onOpenOrderBook,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<Candle | null>(null);

  // Generate synthetic candles based on timeframe & asset price
  const candleData: Candle[] = useMemo(() => {
    const count = timeframe === '1D' ? 24 : timeframe === '5D' ? 30 : 40;
    const basePrice = quote.price * 0.96;
    const volatility = quote.beta ? quote.beta * 0.012 : 0.015;

    let currentClose = basePrice;
    const items: Candle[] = [];

    const now = new Date();
    for (let i = count; i >= 0; i--) {
      const open = currentClose;
      const variation = (Math.random() - 0.48) * open * volatility;
      const close = Math.max(open + variation, open * 0.85);
      const high = Math.max(open, close) + Math.random() * open * 0.006;
      const low = Math.min(open, close) - Math.random() * open * 0.006;
      const volume = Math.floor(Math.random() * 800000 + 200000);

      // Label
      let timeLabel = '';
      if (timeframe === '1D') {
        const d = new Date(now.getTime() - i * 15 * 60 * 1000);
        timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        timeLabel = `${d.getMonth() + 1}/${d.getDate()}`;
      }

      items.push({
        time: timeLabel,
        open,
        high,
        low,
        close: i === 0 ? quote.price : close,
        volume,
      });

      currentClose = close;
    }

    return items;
  }, [quote.price, quote.beta, timeframe]);

  // Derived values for chart scale
  const minPrice = Math.min(...candleData.map(c => c.low));
  const maxPrice = Math.max(...candleData.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candleData.map(c => c.volume));

  const chartWidth = 840;
  const chartHeight = 360;
  const paddingBottom = 40;
  const paddingRight = 60;
  const usableWidth = chartWidth - paddingRight;
  const usableHeight = chartHeight - paddingBottom;

  // SMA 20 points
  const sma20 = useMemo(() => {
    return candleData.map((_, i) => {
      const start = Math.max(0, i - 19);
      const slice = candleData.slice(start, i + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / slice.length;
    });
  }, [candleData]);

  const isPositive = quote.change >= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Asset Header Banner: Institutional Data Header */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 lg:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Symbol Title & Price Lockup */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-sm text-white shrink-0 shadow-xs"
              style={{ backgroundColor: quote.logoBg, color: quote.logoColor }}
            >
              {quote.symbol.slice(0, 3)}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-2xl text-[#131722] tracking-tight">
                  {quote.symbol}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0F3FA] text-[#434656]">
                  {quote.sector}
                </span>
                <span className="text-xs text-[#787B86] font-medium">
                  {quote.name}
                </span>
              </div>

              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="font-display font-bold text-2xl sm:text-3xl tabular-nums text-[#181b24]">
                  ${quote.price >= 1000 ? quote.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : quote.price.toFixed(2)}
                </span>
                <div
                  className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                    isPositive
                      ? 'bg-[#089981]/10 text-[#089981]'
                      : 'bg-[#F23645]/10 text-[#F23645]'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>{isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={onOpenOrderBook}
              className="h-9 px-3.5 rounded-full bg-[#F0F3FA] hover:bg-[#E0E3EB] text-[#131722] font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-[#E0E3EB]"
            >
              <Layers className="w-3.5 h-3.5 text-[#2962FF]" />
              <span>Level 2 Book</span>
            </button>
            <button
              onClick={() => onTradeQuote(quote, 'buy')}
              className="h-9 px-5 rounded-full bg-[#089981] hover:bg-[#089981]/90 text-white font-semibold text-xs transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              Buy {quote.symbol}
            </button>
            <button
              onClick={() => onTradeQuote(quote, 'sell')}
              className="h-9 px-5 rounded-full bg-[#F23645] hover:bg-[#F23645]/90 text-white font-semibold text-xs transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              Sell {quote.symbol}
            </button>
          </div>
        </div>

        {/* Chart Controls Bar */}
        <div className="mt-5 pt-4 border-t border-[#E0E3EB] flex flex-wrap items-center justify-between gap-3">
          {/* Timeframe Selectors */}
          <div className="flex items-center bg-[#F0F3FA] p-0.5 rounded-full border border-[#E0E3EB]">
            {(['1D', '5D', '1M', '3M', '1Y', '5Y', 'ALL'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-[#131722] text-white shadow-2xs'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style & Indicators Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F0F3FA] p-0.5 rounded-full border border-[#E0E3EB]">
              <button
                onClick={() => setChartType('candles')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  chartType === 'candles' ? 'bg-white text-[#131722] shadow-2xs font-semibold' : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                Candles
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  chartType === 'area' ? 'bg-white text-[#131722] shadow-2xs font-semibold' : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  chartType === 'line' ? 'bg-white text-[#131722] shadow-2xs font-semibold' : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                Line
              </button>
            </div>

            <button
              onClick={() => setShowSMA(prev => !prev)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                showSMA
                  ? 'bg-[#2962FF]/10 text-[#2962FF] border-[#2962FF]/30 font-semibold'
                  : 'bg-[#F0F3FA] text-[#787B86] border-[#E0E3EB]'
              }`}
            >
              SMA (20)
            </button>

            <button
              onClick={() => setShowVolume(prev => !prev)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                showVolume
                  ? 'bg-[#131722] text-white border-[#131722] font-semibold'
                  : 'bg-[#F0F3FA] text-[#787B86] border-[#E0E3EB]'
              }`}
            >
              Volume
            </button>
          </div>
        </div>

        {/* Hover Crosshair Info Strip */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#787B86] min-h-[22px] px-1 font-mono tabular-nums">
          {hoveredPoint ? (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-[#181b24]">{hoveredPoint.time}</span>
              <span>O: <strong className="text-[#181b24]">${hoveredPoint.open.toFixed(2)}</strong></span>
              <span>H: <strong className="text-[#089981]">${hoveredPoint.high.toFixed(2)}</strong></span>
              <span>L: <strong className="text-[#F23645]">${hoveredPoint.low.toFixed(2)}</strong></span>
              <span>C: <strong className="text-[#181b24]">${hoveredPoint.close.toFixed(2)}</strong></span>
              <span>Vol: <strong className="text-[#5a5e6b]">{hoveredPoint.volume.toLocaleString()}</strong></span>
            </div>
          ) : (
            <span>Hover across candles to inspect tick details</span>
          )}
          <span className="text-[11px] text-[#787B86] hidden sm:inline">NY Reg Hours · Real-Time Feed</span>
        </div>

        {/* Interactive SVG Chart Canvas */}
        <div className="relative w-full overflow-hidden mt-2 bg-[#faf9ff] rounded-lg border border-[#E0E3EB] p-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto cursor-crosshair select-none"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Horizontal Grid lines & Price Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = usableHeight * pct + 10;
              const priceVal = maxPrice - pct * priceRange;
              return (
                <g key={idx}>
                  <line
                    x1={0}
                    y1={y}
                    x2={usableWidth}
                    y2={y}
                    stroke="#E0E3EB"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={usableWidth + 8}
                    y={y + 4}
                    fill="#787B86"
                    fontSize="10"
                    fontFamily="Inter"
                    className="tabular-nums"
                  >
                    ${priceVal.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Volume Histogram (bottom 60px) */}
            {showVolume &&
              candleData.map((c, i) => {
                const step = usableWidth / candleData.length;
                const x = i * step + step * 0.15;
                const w = Math.max(step * 0.7, 2);
                const volHeight = (c.volume / maxVolume) * 55;
                const y = usableHeight - volHeight;
                const isGreen = c.close >= c.open;
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x}
                    y={y}
                    width={w}
                    height={volHeight}
                    fill={isGreen ? '#089981' : '#F23645'}
                    opacity={0.25}
                    rx="1"
                  />
                );
              })}

            {/* Area or Line Render */}
            {(chartType === 'area' || chartType === 'line') && (
              <>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962FF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2962FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {chartType === 'area' && (
                  <polygon
                    fill="url(#chartGradient)"
                    points={`0,${usableHeight} ${candleData
                      .map((c, i) => {
                        const step = usableWidth / candleData.length;
                        const x = i * step + step * 0.5;
                        const y = usableHeight - ((c.close - minPrice) / priceRange) * (usableHeight - 30) - 15;
                        return `${x},${y}`;
                      })
                      .join(' ')} ${usableWidth},${usableHeight}`}
                  />
                )}

                <polyline
                  fill="none"
                  stroke="#2962FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={candleData
                    .map((c, i) => {
                      const step = usableWidth / candleData.length;
                      const x = i * step + step * 0.5;
                      const y = usableHeight - ((c.close - minPrice) / priceRange) * (usableHeight - 30) - 15;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </>
            )}

            {/* Candlesticks Render */}
            {chartType === 'candles' &&
              candleData.map((c, i) => {
                const step = usableWidth / candleData.length;
                const centerX = i * step + step * 0.5;
                const barWidth = Math.max(step * 0.65, 3);
                const isGreen = c.close >= c.open;
                const strokeColor = isGreen ? '#089981' : '#F23645';

                const highY = usableHeight - ((c.high - minPrice) / priceRange) * (usableHeight - 30) - 15;
                const lowY = usableHeight - ((c.low - minPrice) / priceRange) * (usableHeight - 30) - 15;
                const openY = usableHeight - ((c.open - minPrice) / priceRange) * (usableHeight - 30) - 15;
                const closeY = usableHeight - ((c.close - minPrice) / priceRange) * (usableHeight - 30) - 15;

                const topY = Math.min(openY, closeY);
                const bodyH = Math.max(Math.abs(closeY - openY), 2);

                return (
                  <g
                    key={`candle-${i}`}
                    onMouseEnter={() => setHoveredPoint(c)}
                    className="cursor-pointer"
                  >
                    {/* Wick */}
                    <line
                      x1={centerX}
                      y1={highY}
                      x2={centerX}
                      y2={lowY}
                      stroke={strokeColor}
                      strokeWidth="1.2"
                    />
                    {/* Candle Body */}
                    <rect
                      x={centerX - barWidth / 2}
                      y={topY}
                      width={barWidth}
                      height={bodyH}
                      fill={strokeColor}
                      rx="1"
                    />
                  </g>
                );
              })}

            {/* SMA 20 Line Overlay */}
            {showSMA && (
              <polyline
                fill="none"
                stroke="#2962FF"
                strokeWidth="1.8"
                strokeDasharray="4 2"
                points={sma20
                  .map((val, i) => {
                    const step = usableWidth / candleData.length;
                    const x = i * step + step * 0.5;
                    const y = usableHeight - ((val - minPrice) / priceRange) * (usableHeight - 30) - 15;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Time Axis Labels */}
            {candleData
              .filter((_, i) => i % Math.ceil(candleData.length / 6) === 0)
              .map((c, i) => {
                const origIndex = candleData.findIndex(item => item === c);
                const step = usableWidth / candleData.length;
                const x = origIndex * step + step * 0.5;
                return (
                  <text
                    key={`time-${i}`}
                    x={x}
                    y={usableHeight + 20}
                    textAnchor="middle"
                    fill="#787B86"
                    fontSize="10"
                    fontFamily="Inter"
                  >
                    {c.time}
                  </text>
                );
              })}
          </svg>
        </div>
      </div>

      {/* Key Financial Statistics & Analyst Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Valuation & Range */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-[#787B86] mb-3">
            Valuation & Price Range
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-[#787B86] block text-[11px]">52-Week Range</span>
              <span className="font-semibold tabular-nums text-[#181b24]">
                ${quote.low52w?.toFixed(2) ?? '—'} – ${quote.high52w?.toFixed(2) ?? '—'}
              </span>
            </div>
            <div>
              <span className="text-[#787B86] block text-[11px]">Market Cap</span>
              <span className="font-semibold tabular-nums text-[#181b24]">{quote.marketCap}</span>
            </div>
            <div>
              <span className="text-[#787B86] block text-[11px]">P/E Ratio</span>
              <span className="font-semibold tabular-nums text-[#181b24]">
                {quote.peRatio !== undefined ? quote.peRatio.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[#787B86] block text-[11px]">Beta (Volatility)</span>
              <span className="font-semibold tabular-nums text-[#181b24]">{quote.beta ?? '1.00'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Fundamentals & Dividends */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-[#787B86] mb-3">
            Per Share & Dividend
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-[#787B86] block text-[11px]">Diluted EPS</span>
              <span className="font-semibold tabular-nums text-[#181b24]">
                {quote.eps ? `$${quote.eps.toFixed(2)}` : '—'}
              </span>
            </div>
            <div>
              <span className="text-[#787B86] block text-[11px]">Dividend Yield</span>
              <span className="font-semibold tabular-nums text-[#181b24]">
                {quote.divYield !== undefined ? `${quote.divYield.toFixed(2)}%` : '0.00%'}
              </span>
            </div>
            <div>
              <span className="text-[#787B86] block text-[11px]">Avg Volume (50D)</span>
              <span className="font-semibold tabular-nums text-[#181b24]">{quote.avgVolume50d ?? quote.volume}</span>
            </div>
            <div>
              <span className="text-[#787B86] block text-[11px]">Price / Target</span>
              <span className="font-semibold tabular-nums text-[#089981]">
                ${quote.targetPrice ? quote.targetPrice.toFixed(2) : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Analyst Consensus Gauge */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-[#787B86]">
              Analyst Consensus
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#089981]/10 text-[#089981]">
              {quote.analystRating ?? 'Buy'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#787B86]">Consensus Score</span>
              <span className="font-semibold tabular-nums text-[#181b24]">4.6 / 5.0 (38 Analysts)</span>
            </div>
            <div className="h-2 w-full bg-[#E0E3EB] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#089981]" style={{ width: '70%' }} title="Buy 70%" />
              <div className="h-full bg-[#2962FF]" style={{ width: '22%' }} title="Hold 22%" />
              <div className="h-full bg-[#F23645]" style={{ width: '8%' }} title="Sell 8%" />
            </div>
            <div className="flex justify-between text-[10px] text-[#787B86] pt-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" /> Buy (26)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]" /> Hold (9)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F23645]" /> Underperform (3)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
