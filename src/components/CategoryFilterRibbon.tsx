import React from 'react';
import { AssetCategory, TerminalView } from '../types/market';
import { LayoutGrid, LineChart, PieChart, Layers, Wallet, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryFilterRibbonProps {
  selectedCategory: AssetCategory;
  onSelectCategory: (cat: AssetCategory) => void;
  activeView: TerminalView;
  setActiveView: (view: TerminalView) => void;
  assetCount: number;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
}

const CATEGORIES: { id: AssetCategory; label: string }[] = [
  { id: 'all', label: 'All Markets' },
  { id: 'mega-tech', label: 'Mega Tech' },
  { id: 'equities', label: 'US Equities' },
  { id: 'crypto', label: 'Cryptocurrency' },
  { id: 'commodities', label: 'Commodities & Rates' },
  { id: 'gainers', label: 'Top Gainers' },
  { id: 'active', label: 'Most Active' },
  { id: 'dividend', label: 'High Dividend' },
];

export const CategoryFilterRibbon: React.FC<CategoryFilterRibbonProps> = ({
  selectedCategory,
  onSelectCategory,
  activeView,
  setActiveView,
  assetCount,
  searchFilter,
  setSearchFilter,
}) => {
  return (
    <div className="w-full bg-[#faf9ff] border-b border-[#E0E3EB] px-4 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Category Filter Chips: Horizontally scrollable pill tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] hover:bg-[#E0E3EB]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Right Toolbar: View Mode Tabs + Filter count */}
      <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
        <span className="text-[11px] font-medium text-[#787B86] tabular-nums whitespace-nowrap">
          {assetCount} assets listed
        </span>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center bg-[#F0F3FA] p-0.5 rounded-full border border-[#E0E3EB]">
          <button
            onClick={() => setActiveView('screener')}
            title="Screener Data Table"
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'screener'
                ? 'bg-white text-[#131722] shadow-2xs font-semibold'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setActiveView('chart')}
            title="Interactive Chart Terminal"
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'chart'
                ? 'bg-white text-[#131722] shadow-2xs font-semibold'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chart</span>
          </button>
          <button
            onClick={() => setActiveView('heatmap')}
            title="Sector Treemap Heatmap"
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'heatmap'
                ? 'bg-white text-[#131722] shadow-2xs font-semibold'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Heatmap</span>
          </button>
          <button
            onClick={() => setActiveView('orderbook')}
            title="Level 2 Order Book & Trade Desk"
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'orderbook'
                ? 'bg-white text-[#131722] shadow-2xs font-semibold'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book</span>
          </button>
          <button
            onClick={() => setActiveView('portfolio')}
            title="Portfolio & Price Alerts"
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'portfolio'
                ? 'bg-white text-[#131722] shadow-2xs font-semibold'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
