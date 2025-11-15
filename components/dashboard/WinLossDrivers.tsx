"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultCorrelationMetric } from "@/lib/dashboard-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

interface WinLossDriversProps {
  metrics: ResultCorrelationMetric[];
}

const PERCENTAGE_METRICS = [
  "shot_accuracy",
  "pass_completion",
  "duel_win_pct",
  "possession_pct",
];

function isPercentageMetric(metricKey: string | null): boolean {
  if (!metricKey) return false;
  return PERCENTAGE_METRICS.includes(metricKey);
}

function formatValue(value: number | null, metricKey: string | null): string {
  if (value === null) return "-";
  if (isPercentageMetric(metricKey)) {
    return `${value.toFixed(1)}%`;
  }
  return value.toFixed(2);
}

export function WinLossDrivers({ metrics }: WinLossDriversProps) {
  const chartData = metrics.map((m) => ({
    metric: m.metric_label || "Unknown",
    delta: m.delta_win_loss || 0,
    metricKey: m.metric_key,
  }));

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          What Drives Wins vs Losses
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Positive values indicate metrics where the team performs better in wins compared to losses.
          Negative values show metrics more common in losses.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis
                type="number"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                type="category"
                dataKey="metric"
                className="text-xs"
                tick={{ fill: "currentColor" }}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                }}
                formatter={(value: number) => [value.toFixed(2), "Delta"]}
              />
              <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
              <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.delta >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  Metric
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  Avg Win
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  Avg Draw
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  Avg Loss
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-100">
                    {metric.metric_label || "Unknown"}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatValue(metric.avg_win, metric.metric_key)}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatValue(metric.avg_draw, metric.metric_key)}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatValue(metric.avg_loss, metric.metric_key)}
                  </td>
                  <td
                    className={`text-right py-3 px-4 font-semibold ${
                      (metric.delta_win_loss || 0) >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metric.delta_win_loss !== null
                      ? (metric.delta_win_loss >= 0 ? "+" : "") +
                        formatValue(metric.delta_win_loss, metric.metric_key)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
