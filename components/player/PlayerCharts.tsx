"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/lib/database.types";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PlayerChartsProps {
  timeline: Tables<"player_match_timeline">[];
}

interface ChartDataPoint {
  date: string;
  opponent: string;
  matchRating: number | null;
  passCompletion: number | null;
  defActions: number | null;
}

export function PlayerCharts({ timeline }: PlayerChartsProps) {
  const sortedTimeline = [...timeline].sort((a, b) => {
    const dateA = a.kickoff_utc ? new Date(a.kickoff_utc).getTime() : 0;
    const dateB = b.kickoff_utc ? new Date(b.kickoff_utc).getTime() : 0;
    return dateA - dateB;
  });

  const chartData: ChartDataPoint[] = sortedTimeline.map((match) => ({
    date: match.kickoff_utc
      ? new Date(match.kickoff_utc).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        })
      : "Unknown",
    opponent: match.opponent_name || "Unknown",
    matchRating: match.match_rating,
    passCompletion: match.pass_completion_pct,
    defActions: match.def_actions_per_90,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ChartDataPoint; color: string; name: string; value: number }[] }) => {
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
              {entry.name}: {entry.value?.toFixed(2) || "N/A"}
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
        Performance Timeline
      </h2>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Match Rating Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis
                dataKey="date"
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <YAxis
                domain={[0, 10]}
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="matchRating"
                name="Match Rating"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Pass Completion Rate Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis
                dataKey="date"
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <YAxis
                domain={[0, 100]}
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="passCompletion"
                name="Pass Completion %"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Defensive Actions per 90 Minutes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis
                dataKey="date"
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="defActions"
                name="Defensive Actions / 90"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="#f59e0b"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
