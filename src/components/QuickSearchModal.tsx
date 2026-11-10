import React, { useState, useEffect, useRef } from 'react';
import { AssetQuote } from '../types/market';
import { Search, X, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: AssetQuote[];
  onSelectQuote: (quote: AssetQuote) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  quotes,
  onSelectQuote,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler for ESC and CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Handled in parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredQuotes = quotes.filter(q =>
    q.symbol.toLowerCase().includes(query.toLowerCase()) ||
    q.name.toLowerCase().includes(query.toLowerCase()) ||
    q.sector.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#131722]/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[#E0E3EB] flex items-center gap-3 bg-[#faf9ff]">
          <Search className="w-5 h-5 text-[#787B86] shrink-0 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, or sector (e.g. NVDA, Apple, Crypto)..."
            className="w-full bg-transparent text-sm font-medium text-[#131722] placeholder:text-[#787B86] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787B86] hover:text-[#131722] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#E0E3EB] bg-white text-[#787B86] shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#E0E3EB] p-2">
          {filteredQuotes.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787B86]">
              No assets matching "{query}".
            </div>
          ) : (
            filteredQuotes.map((q) => {
              const isPositive = q.change >= 0;
              return (
                <button
                  key={q.symbol}
                  onClick={() => {
                    onSelectQuote(q);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#F0F3FA] transition-colors flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: q.logoBg, color: q.logoColor }}
                    >
                      {q.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#131722] group-hover:text-[#0049db] transition-colors">
                          {q.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E0E2EE] text-[#434656]">
                          {q.sector}
                        </span>
                      </div>
                      <span className="text-xs text-[#787B86]">{q.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xs tabular-nums text-[#181b24]">
                      ${q.price.toFixed(2)}
                    </div>
                    <div className={`text-[11px] font-semibold tabular-nums ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                      {isPositive ? '+' : ''}{q.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Quick Nav Footer */}
        <div className="p-3 bg-[#faf9ff] border-t border-[#E0E3EB] flex items-center justify-between text-[11px] text-[#787B86]">
          <span>Popular: NVDA, AAPL, BTC, TSLA, MSFT</span>
          <span>Click asset to open interactive chart</span>
        </div>
      </div>
    </div>
  );
};
