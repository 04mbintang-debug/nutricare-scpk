"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info, Loader2, RefreshCw } from "lucide-react";
import { getDecisionMatrix, normalizeWeights } from "@/lib/data";
import { calculateSAW } from "@/lib/saw";
import { calculateTOPSIS } from "@/lib/topsis";
import { getWinnerReasons } from "@/lib/reasons";
import { loadPatientInput } from "@/lib/storage";
import type { PatientInput } from "@/lib/types";
import { DecisionMatrixTable } from "@/components/DecisionMatrixTable";
import { SawRankingTable, TopsisRankingTable } from "@/components/RankingTable";
import { ComparisonChart } from "@/components/ComparisonChart";
import { WinnerCard } from "@/components/WinnerCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ResultsView() {
  const [patient, setPatient] = useState<PatientInput | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPatient(loadPatientInput());
      setReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const computation = useMemo(() => {
    if (!patient) return null;
    const weights = normalizeWeights(patient.weights);
    const matrix = getDecisionMatrix();
    const saw = calculateSAW(matrix, weights);
    const topsis = calculateTOPSIS(matrix, weights);
    const winners = getWinnerReasons(saw, topsis.results, patient);
    return { saw, topsis, winners, weights };
  }, [patient]);

  if (!ready || !patient || !computation) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-teal-800">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Menghitung rekomendasi MADM...</p>
      </div>
    );
  }

  const { saw, topsis, winners } = computation;
  const sameWinner = winners.saw.alternative.id === winners.topsis.alternative.id;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Hasil Rekomendasi
          </h1>
          <p className="mt-1 text-slate-600">
            Perbandingan SAW & TOPSIS untuk profil{" "}
            <span className="font-medium text-teal-800">{patient.disease}</span>
            , anggaran Rp {patient.budget.toLocaleString("id-ID")}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">Usia {patient.age} th</Badge>
            <Badge variant="secondary">{patient.weight} kg</Badge>
            <Badge variant="secondary">{patient.height} cm</Badge>
            {patient.preferences.map((p) => (
              <Badge key={p} variant="outline">
                {p}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/input">
              <ArrowLeft className="h-4 w-4" />
              Ubah Input
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/input">
              <RefreshCw className="h-4 w-4" />
              Hitung Ulang
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WinnerCard
          method="SAW"
          result={winners.saw.result}
          alternative={winners.saw.alternative}
          reasons={winners.saw.reasons}
        />
        <WinnerCard
          method="TOPSIS"
          result={winners.topsis.result}
          alternative={winners.topsis.alternative}
          reasons={winners.topsis.reasons}
        />
      </div>

      {sameWinner ? (
        <Card className="border-teal-200 bg-teal-50/50">
          <CardContent className="flex gap-3 p-4 text-sm text-teal-900">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            Kedua metode menyepakati menu terbaik yang sama:{" "}
            <strong>
              {winners.saw.alternative.id} — {winners.saw.alternative.name}
            </strong>
            . Konsensus ini memperkuat kepercayaan pada rekomendasi.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex gap-3 p-4 text-sm text-amber-950">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            SAW dan TOPSIS menghasilkan juara berbeda. Hal ini wajar karena
            pendekatan normalisasi & pengukuran kedekatan ke solusi ideal
            berbeda — bandingkan tabel dan grafik di bawah.
          </CardContent>
        </Card>
      )}

      <DecisionMatrixTable />

      <div className="grid gap-6 xl:grid-cols-2">
        <SawRankingTable results={saw} />
        <TopsisRankingTable results={topsis.results} />
      </div>

      <ComparisonChart saw={saw} topsis={topsis.results} />

      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Metode</CardTitle>
          <CardDescription>
            Mengapa ranking SAW dan TOPSIS bisa berbeda?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            <strong className="text-slate-800">SAW</strong> menormalisasi setiap
            kriteria secara linear (bagi max untuk benefit, min/nilai untuk
            cost), lalu menjumlahkan hasil terbobot. Metode ini intuitif dan
            cepat, tetapi sensitif terhadap skala ekstrem pada satu kriteria.
          </p>
          <p>
            <strong className="text-slate-800">TOPSIS</strong> menormalisasi
            vektor, membentuk solusi ideal positif & negatif, lalu mengukur
            kedekatan relatif tiap alternatif. Alternatif yang jauh dari solusi
            buruk dan dekat ke solusi ideal akan unggul — bahkan jika skor
            linear SAW-nya sedikit berbeda.
          </p>
          <p>
            Karena itu, ranking bisa berbeda meski data sama. Gunakan kedua
            hasil sebagai bahan pertimbangan bersama ahli gizi atau dokter —
            bukan sebagai diagnosis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
