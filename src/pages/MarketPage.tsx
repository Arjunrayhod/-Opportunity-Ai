import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  Calculator, 
  Bookmark, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Target, 
  Activity, 
  Award, 
  SlidersHorizontal,
  TrendingDown,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskDisclaimerBanner } from '../components/common/RiskDisclaimerBanner';
import { StockQuote, MarketIndex } from '../types';
import { calculateProfitProjection, simulateLiveMarketTick } from '../services/marketService';

export const MarketPage: React.FC = () => {
  const { marketIndices: initialIndices, stocks: initialStocks, user, toggleWatchlist } = useApp();
  
  const [stocks, setStocks] = useState<StockQuote[]>(initialStocks);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>(initialIndices);
  const [selectedStock, setSelectedStock] = useState<StockQuote>(initialStocks[0] || stocks[0]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [activeTab, setActiveTab] = useState<'BREAKOUTS' | 'ANALYSIS' | 'CALCULATOR' | 'WATCHLIST'>('BREAKOUTS');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'BREAKOUT' | 'MULTIBAGGER_SWING' | 'DEFENCE_RAILWAY' | 'GREEN_EV'>('ALL');
  
  // Real-time refresh & tick state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');
  const [liveTickCounter, setLiveTickCounter] = useState(0);

  // Profit Calculator State
  const [calcBudget, setCalcBudget] = useState<number>(10000);
  const [calcStockTicker, setCalcStockTicker] = useState<string>(selectedStock?.ticker || 'TRENT');

  // Sync selected stock when stocks update
  const currentCalcStock = stocks.find(s => s.ticker === calcStockTicker) || selectedStock;
  const currentSelectedStock = stocks.find(s => s.ticker === selectedStock.ticker) || selectedStock;

  // Live Auto-Refresh Tick Simulation every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => {
        const result = simulateLiveMarketTick(prevStocks, marketIndices);
        setMarketIndices(result.updatedIndices);
        return result.updatedStocks;
      });
      setLiveTickCounter(c => c + 1);
      const now = new Date();
      setLastUpdatedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 12000);

    return () => clearInterval(interval);
  }, [marketIndices]);

  // Manual Refresh Handler
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const result = simulateLiveMarketTick(stocks, marketIndices);
      setStocks(result.updatedStocks);
      setMarketIndices(result.updatedIndices);
      const now = new Date();
      setLastUpdatedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 600);
  };

  const handleSelectStock = (st: StockQuote) => {
    setSelectedStock(st);
    setCalcStockTicker(st.ticker);
  };

  const filteredStocks = categoryFilter === 'ALL' 
    ? stocks 
    : stocks.filter(s => s.categoryTag === categoryFilter);

  const profitPlan = calculateProfitProjection(currentCalcStock, calcBudget);
  const chartData = currentSelectedStock.chartData[timeframe] || currentSelectedStock.chartData['1D'];

  return (
    <div className="space-y-5 pb-24">
      {/* 1. Header & Live NSE/BSE Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Market Intelligence & Top Shares
            </h1>
            <span className="flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              LIVE NSE / BSE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time breakout signals, swing profit targets & AI scenario models
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-medium">Last Price Sync</span>
            <span className="text-xs font-bold font-mono text-slate-700">{lastUpdatedTime}</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-2xs disabled:opacity-50"
            title="Refresh Live Market Data"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-teal-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh Live'}</span>
          </button>
        </div>
      </div>

      {/* 2. Indian Market Indices Live Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {marketIndices.map((idx) => (
          <div 
            key={idx.symbol} 
            className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-teal-300 transition"
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
              <span className="truncate">{idx.symbol}</span>
              <span className={`font-mono font-black ${idx.isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                {idx.isPositive ? '+' : ''}{idx.changePercent}%
              </span>
            </div>
            <div className="text-sm font-black text-slate-900 font-mono">
              {idx.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              {idx.isPositive ? (
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-rose-600" />
              )}
              <span>{idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Navigation Sub-Tabs */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'BREAKOUTS', label: '🔥 Aaj Ke Top Shares', icon: Flame, badge: 'High Profit' },
          { id: 'ANALYSIS', label: '📊 Deep Chart & AI Analysis', icon: Sparkles },
          { id: 'CALCULATOR', label: '💰 Live Profit Calculator', icon: Calculator },
          { id: 'WATCHLIST', label: `⭐ My Watchlist (${user.watchlistTickers.length})`, icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                isActive
                  ? 'bg-[#003539] !text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? '!text-white' : 'text-slate-500'}`} />
              <span className={isActive ? '!text-white font-black' : 'font-bold'}>{tab.label}</span>
              {tab.badge && !isActive && (
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TODAY'S TOP BREAKOUT SHARES (आज के टॉप मुनाफे वाले शेयर्स) */}
      {activeTab === 'BREAKOUTS' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 pl-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'ALL', label: '🌟 All Top Breakouts' },
              { id: 'BREAKOUT', label: '🔥 52W High Breakouts' },
              { id: 'MULTIBAGGER_SWING', label: '⚡ High Momentum Swing' },
              { id: 'DEFENCE_RAILWAY', label: '🛡️ Defence & Capital Goods' },
              { id: 'GREEN_EV', label: '🔋 EV & Green Energy' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  categoryFilter === cat.id
                    ? 'bg-[#003539] !text-white border-[#003539] shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className={categoryFilter === cat.id ? '!text-white' : ''}>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Breakout Stocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStocks.map((stock) => {
              const isWatchlisted = user.watchlistTickers.includes(stock.ticker);
              const target1Gain = Number((( (stock.targetPrice1 || stock.price * 1.08) - stock.price) / stock.price * 100).toFixed(1));
              const target2Gain = Number((( (stock.targetPrice2 || stock.price * 1.16) - stock.price) / stock.price * 100).toFixed(1));

              return (
                <div
                  key={stock.ticker}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
                >
                  {/* Top Bar: Name, Ticker, Signal, Watchlist */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-200">
                            {stock.ticker}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-emerald-700 fill-emerald-700" />
                            {stock.signal || 'STRONG BUY'}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                            {stock.winRatePercent || 88}% Win Prob
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-1">{stock.name}</h3>
                        <p className="text-[11px] text-slate-500">{stock.sector} • Vol: {stock.volume}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleWatchlist(stock.ticker)}
                          className={`p-2 rounded-xl border transition ${
                            isWatchlisted 
                              ? 'bg-teal-50 border-teal-300 text-teal-800' 
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                          }`}
                          title="Save to Watchlist"
                        >
                          <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-teal-700 text-teal-700' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Live Price & Day Gain */}
                    <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Price</span>
                        <div className="text-xl font-black text-slate-900 font-mono">
                          ₹{stock.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Move</span>
                        <div className={`text-xs font-black font-mono flex items-center gap-0.5 justify-end ${
                          stock.change >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+{stock.changePercent}% (+₹{stock.change.toFixed(2)})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trade Setup Matrix: Target 1, Target 2, Stop Loss */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <div className="p-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                      <span className="text-[9px] font-extrabold text-emerald-800 uppercase block">Target 1</span>
                      <span className="text-xs font-black text-emerald-950 font-mono block">
                        ₹{stock.targetPrice1?.toFixed(2) || (stock.price * 1.08).toFixed(2)}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700">+{target1Gain}%</span>
                    </div>

                    <div className="p-1.5 rounded-xl bg-teal-50/80 border border-teal-200">
                      <span className="text-[9px] font-extrabold text-teal-800 uppercase block">Target 2</span>
                      <span className="text-xs font-black text-teal-950 font-mono block">
                        ₹{stock.targetPrice2?.toFixed(2) || (stock.price * 1.16).toFixed(2)}
                      </span>
                      <span className="text-[9px] font-bold text-teal-700">+{target2Gain}%</span>
                    </div>

                    <div className="p-1.5 rounded-xl bg-rose-50/80 border border-rose-200">
                      <span className="text-[9px] font-extrabold text-rose-800 uppercase block">Stop Loss</span>
                      <span className="text-xs font-black text-rose-950 font-mono block">
                        ₹{stock.stopLossPrice?.toFixed(2) || (stock.price * 0.96).toFixed(2)}
                      </span>
                      <span className="text-[9px] font-bold text-rose-700">Strict Exit</span>
                    </div>
                  </div>

                  {/* Grounded Catalyst Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    💡 <span className="font-semibold text-slate-800">{stock.whyTrending}</span>
                  </p>

                  {/* Action Buttons: Calculate Profit & View Deep Analysis */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        handleSelectStock(stock);
                        setActiveTab('CALCULATOR');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 !text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                    >
                      <Calculator className="w-3.5 h-3.5 !text-white" />
                      <span className="!text-white">Calculate Profit</span>
                    </button>

                    <button
                      onClick={() => {
                        handleSelectStock(stock);
                        setActiveTab('ANALYSIS');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#003539] hover:bg-[#004f55] !text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 !text-white" />
                      <span className="!text-white">Full Analysis</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DEEP CHART & TECHNICAL ANALYSIS */}
      {activeTab === 'ANALYSIS' && (
        <div className="space-y-4">
          {/* Stock Selector Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {stocks.map((st) => {
              const isSelected = currentSelectedStock.ticker === st.ticker;
              return (
                <button
                  key={st.ticker}
                  onClick={() => handleSelectStock(st)}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-[#003539] !text-white border-[#003539] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className={`font-black ${isSelected ? '!text-white' : 'text-slate-900'}`}>
                    {st.ticker}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                    ₹{st.price.toFixed(2)}
                  </span>
                  <span className={st.change >= 0 ? 'text-emerald-500 font-bold text-[10px]' : 'text-rose-500 font-bold text-[10px]'}>
                    +{st.changePercent}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Stock Chart Container */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">{currentSelectedStock.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                    {currentSelectedStock.ticker}
                  </span>
                  <button
                    onClick={() => toggleWatchlist(currentSelectedStock.ticker)}
                    className="text-slate-400 hover:text-teal-700 transition"
                  >
                    <Bookmark className={`w-4 h-4 ${user.watchlistTickers.includes(currentSelectedStock.ticker) ? 'fill-teal-700 text-teal-700' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{currentSelectedStock.sector} • Strategy: {currentSelectedStock.holdingTime || '1-7 Days'}</p>
              </div>

              <div className="flex items-baseline sm:flex-col sm:items-end gap-2">
                <div className="text-2xl font-black text-slate-900 font-mono">₹{currentSelectedStock.price.toFixed(2)}</div>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{currentSelectedStock.changePercent}% (+₹{currentSelectedStock.change.toFixed(2)})</span>
                </div>
              </div>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex justify-between sm:justify-start gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 max-w-xs">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition ${
                    timeframe === tf
                      ? 'bg-[#003539] !text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={timeframe === tf ? '!text-white' : ''}>{tf}</span>
                </button>
              ))}
            </div>

            {/* Responsive Recharts Area Chart */}
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#94A3B8" fontSize={10} tickLine={false} orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#CBD5E1',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#0F172A',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technical Indicators HUD */}
          {currentSelectedStock.technicalIndicators && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">RSI (14) Strength</span>
                <span className="text-sm font-black text-slate-900">{currentSelectedStock.technicalIndicators.rsi} / 100</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Bullish Zone</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">MACD Signal</span>
                <span className="text-sm font-black text-teal-900">{currentSelectedStock.technicalIndicators.macd}</span>
                <span className="text-[10px] text-teal-700 font-bold block mt-0.5">Positive Histogram</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Moving Averages</span>
                <span className="text-sm font-black text-slate-900">{currentSelectedStock.technicalIndicators.emaStatus}</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Bullish Trend</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Volume Surge</span>
                <span className="text-sm font-black text-purple-900">{currentSelectedStock.technicalIndicators.volumeSurge}</span>
                <span className="text-[10px] text-purple-700 font-bold block mt-0.5">Institutional Buying</span>
              </div>
            </div>
          )}

          {/* AI Intelligence & Grounded Reasons */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>AI Grounded Analysis & Catalysts</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                SENTIMENT {currentSelectedStock.sentimentScore}/100
              </span>
            </div>

            {/* Why Trending */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-teal-800 uppercase tracking-wider text-[10px] block mb-1">
                Why is it trending today?
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">{currentSelectedStock.whyTrending}</p>
            </div>

            {/* Key Drivers */}
            <div>
              <span className="font-bold text-slate-900 text-xs block mb-2">Key Fundamental & Technical Factors:</span>
              <div className="space-y-1.5">
                {currentSelectedStock.keyFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> Potential Upside Target
                  </span>
                  <span className="font-black text-emerald-950 text-sm font-mono">
                    ₹{currentSelectedStock.scenarios.upsideTarget} ({currentSelectedStock.scenarios.upsidePercentage})
                  </span>
                </div>
                <p className="text-[11px] text-slate-700">{currentSelectedStock.scenarios.upsideRationale}</p>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Resistance Zone: ₹{currentSelectedStock.scenarios.resistanceLevel}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800 flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4" /> Downside Risk (Stop-Loss)
                  </span>
                  <span className="font-black text-rose-950 text-sm font-mono">
                    ₹{currentSelectedStock.scenarios.downsideRisk} ({currentSelectedStock.scenarios.downsidePercentage})
                  </span>
                </div>
                <p className="text-[11px] text-slate-700">{currentSelectedStock.scenarios.downsideRationale}</p>
                <div className="text-[10px] text-rose-700 font-semibold">
                  Support Zone: ₹{currentSelectedStock.scenarios.supportLevel}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE USER PROFIT CALCULATOR (लाइव मुनाफा कैलकुलेटर) */}
      {activeTab === 'CALCULATOR' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-700" />
                <span>Live Share Profit Calculator (आप कितना मुनाफा कमा सकते हैं?)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculate exact net profit in ₹, target upside, and risk:reward based on your capital.
              </p>
            </div>

            {/* Select Stock Dropdown / Chips */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Stock (शेयर चुनें):</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {stocks.map((st) => (
                  <button
                    key={st.ticker}
                    onClick={() => setCalcStockTicker(st.ticker)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition ${
                      calcStockTicker === st.ticker
                        ? 'bg-[#003539] !text-white border-[#003539] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className={calcStockTicker === st.ticker ? '!text-white' : ''}>{st.ticker} (₹{st.price.toFixed(1)})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Capital / Budget Presets */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Your Investment Capital (आपकी पूंजी):</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                {[2000, 5000, 10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCalcBudget(amt)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                      calcBudget === amt
                        ? 'bg-teal-100 text-teal-900 border-teal-400 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={calcBudget}
                  onChange={(e) => setCalcBudget(Math.max(100, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono focus:outline-none focus:border-teal-500"
                  placeholder="Custom Capital (e.g. 15000)"
                />
              </div>
            </div>

            {/* Live Profit Calculation Result Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-4">
              <div className="flex items-center justify-between border-b border-teal-200 pb-3">
                <div>
                  <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider block">
                    Breakout Setup for {currentCalcStock.name}
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 font-mono">
                    Buy {profitPlan.sharesQuantity} Shares @ ₹{profitPlan.entryPrice.toFixed(2)}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 block">Total Invested</span>
                  <span className="text-sm font-black text-teal-900 font-mono">
                    ₹{profitPlan.budget.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Target 1 Profit */}
                <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800 mb-0.5">
                    <span>TARGET 1 PROFIT</span>
                    <span>+{profitPlan.target1ProfitPercent}%</span>
                  </div>
                  <div className="text-lg font-black text-emerald-700 font-mono">
                    +₹{profitPlan.target1ProfitAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">At Price: ₹{profitPlan.target1Price.toFixed(2)}</span>
                </div>

                {/* Target 2 Profit */}
                <div className="p-3 rounded-xl bg-white border border-teal-300 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] font-bold text-teal-800 mb-0.5">
                    <span>TARGET 2 (MAX GAIN)</span>
                    <span>+{profitPlan.target2ProfitPercent}%</span>
                  </div>
                  <div className="text-lg font-black text-teal-800 font-mono">
                    +₹{profitPlan.target2ProfitAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">At Price: ₹{profitPlan.target2Price.toFixed(2)}</span>
                </div>

                {/* Max Risk Stop Loss */}
                <div className="p-3 rounded-xl bg-white border border-rose-300 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] font-bold text-rose-800 mb-0.5">
                    <span>MAX RISK (STOP LOSS)</span>
                    <span>-{profitPlan.maxRiskPercent}%</span>
                  </div>
                  <div className="text-lg font-black text-rose-700 font-mono">
                    -₹{profitPlan.maxRiskAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">At Price: ₹{profitPlan.stopLossPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Strategy Tip */}
              <div className="p-3 rounded-xl bg-white/90 border border-teal-200 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-slate-700 leading-relaxed">
                  <span className="font-bold text-teal-950">Profit Booking Rule: </span>
                  Jab Target 1 reach ho jaye, to 50% shares bech kar profit book karein aur baaki shares ka Stop-loss badha kar khareed bhav (Entry Price) par laga dein taaki aapka nuksan zero ho jaye!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MY WATCHLIST (मेरी वॉचलिस्ट) */}
      {activeTab === 'WATCHLIST' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-teal-700 fill-teal-700" />
              <span>My Saved Watchlist ({user.watchlistTickers.length} Stocks)</span>
            </h2>

            {user.watchlistTickers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Aapki Watchlist Khali Hai</p>
                <p className="text-[11px] text-slate-500">Breakouts tab me jaakar kisi bhi share ke bookmark icon par click karein.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stocks
                  .filter(s => user.watchlistTickers.includes(s.ticker))
                  .map(st => (
                    <div
                      key={st.ticker}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-black text-xs font-mono">
                          {st.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{st.name}</h4>
                          <span className="text-[10px] text-slate-500">{st.sector} • Target: ₹{st.targetPrice1}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900 font-mono">₹{st.price.toFixed(2)}</div>
                          <span className="text-[10px] font-bold text-emerald-700">+{st.changePercent}%</span>
                        </div>

                        <button
                          onClick={() => toggleWatchlist(st.ticker)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove from Watchlist"
                        >
                          <Bookmark className="w-4 h-4 fill-teal-700 text-teal-700 hover:fill-none" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SEBI Educational Disclaimer Banner */}
      <RiskDisclaimerBanner />
    </div>
  );
};
