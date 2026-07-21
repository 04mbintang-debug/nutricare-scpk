import type {
  Alternative,
  Criterion,
  MadmValues,
  PatientInput,
} from "./types";

export const DISEASE_OPTIONS = [
  "Diabetes",
  "Hipertensi",
  "Gagal Ginjal",
  "Penyakit Jantung",
  "Lainnya",
] as const;

export const PREFERENCE_OPTIONS = [
  "Rendah gula",
  "Rendah garam",
  "Tinggi serat",
  "Vegetarian",
  "Tanpa seafood",
  "Halal",
] as const;

/**
 * Kriteria MADM berasal dari parameter pasien (BB, TB, Umur, Budget).
 * Gula/Natrium/Serat bukan kriteria — hanya info nutrisi.
 */
export const CRITERIA: Criterion[] = [
  {
    code: "C1",
    name: "Kesesuaian Berat Badan",
    weight: 0.25,
    type: "benefit",
    unit: "skala 1-5",
    key: "fitWeight",
    description:
      "Seberapa cocok porsi/kalori menu terhadap berat badan pasien",
  },
  {
    code: "C2",
    name: "Kesesuaian Tinggi Badan",
    weight: 0.25,
    type: "benefit",
    unit: "skala 1-5",
    key: "fitHeight",
    description:
      "Seberapa cocok profil gizi menu terhadap kecukupan energi dari TB/IMT",
  },
  {
    code: "C3",
    name: "Kesesuaian Umur",
    weight: 0.2,
    type: "benefit",
    unit: "skala 1-5",
    key: "fitAge",
    description:
      "Seberapa cocok menu dengan metabolisme kelompok usia pasien",
  },
  {
    code: "C4",
    name: "Budget / Harga Menu",
    weight: 0.3,
    type: "cost",
    unit: "Rp",
    key: "price",
    description: "Nominal harga riil menu (semakin rendah semakin baik)",
  },
];

/**
 * Seed alternatif: skor C1–C3 (1–5) + harga C4.
 * nutrition = data mentah (bukan kriteria MADM).
 */
export const ALTERNATIVES: Alternative[] = [
  {
    id: "A1",
    name: "Menu Diabetes Hemat",
    values: { fitWeight: 4, fitHeight: 3, fitAge: 4, price: 32000 },
    nutrition: { sugar: 12, sodium: 450, fiber: 12 },
    profile: {
      idealBmiMin: 18.5,
      idealBmiMax: 27,
      idealAgeMin: 30,
      idealAgeMax: 65,
      calorieLevel: 2,
    },
  },
  {
    id: "A2",
    name: "Menu DASH",
    values: { fitWeight: 5, fitHeight: 5, fitAge: 5, price: 40000 },
    nutrition: { sugar: 8, sodium: 380, fiber: 14 },
    profile: {
      idealBmiMin: 18.5,
      idealBmiMax: 29,
      idealAgeMin: 25,
      idealAgeMax: 70,
      calorieLevel: 3,
    },
  },
  {
    id: "A3",
    name: "Menu Mediterania",
    values: { fitWeight: 3, fitHeight: 4, fitAge: 4, price: 55000 },
    nutrition: { sugar: 10, sodium: 420, fiber: 11 },
    profile: {
      idealBmiMin: 20,
      idealBmiMax: 28,
      idealAgeMin: 35,
      idealAgeMax: 70,
      calorieLevel: 4,
    },
  },
  {
    id: "A4",
    name: "Menu Tinggi Serat",
    values: { fitWeight: 4, fitHeight: 4, fitAge: 3, price: 45000 },
    nutrition: { sugar: 9, sodium: 360, fiber: 16 },
    profile: {
      idealBmiMin: 22,
      idealBmiMax: 32,
      idealAgeMin: 20,
      idealAgeMax: 55,
      calorieLevel: 3,
    },
  },
  {
    id: "A5",
    name: "Menu Rendah Karbohidrat",
    values: { fitWeight: 5, fitHeight: 3, fitAge: 4, price: 48000 },
    nutrition: { sugar: 6, sodium: 500, fiber: 9 },
    profile: {
      idealBmiMin: 24,
      idealBmiMax: 35,
      idealAgeMin: 30,
      idealAgeMax: 60,
      calorieLevel: 2,
    },
  },
];

export const DEFAULT_WEIGHTS: Record<string, number> = {
  C1: 25,
  C2: 25,
  C3: 20,
  C4: 30,
};

export const DEFAULT_PATIENT_INPUT: PatientInput = {
  disease: "Diabetes",
  age: 45,
  weight: 70,
  height: 165,
  budget: 50000,
  preferences: ["Rendah gula", "Tinggi serat"],
  preferenceNotes: "",
  weights: { ...DEFAULT_WEIGHTS },
};

