import type { PatientInput } from "./types";
import { CRITERIA, DEFAULT_PATIENT_INPUT, DEFAULT_WEIGHTS } from "./data";

const STORAGE_KEY = "nutricare-patient-input";

/** Migrasi bobot lama (C1–C5 nutrisi) ke kriteria pasien C1–C4. */
function migrateWeights(
  weights: Record<string, number> | undefined
): Record<string, number> {
  if (!weights) return { ...DEFAULT_WEIGHTS };

  const hasNew = CRITERIA.every((c) => typeof weights[c.code] === "number");
  const hasOldC5 = typeof weights.C5 === "number";

  if (hasNew && !hasOldC5) {
    return {
      C1: weights.C1,
      C2: weights.C2,
      C3: weights.C3,
      C4: weights.C4,
    };
  }

  return { ...DEFAULT_WEIGHTS };
}

export function savePatientInput(input: PatientInput): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(input));
}

export function loadPatientInput(): PatientInput {
  if (typeof window === "undefined") return DEFAULT_PATIENT_INPUT;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PATIENT_INPUT;
    const parsed = JSON.parse(raw) as Partial<PatientInput>;
    return {
      ...DEFAULT_PATIENT_INPUT,
      ...parsed,
      weights: migrateWeights(parsed.weights),
    };
  } catch {
    return DEFAULT_PATIENT_INPUT;
  }
}
