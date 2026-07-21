"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  CRITERIA,
  DEFAULT_PATIENT_INPUT,
  DISEASE_OPTIONS,
  PREFERENCE_OPTIONS,
} from "@/lib/data";
import { savePatientInput } from "@/lib/storage";
import type { PatientInput } from "@/lib/types";
import { CRITERION_ICONS } from "@/components/RankBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function parsePositiveNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (cleaned === "" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function PatientInputForm() {
  const router = useRouter();
  const [form, setForm] = useState<PatientInput>(DEFAULT_PATIENT_INPUT);
  const [loading, setLoading] = useState(false);
  const [ageText, setAgeText] = useState(String(DEFAULT_PATIENT_INPUT.age));
  const [weightText, setWeightText] = useState(
    String(DEFAULT_PATIENT_INPUT.weight)
  );
  const [heightText, setHeightText] = useState(
    String(DEFAULT_PATIENT_INPUT.height)
  );
  const [budgetText, setBudgetText] = useState(
    String(DEFAULT_PATIENT_INPUT.budget)
  );

  const weightTotal = useMemo(
    () => Object.values(form.weights).reduce((a, b) => a + b, 0),
    [form.weights]
  );

  const normalizedPreview = useMemo(() => {
    if (weightTotal === 0) return form.weights;
    const result: Record<string, number> = {};
    for (const [k, v] of Object.entries(form.weights)) {
      result[k] = (v / weightTotal) * 100;
    }
    return result;
  }, [form.weights, weightTotal]);

  function updateWeight(code: string, value: number) {
    setForm((prev) => ({
      ...prev,
      weights: { ...prev.weights, [code]: value },
    }));
  }

  function togglePreference(pref: string) {
    setForm((prev) => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((p) => p !== pref)
          : [...prev.preferences, pref],
      };
    });
  }

  function handleReset() {
    setForm(DEFAULT_PATIENT_INPUT);
    setAgeText(String(DEFAULT_PATIENT_INPUT.age));
    setWeightText(String(DEFAULT_PATIENT_INPUT.weight));
    setHeightText(String(DEFAULT_PATIENT_INPUT.height));
    setBudgetText(String(DEFAULT_PATIENT_INPUT.budget));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const age = parsePositiveNumber(ageText);
    const weight = parsePositiveNumber(weightText);
    const height = parsePositiveNumber(heightText);
    const budget = parsePositiveNumber(budgetText);

    if (age === null || age < 1 || age > 120) {
      alert("Usia harus diisi angka 1–120.");
      return;
    }
    if (weight === null || weight <= 0) {
      alert("Berat badan harus diisi angka lebih dari 0.");
      return;
    }
    if (height === null || height <= 0) {
      alert("Tinggi badan harus diisi angka lebih dari 0.");
      return;
    }
    if (budget === null || budget < 0) {
      alert("Anggaran makanan harus diisi angka yang valid.");
      return;
    }

    setLoading(true);
    const payload: PatientInput = {
      ...form,
      age,
      weight,
      height,
      budget,
      weights: Object.fromEntries(
        Object.entries(normalizedPreview).map(([k, v]) => [
          k,
          Math.round(v * 10) / 10,
        ])
      ),
    };
    savePatientInput(payload);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/hasil");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Pasien</CardTitle>
          <CardDescription>
            Informasi dasar untuk menyesuaikan konteks rekomendasi menu.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="disease">Jenis Penyakit Kronis</Label>
            <select
              id="disease"
              value={form.disease}
              onChange={(e) => setForm({ ...form, disease: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              required
            >
              {DISEASE_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Usia (tahun)</Label>
            <Input
              id="age"
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 45"
              value={ageText}
              onChange={(e) => setAgeText(e.target.value.replace(/[^\d]/g, ""))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Berat Badan (kg)</Label>
            <Input
              id="weight"
              type="text"
              inputMode="decimal"
              placeholder="Contoh: 70"
              value={weightText}
              onChange={(e) =>
                setWeightText(e.target.value.replace(/[^\d.]/g, ""))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Tinggi Badan (cm)</Label>
            <Input
              id="height"
              type="text"
              inputMode="decimal"
              placeholder="Contoh: 165"
              value={heightText}
              onChange={(e) =>
                setHeightText(e.target.value.replace(/[^\d.]/g, ""))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Anggaran Makanan (Rp)</Label>
            <Input
              id="budget"
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 50000"
              value={budgetText}
              onChange={(e) =>
                setBudgetText(e.target.value.replace(/[^\d]/g, ""))
              }
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferensi & Pantangan</CardTitle>
          <CardDescription>
            Pilih preferensi yang relevan, atau tulis catatan tambahan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PREFERENCE_OPTIONS.map((pref) => (
              <label
                key={pref}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5 text-sm hover:border-teal-200"
              >
                <Checkbox
                  checked={form.preferences.includes(pref)}
                  onCheckedChange={() => togglePreference(pref)}
                />
                {pref}
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan pantangan lain (opsional)</Label>
            <Input
              id="notes"
              placeholder="Contoh: alergi kacang, tanpa susu..."
              value={form.preferenceNotes}
              onChange={(e) =>
                setForm({ ...form, preferenceNotes: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bobot Kriteria (dari parameter pasien)</CardTitle>
          <CardDescription>
            Sesuaikan prioritas C1–C4 (BB, TB, umur, budget). Total otomatis
            dinormalisasi menjadi 100% saat perhitungan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg bg-teal-50 px-4 py-3 text-sm">
            <span className="text-teal-800">Total bobot saat ini</span>
            <span className="font-semibold text-teal-900">
              {weightTotal.toFixed(0)}% → dinormalisasi ke 100%
            </span>
          </div>
          {CRITERIA.map((c) => {
            const Icon = CRITERION_ICONS[c.code];
            return (
              <div key={c.code} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-teal-700" />
                    {c.code} — {c.name}
                    <span className="text-xs font-normal text-slate-400">
                      ({c.type})
                    </span>
                  </Label>
                  <span className="text-sm font-semibold text-teal-800">
                    {form.weights[c.code]}% →{" "}
                    {normalizedPreview[c.code]?.toFixed(1)}%
                  </span>
                </div>
                <Slider
                  value={[form.weights[c.code]]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={([v]) => updateWeight(c.code, v)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={loading}
        >
          Reset Default
        </Button>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menghitung rekomendasi...
            </>
          ) : (
            "Lihat Rekomendasi"
          )}
        </Button>
      </div>
    </form>
  );
}
