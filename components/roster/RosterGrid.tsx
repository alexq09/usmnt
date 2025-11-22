"use client";

import { Tables } from "@/lib/database.types";
import { X, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getPositionCategory } from "@/lib/position-utils";

type Player = Tables<"players">;

interface RosterGridProps {
  selectedPlayers: Player[];
  starterIds: Set<number>;
  onRemove: (playerId: number) => void;
  onToggleStarter: (playerId: number) => void;
}

export function RosterGrid({ selectedPlayers, starterIds, onRemove, onToggleStarter }: RosterGridProps) {
  const groupedByPosition = selectedPlayers.reduce((acc, player) => {
    const category = getPositionCategory(player.position);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  Object.keys(groupedByPosition).forEach(category => {
    groupedByPosition[category].sort((a, b) => {
      const aLast = a.last_name || a.full_name;
      const bLast = b.last_name || b.full_name;
      return aLast.localeCompare(bLast);
    });
  });

  const positionOrder = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
  const sortedPositions = Object.keys(groupedByPosition).sort((a, b) => {
    const aIndex = positionOrder.indexOf(a);
    const bIndex = positionOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const emptySlots = 26 - selectedPlayers.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Selected Roster
        </h2>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {selectedPlayers.length} / 26 players
        </span>
      </div>

      {selectedPlayers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">
            No players selected yet
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Select players from the pool to build your roster
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedPositions.map(position => (
            <div key={position}>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
                {position}s ({groupedByPosition[position].length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groupedByPosition[position].map(player => {
                  const isStarter = starterIds.has(player.id);
                  return (
                    <div
                      key={player.id}
                      className={`group flex items-center justify-between rounded-lg p-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ${
                        isStarter
                          ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 border-2 border-blue-400 dark:border-blue-500'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      <button
                        onClick={() => onToggleStarter(player.id)}
                        className={`mr-2 p-1.5 rounded-full transition-colors ${
                          isStarter
                            ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50'
                            : 'text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-500'
                        }`}
                        aria-label={isStarter ? "Remove from starting 11" : "Add to starting 11"}
                      >
                        <Star className={`w-4 h-4 ${isStarter ? 'fill-current' : ''}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isStarter
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}>
                          {player.full_name}
                        </p>
                        <p className={`text-xs ${
                          isStarter
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {player.position}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(player.id)}
                        className="ml-2 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove player"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {emptySlots > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
                Empty Slots ({emptySlots})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: Math.min(emptySlots, 6) }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-3 flex items-center justify-center"
                  >
                    <p className="text-xs text-slate-400 dark:text-slate-500">Empty slot</p>
                  </div>
                ))}
                {emptySlots > 6 && (
                  <div className="col-span-full text-center text-sm text-slate-500 dark:text-slate-400 py-2">
                    + {emptySlots - 6} more slots
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
