import { TournamentMapClient } from "@/components/tournament/TournamentMapClient";
import { supabase } from "@/lib/supabase/supabase";

export default async function TournamentMapPage() {
  const [locationsResult, edgesResult] = await Promise.all([
    supabase
      .from("tournament_map_locations")
      .select("*")
      .order("display_order"),
    supabase
      .from("tournament_map_edges")
      .select("*")
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Tournament Map
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore the USMNT tournament journey across different scenarios
          </p>
        </div>
        <TournamentMapClient
          locations={locationsResult.data || []}
          edges={edgesResult.data || []}
        />
      </div>
    </div>
  );
}
