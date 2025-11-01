"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatsGrid } from "./StatsGrid";
import { PlayerCharts } from "./PlayerCharts";
import { Tables } from "@/lib/database.types";

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: Tables<"player_advanced_summary"> | null;
  timeline: Tables<"player_match_timeline">[];
}

export function PlayerModal({
  isOpen,
  onClose,
  summary,
  timeline,
}: PlayerModalProps) {
  if (!summary) return null;

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "bg-slate-500 hover:bg-slate-600";
    if (rating >= 7.5) return "bg-green-500 hover:bg-green-600";
    if (rating >= 7.0) return "bg-blue-500 hover:bg-blue-600";
    if (rating >= 6.5) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-orange-500 hover:bg-orange-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <DialogTitle className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                {summary.full_name || "Unknown Player"}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-base px-4 py-1.5 bg-slate-100 dark:bg-slate-800"
                >
                  {summary.position || "N/A"}
                </Badge>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {summary.matches_played || 0} Matches
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {summary.total_minutes?.toLocaleString() || 0} Minutes
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Avg Rating
                </div>
                <Badge
                  className={`${getRatingColor(summary.avg_match_rating)} text-white text-xl font-bold px-5 py-2`}
                >
                  {summary.avg_match_rating?.toFixed(2) || "N/A"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          <StatsGrid summary={summary} />
          <PlayerCharts timeline={timeline} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
