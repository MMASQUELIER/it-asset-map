import type { MapLayoutData } from "@/features/infrastructure-map/layout/types.ts";
import { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";
import { normalizeMapImageDimensions } from "@/features/infrastructure-map/layout/normalizers/mapImage.ts";
import { normalizeMarkerPlacements } from "@/features/infrastructure-map/layout/normalizers/markers.ts";
import { isRecord } from "@/features/infrastructure-map/layout/normalizers/primitives.ts";
import { ensureUniqueMarkerIds, ensureUniqueZoneIds } from "@/features/infrastructure-map/layout/normalizers/uniqueness.ts";
import { normalizeStoredZones } from "@/features/infrastructure-map/layout/normalizers/zones.ts";

export function normalizeMapLayoutData(value: unknown): MapLayoutData {
  if (!isRecord(value)) {
    throw new InvalidMapLayoutError("Le layout JSON doit etre un objet.");
  }

  const mapImage = normalizeMapImageDimensions(value.mapImage);
  const zones = normalizeStoredZones(value.zones);
  const markerPlacements = normalizeMarkerPlacements(value.markerPlacements);

  ensureUniqueZoneIds(zones);
  ensureUniqueMarkerIds(markerPlacements);

  return {
    mapImage,
    zones,
    markerPlacements,
  };
}
