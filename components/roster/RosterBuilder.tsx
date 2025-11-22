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
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            Build your 26-man squad and select your starting 11 for the World Cup
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="font-semibold">Step 1:</span>
              <span>Select 26 players for your roster</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="font-semibold">Step 2:</span>
              <span>Click the star icon to choose your starting 11</span>
            </div>
          </div>
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
