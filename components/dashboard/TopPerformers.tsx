import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopPerformer } from "@/lib/dashboard-data";

interface TopPerformersProps {
  topScorers: TopPerformer[];
  topAssisters: TopPerformer[];
  topRated: TopPerformer[];
}

export function TopPerformers({
  topScorers,
  topAssisters,
  topRated,
}: TopPerformersProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Top Performers
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Top Scorers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topScorers.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {player.full_name || "Unknown"}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1 bg-slate-200 dark:bg-slate-700"
                    >
                      {player.position || "N/A"}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {player.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Top Assisters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAssisters.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {player.full_name || "Unknown"}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1 bg-slate-200 dark:bg-slate-700"
                    >
                      {player.position || "N/A"}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {player.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Highest Rated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRated.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {player.full_name || "Unknown"}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1 bg-slate-200 dark:bg-slate-700"
                    >
                      {player.position || "N/A"}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {player.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
