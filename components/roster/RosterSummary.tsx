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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const padding = 60;
    const titleHeight = 120;
    const categorySpacing = 40;
    const playerHeight = 36;
    const columnWidth = (width - padding * 2 - 30) / 2;

    let totalHeight = titleHeight + padding;
    positionOrder.forEach(category => {
      const players = groupedByPosition[category] || [];
      if (players.length > 0) {
        totalHeight += 50 + Math.ceil(players.length / 2) * playerHeight + categorySpacing;
      }
    });
    totalHeight += padding;

    canvas.width = width;
    canvas.height = totalHeight;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Inter, system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('World Cup Roster', width / 2, padding + 50);

    ctx.font = '20px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${selectedPlayers.length} Players Selected`, width / 2, padding + 85);

    let currentY = titleHeight + padding;

    positionOrder.forEach(category => {
      const players = groupedByPosition[category] || [];
      if (players.length === 0) return;

      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 24px Inter, system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${category}s (${players.length})`, padding, currentY + 30);

      currentY += 50;

      players.forEach((player, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = padding + col * (columnWidth + 30);
        const y = currentY + row * playerHeight;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x, y, columnWidth, playerHeight - 4);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter, system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(player.full_name, x + 12, y + 23);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px Inter, system-ui, -apple-system, sans-serif';
        const textWidth = ctx.measureText(player.full_name).width;
        ctx.fillText(`(${player.position})`, x + 12 + textWidth + 8, y + 23);
      });

      currentY += Math.ceil(players.length / 2) * playerHeight + categorySpacing;
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'world-cup-roster.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
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
