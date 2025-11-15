"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchTrend } from "@/lib/dashboard-data";
import {
  LineChart,
  Line,
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
  rollingAvg5: number | null;
  rollingAvg10: number | null;
}

function calculateRollingAverage(data: number[], index: number, window: number): number | null {
  if (index < window - 1) return null;
  const slice = data.slice(Math.max(0, index - window + 1), index + 1);
  return slice.reduce((sum, val) => sum + val, 0) / slice.length;
}

export function TeamCharts({ matchTrends }: TeamChartsProps) {
  const points = matchTrends.map((match) => match.points);

  const chartData: ChartDataPoint[] = matchTrends.map((match, index) => ({
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
    rollingAvg5: calculateRollingAverage(points, index, 5),
    rollingAvg10: calculateRollingAverage(points, index, 10),
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
            Team Form - Rolling Average Points Per Match
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            5-match and 10-match rolling averages (W=3, D=1, L=0)
          </p>
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
              <YAxis
                domain={[0, 3]}
                ticks={[0, 0.5, 1, 1.5, 2, 2.5, 3]}
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="rollingAvg5"
                name="5-Match Avg"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="rollingAvg10"
                name="10-Match Avg"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
