# NutriCare Decision Support

Prototype **Sistem Pendukung Keputusan (SPK)** rekomendasi menu harian untuk penderita penyakit kronis, menggunakan metode MADM **SAW** dan **TOPSIS** yang ditampilkan berdampingan.

> **Disclaimer:** Bukan alat diagnosis medis. Hasil rekomendasi bersifat edukatif dan harus dikonsultasikan dengan tenaga kesehatan.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + komponen bergaya shadcn/ui
- Recharts (perbandingan ranking)
- Perhitungan sepenuhnya di browser (tanpa database/backend)

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Script Lain

```bash
npm run build      # production build
npm run start      # jalankan hasil build
npm run verify     # sanity check algoritma SAW & TOPSIS
```

## Deploy ke Vercel

Tidak ada environment variable yang wajib.

**Opsi A — CLI**

```bash
npm i -g vercel
npx vercel --prod
```

**Opsi B — GitHub**

1. Push repo ke GitHub
2. Import project di [vercel.com/new](https://vercel.com/new)
3. Deploy (framework Next.js terdeteksi otomatis)

## Struktur Utama

```
app/           # halaman: /, /input, /hasil, /tentang
lib/           # data.ts, saw.ts, topsis.ts
components/    # UI + tabel + chart
```

## Alur Penggunaan

1. **Beranda** — gambaran sistem & disclaimer
2. **Input** — data pasien, preferensi, bobot kriteria (auto-normalisasi 100%)
3. **Hasil** — matriks keputusan, tabel SAW & TOPSIS, chart perbandingan, kartu menu terbaik
4. **Tentang** — penjelasan langkah metode SAW & TOPSIS
