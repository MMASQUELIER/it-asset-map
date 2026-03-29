import type {
  MapImageDimensions,
  MapZone,
  ZoneDraft,
} from "../../shared/types";
import { clampZoneBounds } from "./zoneGeometry";
import { generateSuggestedZoneId } from "./zoneCollections";

/** Default width applied to a newly created zone draft. */
const DEFAULT_ZONE_WIDTH = 160;
/** Default height applied to a newly created zone draft. */
const DEFAULT_ZONE_HEIGHT = 100;
/**
 * Creates the initial draft displayed when the user starts drawing a zone.
 *
 * @param image Map image boundaries.
 * @param zones Existing zones.
 * @param x Drag origin X coordinate.
 * @param y Drag origin Y coordinate.
 * @returns Draft seeded with suggested size and identifier.
 */
export function createZoneDraft(
  image: MapImageDimensions,
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
    suggestedId: generateSuggestedZoneId(zones),
  };
}
