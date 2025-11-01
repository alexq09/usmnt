"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchTrend } from "@/lib/dashboard-data";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TeamChartsProps {
  matchTrends: MatchTrend[];
}

interface ChartDataPoint {
  date: string;
  opponent: string;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export function TeamCharts({ matchTrends }: TeamChartsProps) {
  const chartData: ChartDataPoint[] = matchTrends.map((match) => ({
    date: match.date
      ? new Date(match.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        })
      : "Unknown",
    opponent: match.opponent,
    goalsFor: match.goalsFor,
    goalsAgainst: match.goalsAgainst,
    points: match.points,
  }));

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: {
      payload: ChartDataPoint;
      color: string;
      name: string;
      value: number;
    }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            vs {data.opponent}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {data.date}
          </p>
          {payload.map((entry, index: number) => (
            <p
              key={index}
              className="text-sm mt-1"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Team Performance Trends
      </h2>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Goals For vs Goals Against
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-200 dark:stroke-slate-800"
              />
              <XAxis
                dataKey="date"
                className="text-xs text-slate-600 dark:text-slate-400"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="goalsFor"
                name="Goals For"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="goalsAgainst"
                name="Goals Against"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Points Per Match (W=3, D=1, L=0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-200 dark:stroke-slate-800"
              />
              <XAxis
                dataKey="date"
                className="text-xs text-slate-600 dark:text-slate-400"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, 3]}
                ticks={[0, 1, 2, 3]}
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="points"
                name="Points"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
