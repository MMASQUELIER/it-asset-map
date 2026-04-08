import type {
  EditablePcFieldId,
  MapZone,
  PcTechnicalDetails,
} from "@/features/infrastructure-map/model/types";
import { applyCatalogIssues } from "@/features/infrastructure-map/model/catalogIssues";

type ZoneContext = Pick<MapZone, "code" | "sectorName">;

export function syncPcTechnicalDetailsWithZone(
  technicalDetails: PcTechnicalDetails,
  zone: ZoneContext | null,
): PcTechnicalDetails {
  const zoneSector = getZoneSector(zone);
  const currentSector = getVisibleText(technicalDetails.sector);
  const currentFloorLocation = getVisibleText(technicalDetails.floorLocation);
  const currentProdsheet = getVisibleText(technicalDetails.prodsheet);

  return applyCatalogIssues({
    ...technicalDetails,
    sector: resolveZoneValue(zoneSector, currentSector),
    floorLocation: resolveZoneValue(zoneSector, currentFloorLocation ?? currentSector),
    prodsheet: resolveZoneValue(getZoneCode(zone), currentProdsheet),
  });
}

export function applyEditablePcFieldUpdate(
  technicalDetails: PcTechnicalDetails,
  fieldId: EditablePcFieldId,
  value: string,
): PcTechnicalDetails {
  const nextValue = getVisibleText(value);

  if (fieldId === "sector") {
    return {
      ...technicalDetails,
      floorLocation: nextValue,
      sector: nextValue,
    };
  }

  if (fieldId === "wifiOrWiredConnection") {
    return {
      ...technicalDetails,
      connectionType: nextValue,
      wifiOrWiredConnection: nextValue,
    };
  }

  if (fieldId === "secondaryComment") {
    return {
      ...technicalDetails,
      comment: nextValue,
      secondaryComment: nextValue,
    };
  }

  return {
    ...technicalDetails,
    [fieldId]: nextValue,
  } as PcTechnicalDetails;
}

function getZoneSector(zone: ZoneContext | null): string | undefined {
  if (zone === null) {
    return undefined;
  }

  return getVisibleText(zone.sectorName);
}

function getZoneCode(zone: ZoneContext | null): string | undefined {
  if (zone === null) {
    return undefined;
  }

  return getVisibleText(zone.code);
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
