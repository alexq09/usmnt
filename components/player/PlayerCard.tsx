import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/lib/database.types";

interface PlayerCardProps {
  player: Tables<"player_overview">;
  onClick: () => void;
}

export function PlayerCard({ player, onClick }: PlayerCardProps) {
  const getRatingColor = (rating: number | null) => {
    if (!rating) return "bg-slate-500";
    if (rating >= 7.5) return "bg-green-500";
    if (rating >= 7.0) return "bg-blue-500";
    if (rating >= 6.5) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {player.full_name || "Unknown Player"}
            </h3>
            <Badge
              variant="secondary"
              className="mt-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {player.position || "N/A"}
            </Badge>
          </div>
          <Badge
            className={`${getRatingColor(player.avg_match_rating)} text-white font-bold px-3 py-1`}
          >
            {player.avg_match_rating?.toFixed(1) || "N/A"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Goals</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {player.total_goals || 0}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Assists</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {player.total_assists || 0}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Minutes</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {player.total_minutes?.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Pass %</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {player.pass_completion_pct?.toFixed(1) || "N/A"}%
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Tackles/90</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {player.tackles_per_90?.toFixed(2) || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Interceptions/90</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {player.interceptions_per_90?.toFixed(2) || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
