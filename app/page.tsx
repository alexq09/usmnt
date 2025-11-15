import {
  getTeamStats,
  getTopPerformers,
  getMatchTrends,
  getResultCorrelationMetrics,
} from "@/lib/dashboard-data";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { TeamCharts } from "@/components/dashboard/TeamCharts";
import { WinLossDrivers } from "@/components/dashboard/WinLossDrivers";

export default async function Home() {
  const [teamStats, topPerformers, matchTrends, correlationMetrics] = await Promise.all([
    getTeamStats(),
    getTopPerformers(),
    getMatchTrends(),
    getResultCorrelationMetrics(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            USMNT Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Team performance insights and player analytics since the 2022 World Cup
          </p>
        </div>

        <div className="space-y-10">
          <StatsCards stats={teamStats} />

          <TopPerformers
            topScorers={topPerformers.topScorers}
            topAssisters={topPerformers.topAssisters}
            topRated={topPerformers.topRated}
          />

          <TeamCharts matchTrends={matchTrends} />

          <WinLossDrivers metrics={correlationMetrics} />
        </div>
      </div>
    </div>
  );
}
