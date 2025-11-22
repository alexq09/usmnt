"use client";

import { useState } from "react";
import { Tables } from "@/lib/database.types";
import { RosterGrid } from "./RosterGrid";
import { PlayerPool } from "./PlayerPool";
import { RosterSummary } from "./RosterSummary";

type Player = Tables<"players">;

interface RosterBuilderProps {
  players: Player[];
}

export function RosterBuilder({ players }: RosterBuilderProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  const addPlayer = (player: Player) => {
    if (selectedPlayers.length < 26 && !selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const removePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
  };

  const clearRoster = () => {
    setSelectedPlayers([]);
  };

  const availablePlayers = players.filter(
    player => !selectedPlayers.find(sp => sp.id === player.id)
  );

  const filteredPlayers = availablePlayers.filter(player => {
    const matchesSearch = player.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === "all" || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const positions = Array.from(new Set(players.map(p => p.position).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            World Cup Roster Builder
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Build your 26-man squad for the World Cup
          </p>
        </div>

        <RosterSummary
          selectedPlayers={selectedPlayers}
          onClear={clearRoster}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <RosterGrid
              selectedPlayers={selectedPlayers}
              onRemove={removePlayer}
            />
          </div>

          <div className="lg:col-span-1">
            <PlayerPool
              players={filteredPlayers}
              onAdd={addPlayer}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              positionFilter={positionFilter}
              onPositionFilterChange={setPositionFilter}
              positions={positions}
              isRosterFull={selectedPlayers.length >= 26}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
