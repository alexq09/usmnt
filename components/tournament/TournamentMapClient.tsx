"use client";

import dynamic from "next/dynamic";
import type { Database } from "@/lib/database.types";

const TournamentMap = dynamic(
  () => import("@/components/tournament/TournamentMap").then(mod => ({ default: mod.TournamentMap })),
  { ssr: false }
);

type Location = Database["public"]["Tables"]["tournament_map_locations"]["Row"];
type Edge = Database["public"]["Tables"]["tournament_map_edges"]["Row"];

interface TournamentMapClientProps {
  locations: Location[];
  edges: Edge[];
}

export function TournamentMapClient({ locations, edges }: TournamentMapClientProps) {
  return <TournamentMap locations={locations} edges={edges} />;
}
