import { CRITERIA, formatNumber } from "@/lib/data";
import type { SawResult, TopsisResult } from "@/lib/types";
import { RankBadge } from "@/components/RankBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SawRankingTableProps {
  results: SawResult[];
}

export function SawRankingTable({ results }: SawRankingTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hasil SAW</CardTitle>
        <CardDescription>
          Normalisasi linear + skor terbobot Vᵢ = Σ(wⱼ · rᵢⱼ)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Alt</TableHead>
              <TableHead>Nama</TableHead>
              {CRITERIA.map((c) => (
                <TableHead key={c.code} className="whitespace-nowrap">
                  r ({c.code})
                </TableHead>
              ))}
              <TableHead>Skor V</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow
                key={row.id}
                className={row.rank === 1 ? "bg-amber-50/60" : undefined}
              >
                <TableCell>
                  <RankBadge rank={row.rank} />
                </TableCell>
                <TableCell className="font-semibold text-teal-800">
                  {row.id}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium">
                  {row.name}
                </TableCell>
                {row.normalized.map((val, i) => (
                  <TableCell key={i}>{formatNumber(val)}</TableCell>
                ))}
                <TableCell className="font-semibold text-teal-800">
                  {formatNumber(row.score)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface TopsisRankingTableProps {
  results: TopsisResult[];
}

export function TopsisRankingTable({ results }: TopsisRankingTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hasil TOPSIS</CardTitle>
        <CardDescription>
          Jarak ke solusi ideal positif/negatif & nilai preferensi Vᵢ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Alt</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>D+</TableHead>
              <TableHead>D−</TableHead>
              <TableHead>Preferensi V</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow
                key={row.id}
                className={row.rank === 1 ? "bg-amber-50/60" : undefined}
              >
                <TableCell>
                  <RankBadge rank={row.rank} />
                </TableCell>
                <TableCell className="font-semibold text-teal-800">
                  {row.id}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium">
                  {row.name}
                </TableCell>
                <TableCell>{formatNumber(row.distancePositive)}</TableCell>
                <TableCell>{formatNumber(row.distanceNegative)}</TableCell>
                <TableCell className="font-semibold text-teal-800">
                  {formatNumber(row.preference)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
