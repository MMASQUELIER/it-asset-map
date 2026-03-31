import type {
  MapZone,
  PcTechnicalDetails,
} from "@/features/infrastructure-map/model/types";

type ZoneContext = Pick<MapZone, "prodsched" | "sector">;

/**
 * Resynchronise les champs techniques qui doivent suivre la zone courante.
 */
export function syncPcTechnicalDetailsWithZone(
  technicalDetails: PcTechnicalDetails,
  zone: ZoneContext | null,
): PcTechnicalDetails {
  const zoneSector = getZoneSector(zone);
  const currentSector = getVisibleText(technicalDetails.sector);
  const currentFloorLocation = getVisibleText(technicalDetails.floorLocation);
  const currentProdsched = getVisibleText(technicalDetails.prodsched);

  return {
    ...technicalDetails,
    sector: resolveZoneValue(zoneSector, currentSector),
    floorLocation: resolveZoneValue(zoneSector, currentFloorLocation ?? currentSector),
    prodsched: resolveZoneValue(getZoneProdsched(zone), currentProdsched),
  };
}

function getZoneSector(zone: ZoneContext | null): string | undefined {
  if (zone === null) {
    return undefined;
  }

  return getVisibleText(zone.sector);
}

function getZoneProdsched(zone: ZoneContext | null): string | undefined {
  if (zone === null) {
    return undefined;
  }

  return getVisibleText(zone.prodsched);
}

function resolveZoneValue(
  zoneValue: string | undefined,
  fallbackValue: string | undefined,
): string | undefined {
  const visibleZoneValue = getVisibleText(zoneValue);

  if (visibleZoneValue !== undefined) {
    return visibleZoneValue;
  }

  return getVisibleText(fallbackValue);
}

function getVisibleText(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  return trimmedValue;
}
