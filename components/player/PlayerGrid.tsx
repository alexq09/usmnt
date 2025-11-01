"use client";

import { useState, useMemo } from "react";
import { PlayerCard } from "./PlayerCard";
import { PlayerModal } from "./PlayerModal";
import { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase/supabase";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface PlayerGridProps {
  players: Tables<"player_overview">[];
}

type SortField =
  | "full_name"
  | "position"
  | "total_goals"
  | "total_assists"
  | "total_minutes"
  | "avg_match_rating"
  | "pass_completion_pct"
  | "tackles_per_90"
  | "interceptions_per_90";

type SortDirection = "asc" | "desc" | null;

export function PlayerGrid({ players }: PlayerGridProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerDetails, setPlayerDetails] = useState<{
    summary: Tables<"player_advanced_summary"> | null;
    timeline: Tables<"player_match_timeline">[];
  }>({ summary: null, timeline: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>("total_minutes");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField("total_minutes");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPlayers = useMemo(() => {
    if (!sortDirection) return players;

    return [...players].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [players, sortField, sortDirection]);

  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => {
    const isActive = sortField === field && sortDirection !== null;
    return (
      <Badge
        variant={isActive ? "default" : "outline"}
        className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        onClick={() => handleSort(field)}
      >
        {label}
        {isActive && sortDirection === "asc" && (
          <ArrowUp className="ml-1 h-3 w-3" />
        )}
        {isActive && sortDirection === "desc" && (
          <ArrowDown className="ml-1 h-3 w-3" />
        )}
        {!isActive && <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
      </Badge>
    );
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Sort by:
        </h3>
        <div className="flex flex-wrap gap-2">
          <SortButton field="full_name" label="Name" />
          <SortButton field="position" label="Position" />
          <SortButton field="total_goals" label="Goals" />
          <SortButton field="total_assists" label="Assists" />
          <SortButton field="total_minutes" label="Minutes" />
          <SortButton field="avg_match_rating" label="Rating" />
          <SortButton field="pass_completion_pct" label="Pass %" />
          <SortButton field="tackles_per_90" label="Tackles/90" />
          <SortButton field="interceptions_per_90" label="Interceptions/90" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedPlayers.map((player) => (
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
