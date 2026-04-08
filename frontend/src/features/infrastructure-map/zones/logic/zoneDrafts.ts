import type {
  MapImageDimensions,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import { clampZoneBounds } from "@/features/infrastructure-map/zones/logic/zoneGeometry";

const DEFAULT_ZONE_WIDTH = 160;
const DEFAULT_ZONE_HEIGHT = 100;

export function createZoneDraft(
  image: MapImageDimensions,
  existingZones: unknown[],
  x: number,
  y: number,
): ZoneDraft {
  void existingZones;

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
