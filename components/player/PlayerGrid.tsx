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
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayerGridProps {
  players: Tables<"player_overview">[];
}

type SortField =
  | "name"
  | "position"
  | "goals"
  | "assists"
  | "minutes"
  | "rating"
  | "pass_pct"
  | "tackles"
  | "interceptions";

export function PlayerGrid({ players }: PlayerGridProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerDetails, setPlayerDetails] = useState<{
    summary: Tables<"player_advanced_summary"> | null;
    timeline: Tables<"player_match_timeline">[];
  }>({ summary: null, timeline: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>("minutes");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
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

      switch (sortField) {
        case "name":
          aValue = a.full_name;
          bValue = b.full_name;
          break;
        case "position":
          aValue = a.position;
          bValue = b.position;
          break;
        case "goals":
          aValue = a.total_goals;
          bValue = b.total_goals;
          break;
        case "assists":
          aValue = a.total_assists;
          bValue = b.total_assists;
          break;
        case "minutes":
          aValue = a.total_minutes;
          bValue = b.total_minutes;
          break;
        case "rating":
          aValue = a.avg_match_rating;
          bValue = b.avg_match_rating;
          break;
        case "pass_pct":
          aValue = a.pass_completion_pct;
          bValue = b.pass_completion_pct;
          break;
        case "tackles":
          aValue = a.tackles_per_90;
          bValue = b.tackles_per_90;
          break;
        case "interceptions":
          aValue = a.interceptions_per_90;
          bValue = b.interceptions_per_90;
          break;
        default:
          return 0;
      }

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const isAscending = sortDirection === "asc";

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
  }, [players, sortField, sortDirection, searchQuery]);

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
          <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="position">Position</SelectItem>
              <SelectItem value="goals">Goals</SelectItem>
              <SelectItem value="assists">Assists</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="pass_pct">Pass %</SelectItem>
              <SelectItem value="tackles">Tackles/90</SelectItem>
              <SelectItem value="interceptions">Interceptions/90</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="h-9 w-9"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
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
