import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SAW_STEPS = [
  {
    title: "Normalisasi matriks R",
    detail:
      "Benefit: rᵢⱼ = xᵢⱼ / max(xⱼ). Cost: rᵢⱼ = min(xⱼ) / xᵢⱼ. Semua nilai berada di rentang 0–1.",
  },
  {
    title: "Hitung skor terbobot",
    detail: "Vᵢ = Σ (wⱼ · rᵢⱼ) untuk setiap alternatif i.",
  },
  {
    title: "Ranking",
    detail: "Urutkan Vᵢ dari terbesar ke terkecil. Skor tertinggi = rekomendasi terbaik.",
  },
];

const TOPSIS_STEPS = [
  {
    title: "Normalisasi vektor",
    detail: "rᵢⱼ = xᵢⱼ / √(Σ xᵢⱼ²) per kolom kriteria j.",
  },
  {
    title: "Matriks terbobot",
    detail: "yᵢⱼ = wⱼ · rᵢⱼ.",
  },
  {
    title: "Solusi ideal A+ & A−",
    detail:
      "Benefit: A+ = max(yⱼ), A− = min(yⱼ). Cost: A+ = min(yⱼ), A− = max(yⱼ).",
  },
  {
    title: "Jarak & preferensi",
    detail:
      "D+ᵢ dan D−ᵢ dihitung dengan jarak Euclidean. Vᵢ = D−ᵢ / (D+ᵢ + D−ᵢ). Ranking descending.",
  },
];

export default function TentangPage() {
  return (
    <div className="space-y-10">
      <div>
        <Badge variant="secondary" className="mb-3">
          Edukasi Metode MADM
        </Badge>
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          Tentang Metode SAW & TOPSIS
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Kedua metode termasuk Multi-Attribute Decision Making (MADM) yang
          membantu memilih alternatif terbaik berdasarkan kriteria pasien:{" "}
          kesesuaian BB, TB, umur (benefit), dan budget/harga (cost).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SAW — Simple Additive Weighting</CardTitle>
            <CardDescription>
              Metode penjumlahan terbobot yang sederhana dan mudah diinterpretasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SAW_STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TOPSIS</CardTitle>
            <CardDescription>
              Technique for Order Preference by Similarity to Ideal Solution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TOPSIS_STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-teal-200 bg-teal-50/40">
        <CardHeader>
          <CardTitle>Kapan ranking bisa berbeda?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-slate-700">
          <p>
            SAW menilai kontribusi linear tiap kriteria. TOPSIS menilai
            kedekatan relatif terhadap solusi ideal. Jika satu alternatif unggul
            di beberapa kriteria tetapi lemah di kriteria cost penting, SAW dan
            TOPSIS dapat memberi urutan yang berbeda.
          </p>
          <p>
            Menampilkan keduanya berdampingan membantu pengguna memahami
            sensitivitas keputusan dan tidak bergantung pada satu metode saja.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild size="lg">
          <Link href="/input">
            Coba Rekomendasi Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
