"use client";

import { Tables } from "@/lib/database.types";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSITION_CATEGORIES } from "@/lib/position-utils";

type Player = Tables<"players">;

interface PlayerPoolProps {
  players: Player[];
  onAdd: (player: Player) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  positionFilter: string;
  onPositionFilterChange: (position: string) => void;
  isRosterFull: boolean;
}

export function PlayerPool({
  players,
  onAdd,
  searchTerm,
  onSearchChange,
  positionFilter,
  onPositionFilterChange,
  isRosterFull,
}: PlayerPoolProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    const aLast = a.last_name || a.full_name;
    const bLast = b.last_name || b.full_name;
    return aLast.localeCompare(bLast);
  });

  return (
    <Card className="p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Available Players
      </h2>

      <div className="space-y-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={positionFilter} onValueChange={onPositionFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All positions</SelectItem>
            {POSITION_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isRosterFull && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Roster is full (26/26). Remove a player to add another.
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-[calc(100vh-24rem)] overflow-y-auto">
        {sortedPlayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No players found
            </p>
          </div>
        ) : (
          sortedPlayers.map(player => (
            <div
              key={player.id}
              className="group flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {player.full_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {player.position || "Unknown"}
                </p>
              </div>
              <button
                onClick={() => onAdd(player)}
                disabled={isRosterFull}
                className="ml-2 p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                aria-label="Add player"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
