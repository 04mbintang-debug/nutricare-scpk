"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SawResult, TopsisResult } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ComparisonChartProps {
  saw: SawResult[];
  topsis: TopsisResult[];
}

export function ComparisonChart({ saw, topsis }: ComparisonChartProps) {
  const byId = new Map(topsis.map((t) => [t.id, t]));

  const data = [...saw]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((s) => {
      const t = byId.get(s.id)!;
      return {
        name: s.id,
        fullName: s.name,
        "Skor SAW": Number(s.score.toFixed(4)),
        "Preferensi TOPSIS": Number(t.preference.toFixed(4)),
        rankSaw: s.rank,
        rankTopsis: t.rank,
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perbandingan Skor SAW vs TOPSIS</CardTitle>
        <CardDescription>
          Semakin tinggi batang skor, semakin baik. Ranking lengkap ada di
          tooltip saat hover.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis
                domain={[0, 1]}
                tick={{ fill: "#475569", fontSize: 12 }}
                label={{
                  value: "Skor",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#64748b", fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #ccfbf1",
                  fontSize: 13,
                }}
                formatter={(value, name, item) => {
                  const payload = item?.payload as
                    | (typeof data)[number]
                    | undefined;
                  const score = typeof value === "number" ? value.toFixed(4) : value;
                  if (name === "Skor SAW" && payload) {
                    return [`${score} (rank #${payload.rankSaw})`, "Skor SAW"];
                  }
                  if (name === "Preferensi TOPSIS" && payload) {
                    return [
                      `${score} (rank #${payload.rankTopsis})`,
                      "Preferensi TOPSIS",
                    ];
                  }
                  return [score, String(name)];
                }}
                labelFormatter={(label) => {
                  const key = String(label);
                  const item = data.find((d) => d.name === key);
                  return item ? `${key} — ${item.fullName}` : key;
                }}
              />
              <Legend />
              <Bar dataKey="Skor SAW" fill="#0f766e" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="Preferensi TOPSIS"
                fill="#14b8a6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
