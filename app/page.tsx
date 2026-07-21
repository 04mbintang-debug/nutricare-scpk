import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CRITERIA, ALTERNATIVES } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-white/70 px-6 py-12 shadow-sm sm:px-10 sm:py-16 lg:px-14">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <Badge variant="secondary" className="mb-4">
            Sistem Pendukung Keputusan · MADM
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-teal-950 sm:text-5xl">
            NutriCare Decision Support
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Prototype SPK rekomendasi menu harian terbaik untuk penderita
            penyakit kronis — diabetes, hipertensi, gagal ginjal, dan penyakit
            jantung — menggunakan metode{" "}
            <strong className="text-teal-800">SAW</strong> dan{" "}
            <strong className="text-teal-800">TOPSIS</strong> dengan kriteria
            dari parameter pasien (BB, TB, umur, budget).
          </p>
          <p className="mt-3 text-slate-600">
            Bukan alat diagnosis medis. Kandungan gula, natrium, dan serat
            ditampilkan sebagai informasi nutrisi pendukung — bukan sebagai
            kriteria MADM.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/input">
                Mulai Rekomendasi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tentang">Pelajari Metode</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Untuk Siapa?
          </h2>
          <p className="mt-1 text-slate-600">
            Digunakan sebagai alat bantu edukasi dan diskusi klinis, bukan
            pengganti konsultasi profesional.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: HeartPulse,
              title: "Pasien & Keluarga",
              desc: "Membandingkan opsi menu harian sesuai pantangan & anggaran.",
            },
            {
              icon: ClipboardList,
              title: "Ahli Gizi",
              desc: "Menjelaskan trade-off kriteria gizi secara transparan.",
            },
            {
              icon: Stethoscope,
              title: "Dokter",
              desc: "Mendukung edukasi pola makan bersama pasien kronis.",
            },
            {
              icon: Users,
              title: "Klinik / RS",
              desc: "Demo SPK untuk layanan gizi preventif & edukasi.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="pb-2">
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alur Kerja Sistem</CardTitle>
            <CardDescription>Tiga langkah sederhana hingga rekomendasi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                step: "1",
                title: "Input data pasien",
                desc: "Penyakit, antropometri, anggaran, preferensi, dan bobot kriteria.",
              },
              {
                step: "2",
                title: "Hitung MADM",
                desc: "Matriks keputusan diproses dengan algoritma SAW & TOPSIS di browser.",
              },
              {
                step: "3",
                title: "Bandingkan hasil",
                desc: "Lihat ranking, skor, grafik, dan alasan rekomendasi menu terbaik.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {s.step}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{s.title}</p>
                  <p className="text-sm text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pemodelan MADM</CardTitle>
            <CardDescription>
              {CRITERIA.length} kriteria dari parameter pasien ·{" "}
              {ALTERNATIVES.length} alternatif menu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {CRITERIA.map((c) => (
              <div
                key={c.code}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-semibold text-teal-800">{c.code}</span>{" "}
                  {c.name}
                  <p className="mt-0.5 text-xs text-slate-400">{c.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={c.type === "benefit" ? "benefit" : "cost"}>
                    {c.type}
                  </Badge>
                  <span className="font-medium text-slate-700">
                    {(c.weight * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="border-amber-200 bg-amber-50/60">
        <CardContent className="flex gap-3 p-5">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="text-sm text-amber-950">
            <p className="font-semibold">Disclaimer medis</p>
            <p className="mt-1 leading-relaxed">
              NutriCare Decision Support adalah prototype edukasi SPK. Hasil
              rekomendasi tidak menggantikan diagnosis, resep diet, atau
              keputusan klinis dari dokter/ahli gizi. Selalu konsultasikan
              perubahan pola makan dengan tenaga kesehatan yang kompeten.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
