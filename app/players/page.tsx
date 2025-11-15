import { supabase } from "@/lib/supabase/supabase";
import { PlayerGrid } from "@/components/player/PlayerGrid";

export default async function PlayersPage() {
  const { data: players } = await supabase
    .from("player_overview")
    .select("*")
    .order("total_minutes", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            USMNT Player Stats
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            All statistics compiled from matches after the 2022 World Cup. Click any player for detailed performance charts.
          </p>
        </div>
        <PlayerGrid players={players || []} />
      </div>
    </div>
  );
}
