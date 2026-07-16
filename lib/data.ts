import type { Alternative, Criterion, PatientInput } from "./types";

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

export const CRITERIA: Criterion[] = [
  {
    code: "C1",
    name: "Kandungan Gula",
    weight: 0.3,
    type: "cost",
    unit: "g",
    key: "sugar",
  },
  {
    code: "C2",
    name: "Kandungan Natrium",
    weight: 0.2,
    type: "cost",
    unit: "mg",
    key: "sodium",
  },
  {
    code: "C3",
    name: "Kandungan Serat",
    weight: 0.2,
    type: "benefit",
    unit: "g",
    key: "fiber",
  },
  {
    code: "C4",
    name: "Harga Menu",
    weight: 0.15,
    type: "cost",
    unit: "Rp",
    key: "price",
  },
  {
    code: "C5",
    name: "Kemudahan Memperoleh Bahan",
    weight: 0.15,
    type: "benefit",
    unit: "skala 1-5",
    key: "ease",
  },
];

export const ALTERNATIVES: Alternative[] = [
  {
    id: "A1",
    name: "Menu Diabetes Hemat",
    values: { sugar: 12, sodium: 450, fiber: 12, price: 32000, ease: 3 },
  },
  {
    id: "A2",
    name: "Menu DASH",
    values: { sugar: 8, sodium: 380, fiber: 14, price: 40000, ease: 5 },
  },
  {
    id: "A3",
    name: "Menu Mediterania",
    values: { sugar: 10, sodium: 420, fiber: 11, price: 55000, ease: 3 },
  },
  {
    id: "A4",
    name: "Menu Tinggi Serat",
    values: { sugar: 9, sodium: 360, fiber: 16, price: 45000, ease: 4 },
  },
  {
    id: "A5",
    name: "Menu Rendah Karbohidrat",
    values: { sugar: 6, sodium: 500, fiber: 9, price: 48000, ease: 3 },
  },
];

export const DEFAULT_WEIGHTS: Record<string, number> = {
  C1: 30,
  C2: 20,
  C3: 20,
  C4: 15,
  C5: 15,
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

/** Normalize percentage weights so they sum to 100, then return decimal weights (sum = 1). */
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

export function getDecisionMatrix(): number[][] {
  return ALTERNATIVES.map((alt) =>
    CRITERIA.map((criterion) => alt.values[criterion.key])
  );
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
