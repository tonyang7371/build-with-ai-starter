import React, { useState, useEffect, useMemo } from 'react';
import {
  AssetQuote,
  MarketIndex,
  AssetCategory,
  TerminalView,
  PortfolioPosition,
  TradeOrder,
  PriceAlert,
  OrderBookRow,
  RecentTrade,
} from './types/market';
import {
  INITIAL_QUOTES,
  INITIAL_INDICES,
  INITIAL_ORDERBOOK,
  INITIAL_TRADES,
  INITIAL_PORTFOLIO,
  SECTOR_PERFORMANCE,
} from './data/mockMarketData';
import { TopBar } from './components/TopBar';
import { IndexTickerStrip } from './components/IndexTickerStrip';
import { CategoryFilterRibbon } from './components/CategoryFilterRibbon';
import { MarketScreenerTable } from './components/MarketScreenerTable';
import { ChartTerminal } from './components/ChartTerminal';
import { MarketHeatmap } from './components/MarketHeatmap';
import { OrderBookDesk } from './components/OrderBookDesk';
import { PortfolioDesk } from './components/PortfolioDesk';
import { QuickSearchModal } from './components/QuickSearchModal';
import { TradeModal } from './components/TradeModal';
import { Bell, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function App() {
  const [quotes, setQuotes] = useState<AssetQuote[]>(INITIAL_QUOTES);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [orderBook, setOrderBook] = useState(INITIAL_ORDERBOOK);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>(INITIAL_TRADES);
  const [positions, setPositions] = useState<PortfolioPosition[]>(INITIAL_PORTFOLIO);
  const [cashBalance, setCashBalance] = useState<number>(16500.0);
  const [tradeHistory, setTradeHistory] = useState<TradeOrder[]>([
    {
      id: 'ORD-9821',
      timestamp: 'Today, 14:15:20',
      symbol: 'NVDA',
      side: 'buy',
      orderType: 'limit',
      shares: 20,
      price: 145.2,
      status: 'filled',
      total: 2904.0,
    },
    {
      id: 'ORD-9820',
      timestamp: 'Today, 11:32:04',
      symbol: 'BTCUSD',
      side: 'buy',
      orderType: 'market',
      shares: 0.15,
      price: 86400.0,
      status: 'filled',
      total: 12960.0,
    },
  ]);

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'al-1',
      symbol: 'NVDA',
      targetPrice: 150.0,
      direction: 'above',
      createdAt: 'Today, 09:30',
      triggered: false,
    },
    {
      id: 'al-2',
      symbol: 'TSLA',
      targetPrice: 350.0,
      direction: 'above',
      createdAt: 'Today, 10:15',
      triggered: false,
    },
  ]);

  const [activeView, setActiveView] = useState<TerminalView>('screener');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('all');
  const [activeQuoteSymbol, setActiveQuoteSymbol] = useState<string>('NVDA');
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'MSFT', 'BTCUSD']);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [tradeModalOpen, setTradeModalOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (text: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Active Quote object
  const activeQuote = useMemo(() => {
    return quotes.find((q) => q.symbol === activeQuoteSymbol) || quotes[0];
  }, [quotes, activeQuoteSymbol]);

  // Global Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // 1. Pick 1-2 random quotes to update
      setQuotes((prevQuotes) => {
        const next = [...prevQuotes];
        const randomIndex = Math.floor(Math.random() * next.length);
        const target = { ...next[randomIndex] };

        // Micro tick: +/- 0.05% to 0.35%
        const deltaPct = (Math.random() - 0.49) * 0.004;
        const oldPrice = target.price;
        const newPrice = Math.max(0.01, +(oldPrice * (1 + deltaPct)).toFixed(2));
        const diff = newPrice - oldPrice;

        target.price = newPrice;
        target.change = +(target.change + diff).toFixed(2);
        target.changePercent = +(((target.price - (target.price - target.change)) / (target.price - target.change)) * 100).toFixed(2);
        target.dayLow = Math.min(target.dayLow, newPrice);
        target.dayHigh = Math.max(target.dayHigh, newPrice);

        // Append to sparkline
        target.sparkline = [...target.sparkline.slice(1), newPrice];
        next[randomIndex] = target;

        // Check if an alert was triggered
        alerts.forEach((alert) => {
          if (!alert.triggered && alert.symbol === target.symbol) {
            if (
              (alert.direction === 'above' && newPrice >= alert.targetPrice) ||
              (alert.direction === 'below' && newPrice <= alert.targetPrice)
            ) {
              showToast(
                `Price Alert Triggered: ${alert.symbol} reached $${newPrice.toFixed(2)} (${alert.direction} $${alert.targetPrice.toFixed(2)})!`,
                'alert'
              );
            }
          }
        });

        return next;
      });

      // 2. Also simulate ticks in recent trades
      const sides: ('buy' | 'sell')[] = ['buy', 'sell'];
      const currentActivePrice = activeQuote.price;
      const tradePrice = +(currentActivePrice + (Math.random() - 0.5) * 0.1).toFixed(2);
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setRecentTrades((prev) => [
        {
          id: `t-${Date.now()}`,
          time: timeStr,
          price: tradePrice,
          size: Math.floor(Math.random() * 800 + 50),
          side: sides[Math.floor(Math.random() * 2)],
        },
        ...prev.slice(0, 15),
      ]);

      // 3. Keep open position current prices synchronized
      setPositions((prevPositions) =>
        prevPositions.map((pos) => {
          const matchQuote = quotes.find((q) => q.symbol === pos.symbol);
          if (!matchQuote) return pos;
          const currentPrice = matchQuote.price;
          const marketValue = +(currentPrice * pos.shares).toFixed(2);
          const totalGain = +(marketValue - pos.avgCost * pos.shares).toFixed(2);
          const totalGainPercent = +((totalGain / (pos.avgCost * pos.shares)) * 100).toFixed(2);
          const dayGain = +(matchQuote.change * pos.shares).toFixed(2);
          const dayGainPercent = matchQuote.changePercent;

          return {
            ...pos,
            currentPrice,
            marketValue,
            totalGain,
            totalGainPercent,
            dayGain,
            dayGainPercent,
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [isSimulating, activeQuote.price, activeQuote.symbol, alerts, quotes]);

  // Filtered quotes based on Category & Search Filter
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      // Category filter
      if (selectedCategory === 'mega-tech') {
        if (!['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'].includes(q.symbol)) {
          return false;
        }
      } else if (selectedCategory === 'equities') {
        if (q.category !== 'equities') return false;
      } else if (selectedCategory === 'crypto') {
        if (q.category !== 'crypto') return false;
      } else if (selectedCategory === 'commodities') {
        if (q.category !== 'commodities') return false;
      } else if (selectedCategory === 'gainers') {
        if (q.changePercent <= 1.5) return false;
      } else if (selectedCategory === 'active') {
        if (q.rawVolume < 30000000) return false;
      } else if (selectedCategory === 'dividend') {
        if (!q.divYield || q.divYield <= 0.2) return false;
      }

      // Search Filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        return (
          q.symbol.toLowerCase().includes(query) ||
          q.name.toLowerCase().includes(query) ||
          q.sector.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [quotes, selectedCategory, searchFilter]);

  // Trade Execution Handler
  const handleExecuteTrade = (trade: {
    symbol: string;
    side: 'buy' | 'sell';
    orderType: 'market' | 'limit' | 'stop';
    shares: number;
    price: number;
  }) => {
    const total = +(trade.shares * trade.price).toFixed(2);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Add to trade history
    const newOrder: TradeOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: `Today, ${timeStr}`,
      symbol: trade.symbol,
      side: trade.side,
      orderType: trade.orderType,
      shares: trade.shares,
      price: trade.price,
      status: 'filled',
      total,
    };
    setTradeHistory((prev) => [newOrder, ...prev]);

    // 2. Adjust cash balance and portfolio positions
    if (trade.side === 'buy') {
      setCashBalance((prev) => +(prev - total).toFixed(2));
      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === trade.symbol);
        const quoteObj = quotes.find((q) => q.symbol === trade.symbol) || activeQuote;
        if (existing) {
          const totalShares = existing.shares + trade.shares;
          const totalCost = existing.avgCost * existing.shares + total;
          const newAvgCost = +(totalCost / totalShares).toFixed(2);
          const marketValue = +(totalShares * trade.price).toFixed(2);
          const totalGain = +(marketValue - totalCost).toFixed(2);
          const totalGainPercent = +((totalGain / totalCost) * 100).toFixed(2);

          return prev.map((p) =>
            p.symbol === trade.symbol
              ? {
                  ...p,
                  shares: totalShares,
                  avgCost: newAvgCost,
                  currentPrice: trade.price,
                  marketValue,
                  totalGain,
                  totalGainPercent,
                }
              : p
          );
        } else {
          return [
            ...prev,
            {
              symbol: trade.symbol,
              name: quoteObj.name,
              shares: trade.shares,
              avgCost: trade.price,
              currentPrice: trade.price,
              marketValue: total,
              totalGain: 0,
              totalGainPercent: 0,
              dayGain: 0,
              dayGainPercent: 0,
            },
          ];
        }
      });
      showToast(`Bought ${trade.shares} shares of ${trade.symbol} for $${total.toLocaleString('en-US')}`);
    } else {
      // Sell
      setCashBalance((prev) => +(prev + total).toFixed(2));
      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === trade.symbol);
        if (!existing) return prev;
        if (existing.shares <= trade.shares) {
          return prev.filter((p) => p.symbol !== trade.symbol);
        } else {
          const remShares = existing.shares - trade.shares;
          const marketValue = +(remShares * trade.price).toFixed(2);
          const totalGain = +(marketValue - existing.avgCost * remShares).toFixed(2);
          const totalGainPercent = +((totalGain / (existing.avgCost * remShares)) * 100).toFixed(2);
          return prev.map((p) =>
            p.symbol === trade.symbol
              ? {
                  ...p,
                  shares: remShares,
                  currentPrice: trade.price,
                  marketValue,
                  totalGain,
                  totalGainPercent,
                }
              : p
          );
        }
      });
      showToast(`Sold ${trade.shares} shares of ${trade.symbol} for $${total.toLocaleString('en-US')}`);
    }
  };

  // Close Position Handler
  const handleClosePosition = (symbol: string) => {
    const pos = positions.find((p) => p.symbol === symbol);
    if (!pos) return;
    const quote = quotes.find((q) => q.symbol === symbol) || activeQuote;
    handleExecuteTrade({
      symbol,
      side: 'sell',
      orderType: 'market',
      shares: pos.shares,
      price: quote.price,
    });
  };

  // Alert handlers
  const handleAddAlert = (symbol: string, targetPrice: number, direction: 'above' | 'below') => {
    const now = new Date();
    const newAlert: PriceAlert = {
      id: `al-${Date.now()}`,
      symbol,
      targetPrice,
      direction,
      createdAt: `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      triggered: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Alert set for ${symbol} when price is ${direction} $${targetPrice.toFixed(2)}`);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert removed', 'alert');
  };

  // Watchlist toggle
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(symbol);
      const next = exists ? prev.filter((s) => s !== symbol) : [...prev, symbol];
      showToast(exists ? `Removed ${symbol} from watchlist` : `Added ${symbol} to watchlist`);
      return next;
    });
  };

  // Select quote from table or index strip
  const handleSelectQuote = (quote: AssetQuote) => {
    setActiveQuoteSymbol(quote.symbol);
    setActiveView('chart');
  };

  const handleSelectSymbol = (symbol: string) => {
    setActiveQuoteSymbol(symbol);
    setActiveView('chart');
  };

  const handleSelectIndex = (idx: MarketIndex) => {
    // Map index to symbol
    const mapping: Record<string, string> = {
      '^GSPC': 'AAPL',
      '^IXIC': 'NVDA',
      '^DJI': 'MSFT',
      '^RUT': 'AMD',
      BTCUSD: 'BTCUSD',
      ETHUSD: 'ETHUSD',
      'CL1!': 'CL1!',
      XAUUSD: 'XAUUSD',
    };
    const targetSymbol = mapping[idx.symbol] || 'NVDA';
    setActiveQuoteSymbol(targetSymbol);
    setActiveView('chart');
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#181b24] flex flex-col antialiased">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold ${
              toastMessage.type === 'alert'
                ? 'bg-[#131722] text-[#F23645] border border-[#F23645]/40'
                : 'bg-[#131722] text-white border border-[#089981]/40'
            }`}
          >
            {toastMessage.type === 'alert' ? (
              <AlertTriangle className="w-4 h-4 text-[#F23645] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Bar Contract (Wordmark, Capsule Search, Links, CTA) */}
      <TopBar
        activeView={activeView}
        setActiveView={setActiveView}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenTradeModal={() => setTradeModalOpen(true)}
      />

      {/* Index Badges Ribbon (28px circle badges, sparklines, price delta badges) */}
      <IndexTickerStrip
        indices={indices}
        selectedIndex={activeQuote.symbol}
        onSelectIndex={handleSelectIndex}
      />

      {/* Category Navigators & Filter Ribbon */}
      <CategoryFilterRibbon
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeView={activeView}
        setActiveView={setActiveView}
        assetCount={filteredQuotes.length}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 lg:px-8 py-5 max-w-[1720px] w-full mx-auto">
        {/* Screen 1: Screener Table */}
        {activeView === 'screener' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-[#131722] tracking-tight">
                  Institutional Market Screener
                </h2>
                <p className="text-xs text-[#787B86]">
                  Real-time algorithmic quotes with 24h range bounds, 7D sparklines, and direct execution tickets.
                </p>
              </div>
              <button
                onClick={() => setActiveView('chart')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0049db] hover:underline cursor-pointer"
              >
                <span>View {activeQuote.symbol} Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <MarketScreenerTable
              quotes={filteredQuotes}
              onSelectQuote={handleSelectQuote}
              onTradeQuote={(q) => {
                setActiveQuoteSymbol(q.symbol);
                setTradeModalOpen(true);
              }}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              activeQuoteSymbol={activeQuoteSymbol}
            />
          </div>
        )}

        {/* Screen 2: Interactive Chart Terminal */}
        {activeView === 'chart' && (
          <ChartTerminal
            quote={activeQuote}
            onTradeQuote={(q, side) => {
              setActiveQuoteSymbol(q.symbol);
              setTradeModalOpen(true);
            }}
            onOpenOrderBook={() => setActiveView('orderbook')}
          />
        )}

        {/* Screen 3: Sector Treemap Heatmap */}
        {activeView === 'heatmap' && (
          <MarketHeatmap
            sectors={SECTOR_PERFORMANCE}
            onSelectSymbol={handleSelectSymbol}
          />
        )}

        {/* Screen 4: Level 2 Order Book & Trade Desk */}
        {activeView === 'orderbook' && (
          <OrderBookDesk
            quote={activeQuote}
            orderBook={orderBook}
            recentTrades={recentTrades}
            onExecuteTrade={handleExecuteTrade}
            cashBalance={cashBalance}
          />
        )}

        {/* Screen 5: Portfolio, Holdings & Alerts */}
        {activeView === 'portfolio' && (
          <PortfolioDesk
            positions={positions}
            cashBalance={cashBalance}
            tradeHistory={tradeHistory}
            alerts={alerts}
            quotes={quotes}
            onClosePosition={handleClosePosition}
            onAddAlert={handleAddAlert}
            onDeleteAlert={handleDeleteAlert}
            onSelectSymbol={handleSelectSymbol}
          />
        )}
      </main>

      {/* Global Quick Search Modal (Ctrl+K) */}
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        quotes={quotes}
        onSelectQuote={handleSelectQuote}
      />

      {/* Quick Trade Order Modal */}
      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        quotes={quotes}
        defaultQuote={activeQuote}
        cashBalance={cashBalance}
        onExecuteTrade={handleExecuteTrade}
      />
    </div>
  );
}
