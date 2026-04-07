import type {
  MapImageDimensions,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import { clampZoneBounds } from "@/features/infrastructure-map/zones/logic/zoneGeometry";

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
  _zones: unknown[],
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
  };
}
