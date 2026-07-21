import { calculateSAW } from "./saw";
import { calculateTOPSIS } from "./topsis";
import {
  ALTERNATIVES,
  CRITERIA,
  DEFAULT_PATIENT_INPUT,
  DEFAULT_WEIGHTS,
  buildDecisionMatrix,
  normalizeWeights,
} from "./data";

/** Sanity check: A2 (DASH) diharapkan skor tinggi pada kriteria pasien. */
export function runAlgorithmSanityCheck(): {
  ok: boolean;
  sawTop2: string[];
  topsisTop2: string[];
  message: string;
} {
  const weights = normalizeWeights(DEFAULT_WEIGHTS);
  const matrix = buildDecisionMatrix(DEFAULT_PATIENT_INPUT);
  const saw = calculateSAW(matrix, weights);
  const { results: topsis } = calculateTOPSIS(matrix, weights);

  const sawTop2 = saw.slice(0, 2).map((r) => r.id);
  const topsisTop2 = topsis.slice(0, 2).map((r) => r.id);

  const expected = new Set(["A2", "A4", "A1"]);
  const sawOk = sawTop2.some((id) => expected.has(id));
  const topsisOk = topsisTop2.some((id) => expected.has(id));
  const ok = sawOk && topsisOk;

  const message = [
    "=== NutriCare Algorithm Sanity Check (revisi kriteria pasien) ===",
    `Criteria: ${CRITERIA.map((c) => `${c.code}:${c.name}`).join(" | ")}`,
    `Alternatives: ${ALTERNATIVES.map((a) => a.id).join(", ")}`,
    `Patient: BB=${DEFAULT_PATIENT_INPUT.weight}kg TB=${DEFAULT_PATIENT_INPUT.height}cm umur=${DEFAULT_PATIENT_INPUT.age} budget=${DEFAULT_PATIENT_INPUT.budget}`,
    "",
    "Decision matrix (personalized):",
    ...matrix.map(
      (row, i) =>
        `  ${ALTERNATIVES[i].id}: C1=${row[0]} C2=${row[1]} C3=${row[2]} C4=${row[3]}`
    ),
    "",
    "SAW Ranking:",
    ...saw.map(
      (r) => `  #${r.rank} ${r.id} ${r.name} → V=${r.score.toFixed(4)}`
    ),
    "",
    "TOPSIS Ranking:",
    ...topsis.map(
      (r) =>
        `  #${r.rank} ${r.id} ${r.name} → V=${r.preference.toFixed(4)} (D+=${r.distancePositive.toFixed(4)}, D-=${r.distanceNegative.toFixed(4)})`
    ),
    "",
    ok
      ? "PASS: Ranking masuk akal (A2/A4/A1 di peringkat atas)."
      : "FAIL: Hasil tidak sesuai ekspektasi.",
  ].join("\n");

  return { ok, sawTop2, topsisTop2, message };
}

const result = runAlgorithmSanityCheck();
console.log(result.message);
if (!result.ok) {
  process.exit(1);
}
