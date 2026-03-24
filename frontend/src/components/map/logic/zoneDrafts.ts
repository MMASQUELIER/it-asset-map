import type { MapZone, StaticMapImage, ZoneDraft } from "../../../types/layout";
import { clampZoneBounds } from "./zoneGeometry";
import { generateSuggestedZoneId } from "./zoneCollections";

const DEFAULT_ZONE_WIDTH = 160;
const DEFAULT_ZONE_HEIGHT = 100;
const ZONE_COLORS = [
  "#2a6fdb",
  "#16a34a",
  "#c2410c",
  "#7c3aed",
  "#d97706",
  "#0f766e",
  "#be123c",
];

export function createZoneDraft(
  image: StaticMapImage,
  zones: MapZone[],
  x: number,
  y: number,
): ZoneDraft {
  const bounds = clampZoneBounds(
    {
      x: Math.round(x),
      y: Math.round(y),
      width: DEFAULT_ZONE_WIDTH,
      height: DEFAULT_ZONE_HEIGHT,
    },
    image,
  );

  return {
    bounds,
    color: pickZoneColor(zones),
    suggestedId: generateSuggestedZoneId(zones),
  };
}

function pickZoneColor(zones: MapZone[]): string {
  return ZONE_COLORS[zones.length % ZONE_COLORS.length];
}
