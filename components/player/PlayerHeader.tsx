import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PlayerHeaderProps {
  fullName: string;
  position: string;
  matchesPlayed: number;
  totalMinutes: number;
  avgRating: number;
}

export function PlayerHeader({
  fullName,
  position,
  matchesPlayed,
  totalMinutes,
  avgRating,
}: PlayerHeaderProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return "bg-green-500 hover:bg-green-600";
    if (rating >= 7.0) return "bg-blue-500 hover:bg-blue-600";
    if (rating >= 6.5) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-orange-500 hover:bg-orange-600";
  };

  return (
    <Card className="mb-8 border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardContent className="pt-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {fullName}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className="text-base px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white border-white/40">
                {position}
              </Badge>
              <span className="text-lg text-blue-100">
                {matchesPlayed} {matchesPlayed === 1 ? "Match" : "Matches"}
              </span>
              <span className="text-lg text-blue-100">
                {totalMinutes?.toLocaleString() || 0} Minutes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-sm text-blue-200 mb-2">Average Rating</div>
              <Badge
                className={`${getRatingColor(avgRating)} text-white text-2xl font-bold px-6 py-3`}
              >
                {avgRating?.toFixed(2) || "N/A"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
