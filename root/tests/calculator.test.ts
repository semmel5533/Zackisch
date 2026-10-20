import { describe, it, expect } from "vitest";
import {
  calculatePotential,
  convertRevenuePeriod,
} from "../lib/calculator";

describe("Zackisch Potential Calculator v3 (Mathematical Contract)", () => {
  it("computes exact default values for year / 420.000 €", () => {
    const res = calculatePotential(420000, "year");

    // Uplift should be exactly 18.840 €
    expect(res.uplift).toBeCloseTo(18840, 2);
    // Net incremental result should be exactly 4.404,60 €
    expect(res.netIncrementalResult).toBeCloseTo(4404.6, 2);
    // Labor savings must strictly be 0 €
    expect(res.laborSavings).toBe(0);

    // Component breakdown check for the year:
    expect(res.baseDigitalSales).toBeCloseTo(168000, 2);
    expect(res.upselling).toBeCloseTo(6720, 2);
    expect(res.reorders).toBeCloseTo(2520, 2);
    expect(res.recovered).toBeCloseTo(6000, 2);
    expect(res.returnVisits).toBeCloseTo(3600, 2);
    expect(res.variableCost).toBeCloseTo(6594, 2);
    expect(res.incrementalContributionBeforeFees).toBeCloseTo(12246, 2);
    expect(res.zackischFee).toBeCloseTo(3736.8, 2);
    expect(res.stripeFee).toBeCloseTo(5112.6, 2);
    expect(res.previousCardFeeCredit).toBeCloseTo(1008, 2);
  });

  it("computes exact values for month / 35.000 €", () => {
    const res = calculatePotential(35000, "month");

    // Uplift should be exactly 1.570 €
    expect(res.uplift).toBeCloseTo(1570, 2);
    // Net incremental result should be exactly 367,05 €
    expect(res.netIncrementalResult).toBeCloseTo(367.05, 2);
    expect(res.laborSavings).toBe(0);

    expect(res.upselling).toBeCloseTo(560, 2);
    expect(res.reorders).toBeCloseTo(210, 2);
    expect(res.recovered).toBeCloseTo(500, 2);
    expect(res.returnVisits).toBeCloseTo(300, 2);
    expect(res.variableCost).toBeCloseTo(549.5, 2);
    expect(res.incrementalContributionBeforeFees).toBeCloseTo(1020.5, 2);
    expect(res.zackischFee).toBeCloseTo(311.4, 2);
    expect(res.stripeFee).toBeCloseTo(426.05, 2);
    expect(res.previousCardFeeCredit).toBeCloseTo(84, 2);
  });

  it("computes exact values for day / 1.400 € at 300 opening days", () => {
    const res = calculatePotential(1400, "day");

    // Uplift = 1570 * (12/300) = 62.80 €
    expect(res.uplift).toBeCloseTo(62.8, 2);
    // Net result = 367.05 * 0.04 = 14.682 €
    expect(res.netIncrementalResult).toBeCloseTo(14.682, 2);
    expect(res.laborSavings).toBe(0);
  });

  it("handles 0 € revenue safely with 0 uplift and 0 transaction fees", () => {
    const res = calculatePotential(0, "year");
    expect(res.uplift).toBe(0);
    expect(res.netIncrementalResult).toBe(0);
    expect(res.zackischFee).toBe(0);
    expect(res.stripeFee).toBe(0);
    expect(res.laborSavings).toBe(0);
  });

  it("converts revenue accurately between periods based on 300 opening days", () => {
    expect(convertRevenuePeriod(420000, "year", "month")).toBe(35000);
    expect(convertRevenuePeriod(420000, "year", "day")).toBe(1400);
    expect(convertRevenuePeriod(35000, "month", "year")).toBe(420000);
    expect(convertRevenuePeriod(1400, "day", "year")).toBe(420000);
  });
});
