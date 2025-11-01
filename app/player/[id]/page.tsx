import { supabase } from "@/lib/supabase/supabase";
import { notFound } from "next/navigation";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { StatsGrid } from "@/components/player/StatsGrid";
import { PlayerCharts } from "@/components/player/PlayerCharts";

interface PlayerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { id } = await params;
  const playerId = parseInt(id);

  if (isNaN(playerId)) {
    notFound();
  }

  const [summaryResult, timelineResult] = await Promise.all([
    supabase
      .from("player_advanced_summary")
      .select("*")
      .eq("player_id", playerId)
      .maybeSingle(),
    supabase
      .from("player_match_timeline")
      .select("*")
      .eq("player_id", playerId)
      .order("kickoff_utc", { ascending: true }),
  ]);

  if (summaryResult.error || !summaryResult.data) {
    notFound();
  }

  const summary = summaryResult.data;
  const timeline = timelineResult.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <PlayerHeader
          fullName={summary.full_name || "Unknown Player"}
          position={summary.position || "N/A"}
          matchesPlayed={summary.matches_played || 0}
          totalMinutes={summary.total_minutes || 0}
          avgRating={summary.avg_match_rating || 0}
        />

        <StatsGrid summary={summary} />

        <PlayerCharts timeline={timeline} />
      </div>
    </div>
  );
}
