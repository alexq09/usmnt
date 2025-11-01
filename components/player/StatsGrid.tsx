import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/lib/database.types";

interface StatsGridProps {
  summary: Tables<"player_advanced_summary">;
}

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
}

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsGrid({ summary }: StatsGridProps) {
  const formatPercentage = (value: number | null) => {
    if (value === null) return "N/A";
    return `${value.toFixed(1)}%`;
  };

  const formatDecimal = (value: number | null, decimals = 2) => {
    if (value === null) return "N/A";
    return value.toFixed(decimals);
  };

  const formatInteger = (value: number | null) => {
    if (value === null) return "N/A";
    return value.toString();
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Advanced Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Goals"
          value={formatInteger(summary.total_goals)}
        />
        <StatCard
          label="Total Assists"
          value={formatInteger(summary.total_assists)}
        />
        <StatCard
          label="Goal Involvements per 90"
          value={formatDecimal(summary.goal_involvements_per_90)}
          description="Goals + Assists per 90 minutes"
        />
        <StatCard
          label="Pass Completion"
          value={formatPercentage(summary.pass_completion_pct)}
        />
        <StatCard
          label="Passes per 90"
          value={formatDecimal(summary.passes_per_90, 1)}
        />
        <StatCard
          label="Chances Created per 90"
          value={formatDecimal(summary.chances_created_per_90)}
        />
        <StatCard
          label="Tackles per 90"
          value={formatDecimal(summary.tackles_per_90)}
        />
        <StatCard
          label="Interceptions per 90"
          value={formatDecimal(summary.interceptions_per_90)}
        />
        <StatCard
          label="Duel Win %"
          value={formatPercentage(summary.duel_win_pct)}
        />
        <StatCard
          label="Average Match Rating"
          value={formatDecimal(summary.avg_match_rating)}
        />
        <StatCard
          label="Minutes per Match"
          value={formatDecimal(summary.minutes_per_match, 1)}
        />
        <StatCard
          label="Goal Contribution %"
          value={formatPercentage(summary.pct_matches_with_goal_contrib)}
          description="% of matches with goal or assist"
        />
      </div>
    </div>
  );
}
