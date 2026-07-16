import { calculateSAW } from "./saw";
import { calculateTOPSIS } from "./topsis";
import { ALTERNATIVES, CRITERIA, normalizeWeights, DEFAULT_WEIGHTS } from "./data";

/** Simple verification that A2 / A4 rank highly with default weights. */
export function runAlgorithmSanityCheck(): {
  ok: boolean;
  sawTop2: string[];
  topsisTop2: string[];
  message: string;
} {
  const weights = normalizeWeights(DEFAULT_WEIGHTS);
  const saw = calculateSAW(undefined, weights);
  const { results: topsis } = calculateTOPSIS(undefined, weights);

  const sawTop2 = saw.slice(0, 2).map((r) => r.id);
  const topsisTop2 = topsis.slice(0, 2).map((r) => r.id);

  const expected = new Set(["A2", "A4"]);
  const sawOk = sawTop2.some((id) => expected.has(id));
  const topsisOk = topsisTop2.some((id) => expected.has(id));
  const ok = sawOk && topsisOk;

  const message = [
    "=== NutriCare Algorithm Sanity Check ===",
    `Criteria: ${CRITERIA.map((c) => c.code).join(", ")}`,
    `Alternatives: ${ALTERNATIVES.map((a) => a.id).join(", ")}`,
    "",
    "SAW Ranking:",
    ...saw.map((r) => `  #${r.rank} ${r.id} ${r.name} → V=${r.score.toFixed(4)}`),
    "",
    "TOPSIS Ranking:",
    ...topsis.map(
      (r) =>
        `  #${r.rank} ${r.id} ${r.name} → V=${r.preference.toFixed(4)} (D+=${r.distancePositive.toFixed(4)}, D-=${r.distanceNegative.toFixed(4)})`
    ),
    "",
    ok
      ? "PASS: A2 dan/atau A4 berada di peringkat atas (sesuai ekspektasi)."
      : "FAIL: Hasil tidak sesuai ekspektasi (A2/A4 seharusnya skor tinggi).",
  ].join("\n");

  return { ok, sawTop2, topsisTop2, message };
}

const result = runAlgorithmSanityCheck();
console.log(result.message);
if (!result.ok) {
  process.exit(1);
}
