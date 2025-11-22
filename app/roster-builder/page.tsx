"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Tables } from "@/lib/database.types";
import { RosterBuilder } from "@/components/roster/RosterBuilder";

type Player = Tables<"players">;

export default function RosterBuilderPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const { data, error } = await supabase
          .from("players")
          .select("*")
          .order("position", { ascending: true })
          .order("last_name", { ascending: true });

        if (error) throw error;
        setPlayers(data || []);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading players...</p>
        </div>
      </div>
    );
  }

  return <RosterBuilder players={players} />;
}