export function normalizeWeights(
  percentageWeights: Record<string, number>
): number[] {
  const codes = CRITERIA.map((c) => c.code);
  const values = codes.map((code) => Math.max(0, percentageWeights[code] ?? 0));
  const total = values.reduce((sum, v) => sum + v, 0);

  if (total === 0) {
    return CRITERIA.map((c) => c.weight);
  }

  return values.map((v) => v / total);
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  if (m <= 0) return 0;
  return weightKg / (m * m);
}

function clampScore(value: number): number {
  return Math.min(5, Math.max(1, Math.round(value)));
}

/**
 * Skor C1: kesesuaian BB — bandingkan IMT pasien & tingkat kalori menu.
 */
export function scoreWeightFit(
  patient: PatientInput,
  alt: Alternative
): number {
  const bmi = calcBMI(patient.weight, patient.height);
  const { idealBmiMin, idealBmiMax, calorieLevel } = alt.profile;

  let score = alt.values.fitWeight;

  if (bmi >= idealBmiMin && bmi <= idealBmiMax) {
    score += 1;
  } else {
    const dist = bmi < idealBmiMin ? idealBmiMin - bmi : bmi - idealBmiMax;
    score -= dist > 5 ? 2 : 1;
  }

  // BB tinggi → porsi lebih terkendali lebih cocok
  if (bmi >= 25 && calorieLevel <= 2) score += 1;
  if (bmi < 18.5 && calorieLevel >= 4) score += 1;
  if (bmi >= 30 && calorieLevel >= 4) score -= 1;

  return clampScore(score);
}

/**
 * Skor C2: kesesuaian TB — kecukupan energi relatif terhadap tinggi/IMT.
 */
export function scoreHeightFit(
  patient: PatientInput,
  alt: Alternative
): number {
  const bmi = calcBMI(patient.weight, patient.height);
  let score = alt.values.fitHeight;

  // TB tinggi umumnya butuh energi lebih → calorieLevel menengah–tinggi lebih cocok
  if (patient.height >= 170 && alt.profile.calorieLevel >= 3) score += 1;
  if (patient.height < 155 && alt.profile.calorieLevel <= 2) score += 1;
  if (patient.height >= 170 && alt.profile.calorieLevel <= 1) score -= 1;

  // IMT ekstrem menjauh dari ideal menu → kurangi
  if (bmi < alt.profile.idealBmiMin - 3 || bmi > alt.profile.idealBmiMax + 3) {
    score -= 1;
  } else if (
    bmi >= alt.profile.idealBmiMin &&
    bmi <= alt.profile.idealBmiMax
  ) {
    score += 0.5;
  }

  return clampScore(score);
}

/**
 * Skor C3: kesesuaian umur — metabolisme kelompok usia.
 */
export function scoreAgeFit(patient: PatientInput, alt: Alternative): number {
  const { idealAgeMin, idealAgeMax, calorieLevel } = alt.profile;
  let score = alt.values.fitAge;

  if (patient.age >= idealAgeMin && patient.age <= idealAgeMax) {
    score += 1;
  } else {
    const dist =
      patient.age < idealAgeMin
        ? idealAgeMin - patient.age
        : patient.age - idealAgeMax;
    score -= dist > 15 ? 2 : 1;
  }

  // Usia lanjut: porsi lebih ringan cenderung lebih sesuai
  if (patient.age >= 60 && calorieLevel <= 3) score += 1;
  if (patient.age < 30 && calorieLevel >= 4) score += 1;

  return clampScore(score);
}

/**
 * Matriks keputusan X untuk pasien tertentu.
 * Baris = alternatif, kolom = [C1, C2, C3, C4].
 */
export function buildDecisionMatrix(patient: PatientInput): number[][] {
  return ALTERNATIVES.map((alt) => [
    scoreWeightFit(patient, alt),
    scoreHeightFit(patient, alt),
    scoreAgeFit(patient, alt),
    alt.values.price,
  ]);
}

/** Matriks dari seed default (tanpa personalisasi pasien). */
export function getDecisionMatrix(): number[][] {
  return ALTERNATIVES.map((alt) =>
    CRITERIA.map((criterion) => alt.values[criterion.key])
  );
}

export function getMadmValuesForPatient(
  patient: PatientInput,
  alt: Alternative
): MadmValues {
  return {
    fitWeight: scoreWeightFit(patient, alt),
    fitHeight: scoreHeightFit(patient, alt),
    fitAge: scoreAgeFit(patient, alt),
    price: alt.values.price,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, digits = 4): string {
  return value.toFixed(digits);
}
