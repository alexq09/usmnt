"use client";

import { useState } from "react";
import { Tables } from "@/lib/database.types";
import { RosterGrid } from "./RosterGrid";
import { PlayerPool } from "./PlayerPool";
import { RosterSummary } from "./RosterSummary";
import { getPositionCategory } from "@/lib/position-utils";

type Player = Tables<"players">;

interface RosterBuilderProps {
  players: Player[];
}

export function RosterBuilder({ players }: RosterBuilderProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [starterIds, setStarterIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  const addPlayer = (player: Player) => {
    if (selectedPlayers.length < 26 && !selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const removePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
    const newStarters = new Set(starterIds);
    newStarters.delete(playerId);
    setStarterIds(newStarters);
  };

  const toggleStarter = (playerId: number) => {
    const newStarters = new Set(starterIds);
    if (newStarters.has(playerId)) {
      newStarters.delete(playerId);
    } else {
      if (newStarters.size < 11) {
        newStarters.add(playerId);
      }
    }
    setStarterIds(newStarters);
  };

  const clearRoster = () => {
    setSelectedPlayers([]);
    setStarterIds(new Set());
  };

  const availablePlayers = players.filter(
    player => !selectedPlayers.find(sp => sp.id === player.id)
  );

  const filteredPlayers = availablePlayers.filter(player => {
    const matchesSearch = player.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const playerCategory = getPositionCategory(player.position);
    const matchesPosition = positionFilter === "all" || playerCategory === positionFilter;
    return matchesSearch && matchesPosition;
  });

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
          starterIds={starterIds}
          onClear={clearRoster}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <RosterGrid
              selectedPlayers={selectedPlayers}
              starterIds={starterIds}
              onRemove={removePlayer}
              onToggleStarter={toggleStarter}
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
              isRosterFull={selectedPlayers.length >= 26}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
