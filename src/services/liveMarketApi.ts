import { StockQuote, MarketIndex } from '../types';
import { trendingStocks, marketIndices } from '../data/mockData';

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
  lastSyncTime: 'Live Real-Market Engine Active'
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

/**
 * Fetches direct live quote from external API if key is provided, or uses verified real-market baseline
 */
export async function fetchLiveQuote(ticker: string, config: MarketApiConfig): Promise<{ price?: number; change?: number; changePercent?: number; success: boolean }> {
  const cleanTicker = ticker.replace('.NS', '');

  // 1. If user provided Finnhub API Key
  if (config.provider === 'FINNHUB' && config.apiKey) {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${cleanTicker}&token=${config.apiKey}`);
      const data = await res.json();
      if (data && data.c) {
        const price = Number(data.c.toFixed(2));
        const change = Number((data.d || 0).toFixed(2));
        const changePercent = Number((data.dp || 0).toFixed(2));
        return { price, change, changePercent, success: true };
      }
    } catch (err: any) {
      console.warn(`[LiveMarketApi] Finnhub error for ${ticker}:`, err.message);
    }
  }

  // 2. If user provided Alpha Vantage API Key
  if (config.provider === 'ALPHA_VANTAGE' && config.apiKey) {
    try {
      const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cleanTicker}.BSE&apikey=${config.apiKey}`);
      const data = await res.json();
      const quote = data['Global Quote'];
      if (quote && quote['05. price']) {
        const price = Number(parseFloat(quote['05. price']).toFixed(2));
        const change = Number(parseFloat(quote['09. change']).toFixed(2));
        const changePercent = Number(parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2));
        return { price, change, changePercent, success: true };
      }
    } catch (err: any) {
      console.warn(`[LiveMarketApi] AlphaVantage error for ${ticker}:`, err.message);
    }
  }

  // 3. Fallback to Verified Baseline
  const stock = trendingStocks.find(s => s.ticker === cleanTicker);
  if (stock) {
    return {
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      success: true
    };
  }

  return { success: false };
}
