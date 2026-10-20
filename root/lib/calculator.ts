/**
 * Zackisch Potential Calculator v3 — Mathematical Contract
 *
 * Implements strictly docs/CALCULATOR_MODEL_SPEC.md (20.10.2026):
 * - Period: 'day' | 'month' | 'year'
 * - Default: year / 420.000 € (equivalent to month / 35.000 € and day / 1.400 € at 300 opening days/year)
 * - Result at 420.000 €/year: +18.840 € net revenue uplift / year, +4.404,60 € net incremental result / year
 * - LABOR SAVINGS: ALWAYS 0,00 € (Time saved enhances personal service; not monetized).
 */

export type CalculatorPeriod = "day" | "month" | "year";

export interface CalculatorBreakdown {
  period: CalculatorPeriod;
  netRevenue: number;
  monthsFactor: number;
  scale: number;
  baseDigitalSales: number;
  baseDigitalOrders: number;
  upselling: number;
  reorders: number;
  recovered: number;
  returnVisits: number;
  uplift: number;
  variableCost: number;
  incrementalContributionBeforeFees: number;
  digitalSalesTotal: number;
  digitalNewOrders: number;
  digitalOrdersTotal: number;
  zackischFee: number;
  stripeFee: number;
  previousCardFeeCredit: number;
  laborSavings: number; // 0.00 always
  netIncrementalResult: number;
}

export const OPENING_DAYS_PER_YEAR = 300;
export const MONTHS_PER_YEAR = 12;
export const BASE_MONTHLY_REVENUE = 35000;

export function getMonthsFactor(period: CalculatorPeriod): number {
  switch (period) {
    case "year":
      return 12;
    case "month":
      return 1;
    case "day":
      return 12 / OPENING_DAYS_PER_YEAR; // 0.04
  }
}

/**
 * Convert a revenue figure when switching between periods so the underlying annualized
 * business scale remains identical (300 operating days = 12 months = 1 year).
 */
export function convertRevenuePeriod(
  amount: number,
  from: CalculatorPeriod,
  to: CalculatorPeriod
): number {
  if (from === to) return amount;
  const fromFactor = getMonthsFactor(from);
  const toFactor = getMonthsFactor(to);
  const annualized = (amount / fromFactor) * 12;
  return Math.round((annualized / 12) * toFactor);
}

export function calculatePotential(
  netRevenue: number,
  period: CalculatorPeriod
): CalculatorBreakdown {
  const safeRevenue = Math.max(0, isNaN(netRevenue) ? 0 : netRevenue);
  const monthsFactor = getMonthsFactor(period);

  if (safeRevenue === 0) {
    return {
      period,
      netRevenue: 0,
      monthsFactor,
      scale: 0,
      baseDigitalSales: 0,
      baseDigitalOrders: 0,
      upselling: 0,
      reorders: 0,
      recovered: 0,
      returnVisits: 0,
      uplift: 0,
      variableCost: 0,
      incrementalContributionBeforeFees: 0,
      digitalSalesTotal: 0,
      digitalNewOrders: 0,
      digitalOrdersTotal: 0,
      zackischFee: 0,
      stripeFee: 0,
      previousCardFeeCredit: 0,
      laborSavings: 0,
      netIncrementalResult: 0,
    };
  }

  const R_month = safeRevenue / monthsFactor;
  const scale = R_month / BASE_MONTHLY_REVENUE;

  // Base 40% digital volume
  const base_digital_sales_month = 0.4 * R_month;
  const base_digital_orders_month = base_digital_sales_month / 20;

  // 4 Revenue Uplift Drivers
  const upselling_month = base_digital_sales_month * 0.04;
  const reorders_month = 30 * scale * 7;
  const recovered_month = 25 * scale * 20;
  const return_visits_month = 15 * scale * 20;

  const uplift_month =
    upselling_month + reorders_month + recovered_month + return_visits_month;

  // 35% variable costs on uplift
  const variable_cost_month = 0.35 * uplift_month;
  const incremental_contribution_before_fees_month =
    uplift_month - variable_cost_month;

  // Total digital volume
  const digital_sales_total_month = base_digital_sales_month + uplift_month;
  const digital_new_orders_month = (30 + 25 + 15) * scale;
  const digital_orders_total_month =
    base_digital_orders_month + digital_new_orders_month;

  // Fees
  const zackisch_fee_month = 0.02 * digital_sales_total_month;
  const stripe_fee_month =
    0.015 * digital_sales_total_month + 0.25 * digital_orders_total_month;
  const previous_card_fee_credit_month =
    0.6 * base_digital_sales_month * 0.01;

  // Labor savings are strictly 0 €
  const labor_saving_month = 0.0;

  const net_incremental_result_month =
    incremental_contribution_before_fees_month -
    zackisch_fee_month -
    stripe_fee_month +
    previous_card_fee_credit_month +
    labor_saving_month;

  return {
    period,
    netRevenue: safeRevenue,
    monthsFactor,
    scale,
    baseDigitalSales: base_digital_sales_month * monthsFactor,
    baseDigitalOrders: base_digital_orders_month * monthsFactor,
    upselling: upselling_month * monthsFactor,
    reorders: reorders_month * monthsFactor,
    recovered: recovered_month * monthsFactor,
    returnVisits: return_visits_month * monthsFactor,
    uplift: uplift_month * monthsFactor,
    variableCost: variable_cost_month * monthsFactor,
    incrementalContributionBeforeFees:
      incremental_contribution_before_fees_month * monthsFactor,
    digitalSalesTotal: digital_sales_total_month * monthsFactor,
    digitalNewOrders: digital_new_orders_month * monthsFactor,
    digitalOrdersTotal: digital_orders_total_month * monthsFactor,
    zackischFee: zackisch_fee_month * monthsFactor,
    stripeFee: stripe_fee_month * monthsFactor,
    previousCardFeeCredit: previous_card_fee_credit_month * monthsFactor,
    laborSavings: 0,
    netIncrementalResult: net_incremental_result_month * monthsFactor,
  };
}

export function formatEuro(
  amount: number,
  locale: "de" | "en" = "de",
  decimals: number = 0
): string {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}
