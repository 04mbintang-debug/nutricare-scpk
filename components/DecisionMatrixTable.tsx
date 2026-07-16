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

export function DecisionMatrixTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriks Keputusan</CardTitle>
        <CardDescription>
          Data mentah alternatif menu berdasarkan 5 kriteria MADM (default seed
          data).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
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
            {ALTERNATIVES.map((alt) => (
              <TableRow key={alt.id}>
                <TableCell className="font-semibold text-teal-800">
                  {alt.id}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {alt.name}
                </TableCell>
                <TableCell>{alt.values.sugar}</TableCell>
                <TableCell>{alt.values.sodium}</TableCell>
                <TableCell>{alt.values.fiber}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(alt.values.price)}
                </TableCell>
                <TableCell>{alt.values.ease}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
