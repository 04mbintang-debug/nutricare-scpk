export type CriterionType = "benefit" | "cost";

export interface Criterion {
  code: string;
  name: string;
  weight: number;
  type: CriterionType;
  unit: string;
  key: keyof MadmValues;
  description: string;
}

/** Nilai kriteria MADM (C1–C4). */
export interface MadmValues {
  fitWeight: number;
  fitHeight: number;
  fitAge: number;
  price: number;
}

/** Data mentah nutrisi — BUKAN kriteria MADM. */
export interface NutritionInfo {
  sugar: number;
  sodium: number;
  fiber: number;
}

/** Profil target menu untuk penskoran kesesuaian terhadap pasien. */
export interface MenuProfile {
  idealBmiMin: number;
  idealBmiMax: number;
  idealAgeMin: number;
  idealAgeMax: number;
  /** Tingkat porsi/kalori relatif (1=ringan … 5=tinggi). */
  calorieLevel: number;
}

export interface Alternative {
  id: string;
  name: string;
  /** Skor seed default C1–C3 + harga C4 (digunakan bila tanpa personalisasi). */
  values: MadmValues;
  nutrition: NutritionInfo;
  profile: MenuProfile;
}

export interface PatientInput {
  disease: string;
  age: number;
  weight: number;
  height: number;
  budget: number;
  preferences: string[];
  preferenceNotes: string;
  weights: Record<string, number>;
}

export interface SawResult {
  id: string;
  name: string;
  normalized: number[];
  score: number;
  rank: number;
}

export interface TopsisResult {
  id: string;
  name: string;
  weightedNormalized: number[];
  distancePositive: number;
  distanceNegative: number;
  preference: number;
  rank: number;
}

export interface DecisionResult {
  saw: SawResult[];
  topsis: TopsisResult[];
  normalizedSawMatrix: number[][];
  weightedTopsisMatrix: number[][];
  idealPositive: number[];
  idealNegative: number[];
}
