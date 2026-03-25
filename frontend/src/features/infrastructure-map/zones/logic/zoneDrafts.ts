import type { MapZone, StaticMapImage, ZoneDraft } from "../../shared/types";
import { clampZoneBounds } from "./zoneGeometry";
import { generateSuggestedZoneId } from "./zoneCollections";

/** Default width applied to a newly created zone draft. */
const DEFAULT_ZONE_WIDTH = 160;
/** Default height applied to a newly created zone draft. */
const DEFAULT_ZONE_HEIGHT = 100;
/** Palette rotated through when suggesting a color for a new zone. */
const ZONE_COLORS = [
  "#2a6fdb",
  "#16a34a",
  "#c2410c",
  "#7c3aed",
  "#d97706",
  "#0f766e",
  "#be123c",
];

/**
 * Creates the initial draft displayed when the user starts drawing a zone.
 *
 * @param image Map image boundaries.
 * @param zones Existing zones.
 * @param x Drag origin X coordinate.
 * @param y Drag origin Y coordinate.
 * @returns Draft seeded with suggested size, color and identifier.
 */
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

/**
 * Cycles through the predefined zone colors.
 *
 * @param zones Existing zones.
 * @returns Suggested hexadecimal color for the next zone.
 */
function pickZoneColor(zones: MapZone[]): string {
  return ZONE_COLORS[zones.length % ZONE_COLORS.length];
}
