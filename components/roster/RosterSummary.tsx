"use client";

import { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, CheckCircle2 } from "lucide-react";
import { getPositionCategory } from "@/lib/position-utils";

type Player = Tables<"players">;

interface RosterSummaryProps {
  selectedPlayers: Player[];
  onClear: () => void;
}

export function RosterSummary({ selectedPlayers, onClear }: RosterSummaryProps) {
  const positionCounts = selectedPlayers.reduce((acc, player) => {
    const category = getPositionCategory(player.position);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedPositions = Object.entries(positionCounts).sort((a, b) => {
    const order = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  });

  const isComplete = selectedPlayers.length === 26;
  const progress = (selectedPlayers.length / 26) * 100;

  const exportRoster = () => {
    const rosterText = selectedPlayers
      .map(p => `${p.full_name} (${p.position})`)
      .join('\n');

    const blob = new Blob([rosterText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world-cup-roster.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const rosterText = selectedPlayers
      .map(p => `${p.full_name} (${p.position})`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(rosterText);
      alert('Roster copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {selectedPlayers.length} / 26
            </h2>
            {isComplete && (
              <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </div>
            )}
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isComplete ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {sortedPositions.map(([position, count]) => (
              <div
                key={position}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg"
              >
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {position}:
                </span>
                <span className="ml-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={copyToClipboard}
            disabled={selectedPlayers.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Copy
          </Button>
          <Button
            onClick={exportRoster}
            disabled={selectedPlayers.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={onClear}
            disabled={selectedPlayers.length === 0}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
