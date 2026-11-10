import React, { useState } from 'react';
import { AssetQuote } from '../types/market';
import { X, CheckCircle2, Zap } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: AssetQuote[];
  defaultQuote?: AssetQuote;
  cashBalance: number;
  onExecuteTrade: (trade: {
    symbol: string;
    side: 'buy' | 'sell';
    orderType: 'market' | 'limit' | 'stop';
    shares: number;
    price: number;
  }) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  quotes,
  defaultQuote,
  cashBalance,
  onExecuteTrade,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    defaultQuote?.symbol || quotes[0]?.symbol || 'NVDA'
  );
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [shares, setShares] = useState<number>(25);
  const [limitPrice, setLimitPrice] = useState<number>(defaultQuote?.price || 147.50);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentQuote = quotes.find(q => q.symbol === selectedSymbol) || quotes[0];
  const executionPrice = orderType === 'market' ? currentQuote.price : limitPrice;
  const totalCost = shares * executionPrice;

  const handleSymbolChange = (sym: string) => {
    setSelectedSymbol(sym);
    const q = quotes.find(item => item.symbol === sym);
    if (q) setLimitPrice(q.price);
  };

  const handleQuickAdd = (amt: number) => {
    setShares(prev => Math.max(1, prev + amt));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) return;

    if (side === 'buy' && totalCost > cashBalance) {
      setStatusMessage(`Insufficient cash! Need $${totalCost.toFixed(2)}, have $${cashBalance.toFixed(2)}.`);
      return;
    }

    onExecuteTrade({
      symbol: currentQuote.symbol,
      side,
      orderType,
      shares,
      price: executionPrice,
    });

    setStatusMessage(`Order filled! ${side.toUpperCase()} ${shares} ${currentQuote.symbol} at $${executionPrice.toFixed(2)}`);
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131722]/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between bg-[#faf9ff]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#131722] flex items-center justify-center text-white">
              <Zap className="w-3.5 h-3.5 text-[#2962FF]" />
            </div>
            <h3 className="font-display font-bold text-sm text-[#131722]">
              Order Ticket
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#787B86] hover:text-[#131722] hover:bg-[#E0E3EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {statusMessage && (
            <div className="p-3 rounded-xl bg-[#131722] text-white text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Asset Selection */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787B86] mb-1">
              Select Asset
            </label>
            <select
              value={selectedSymbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#F0F3FA] border border-[#E0E3EB] text-xs font-semibold text-[#181b24] focus:outline-none focus:border-[#2962FF]"
            >
              {quotes.map(q => (
                <option key={q.symbol} value={q.symbol}>
                  {q.symbol} — {q.name} (${q.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Buy / Sell Toggle */}
          <div className="grid grid-cols-2 p-1 bg-[#F0F3FA] rounded-full border border-[#E0E3EB]">
            <button
              type="button"
              onClick={() => setSide('buy')}
              className={`py-2 rounded-full text-xs font-bold transition-all ${
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
              className={`py-2 rounded-full text-xs font-bold transition-all ${
                side === 'sell'
                  ? 'bg-[#F23645] text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              SELL
            </button>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787B86] mb-1">
              Order Type
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F0F3FA] rounded-full border border-[#E0E3EB]">
              {(['market', 'limit', 'stop'] as const).map(type => (
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

          {/* Limit Price */}
          {orderType !== 'market' && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787B86] mb-1">
                Limit Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-xl bg-[#F0F3FA] border border-[#E0E3EB] text-xs font-semibold tabular-nums text-[#181b24] focus:outline-none focus:border-[#2962FF]"
              />
            </div>
          )}

          {/* Shares */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">Shares</span>
              <span className="text-[11px] text-[#787B86] tabular-nums">Available Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <input
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-10 px-3 rounded-xl bg-[#F0F3FA] border border-[#E0E3EB] text-xs font-semibold tabular-nums text-[#181b24] focus:outline-none focus:border-[#2962FF]"
            />
            <div className="flex gap-1.5 mt-2">
              {[10, 25, 50, 100].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAdd(amt)}
                  className="flex-1 py-1 rounded-full text-xs font-semibold bg-[#F0F3FA] hover:bg-[#E0E3EB] text-[#434656]"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Math breakdown */}
          <div className="p-3 bg-[#faf9ff] rounded-xl border border-[#E0E3EB] flex justify-between items-center text-xs">
            <span className="text-[#787B86]">Estimated Total:</span>
            <span className="font-bold text-sm font-mono text-[#0049db] tabular-nums">
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full h-11 rounded-full font-bold text-xs uppercase tracking-wider text-white shadow-sm transition-all cursor-pointer ${
              side === 'buy' ? 'bg-[#089981] hover:bg-[#089981]/90' : 'bg-[#F23645] hover:bg-[#F23645]/90'
            }`}
          >
            Execute {side} Order
          </button>
        </form>
      </div>
    </div>
  );
};
