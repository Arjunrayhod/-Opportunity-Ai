import { StockQuote, MarketIndex } from '../types';
import { trendingStocks, marketIndices } from '../data/mockData';

export interface ProfitProjection {
  budget: number;
  sharesQuantity: number;
  entryPrice: number;
  target1Price: number;
  target2Price: number;
  stopLossPrice: number;
  target1ProfitAmount: number;
  target1ProfitPercent: number;
  target2ProfitAmount: number;
  target2ProfitPercent: number;
  maxRiskAmount: number;
  maxRiskPercent: number;
  riskRewardRatioFormatted: string;
  recommendedHoldingDays: string;
}

/**
 * Calculates real live profit projection for a user with any budget
 */
export function calculateProfitProjection(stock: StockQuote, budget: number): ProfitProjection {
  const safeBudget = Math.max(100, budget);
  const entryPrice = stock.price;
  const target1 = stock.targetPrice1 || stock.scenarios.upsideTarget * 0.95;
  const target2 = stock.targetPrice2 || stock.scenarios.upsideTarget;
  const stopLoss = stock.stopLossPrice || stock.scenarios.supportLevel;

  const sharesQuantity = Math.max(1, Math.floor(safeBudget / entryPrice));
  const actualInvestment = sharesQuantity * entryPrice;

  const target1ProfitAmount = Math.round(sharesQuantity * (target1 - entryPrice));
  const target1ProfitPercent = Number(((target1 - entryPrice) / entryPrice * 100).toFixed(2));

  const target2ProfitAmount = Math.round(sharesQuantity * (target2 - entryPrice));
  const target2ProfitPercent = Number(((target2 - entryPrice) / entryPrice * 100).toFixed(2));

  const maxRiskAmount = Math.round(sharesQuantity * (entryPrice - stopLoss));
  const maxRiskPercent = Number(((entryPrice - stopLoss) / entryPrice * 100).toFixed(2));

  const ratio = (maxRiskAmount > 0 && target1ProfitAmount > 0)
    ? `1 : ${(target1ProfitAmount / maxRiskAmount).toFixed(1)}`
    : stock.riskRewardRatio || '1 : 3.2';

  return {
    budget: actualInvestment,
    sharesQuantity,
    entryPrice,
    target1Price: target1,
    target2Price: target2,
    stopLossPrice: stopLoss,
    target1ProfitAmount,
    target1ProfitPercent,
    target2ProfitAmount,
    target2ProfitPercent,
    maxRiskAmount,
    maxRiskPercent,
    riskRewardRatioFormatted: ratio,
    recommendedHoldingDays: stock.holdingTime || '2-10 Days Swing'
  };
}

/**
 * Live market dynamic price tick engine with realistic micro-variations
 */
export function simulateLiveMarketTick(
  currentStocks: StockQuote[],
  currentIndices: MarketIndex[]
): { updatedStocks: StockQuote[]; updatedIndices: MarketIndex[] } {
  const updatedStocks = currentStocks.map(stock => {
    // Slight tick variation between -0.15% and +0.35% (bullish bias for top momentum picks)
    const tickDeltaPercent = (Math.random() * 0.5 - 0.15) / 100;
    const newPrice = Number((stock.price * (1 + tickDeltaPercent)).toFixed(2));
    const priceDiff = Number((newPrice - (stock.price - stock.change)).toFixed(2));
    const newChangePercent = Number(((priceDiff / (stock.price - stock.change)) * 100).toFixed(2));

    // Update 1D chart with latest tick
    const chart1D = [...stock.chartData['1D']];
    if (chart1D.length > 0) {
      chart1D[chart1D.length - 1] = {
        ...chart1D[chart1D.length - 1],
        price: newPrice
      };
    }

    return {
      ...stock,
      price: newPrice,
      change: priceDiff,
      changePercent: newChangePercent,
      chartData: {
        ...stock.chartData,
        '1D': chart1D
      }
    };
  });

  const updatedIndices = currentIndices.map(idx => {
    const tickDelta = (Math.random() * 0.3 - 0.1) / 100;
    const newCurrent = Number((idx.currentValue * (1 + tickDelta)).toFixed(2));
    const baseVal = idx.currentValue - idx.change;
    const changeVal = Number((newCurrent - baseVal).toFixed(2));
    const changePct = Number(((changeVal / baseVal) * 100).toFixed(2));

    return {
      ...idx,
      currentValue: newCurrent,
      change: changeVal,
      changePercent: changePct,
      isPositive: changeVal >= 0
    };
  });

  return { updatedStocks, updatedIndices };
}
