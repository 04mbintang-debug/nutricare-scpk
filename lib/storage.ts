import type { PatientInput } from "./types";
import { DEFAULT_PATIENT_INPUT } from "./data";

const STORAGE_KEY = "nutricare-patient-input";

export function savePatientInput(input: PatientInput): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(input));
}

export function loadPatientInput(): PatientInput {
  if (typeof window === "undefined") return DEFAULT_PATIENT_INPUT;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PATIENT_INPUT;
    return { ...DEFAULT_PATIENT_INPUT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PATIENT_INPUT;
  }
}
