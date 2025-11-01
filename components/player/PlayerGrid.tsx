"use client";

import { useState, useMemo } from "react";
import { PlayerCard } from "./PlayerCard";
import { PlayerModal } from "./PlayerModal";
import { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PlayerGridProps {
  players: Tables<"player_overview">[];
}

type SortOption =
  | "name_asc"
  | "name_desc"
  | "position_asc"
  | "position_desc"
  | "goals_desc"
  | "goals_asc"
  | "assists_desc"
  | "assists_asc"
  | "minutes_desc"
  | "minutes_asc"
  | "rating_desc"
  | "rating_asc"
  | "pass_pct_desc"
  | "pass_pct_asc"
  | "tackles_desc"
  | "tackles_asc"
  | "interceptions_desc"
  | "interceptions_asc";

export function PlayerGrid({ players }: PlayerGridProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerDetails, setPlayerDetails] = useState<{
    summary: Tables<"player_advanced_summary"> | null;
    timeline: Tables<"player_match_timeline">[];
  }>({ summary: null, timeline: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("minutes_desc");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePlayerClick = async (playerId: number) => {
    setIsLoading(true);
    setSelectedPlayerId(playerId);

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

    setPlayerDetails({
      summary: summaryResult.data,
      timeline: timelineResult.data || [],
    });
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setSelectedPlayerId(null);
    setPlayerDetails({ summary: null, timeline: [] });
  };

  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...players];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((player) =>
        player.full_name?.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let aValue: string | number | null;
      let bValue: string | number | null;

      switch (sortOption) {
        case "name_asc":
        case "name_desc":
          aValue = a.full_name;
          bValue = b.full_name;
          break;
        case "position_asc":
        case "position_desc":
          aValue = a.position;
          bValue = b.position;
          break;
        case "goals_desc":
        case "goals_asc":
          aValue = a.total_goals;
          bValue = b.total_goals;
          break;
        case "assists_desc":
        case "assists_asc":
          aValue = a.total_assists;
          bValue = b.total_assists;
          break;
        case "minutes_desc":
        case "minutes_asc":
          aValue = a.total_minutes;
          bValue = b.total_minutes;
          break;
        case "rating_desc":
        case "rating_asc":
          aValue = a.avg_match_rating;
          bValue = b.avg_match_rating;
          break;
        case "pass_pct_desc":
        case "pass_pct_asc":
          aValue = a.pass_completion_pct;
          bValue = b.pass_completion_pct;
          break;
        case "tackles_desc":
        case "tackles_asc":
          aValue = a.tackles_per_90;
          bValue = b.tackles_per_90;
          break;
        case "interceptions_desc":
        case "interceptions_asc":
          aValue = a.interceptions_per_90;
          bValue = b.interceptions_per_90;
          break;
        default:
          return 0;
      }

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const isAscending = sortOption.endsWith("_asc");

      if (typeof aValue === "string" && typeof bValue === "string") {
        return isAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return isAscending ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [players, sortOption, searchQuery]);

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search players by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="position_asc">Position (A-Z)</SelectItem>
              <SelectItem value="position_desc">Position (Z-A)</SelectItem>
              <SelectItem value="goals_desc">Goals (High-Low)</SelectItem>
              <SelectItem value="goals_asc">Goals (Low-High)</SelectItem>
              <SelectItem value="assists_desc">Assists (High-Low)</SelectItem>
              <SelectItem value="assists_asc">Assists (Low-High)</SelectItem>
              <SelectItem value="minutes_desc">Minutes (High-Low)</SelectItem>
              <SelectItem value="minutes_asc">Minutes (Low-High)</SelectItem>
              <SelectItem value="rating_desc">Rating (High-Low)</SelectItem>
              <SelectItem value="rating_asc">Rating (Low-High)</SelectItem>
              <SelectItem value="pass_pct_desc">Pass % (High-Low)</SelectItem>
              <SelectItem value="pass_pct_asc">Pass % (Low-High)</SelectItem>
              <SelectItem value="tackles_desc">Tackles/90 (High-Low)</SelectItem>
              <SelectItem value="tackles_asc">Tackles/90 (Low-High)</SelectItem>
              <SelectItem value="interceptions_desc">Interceptions/90 (High-Low)</SelectItem>
              <SelectItem value="interceptions_asc">Interceptions/90 (Low-High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAndSortedPlayers.map((player) => (
          <PlayerCard
            key={player.player_id}
            player={player}
            onClick={() => handlePlayerClick(player.player_id!)}
          />
        ))}
      </div>

      {!isLoading && (
        <PlayerModal
          isOpen={selectedPlayerId !== null}
          onClose={handleCloseModal}
          summary={playerDetails.summary}
          timeline={playerDetails.timeline}
        />
      )}
    </>
  );
}
