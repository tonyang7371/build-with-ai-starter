import React, { useState } from 'react';
import { PortfolioPosition, TradeOrder, PriceAlert, AssetQuote } from '../types/market';
import { ArrowUpRight, ArrowDownRight, Wallet, Bell, History, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface PortfolioDeskProps {
  positions: PortfolioPosition[];
  cashBalance: number;
  tradeHistory: TradeOrder[];
  alerts: PriceAlert[];
  quotes: AssetQuote[];
  onClosePosition: (symbol: string) => void;
  onAddAlert: (symbol: string, targetPrice: number, direction: 'above' | 'below') => void;
  onDeleteAlert: (id: string) => void;
  onSelectSymbol: (symbol: string) => void;
}

export const PortfolioDesk: React.FC<PortfolioDeskProps> = ({
  positions,
  cashBalance,
  tradeHistory,
  alerts,
  quotes,
  onClosePosition,
  onAddAlert,
  onDeleteAlert,
  onSelectSymbol,
}) => {
  const [newAlertSymbol, setNewAlertSymbol] = useState(quotes[0]?.symbol || 'NVDA');
  const [newAlertPrice, setNewAlertPrice] = useState<number>(150);
  const [newAlertDir, setNewAlertDir] = useState<'above' | 'below'>('above');
  const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'alerts'>('positions');

  // Calculate portfolio totals
  const totalMarketValue = positions.reduce((acc, pos) => acc + pos.marketValue, 0);
  const totalEquity = totalMarketValue + cashBalance;
  const totalGain = positions.reduce((acc, pos) => acc + pos.totalGain, 0);
  const totalCost = positions.reduce((acc, pos) => acc + pos.avgCost * pos.shares, 0);
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const dayGain = positions.reduce((acc, pos) => acc + pos.dayGain, 0);
  const dayGainPct = totalMarketValue > 0 ? (dayGain / totalMarketValue) * 100 : 0;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertSymbol || newAlertPrice <= 0) return;
    onAddAlert(newAlertSymbol, newAlertPrice, newAlertDir);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* KPI Overview Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Equity */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">
            Total Net Worth
          </span>
          <div className="font-display font-bold text-2xl tabular-nums text-[#131722] mt-1">
            ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#787B86] mt-1">
            Cash: <span className="font-semibold text-[#181b24] tabular-nums">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Invested Market Value */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">
            Active Capital Invested
          </span>
          <div className="font-display font-bold text-2xl tabular-nums text-[#131722] mt-1">
            ${totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#787B86] mt-1">
            {positions.length} active asset positions
          </div>
        </div>

        {/* Today's P&L */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">
            Today's Unrealized Return
          </span>
          <div className={`font-display font-bold text-2xl tabular-nums mt-1 ${dayGain >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
            {dayGain >= 0 ? '+' : ''}${dayGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-semibold tabular-nums mt-1 flex items-center gap-1">
            {dayGain >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-[#089981]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#F23645]" />}
            <span className={dayGain >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
              {dayGain >= 0 ? '+' : ''}{dayGainPct.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Total Return */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">
            Total Accumulated Return
          </span>
          <div className={`font-display font-bold text-2xl tabular-nums mt-1 ${totalGain >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
            {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-semibold tabular-nums mt-1 flex items-center gap-1">
            {totalGain >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-[#089981]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#F23645]" />}
            <span className={totalGain >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
              {totalGain >= 0 ? '+' : ''}{totalGainPct.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
        {/* Tabs Bar */}
        <div className="px-4 py-3 border-b border-[#E0E3EB] bg-[#faf9ff] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-[#F0F3FA] p-0.5 rounded-full border border-[#E0E3EB]">
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'positions'
                  ? 'bg-white text-[#131722] shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              Open Holdings ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-[#131722] shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              Order Log ({tradeHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'alerts'
                  ? 'bg-white text-[#131722] shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              Price Alerts ({alerts.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Open Holdings Table */}
        {activeTab === 'positions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E0E3EB] text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right">Shares</th>
                  <th className="py-3 px-4 text-right">Avg Cost</th>
                  <th className="py-3 px-4 text-right">Current Price</th>
                  <th className="py-3 px-4 text-right">Market Value</th>
                  <th className="py-3 px-4 text-right">Today's Gain</th>
                  <th className="py-3 px-4 text-right">Total Gain</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3EB] text-xs font-mono tabular-nums">
                {positions.map((pos) => {
                  const isDayGreen = pos.dayGain >= 0;
                  const isTotalGreen = pos.totalGain >= 0;
                  return (
                    <tr
                      key={pos.symbol}
                      onClick={() => onSelectSymbol(pos.symbol)}
                      className="h-11 hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <td className="py-2 px-4 font-sans font-semibold text-[#131722]">
                        <div className="flex items-center gap-2">
                          <span>{pos.symbol}</span>
                          <span className="text-[11px] text-[#787B86] font-normal truncate max-w-[120px]">
                            {pos.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-right font-medium text-[#181b24]">
                        {pos.shares}
                      </td>
                      <td className="py-2 px-4 text-right text-[#5a5e6b]">
                        ${pos.avgCost.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right font-semibold text-[#181b24]">
                        ${pos.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-[#181b24]">
                        ${pos.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className={`font-semibold ${isDayGreen ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                          {isDayGreen ? '+' : ''}${pos.dayGain.toFixed(2)} ({isDayGreen ? '+' : ''}{pos.dayGainPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className={`font-semibold ${isTotalGreen ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                          {isTotalGreen ? '+' : ''}${pos.totalGain.toFixed(2)} ({isTotalGreen ? '+' : ''}{pos.totalGainPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onClosePosition(pos.symbol)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F23645]/10 hover:bg-[#F23645] text-[#F23645] hover:text-white transition-all cursor-pointer"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Trade History */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E0E3EB] text-[11px] font-semibold uppercase tracking-wider text-[#787B86]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Symbol</th>
                  <th className="py-3 px-4">Side</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Shares</th>
                  <th className="py-3 px-4 text-right">Fill Price</th>
                  <th className="py-3 px-4 text-right">Total ($)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3EB] text-xs font-mono tabular-nums">
                {tradeHistory.map((order) => (
                  <tr key={order.id} className="h-10 hover:bg-[#F0F3FA] transition-colors">
                    <td className="py-2 px-4 text-[#787B86]">{order.id}</td>
                    <td className="py-2 px-4 text-[#5a5e6b]">{order.timestamp}</td>
                    <td className="py-2 px-4 font-sans font-semibold text-[#131722]">{order.symbol}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.side === 'buy' ? 'bg-[#089981]/10 text-[#089981]' : 'bg-[#F23645]/10 text-[#F23645]'
                      }`}>
                        {order.side}
                      </span>
                    </td>
                    <td className="py-2 px-4 uppercase text-[#5a5e6b]">{order.orderType}</td>
                    <td className="py-2 px-4 text-right font-medium">{order.shares}</td>
                    <td className="py-2 px-4 text-right">${order.price.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right font-bold">${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[#089981] font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Filled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Price Alerts */}
        {activeTab === 'alerts' && (
          <div className="p-4 lg:p-6 flex flex-col gap-6">
            {/* Create Alert Form */}
            <form onSubmit={handleCreateAlert} className="bg-[#faf9ff] p-4 rounded-xl border border-[#E0E3EB] flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787B86] mb-1">
                  Symbol
                </label>
                <select
                  value={newAlertSymbol}
                  onChange={(e) => setNewAlertSymbol(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-white border border-[#E0E3EB] text-xs font-semibold text-[#181b24] focus:outline-none focus:border-[#2962FF]"
                >
                  {quotes.map(q => (
                    <option key={q.symbol} value={q.symbol}>{q.symbol} - {q.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787B86] mb-1">
                  Condition
                </label>
                <select
                  value={newAlertDir}
                  onChange={(e) => setNewAlertDir(e.target.value as 'above' | 'below')}
                  className="h-10 px-3 rounded-xl bg-white border border-[#E0E3EB] text-xs font-semibold text-[#181b24] focus:outline-none focus:border-[#2962FF]"
                >
                  <option value="above">Price rises above (&gt;=)</option>
                  <option value="below">Price drops below (&lt;=)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#787B86] mb-1">
                  Target Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newAlertPrice}
                  onChange={(e) => setNewAlertPrice(parseFloat(e.target.value) || 0)}
                  className="h-10 px-3 rounded-xl bg-white border border-[#E0E3EB] text-xs font-semibold tabular-nums text-[#181b24] focus:outline-none focus:border-[#2962FF] w-32"
                />
              </div>

              <button
                type="submit"
                className="h-10 px-5 rounded-full bg-[#131722] hover:bg-[#131722]/90 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Alert</span>
              </button>
            </form>

            {/* Active Alerts List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#787B86] uppercase tracking-wider">
                Active Threshold Watchers
              </h4>
              {alerts.length === 0 ? (
                <p className="text-xs text-[#787B86]">No active alerts. Add one above to get real-time price trigger notifications.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {alerts.map((al) => (
                    <div
                      key={al.id}
                      className="p-3.5 rounded-xl border border-[#E0E3EB] bg-[#faf9ff] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#2962FF]/10 text-[#2962FF] flex items-center justify-center font-bold text-xs">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#131722]">
                            {al.symbol} {al.direction === 'above' ? '≥' : '≤'} ${al.targetPrice.toFixed(2)}
                          </div>
                          <span className="text-[10px] text-[#787B86]">Created {al.createdAt}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteAlert(al.id)}
                        className="p-1.5 rounded-full text-[#787B86] hover:text-[#F23645] hover:bg-[#F0F3FA] transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
