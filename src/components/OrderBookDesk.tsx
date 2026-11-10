import React, { useState } from 'react';
import { AssetQuote, OrderBookRow, RecentTrade } from '../types/market';
import { ArrowUpRight, ArrowDownRight, Layers, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface OrderBookDeskProps {
  quote: AssetQuote;
  orderBook: { bids: OrderBookRow[]; asks: OrderBookRow[] };
  recentTrades: RecentTrade[];
  onExecuteTrade: (trade: {
    symbol: string;
    side: 'buy' | 'sell';
    orderType: 'market' | 'limit' | 'stop';
    shares: number;
    price: number;
  }) => void;
  cashBalance: number;
}

export const OrderBookDesk: React.FC<OrderBookDeskProps> = ({
  quote,
  orderBook,
  recentTrades,
  onExecuteTrade,
  cashBalance,
}) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('limit');
  const [shares, setShares] = useState<number>(50);
  const [limitPrice, setLimitPrice] = useState<number>(quote.price);
  const [executionNotice, setExecutionNotice] = useState<string | null>(null);

  const bestAsk = orderBook.asks[orderBook.asks.length - 1]?.price || quote.price;
  const bestBid = orderBook.bids[0]?.price || quote.price;
  const spread = Math.abs(bestAsk - bestBid);
  const spreadPct = (spread / quote.price) * 100;

  const currentPrice = orderType === 'market' ? quote.price : limitPrice;
  const estimatedTotal = shares * currentPrice;

  const handleQuickShares = (amount: number) => {
    setShares(prev => Math.max(1, prev + amount));
  };

  const handleMaxShares = () => {
    if (side === 'buy') {
      const max = Math.floor(cashBalance / (currentPrice || 1));
      setShares(Math.max(1, max));
    } else {
      setShares(100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) return;

    if (side === 'buy' && estimatedTotal > cashBalance) {
      setExecutionNotice(`Insufficient cash balance! Required: $${estimatedTotal.toFixed(2)}, Available: $${cashBalance.toFixed(2)}`);
      setTimeout(() => setExecutionNotice(null), 3500);
      return;
    }

    onExecuteTrade({
      symbol: quote.symbol,
      side,
      orderType,
      shares,
      price: currentPrice,
    });

    setExecutionNotice(`Filled ${side.toUpperCase()} order for ${shares} shares of ${quote.symbol} at $${currentPrice.toFixed(2)}`);
    setTimeout(() => setExecutionNotice(null), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Col 1-7: Level 2 Order Book & Depth */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Order Book Card */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2962FF]" />
              <h2 className="font-display font-semibold text-sm text-[#131722]">
                Level 2 Depth Ladder
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0F3FA] text-[#787B86]">
                {quote.symbol}
              </span>
            </div>
            <div className="text-right text-[11px] text-[#787B86] tabular-nums font-mono">
              Spread: <span className="font-semibold text-[#181b24]">${spread.toFixed(2)} ({spreadPct.toFixed(2)}%)</span>
            </div>
          </div>

          {/* Depth Headers */}
          <div className="grid grid-cols-3 py-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-[#787B86] border-b border-[#E0E3EB]">
            <span>Price ($)</span>
            <span className="text-right">Size (Shares)</span>
            <span className="text-right">Total Depth</span>
          </div>

          {/* Asks (Sell Orders - Red) */}
          <div className="flex flex-col-reverse divide-y divide-[#E0E3EB]/40 py-1 font-mono text-xs tabular-nums">
            {orderBook.asks.map((ask, idx) => (
              <div
                key={`ask-${idx}`}
                onClick={() => setLimitPrice(ask.price)}
                className="relative grid grid-cols-3 py-1 px-1 hover:bg-[#F23645]/5 transition-colors cursor-pointer group"
              >
                {/* Visual Depth Bar Fill */}
                <div
                  className="absolute top-0 bottom-0 right-0 bg-[#F23645]/10 pointer-events-none transition-all"
                  style={{ width: `${ask.depthPercent}%` }}
                />
                <span className="relative z-10 font-semibold text-[#F23645]">
                  {ask.price.toFixed(2)}
                </span>
                <span className="relative z-10 text-right text-[#434656]">
                  {ask.size.toLocaleString()}
                </span>
                <span className="relative z-10 text-right text-[#787B86]">
                  {ask.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Mid Market Spread Bar */}
          <div className="py-2.5 px-3 bg-[#F0F3FA] rounded-lg my-1.5 flex items-center justify-between border border-[#E0E3EB]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#181b24] tabular-nums">
                Mid: ${((bestAsk + bestBid) / 2).toFixed(2)}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.2 rounded-full ${
                quote.change >= 0 ? 'bg-[#089981]/10 text-[#089981]' : 'bg-[#F23645]/10 text-[#F23645]'
              }`}>
                {quote.change >= 0 ? 'BUY DOMINANT' : 'SELL DOMINANT'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#787B86]">
              Tick: 0.05
            </span>
          </div>

          {/* Bids (Buy Orders - Green) */}
          <div className="flex flex-col divide-y divide-[#E0E3EB]/40 py-1 font-mono text-xs tabular-nums">
            {orderBook.bids.map((bid, idx) => (
              <div
                key={`bid-${idx}`}
                onClick={() => setLimitPrice(bid.price)}
                className="relative grid grid-cols-3 py-1 px-1 hover:bg-[#089981]/5 transition-colors cursor-pointer group"
              >
                {/* Visual Depth Bar Fill */}
                <div
                  className="absolute top-0 bottom-0 right-0 bg-[#089981]/10 pointer-events-none transition-all"
                  style={{ width: `${bid.depthPercent}%` }}
                />
                <span className="relative z-10 font-semibold text-[#089981]">
                  {bid.price.toFixed(2)}
                </span>
                <span className="relative z-10 text-right text-[#434656]">
                  {bid.size.toLocaleString()}
                </span>
                <span className="relative z-10 text-right text-[#787B86]">
                  {bid.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Real-Time Tape */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0E3EB]">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-[#787B86]">
              Time & Sales Tape
            </h3>
            <span className="text-[10px] text-[#787B86]">Continuous Stream</span>
          </div>

          <div className="divide-y divide-[#E0E3EB]/40 pt-1 font-mono text-xs tabular-nums max-h-48 overflow-y-auto">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="grid grid-cols-4 py-1 px-1 hover:bg-[#F0F3FA] transition-colors">
                <span className="text-[#787B86]">{trade.time}</span>
                <span className={`font-semibold ${trade.side === 'buy' ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  ${trade.price.toFixed(2)}
                </span>
                <span className="text-right text-[#434656]">{trade.size.toLocaleString()}</span>
                <span className={`text-right font-medium uppercase text-[11px] ${trade.side === 'buy' ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  {trade.side}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Col 8-12: Simulated Execution Desk */}
      <div className="lg:col-span-5">
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 lg:p-6 shadow-2xs sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB]">
            <h2 className="font-display font-bold text-base text-[#131722]">
              Order Execution Desk
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2962FF]/10 text-[#2962FF]">
              Direct Routing
            </span>
          </div>

          {/* Notification Toast */}
          {executionNotice && (
            <div className="mt-3 p-3 rounded-lg bg-[#131722] text-white text-xs flex items-center gap-2 shadow-md animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
              <span>{executionNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Buy / Sell Pill Toggle */}
            <div className="grid grid-cols-2 p-1 bg-[#F0F3FA] rounded-full border border-[#E0E3EB]">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  side === 'buy'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  side === 'sell'
                    ? 'bg-[#F23645] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                SELL
              </button>
            </div>

            {/* Order Type Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787B86] mb-1.5">
                Order Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F0F3FA] rounded-full border border-[#E0E3EB]">
                {(['market', 'limit', 'stop'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`py-1.5 rounded-full text-xs font-medium uppercase transition-all ${
                      orderType === type
                        ? 'bg-white text-[#131722] shadow-2xs font-semibold'
                        : 'text-[#787B86] hover:text-[#131722]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Limit Price Input (if not Market) */}
            {orderType !== 'market' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">Limit Price</span>
                  <span className="text-[11px] text-[#787B86] tabular-nums">Market: ${quote.price.toFixed(2)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#787B86]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 pl-7 pr-4 rounded-xl bg-[#F0F3FA] border border-[#E0E3EB] focus:border-[#2962FF] focus:bg-white focus:outline-none text-xs font-semibold tabular-nums text-[#181b24] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Shares Input + Quick Increment Buttons */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">Shares / Quantity</span>
                <span className="text-[11px] text-[#787B86] tabular-nums">Min 1</span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F0F3FA] border border-[#E0E3EB] focus:border-[#2962FF] focus:bg-white focus:outline-none text-xs font-semibold tabular-nums text-[#181b24] transition-all"
              />

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[10, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickShares(amt)}
                    className="py-1 rounded-full text-xs font-semibold bg-[#F0F3FA] hover:bg-[#E0E3EB] text-[#434656] transition-colors"
                  >
                    +{amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleMaxShares}
                  className="py-1 rounded-full text-xs font-semibold bg-[#F0F3FA] hover:bg-[#E0E3EB] text-[#2962FF] transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Order Summary & Financial Math */}
            <div className="p-3.5 rounded-xl bg-[#faf9ff] border border-[#E0E3EB] space-y-2 text-xs">
              <div className="flex justify-between text-[#787B86]">
                <span>Execution Unit Price</span>
                <span className="font-semibold text-[#181b24] tabular-nums font-mono">${currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#787B86]">
                <span>Cash Available</span>
                <span className="font-semibold text-[#181b24] tabular-nums font-mono">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-[#E0E3EB] pt-2 flex justify-between font-bold text-sm text-[#181b24]">
                <span>Estimated Value</span>
                <span className="tabular-nums font-mono text-[#0049db]">${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Primary Action Pill Button */}
            <button
              type="submit"
              className={`w-full h-11 rounded-full font-bold text-xs uppercase tracking-wider text-white shadow-sm transition-all active:scale-98 cursor-pointer ${
                side === 'buy'
                  ? 'bg-[#089981] hover:bg-[#089981]/90'
                  : 'bg-[#F23645] hover:bg-[#F23645]/90'
              }`}
            >
              Confirm {side} {shares} {quote.symbol}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
