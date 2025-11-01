import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamStats } from "@/lib/dashboard-data";

interface StatsCardsProps {
  stats: TeamStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Matches Played
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats.matchesPlayed}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Record: {stats.wins}W-{stats.draws}D-{stats.losses}L
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats.goalsFor} - {stats.goalsAgainst}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Difference: {stats.goalDifference > 0 ? "+" : ""}
            {stats.goalDifference}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Averages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats.avgGoalsPerMatch.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Goals per match
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Clean Sheets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats.cleanSheets}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            {stats.matchesPlayed > 0
              ? `${((stats.cleanSheets / stats.matchesPlayed) * 100).toFixed(1)}%`
              : "0%"}{" "}
            of matches
          </p>
        </CardContent>
      </Card>

      {stats.avgPossession !== null && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Avg Possession
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {stats.avgPossession.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Team average
            </p>
          </CardContent>
        </Card>
      )}

      {stats.avgPlayerRating !== null && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Avg Player Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {stats.avgPlayerRating.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Across all players
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
