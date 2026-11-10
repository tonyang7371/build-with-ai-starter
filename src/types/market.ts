export type AssetCategory = 
  | 'all'
  | 'mega-tech'
  | 'equities'
  | 'crypto'
  | 'commodities'
  | 'gainers'
  | 'active'
  | 'dividend';

export type TerminalView = 'screener' | 'chart' | 'heatmap' | 'orderbook' | 'portfolio';

export interface MarketIndex {
  symbol: string;
  name: string;
  shortCode: string;
  badgeBg: string;
  badgeColor: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface AssetQuote {
  symbol: string;
  name: string;
  category: 'equities' | 'crypto' | 'commodities';
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  dayLow: number;
  dayHigh: number;
  volume: string;
  rawVolume: number;
  marketCap: string;
  rawMarketCap: number;
  peRatio?: number;
  sparkline: number[];
  logoColor: string;
  logoBg: string;
  description: string;
  beta?: number;
  eps?: number;
  divYield?: number;
  avgVolume50d?: string;
  high52w?: number;
  low52w?: number;
  analystRating?: 'Strong Buy' | 'Buy' | 'Hold' | 'Underperform';
  targetPrice?: number;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookRow {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
}

export interface RecentTrade {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayGain: number;
  dayGainPercent: number;
}

export interface TradeOrder {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop';
  shares: number;
  price: number;
  status: 'filled' | 'pending' | 'cancelled';
  total: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: string;
  triggered: boolean;
}

export interface SectorItem {
  name: string;
  weight: number; // percentage of market
  changePercent: number;
  companies: {
    symbol: string;
    name: string;
    marketCap: number; // in billions
    changePercent: number;
    price: number;
  }[];
}
