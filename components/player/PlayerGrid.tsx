"use client";

import { useState } from "react";
import { PlayerCard } from "./PlayerCard";
import { PlayerModal } from "./PlayerModal";
import { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase/supabase";

interface PlayerGridProps {
  players: Tables<"player_overview">[];
}

export function PlayerGrid({ players }: PlayerGridProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerDetails, setPlayerDetails] = useState<{
    summary: Tables<"player_advanced_summary"> | null;
    timeline: Tables<"player_match_timeline">[];
  }>({ summary: null, timeline: [] });
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map((player) => (
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
