import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles, ShieldAlert, Calculator, Bookmark, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskDisclaimerBanner } from '../components/common/RiskDisclaimerBanner';
import { StockQuote } from '../types';

export const MarketPage: React.FC = () => {
  const { marketIndices, stocks, user, toggleWatchlist, calculateRisk } = useApp();
  const [selectedStock, setSelectedStock] = useState<StockQuote>(stocks[0]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'CALCULATOR' | 'WATCHLIST'>('ANALYSIS');

  // Calculator State
  const [budget, setBudget] = useState<number>(1000);
  const [entryPrice, setEntryPrice] = useState<number>(selectedStock.price);
  const [stopLossPrice, setStopLossPrice] = useState<number>(selectedStock.scenarios.supportLevel);
  const [targetPrice, setTargetPrice] = useState<number>(selectedStock.scenarios.upsideTarget);

  // When selected stock changes, update default calculator numbers
  const handleSelectStock = (st: StockQuote) => {
    setSelectedStock(st);
    setEntryPrice(st.price);
    setStopLossPrice(st.scenarios.supportLevel);
    setTargetPrice(st.scenarios.upsideTarget);
  };

  const calcResult = calculateRisk({
    budget: Number(budget) || 1000,
    entryPrice: Number(entryPrice) || selectedStock.price,
    stopLossPrice: Number(stopLossPrice) || selectedStock.scenarios.supportLevel,
    targetPrice: Number(targetPrice) || selectedStock.scenarios.upsideTarget,
  });

  const chartData = selectedStock.chartData[timeframe];

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Market Intelligence</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LIVE SNAPSHOT
            </span>
          </h1>
          <p className="text-xs text-slate-400">Verified Indian equities data & scenario risk modeling</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="tab-container flex gap-1.5 p-1 rounded-2xl bg-dark-900 border border-slate-800">
        {[
          { id: 'ANALYSIS', label: 'AI Trend Analysis', icon: Sparkles },
          { id: 'CALCULATOR', label: 'Risk Calculator', icon: Calculator },
          { id: 'WATCHLIST', label: `My Watchlist (${user.watchlistTickers.length})`, icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                isActive
                  ? 'tab-btn-active bg-[#003539] text-white shadow-md'
                  : 'tab-btn-inactive text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Market Indices Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {marketIndices.map((idx) => (
          <div key={idx.symbol} className="p-3 rounded-2xl bg-dark-850 border border-slate-800">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mb-0.5">
              <span>{idx.symbol}</span>
              <span className={idx.isPositive ? 'text-emerald-500' : 'text-rose-500'}>
                {idx.isPositive ? '+' : ''}{idx.changePercent}%
              </span>
            </div>
            <div className="text-sm font-black text-white">{idx.currentValue.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>

      {activeTab === 'ANALYSIS' && (
        <>
          {/* Stock Selector Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {stocks.map((st) => {
              const isSelected = selectedStock.ticker === st.ticker;
              return (
                <button
                  key={st.ticker}
                  onClick={() => handleSelectStock(st)}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
                    isSelected
                      ? 'stock-chip-active bg-[#003539] text-white border-[#003539] shadow-sm'
                      : 'stock-chip-inactive bg-dark-850 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="font-extrabold">{st.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>₹{st.price}</span>
                  <span className={st.change >= 0 ? 'text-emerald-400 font-bold text-[10px]' : 'text-rose-400 font-bold text-[10px]'}>
                    {st.change >= 0 ? '+' : ''}{st.changePercent}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Stock Chart & Interactive Timeframes */}
          <div className="p-4 sm:p-5 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white">{selectedStock.name}</h2>
                  <span className="ticker-badge text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 border border-slate-700 font-bold">
                    {selectedStock.ticker}
                  </span>
                  <button
                    onClick={() => toggleWatchlist(selectedStock.ticker)}
                    className="text-slate-400 hover:text-cyan-400"
                  >
                    <Bookmark className={`w-4 h-4 ${user.watchlistTickers.includes(selectedStock.ticker) ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStock.sector} • Vol: {selectedStock.volume}</p>
              </div>

              <div className="flex items-baseline sm:flex-col sm:items-end gap-2">
                <div className="text-2xl font-black text-white">₹{selectedStock.price.toFixed(2)}</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{selectedStock.changePercent}% (+₹{selectedStock.change})</span>
                </div>
              </div>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex justify-between sm:justify-start gap-1.5 p-1 rounded-xl bg-dark-950 border border-slate-800 max-w-xs">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Responsive Recharts Area Chart */}
            <div className="h-52 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#64748B" fontSize={10} tickLine={false} orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#F8FAFC'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Intelligence & Responsible Scenario Analysis */}
          <div className="p-4 sm:p-5 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Grounded Analysis & Scenarios</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                SENTIMENT {selectedStock.sentimentScore}/100
              </span>
            </div>

            {/* Why Trending */}
            <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 text-xs">
              <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px] block mb-1">
                Why is it trending today?
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedStock.whyTrending}</p>
            </div>

            {/* Key Drivers */}
            <div>
              <span className="font-bold text-slate-300 text-xs block mb-2">Key Fundamental & Technical Factors:</span>
              <div className="space-y-1.5">
                {selectedStock.keyFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Possible Scenarios Grid (Non-guaranteed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Upside Scenario */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> Potential Upside Target
                  </span>
                  <span className="font-black text-emerald-300 text-sm">
                    ₹{selectedStock.scenarios.upsideTarget} ({selectedStock.scenarios.upsidePercentage})
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{selectedStock.scenarios.upsideRationale}</p>
                <div className="text-[10px] text-emerald-400/80 font-medium">
                  Resistance Zone: ₹{selectedStock.scenarios.resistanceLevel}
                </div>
              </div>

              {/* Downside Risk Scenario */}
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4" /> Downside Risk Level
                  </span>
                  <span className="font-black text-rose-300 text-sm">
                    ₹{selectedStock.scenarios.downsideRisk} ({selectedStock.scenarios.downsidePercentage})
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{selectedStock.scenarios.downsideRationale}</p>
                <div className="text-[10px] text-rose-400/80 font-medium">
                  Invalidation / Stop-Loss: ₹{selectedStock.scenarios.invalidationLevel}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. Position & Risk Calculator Tab */}
      {activeTab === 'CALCULATOR' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-dark-850 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span>Disciplined Position & Risk Calculator</span>
              </h2>
              <p className="text-xs text-slate-400">Size your trades according to strict capital protection rules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Total Trading Budget (₹)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Planned Entry Price (₹)
                </label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 text-rose-400">
                  Stop-Loss / Invalidation Price (₹)
                </label>
                <input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-rose-900/60 rounded-xl text-xs text-rose-200 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 text-emerald-400">
                  Target Price (₹)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-emerald-900/60 rounded-xl text-xs text-emerald-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Calculated Risk Breakdown Card */}
            <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Risk-Reward Mathematical Scenario
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Suggested Quantity</span>
                  <span className="text-base font-black text-white font-mono">
                    {calcResult.suggestedQuantity} Shares
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Risk:Reward Ratio</span>
                  <span className="text-base font-black text-cyan-400 font-mono">
                    1 : {calcResult.rewardRiskRatio}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                  <span className="text-[10px] text-rose-400 block">Total Capital at Risk</span>
                  <span className="text-sm font-black text-rose-300 font-mono">
                    -₹{calcResult.riskAmount} ({calcResult.riskPercent}%)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 block">Potential Upside Profit</span>
                  <span className="text-sm font-black text-emerald-300 font-mono">
                    +₹{calcResult.potentialProfit} ({calcResult.profitPercent}%)
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                💡 {calcResult.disclaimer}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Watchlist Tab */}
      {activeTab === 'WATCHLIST' && (
        <div className="space-y-3">
          {user.watchlistTickers.length === 0 ? (
            <div className="py-12 text-center rounded-3xl bg-dark-850 border border-slate-800 p-6">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="font-bold text-white text-sm">Your Watchlist is Empty</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tap the bookmark icon on any trending stock to monitor it closely.
              </p>
              <button
                onClick={() => setActiveTab('ANALYSIS')}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Explore Trending Stocks
              </button>
            </div>
          ) : (
            stocks
              .filter((s) => user.watchlistTickers.includes(s.ticker))
              .map((st) => (
                <div
                  key={st.ticker}
                  onClick={() => {
                    handleSelectStock(st);
                    setActiveTab('ANALYSIS');
                  }}
                  className="p-4 rounded-3xl bg-dark-850 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{st.name}</h4>
                      <span className="text-xs font-mono text-cyan-400">{st.ticker}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{st.sector}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-white">₹{st.price.toFixed(2)}</div>
                    <div className="text-xs font-bold text-emerald-400">+{st.changePercent}%</div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Universal Disclaimer Banner */}
      <RiskDisclaimerBanner />
    </div>
  );
};
