import { ALTERNATIVES, CRITERIA, getDecisionMatrix } from "./data";
import type { Criterion, TopsisResult } from "./types";

export interface TopsisFullResult {
  results: TopsisResult[];
  weightedNormalized: number[][];
  idealPositive: number[];
  idealNegative: number[];
}

/**
 * TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
 * 1. Vector normalize: r_ij = x_ij / sqrt(Σ x_ij²)
 * 2. Weighted: y_ij = w_j * r_ij
 * 3. Ideal A+ / A- (benefit: max/min, cost: min/max)
 * 4. Distances D+ / D-
 * 5. Preference: V_i = D- / (D+ + D-)
 * 6. Rank descending by V_i
 */
export function calculateTOPSIS(
  matrix: number[][] = getDecisionMatrix(),
  weights: number[] = CRITERIA.map((c) => c.weight),
  criteria: Criterion[] = CRITERIA,
  alternatives = ALTERNATIVES
): TopsisFullResult {
  const colCount = criteria.length;

  const denominators = Array.from({ length: colCount }, (_, j) => {
    const sumSquares = matrix.reduce((sum, row) => sum + row[j] ** 2, 0);
    return Math.sqrt(sumSquares);
  });

  const normalized = matrix.map((row) =>
    row.map((value, j) =>
      denominators[j] === 0 ? 0 : value / denominators[j]
    )
  );

  const weightedNormalized = normalized.map((row) =>
    row.map((r, j) => weights[j] * r)
  );

  const idealPositive = Array.from({ length: colCount }, (_, j) => {
    const col = weightedNormalized.map((row) => row[j]);
    return criteria[j].type === "benefit" ? Math.max(...col) : Math.min(...col);
  });

  const idealNegative = Array.from({ length: colCount }, (_, j) => {
    const col = weightedNormalized.map((row) => row[j]);
    return criteria[j].type === "benefit" ? Math.min(...col) : Math.max(...col);
  });

  const scored = alternatives.map((alt, i) => {
    const distancePositive = Math.sqrt(
      weightedNormalized[i].reduce(
        (sum, y, j) => sum + (y - idealPositive[j]) ** 2,
        0
      )
    );
    const distanceNegative = Math.sqrt(
      weightedNormalized[i].reduce(
        (sum, y, j) => sum + (y - idealNegative[j]) ** 2,
        0
      )
    );
    const denom = distancePositive + distanceNegative;
    const preference = denom === 0 ? 0 : distanceNegative / denom;

    return {
      id: alt.id,
      name: alt.name,
      weightedNormalized: weightedNormalized[i],
      distancePositive,
      distanceNegative,
      preference,
      rank: 0,
    };
  });

  const sorted = [...scored].sort((a, b) => b.preference - a.preference);
  sorted.forEach((item, index) => {
    item.rank = index + 1;
  });

  const rankMap = new Map(sorted.map((s) => [s.id, s.rank]));
  const results = scored
    .map((s) => ({ ...s, rank: rankMap.get(s.id)! }))
    .sort((a, b) => a.rank - b.rank);

  return {
    results,
    weightedNormalized,
    idealPositive,
    idealNegative,
  };
}
