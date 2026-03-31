import type {
  StoredMapZone,
  StoredMarkerPlacement,
} from "@/features/infrastructure-map/layout/types.ts";
import { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";

export function ensureUniqueZoneIds(zones: StoredMapZone[]): void {
  const seenZoneIds = new Set<number>();

  for (const zone of zones) {
    if (seenZoneIds.has(zone.id)) {
      throw new InvalidMapLayoutError(
        `L'identifiant de zone ${zone.id} est duplique.`,
      );
    }

    seenZoneIds.add(zone.id);
  }
}

export function ensureUniqueMarkerIds(
  markerPlacements: StoredMarkerPlacement[],
): void {
  const seenMarkerIds = new Set<string>();

  for (const placement of markerPlacements) {
    if (seenMarkerIds.has(placement.markerId)) {
      throw new InvalidMapLayoutError(
        `Le marqueur ${placement.markerId} est duplique dans le layout.`,
      );
    }

    seenMarkerIds.add(placement.markerId);
  }
}
