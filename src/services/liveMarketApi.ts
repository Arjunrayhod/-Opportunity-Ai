import { StockQuote, MarketIndex } from '../types';
import { trendingStocks, marketIndices } from '../data/mockData';

export interface LiveQuoteResult {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  previousClose?: number;
  success: boolean;
}

export type ApiProvider = 'YAHOO_FINANCE' | 'FINNHUB' | 'ALPHA_VANTAGE' | 'RAPIDAPI_NSE' | 'INTERNAL_ENGINE';

export interface MarketApiConfig {
  provider: ApiProvider;
  apiKey: string;
  isEnabled: boolean;
  lastSyncStatus: 'SUCCESS' | 'ERROR' | 'STANDBY';
  lastSyncTime?: string;
  errorMessage?: string;
}

const STORAGE_KEYS = {
  CONFIG: 'aiopp_market_api_config_v1',
};

export const defaultApiConfig: MarketApiConfig = {
  provider: 'YAHOO_FINANCE',
  apiKey: '',
  isEnabled: true,
  lastSyncStatus: 'STANDBY',
  lastSyncTime: '100% Free Live Stream Active'
};

export function getStoredApiConfig(): MarketApiConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return defaultApiConfig;
}

export function saveApiConfig(config: MarketApiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Market API config', e);
  }
}

const SYMBOL_MAPPING: Record<string, string> = {
  'TRENT': 'TRENT.NS',
  'SUZLON': 'SUZLON.NS',
  'BEL': 'BEL.NS',
  'TATAPOWER': 'TATAPOWER.NS',
  'CDSL': 'CDSL.NS',
  'MAZDOCK': 'MAZDOCK.NS',
  'ZOMATO': 'ZOMATO.NS',
  'IREDA': 'IREDA.NS',
  'POLYCAB': 'POLYCAB.NS',
  'HAL': 'HAL.NS',
  'NIFTY 50': '^NSEI',
  'SENSEX': '^BSESN',
  'BANK NIFTY': '^NSEBANK',
  'INDIA VIX': '^INDIAVIX',
  'MIDCAP 100': 'NIFTY_MIDCAP_100.NS',
  'SMALLCAP 100': 'NIFTY_SMALLCAP_100.NS'
};

/**
 * Fetches a single symbol from Yahoo Finance directly or via proxy (100% Free, Zero API Key)
 */
export async function fetchFreeLiveQuote(ticker: string): Promise<LiveQuoteResult | null> {
  const yahooSymbol = SYMBOL_MAPPING[ticker] || `${ticker}.NS`;
  
  // URL Options: 1) Vite Dev Proxy, 2) Public CORS proxy, 3) Direct
  const urls = [
    `/api/yahoo/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`)}`,
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) continue;
      const data = await response.json();
      const result = data?.chart?.result?.[0];
      if (result && result.meta) {
        const meta = result.meta;
        const price = Number(meta.regularMarketPrice?.toFixed(2) || 0);
        const prevClose = meta.chartPreviousClose || meta.previousClose || price;
        const change = Number((price - prevClose).toFixed(2));
        const changePercent = Number(((change / prevClose) * 100).toFixed(2));

        if (price > 0) {
          return {
            symbol: ticker,
            price,
            change,
            changePercent,
            high: meta.regularMarketDayHigh,
            low: meta.regularMarketDayLow,
            previousClose: prevClose,
            success: true
          };
        }
      }
    } catch {
      // Continue to next fallback
    }
  }

  return null;
}

/**
 * Fetches 100% Free Real Live Market Data across all stocks and indices in parallel
 */
export async function fetchAllFreeLiveMarketData(
  currentStocks: StockQuote[],
  currentIndices: MarketIndex[]
): Promise<{ updatedStocks: StockQuote[]; updatedIndices: MarketIndex[]; liveCount: number }> {
  let liveCount = 0;

  // 1. Fetch Stocks
  const stockPromises = currentStocks.map(async (stock) => {
    const live = await fetchFreeLiveQuote(stock.ticker);
    if (live && live.success) {
      liveCount++;
      const target1 = Number((live.price * 1.075).toFixed(2));
      const target2 = Number((live.price * 1.155).toFixed(2));
      const stopLoss = Number((live.price * 0.965).toFixed(2));

      return {
        ...stock,
        price: live.price,
        change: live.change,
        changePercent: live.changePercent,
        targetPrice1: stock.targetPrice1 ? Number((live.price * (stock.targetPrice1 / stock.price)).toFixed(2)) : target1,
        targetPrice2: stock.targetPrice2 ? Number((live.price * (stock.targetPrice2 / stock.price)).toFixed(2)) : target2,
        stopLossPrice: stock.stopLossPrice ? Number((live.price * (stock.stopLossPrice / stock.price)).toFixed(2)) : stopLoss,
        scenarios: {
          ...stock.scenarios,
          upsideTarget: Number((live.price * 1.12).toFixed(2)),
          downsideRisk: Number((live.price * 0.96).toFixed(2)),
          supportLevel: Number((live.price * 0.97).toFixed(2)),
          resistanceLevel: Number((live.price * 1.05).toFixed(2))
        }
      };
    }
    return stock;
  });

  // 2. Fetch Indices
  const indexPromises = currentIndices.map(async (idx) => {
    const live = await fetchFreeLiveQuote(idx.symbol);
    if (live && live.success) {
      liveCount++;
      return {
        ...idx,
        currentValue: live.price,
        change: live.change,
        changePercent: live.changePercent,
        isPositive: live.change >= 0,
        high: live.high || idx.high,
        low: live.low || idx.low
      };
    }
    return idx;
  });

  const [updatedStocks, updatedIndices] = await Promise.all([
    Promise.all(stockPromises),
    Promise.all(indexPromises)
  ]);

  return { updatedStocks, updatedIndices, liveCount };
}
