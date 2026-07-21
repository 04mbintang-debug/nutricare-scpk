import { Scale, Ruler, CalendarDays, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CRITERION_ICONS: Record<string, LucideIcon> = {
  C1: Scale,
  C2: Ruler,
  C3: CalendarDays,
  C4: Wallet,
};

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
        #1 Emas
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
        #2 Perak
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center rounded-md border border-orange-300 bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-900">
        #3 Perunggu
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600">
      #{rank}
    </span>
  );
}
