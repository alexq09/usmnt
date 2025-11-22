export function getPositionCategory(position: string | null): string {
  if (!position) return "Unknown";

  const pos = position.toUpperCase();

  if (pos === "GK") return "Goalkeeper";
  if (["CB", "LB", "RB", "LWB", "RWB"].includes(pos)) return "Defender";
  if (["AM", "DM", "CM", "RM", "LM"].includes(pos)) return "Midfielder";
  if (["ST", "RW", "LW"].includes(pos)) return "Forward";

  return position;
}

export const POSITION_CATEGORIES = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward"
] as const;
