import { createClient } from "@/lib/supabase/supabase";

export interface Player {
  full_name: string;
  position: string;
  matches_played: number;
  total_goals: number;
  total_assists: number;
  avg_match_rating: number;
}

export interface RosterPlayer extends Player {
  player_id: string;
  position_group: string;
  sort_order: number;
}

export interface Roster {
  id: string;
  roster_name: string;
  created_at: string;
  updated_at: string;
  session_id: string;
  selections?: RosterPlayer[];
}

export async function getAllPlayers(): Promise<Player[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("player_advanced_summary")
    .select("full_name, position, matches_played, total_goals, total_assists, avg_match_rating")
    .order("matches_played", { ascending: false });

  if (error) throw error;

  return (data || []).map(player => ({
    full_name: player.full_name || "Unknown",
    position: player.position || "N/A",
    matches_played: player.matches_played || 0,
    total_goals: player.total_goals || 0,
    total_assists: player.total_assists || 0,
    avg_match_rating: player.avg_match_rating || 0,
  }));
}

export async function createRoster(sessionId: string, rosterName: string): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_rosters")
    .insert({
      roster_name: rosterName,
      session_id: sessionId,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function addPlayerToRoster(
  rosterId: string,
  playerId: string,
  positionGroup: string,
  sortOrder: number
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("roster_selections").insert({
    roster_id: rosterId,
    player_id: playerId,
    position_group: positionGroup,
    sort_order: sortOrder,
  });

  if (error) throw error;
}

export async function removePlayerFromRoster(
  rosterId: string,
  playerId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("roster_selections")
    .delete()
    .eq("roster_id", rosterId)
    .eq("player_id", playerId);

  if (error) throw error;
}

export async function getRosterWithSelections(rosterId: string): Promise<Roster | null> {
  const supabase = createClient();

  const { data: roster, error: rosterError } = await supabase
    .from("user_rosters")
    .select("*")
    .eq("id", rosterId)
    .maybeSingle();

  if (rosterError) throw rosterError;
  if (!roster) return null;

  const { data: selections, error: selectionsError } = await supabase
    .from("roster_selections")
    .select("*")
    .eq("roster_id", rosterId)
    .order("sort_order");

  if (selectionsError) throw selectionsError;

  const playerIds = selections?.map((s) => s.player_id) || [];
  const { data: players } = await supabase
    .from("player_advanced_summary")
    .select("full_name, position, matches_played, total_goals, total_assists, avg_match_rating")
    .in("full_name", playerIds);

  const playerMap = new Map(players?.map((p) => [p.full_name, p]) || []);

  return {
    ...roster,
    selections: selections?.map((s) => {
      const player = playerMap.get(s.player_id);
      return {
        player_id: s.player_id,
        position_group: s.position_group,
        sort_order: s.sort_order,
        full_name: player?.full_name || s.player_id,
        position: player?.position || "",
        matches_played: player?.matches_played || 0,
        total_goals: player?.total_goals || 0,
        total_assists: player?.total_assists || 0,
        avg_match_rating: player?.avg_match_rating || 0,
      };
    }),
  };
}

export async function updateRosterName(rosterId: string, newName: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_rosters")
    .update({ roster_name: newName, updated_at: new Date().toISOString() })
    .eq("id", rosterId);

  if (error) throw error;
}

export function getPositionGroup(position: string): string {
  const posUpper = position.toUpperCase();
  if (posUpper.includes("GK")) return "GK";
  if (posUpper.includes("DEF") || posUpper.includes("CB") || posUpper.includes("LB") || posUpper.includes("RB")) return "DEF";
  if (posUpper.includes("MID") || posUpper.includes("CM") || posUpper.includes("DM") || posUpper.includes("AM")) return "MID";
  return "FWD";
}
