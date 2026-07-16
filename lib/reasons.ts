import { ALTERNATIVES, CRITERIA } from "./data";
import type { Alternative, PatientInput, SawResult, TopsisResult } from "./types";

export function generateReasons(
  alternative: Alternative,
  patient: PatientInput | null,
  method: "SAW" | "TOPSIS",
  score: number
): string[] {
  const reasons: string[] = [];
  const { sugar, sodium, fiber, price, ease } = alternative.values;

  const sugars = ALTERNATIVES.map((a) => a.values.sugar);
  const sodiums = ALTERNATIVES.map((a) => a.values.sodium);
  const fibers = ALTERNATIVES.map((a) => a.values.fiber);
  const prices = ALTERNATIVES.map((a) => a.values.price);

  if (sugar <= Math.min(...sugars) + 2) {
    reasons.push(`Kandungan gula rendah (${sugar} g) — cocok untuk kontrol gula darah`);
  }
  if (sodium <= Math.min(...sodiums) + 40) {
    reasons.push(`Natrium relatif rendah (${sodium} mg) — mendukung tekanan darah sehat`);
  }
  if (fiber >= Math.max(...fibers) - 2) {
    reasons.push(`Serat tinggi (${fiber} g) — membantu kenyang lebih lama & pencernaan`);
  }
  if (patient && price <= patient.budget) {
    reasons.push(
      `Harga Rp ${price.toLocaleString("id-ID")} sesuai anggaran Rp ${patient.budget.toLocaleString("id-ID")}`
    );
  } else if (price <= Math.min(...prices) + 8000) {
    reasons.push(`Harga relatif terjangkau (Rp ${price.toLocaleString("id-ID")})`);
  }
  if (ease >= 4) {
    reasons.push(`Bahan mudah diperoleh (skala kemudahan ${ease}/5)`);
  }

  if (patient?.disease === "Diabetes" && sugar <= 10) {
    reasons.push("Profil gula mendukung manajemen diabetes");
  }
  if (patient?.disease === "Hipertensi" && sodium <= 400) {
    reasons.push("Profil natrium mendukung manajemen hipertensi (DASH-like)");
  }
  if (patient?.disease === "Gagal Ginjal" && sodium <= 400) {
    reasons.push("Natrium terkendali — relevan untuk pantangan ginjal");
  }
  if (patient?.disease === "Penyakit Jantung" && fiber >= 12 && sodium <= 420) {
    reasons.push("Kombinasi serat & natrium mendukung pola makan jantung sehat");
  }

  if (reasons.length === 0) {
    reasons.push(
      `Skor ${method} ${score.toFixed(4)} menunjukkan keseimbangan kriteria yang baik secara keseluruhan`
    );
  }

  return reasons.slice(0, 4);
}

export function getWinnerReasons(
  saw: SawResult[],
  topsis: TopsisResult[],
  patient: PatientInput | null
) {
  const sawWinner = saw[0];
  const topsisWinner = topsis[0];
  const sawAlt = ALTERNATIVES.find((a) => a.id === sawWinner.id)!;
  const topsisAlt = ALTERNATIVES.find((a) => a.id === topsisWinner.id)!;

  return {
    saw: {
      result: sawWinner,
      alternative: sawAlt,
      reasons: generateReasons(sawAlt, patient, "SAW", sawWinner.score),
    },
    topsis: {
      result: topsisWinner,
      alternative: topsisAlt,
      reasons: generateReasons(topsisAlt, patient, "TOPSIS", topsisWinner.preference),
    },
  };
}

export function describeCriteriaForUI() {
  return CRITERIA.map((c) => ({
    ...c,
    typeLabel: c.type === "benefit" ? "Benefit (semakin tinggi semakin baik)" : "Cost (semakin rendah semakin baik)",
    weightPercent: `${(c.weight * 100).toFixed(0)}%`,
  }));
}
