import { PatientInputForm } from "@/components/PatientInputForm";

export default function InputPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          Input Data Pasien & Preferensi
        </h1>
        <p className="mt-1 max-w-2xl text-slate-600">
          Lengkapi data berikut. Bobot kriteria dapat disesuaikan dan akan
          otomatis dinormalisasi agar total = 100% sebelum perhitungan SAW &
          TOPSIS.
        </p>
      </div>
      <PatientInputForm />
    </div>
  );
}
