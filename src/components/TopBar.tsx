import React from 'react';
import { Search, Activity, Zap, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { TerminalView } from '../types/market';

interface TopBarProps {
  activeView: TerminalView;
  setActiveView: (view: TerminalView) => void;
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenSearch: () => void;
  onOpenTradeModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  setActiveView,
  isSimulating,
  setIsSimulating,
  onOpenSearch,
  onOpenTradeModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E0E3EB] px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4 lg:gap-8">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveView('screener'); }}
          className="flex items-center gap-2.5 text-[#131722] hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-[#131722] flex items-center justify-center text-white shadow-sm">
            <Activity className="w-4 h-4 text-[#2962FF]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-tight text-[#131722] leading-tight">
              MARKET TERMINAL
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#787B86]">
              Institutional Suite
            </span>
          </div>
        </a>

        {/* Live Market Engine Status Switch */}
        <button
          onClick={() => setIsSimulating(prev => !prev)}
          title={isSimulating ? 'Market streaming active. Click to pause.' : 'Market streaming paused. Click to resume.'}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${
            isSimulating
              ? 'bg-[#089981]/10 text-[#089981] border-[#089981]/25 hover:bg-[#089981]/15'
              : 'bg-[#F0F3FA] text-[#787B86] border-[#E0E3EB] hover:bg-[#E0E3EB]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-[#089981] animate-ping' : 'bg-[#787B86]'}`} />
          <span className="tabular-nums">{isSimulating ? 'STREAMING 100ms' : 'PAUSED'}</span>
        </button>
      </div>

      {/* Zone 2: Search Bar Capsule + Screen Nav Links */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl justify-center">
        {/* Capsule Search Bar with Shortcut Cue */}
        <button
          onClick={onOpenSearch}
          className="w-full max-w-md h-[38px] px-3.5 rounded-full bg-[#F0F3FA] hover:bg-[#E0E3EB] transition-colors border border-transparent hover:border-[#D1D4DC] flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-[#787B86] group-hover:text-[#131722] transition-colors">
            <Search className="w-4 h-4 text-[#787B86]" />
            <span className="text-xs font-normal text-[#787B86]">Search tickers, companies, indices...</span>
          </div>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-[#c3c5d8] bg-white text-[10px] font-mono text-[#5a5e6b] font-medium shadow-2xs">
            Ctrl+K
          </span>
        </button>

        {/* Desktop Screen Switcher Links */}
        <nav className="hidden xl:flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveView('screener')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              activeView === 'screener'
                ? 'bg-[#131722] text-white'
                : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
            }`}
          >
            Screener
          </button>
          <button
            onClick={() => setActiveView('chart')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              activeView === 'chart'
                ? 'bg-[#131722] text-white'
                : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
            }`}
          >
            Interactive Chart
          </button>
          <button
            onClick={() => setActiveView('heatmap')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              activeView === 'heatmap'
                ? 'bg-[#131722] text-white'
                : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveView('orderbook')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              activeView === 'orderbook'
                ? 'bg-[#131722] text-white'
                : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
            }`}
          >
            Order Book
          </button>
          <button
            onClick={() => setActiveView('portfolio')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              activeView === 'portfolio'
                ? 'bg-[#131722] text-white'
                : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
            }`}
          >
            Portfolio & Alerts
          </button>
        </nav>
      </div>

      {/* Zone 3: Primary Action & Quick Execution */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenTradeModal}
          className="h-10 px-5 rounded-full bg-[#131722] hover:bg-[#131722]/90 active:scale-98 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Zap className="w-3.5 h-3.5 text-[#2962FF]" />
          <span>New Order</span>
        </button>
      </div>
    </header>
  );
};
