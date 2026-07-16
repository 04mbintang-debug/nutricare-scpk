import { ALTERNATIVES, CRITERIA, getDecisionMatrix } from "./data";
import type { Criterion, SawResult } from "./types";

/**
 * SAW (Simple Additive Weighting)
 * 1. Normalize: benefit r = x/max, cost r = min/x
 * 2. Score: V_i = Σ (w_j * r_ij)
 * 3. Rank descending by V_i
 */
export function calculateSAW(
  matrix: number[][] = getDecisionMatrix(),
  weights: number[] = CRITERIA.map((c) => c.weight),
  criteria: Criterion[] = CRITERIA,
  alternatives = ALTERNATIVES
): SawResult[] {
  const colCount = criteria.length;

  const colMins = Array.from({ length: colCount }, (_, j) =>
    Math.min(...matrix.map((row) => row[j]))
  );
  const colMaxs = Array.from({ length: colCount }, (_, j) =>
    Math.max(...matrix.map((row) => row[j]))
  );

  const normalized: number[][] = matrix.map((row) =>
    row.map((value, j) => {
      if (criteria[j].type === "benefit") {
        return colMaxs[j] === 0 ? 0 : value / colMaxs[j];
      }
      return value === 0 ? 0 : colMins[j] / value;
    })
  );

  const scored = alternatives.map((alt, i) => {
    const score = normalized[i].reduce(
      (sum, r, j) => sum + weights[j] * r,
      0
    );
    return {
      id: alt.id,
      name: alt.name,
      normalized: normalized[i],
      score,
      rank: 0,
    };
  });

  const sorted = [...scored].sort((a, b) => b.score - a.score);
  sorted.forEach((item, index) => {
    item.rank = index + 1;
  });

  const rankMap = new Map(sorted.map((s) => [s.id, s.rank]));
  return scored
    .map((s) => ({ ...s, rank: rankMap.get(s.id)! }))
    .sort((a, b) => a.rank - b.rank);
}

export function getSAWNormalizedMatrix(
  matrix: number[][] = getDecisionMatrix(),
  criteria: Criterion[] = CRITERIA
): number[][] {
  const colMins = Array.from({ length: criteria.length }, (_, j) =>
    Math.min(...matrix.map((row) => row[j]))
  );
  const colMaxs = Array.from({ length: criteria.length }, (_, j) =>
    Math.max(...matrix.map((row) => row[j]))
  );

  return matrix.map((row) =>
    row.map((value, j) => {
      if (criteria[j].type === "benefit") {
        return colMaxs[j] === 0 ? 0 : value / colMaxs[j];
      }
      return value === 0 ? 0 : colMins[j] / value;
    })
  );
}
