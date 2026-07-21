import { ALTERNATIVES, CRITERIA, formatCurrency } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CRITERION_ICONS } from "@/components/RankBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DecisionMatrixTableProps {
  /** Matriks X hasil personalisasi pasien; default seed. */
  matrix?: number[][];
}

export function DecisionMatrixTable({ matrix }: DecisionMatrixTableProps) {
  const rows =
    matrix ??
    ALTERNATIVES.map((alt) =>
      CRITERIA.map((c) => alt.values[c.key])
    );

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Matriks Keputusan</CardTitle>
        <CardDescription>
          Evaluasi alternatif pada kriteria pasien (C1–C4). Gula, natrium, dan
          serat adalah info nutrisi, bukan kriteria MADM. Geser ke samping di HP
          untuk melihat semua kolom.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 overflow-hidden px-0 sm:px-6">
        <div className="mb-4 flex flex-wrap gap-2 px-6 sm:px-0">
          {CRITERIA.map((c) => {
            const Icon = CRITERION_ICONS[c.code];
            return (
              <Badge
                key={c.code}
                variant={c.type === "benefit" ? "benefit" : "cost"}
                className="gap-1"
              >
                <Icon className="h-3 w-3" />
                {c.code} · {c.type === "benefit" ? "Benefit" : "Cost"} ·{" "}
                {(c.weight * 100).toFixed(0)}%
              </Badge>
            );
          })}
        </div>
        <div className="min-w-0 overflow-x-auto px-6 sm:px-0 [-webkit-overflow-scrolling:touch]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alt</TableHead>
                <TableHead>Nama Menu</TableHead>
                {CRITERIA.map((c) => {
                  const Icon = CRITERION_ICONS[c.code];
                  return (
                    <TableHead key={c.code} className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Icon className="h-3.5 w-3.5" />
                        {c.code}
                      </span>
                      <div className="normal-case tracking-normal text-[10px] font-normal text-slate-400">
                        {c.name} ({c.unit})
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ALTERNATIVES.map((alt, i) => (
                <TableRow key={alt.id}>
                  <TableCell className="font-semibold text-teal-800">
                    {alt.id}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">
                    {alt.name}
                  </TableCell>
                  <TableCell>{rows[i][0]}</TableCell>
                  <TableCell>{rows[i][1]}</TableCell>
                  <TableCell>{rows[i][2]}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatCurrency(rows[i][3])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
