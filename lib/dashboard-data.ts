import { createClient } from "@/lib/supabase/supabase";

export interface TeamStats {
  matchesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  wins: number;
  draws: number;
  losses: number;
  cleanSheets: number;
  avgGoalsPerMatch: number;
  avgPossession: number | null;
  avgPlayerRating: number | null;
}

export interface TopPerformer {
  full_name: string | null;
  position: string | null;
  value: number;
}

export interface MatchTrend {
  date: string;
  opponent: string;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export async function getTeamStats(): Promise<TeamStats> {
  const supabase = createClient();

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .eq("finished", true);

  if (matchesError) throw matchesError;

  const matchesPlayed = matches?.length || 0;
  const goalsFor = matches?.reduce((sum, m) => sum + (m.usa_score || 0), 0) || 0;
  const goalsAgainst = matches?.reduce((sum, m) => sum + (m.opponent_score || 0), 0) || 0;
  const goalDifference = goalsFor - goalsAgainst;

  const wins = matches?.filter((m) => m.result_char === "W").length || 0;
  const draws = matches?.filter((m) => m.result_char === "D").length || 0;
  const losses = matches?.filter((m) => m.result_char === "L").length || 0;

  const cleanSheets = matches?.filter((m) => m.opponent_score === 0).length || 0;

  const avgGoalsPerMatch = matchesPlayed > 0 ? goalsFor / matchesPlayed : 0;

  const matchesWithPossession = matches?.filter((m) => m.possession_pct !== null) || [];
  const avgPossession =
    matchesWithPossession.length > 0
      ? matchesWithPossession.reduce((sum, m) => sum + (m.possession_pct || 0), 0) /
        matchesWithPossession.length
      : null;

  const { data: playerStats, error: statsError } = await supabase
    .from("player_match_stats")
    .select("match_rating");

  if (statsError) throw statsError;

  const ratingsWithValues = playerStats?.filter((s) => s.match_rating !== null) || [];
  const avgPlayerRating =
    ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, s) => sum + (s.match_rating || 0), 0) /
        ratingsWithValues.length
      : null;

  return {
    matchesPlayed,
    goalsFor,
    goalsAgainst,
    goalDifference,
    wins,
    draws,
    losses,
    cleanSheets,
    avgGoalsPerMatch,
    avgPossession,
    avgPlayerRating,
  };
}

export async function getTopPerformers() {
  const supabase = createClient();

  const { data: topScorers } = await supabase
    .from("player_advanced_summary")
    .select("full_name, position, total_goals")
    .order("total_goals", { ascending: false, nullsFirst: false })
    .limit(5);

  const { data: topAssisters } = await supabase
    .from("player_advanced_summary")
    .select("full_name, position, total_assists")
    .order("total_assists", { ascending: false, nullsFirst: false })
    .limit(5);

  const { data: topRated } = await supabase
    .from("player_advanced_summary")
    .select("full_name, position, avg_match_rating")
    .order("avg_match_rating", { ascending: false, nullsFirst: false })
    .limit(5);

  return {
    topScorers: (topScorers || []).map((p) => ({
      full_name: p.full_name,
      position: p.position,
      value: p.total_goals || 0,
    })),
    topAssisters: (topAssisters || []).map((p) => ({
      full_name: p.full_name,
      position: p.position,
      value: p.total_assists || 0,
    })),
    topRated: (topRated || []).map((p) => ({
      full_name: p.full_name,
      position: p.position,
      value: p.avg_match_rating || 0,
    })),
  };
}

export async function getMatchTrends(): Promise<MatchTrend[]> {
  const supabase = createClient();

  const { data: matches, error } = await supabase
    .from("matches")
    .select("kickoff_utc, opponent_name, usa_score, opponent_score, result_char")
    .eq("finished", true)
    .order("kickoff_utc", { ascending: true });

  if (error) throw error;

  return (matches || []).map((match) => {
    let points = 0;
    if (match.result_char === "W") points = 3;
    else if (match.result_char === "D") points = 1;

    return {
      date: match.kickoff_utc || "",
      opponent: match.opponent_name || "Unknown",
      goalsFor: match.usa_score || 0,
      goalsAgainst: match.opponent_score || 0,
      points,
    };
  });
}
