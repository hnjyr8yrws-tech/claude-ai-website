// Audience colour system (STEP 8). Defined once, imported everywhere — never
// hardcode these hex values elsewhere. Use as inline style color/backgroundColor.

export const AUDIENCE_COLORS: Record<string, string> = {
  Teacher: "#C8E44A",
  Leader: "#6A8CAF",
  SENCO: "#D97757",
  Parent: "#4A9B8E",
  Student: "#8B5CF6",
  Admin: "#9C9C8A",
};

export function audienceColor(audience: string): string {
  return AUDIENCE_COLORS[audience] ?? "#9C9C8A";
}
