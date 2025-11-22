"use client";

import { useState, useEffect } from "react";
import { getAllPlayers, createRoster, addPlayerToRoster, getPositionGroup, type Player } from "@/lib/roster-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search, Save } from "lucide-react";

interface SelectedPlayer extends Player {
  positionGroup: string;
}

export default function RosterBuilderPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("ALL");
  const [rosterName, setRosterName] = useState("My World Cup Roster");
  const [rosterId, setRosterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => {
    if (typeof window !== "undefined") {
      let sid = localStorage.getItem("roster_session_id");
      if (!sid) {
        sid = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem("roster_session_id", sid);
      }
      return sid;
    }
    return "temp_session";
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    try {
      const data = await getAllPlayers();
      setPlayers(data);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === "ALL" || getPositionGroup(player.position) === positionFilter;
    const notSelected = !selectedPlayers.some((sp) => sp.full_name === player.full_name);
    return matchesSearch && matchesPosition && notSelected;
  });

  const handleAddPlayer = (player: Player) => {
    if (selectedPlayers.length >= 26) {
      alert("Roster is full! Maximum 26 players allowed.");
      return;
    }

    const positionGroup = getPositionGroup(player.position);
    const groupCount = selectedPlayers.filter((p) => p.positionGroup === positionGroup).length;

    const maxByPosition: Record<string, number> = {
      GK: 3,
      DEF: 10,
      MID: 10,
      FWD: 10,
    };

    if (groupCount >= maxByPosition[positionGroup]) {
      alert(`Maximum ${maxByPosition[positionGroup]} ${positionGroup} players allowed.`);
      return;
    }

    setSelectedPlayers([...selectedPlayers, { ...player, positionGroup }]);
  };

  const handleRemovePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.full_name !== playerName));
  };

  async function handleSaveRoster() {
    try {
      let currentRosterId = rosterId;

      if (!currentRosterId) {
        currentRosterId = await createRoster(sessionId, rosterName);
        setRosterId(currentRosterId);
      }

      for (let i = 0; i < selectedPlayers.length; i++) {
        const player = selectedPlayers[i];
        await addPlayerToRoster(
          currentRosterId,
          player.full_name,
          player.positionGroup,
          i
        );
      }

      alert("Roster saved successfully!");
    } catch (error) {
      console.error("Error saving roster:", error);
      alert("Failed to save roster. Please try again.");
    }
  }

  const positionGroups = ["ALL", "GK", "DEF", "MID", "FWD"];
  const groupedPlayers = {
    GK: selectedPlayers.filter((p) => p.positionGroup === "GK"),
    DEF: selectedPlayers.filter((p) => p.positionGroup === "DEF"),
    MID: selectedPlayers.filter((p) => p.positionGroup === "MID"),
    FWD: selectedPlayers.filter((p) => p.positionGroup === "FWD"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Build Your World Cup Roster
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select 26 players for your ideal USMNT World Cup squad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search players..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {positionGroups.map((pos) => (
                    <Button
                      key={pos}
                      variant={positionFilter === pos ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPositionFilter(pos)}
                      className="min-w-[60px]"
                    >
                      {pos}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-12 text-slate-500">Loading players...</div>
                ) : filteredPlayers.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No players found</div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.full_name}
                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {player.full_name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {player.position}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>{player.matches_played} apps</span>
                          <span>{player.total_goals} goals</span>
                          <span>{player.total_assists} assists</span>
                          <span>Rating: {player.avg_match_rating?.toFixed(1) || "N/A"}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddPlayer(player)}
                        className="ml-4"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 sticky top-4">
              <div className="mb-6">
                <Input
                  type="text"
                  value={rosterName}
                  onChange={(e) => setRosterName(e.target.value)}
                  className="text-lg font-semibold mb-4"
                  placeholder="Roster Name"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedPlayers.length} / 26 Players
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveRoster}
                      disabled={selectedPlayers.length === 0}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(groupedPlayers).map(([group, players]) => (
                  <div key={group}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {group}
                      </h3>
                      <Badge variant="secondary">{players.length}</Badge>
                    </div>
                    <div className="space-y-1">
                      {players.length === 0 ? (
                        <div className="text-sm text-slate-400 italic p-2">
                          No players selected
                        </div>
                      ) : (
                        players.map((player) => (
                          <div
                            key={player.full_name}
                            className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm"
                          >
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {player.full_name}
                            </span>
                            <button
                              onClick={() => handleRemovePlayer(player.full_name)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
