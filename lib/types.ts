export type CriterionType = "benefit" | "cost";

export interface Criterion {
  code: string;
  name: string;
  weight: number;
  type: CriterionType;
  unit: string;
  key: keyof AlternativeValues;
}

export interface AlternativeValues {
  sugar: number;
  sodium: number;
  fiber: number;
  price: number;
  ease: number;
}

export interface Alternative {
  id: string;
  name: string;
  values: AlternativeValues;
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
