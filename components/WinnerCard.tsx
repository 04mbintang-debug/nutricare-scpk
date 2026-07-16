import { Trophy, Sparkles } from "lucide-react";
import type { Alternative, SawResult, TopsisResult } from "@/lib/types";
import { formatCurrency } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WinnerCardProps {
  method: "SAW" | "TOPSIS";
  result: SawResult | TopsisResult;
  alternative: Alternative;
  reasons: string[];
}

export function WinnerCard({
  method,
  result,
  alternative,
  reasons,
}: WinnerCardProps) {
  const score =
    method === "SAW"
      ? (result as SawResult).score
      : (result as TopsisResult).preference;

  return (
    <Card className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-white to-teal-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="gold" className="mb-2 gap-1">
              <Trophy className="h-3 w-3" />
              Juara {method}
            </Badge>
            <CardTitle className="break-words text-xl text-teal-900">
              {alternative.id} — {alternative.name}
            </CardTitle>
            <CardDescription className="mt-1">
              Skor {method}: {score.toFixed(4)} · Ranking #{result.rank}
            </CardDescription>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Trophy className="h-6 w-6" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm min-[480px]:grid-cols-3 sm:grid-cols-5">
          <Metric label="Gula" value={`${alternative.values.sugar} g`} />
          <Metric label="Natrium" value={`${alternative.values.sodium} mg`} />
          <Metric label="Serat" value={`${alternative.values.fiber} g`} />
          <Metric label="Harga" value={formatCurrency(alternative.values.price)} />
          <Metric
            label="Kemudahan"
            value={`${alternative.values.ease}/5`}
            className="col-span-2 min-[480px]:col-span-1 sm:col-span-1"
          />
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            <Sparkles className="h-4 w-4 text-teal-600" />
            Mengapa direkomendasikan?
          </p>
          <ul className="space-y-1.5">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="flex gap-2 text-sm text-slate-600 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-teal-500"
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-teal-100 bg-white/80 px-2.5 py-2 ${className ?? ""}`}
    >
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="break-words text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
