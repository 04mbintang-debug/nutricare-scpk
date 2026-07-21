import { ALTERNATIVES, CRITERIA, formatCurrency } from "./data";
import type {
  Alternative,
  MadmValues,
  PatientInput,
  SawResult,
  TopsisResult,
} from "./types";

export function generateReasons(
  alternative: Alternative,
  madm: MadmValues,
  patient: PatientInput | null,
  method: "SAW" | "TOPSIS",
  score: number
): string[] {
  const reasons: string[] = [];
  const { fitWeight, fitHeight, fitAge, price } = madm;
  const { sugar, sodium, fiber } = alternative.nutrition;

  if (fitWeight >= 4) {
    reasons.push(
      `Kesesuaian BB tinggi (skor ${fitWeight}/5) — porsi/kalori selaras dengan berat badan pasien`
    );
  }
  if (fitHeight >= 4) {
    reasons.push(
      `Kesesuaian TB tinggi (skor ${fitHeight}/5) — profil gizi mendukung kecukupan energi dari TB/IMT`
    );
  }
  if (fitAge >= 4) {
    reasons.push(
      `Kesesuaian umur tinggi (skor ${fitAge}/5) — cocok dengan metabolisme kelompok usia`
    );
  }

  if (patient && price <= patient.budget) {
    reasons.push(
      `Harga ${formatCurrency(price)} sesuai anggaran ${formatCurrency(patient.budget)}`
    );
  } else if (price <= 40000) {
    reasons.push(`Harga relatif terjangkau (${formatCurrency(price)})`);
  } else if (patient && price > patient.budget) {
    reasons.push(
      `Harga ${formatCurrency(price)} melebihi anggaran — pertimbangkan trade-off dengan kriteria lain`
    );
  }

  // Nutrisi sebagai konteks pendukung (bukan kriteria MADM)
  if (sugar <= 10) {
    reasons.push(`Info nutrisi: gula relatif rendah (${sugar} g)`);
  }
  if (fiber >= 12) {
    reasons.push(`Info nutrisi: serat tinggi (${fiber} g)`);
  }
  if (patient?.disease === "Hipertensi" && sodium <= 400) {
    reasons.push(`Info nutrisi: natrium terkendali (${sodium} mg)`);
  }

  if (reasons.length === 0) {
    reasons.push(
      `Skor ${method} ${score.toFixed(4)} menunjukkan keseimbangan kriteria BB, TB, umur, dan budget`
    );
  }

  return reasons.slice(0, 4);
}

export function getWinnerReasons(
  saw: SawResult[],
  topsis: TopsisResult[],
  patient: PatientInput | null,
  matrix: number[][]
) {
  const sawWinner = saw[0];
  const topsisWinner = topsis[0];
  const sawAlt = ALTERNATIVES.find((a) => a.id === sawWinner.id)!;
  const topsisAlt = ALTERNATIVES.find((a) => a.id === topsisWinner.id)!;

  const sawIndex = ALTERNATIVES.findIndex((a) => a.id === sawWinner.id);
  const topsisIndex = ALTERNATIVES.findIndex((a) => a.id === topsisWinner.id);

  const sawMadm: MadmValues = {
    fitWeight: matrix[sawIndex][0],
    fitHeight: matrix[sawIndex][1],
    fitAge: matrix[sawIndex][2],
    price: matrix[sawIndex][3],
  };
  const topsisMadm: MadmValues = {
    fitWeight: matrix[topsisIndex][0],
    fitHeight: matrix[topsisIndex][1],
    fitAge: matrix[topsisIndex][2],
    price: matrix[topsisIndex][3],
  };

  return {
    saw: {
      result: sawWinner,
      alternative: sawAlt,
      madm: sawMadm,
      reasons: generateReasons(
        sawAlt,
        sawMadm,
        patient,
        "SAW",
        sawWinner.score
      ),
    },
    topsis: {
      result: topsisWinner,
      alternative: topsisAlt,
      madm: topsisMadm,
      reasons: generateReasons(
        topsisAlt,
        topsisMadm,
        patient,
        "TOPSIS",
        topsisWinner.preference
      ),
    },
  };
}

export function describeCriteriaForUI() {
  return CRITERIA.map((c) => ({
    ...c,
    typeLabel:
      c.type === "benefit"
        ? "Benefit (semakin tinggi semakin baik)"
        : "Cost (semakin rendah semakin baik)",
    weightPercent: `${(c.weight * 100).toFixed(0)}%`,
  }));
}
