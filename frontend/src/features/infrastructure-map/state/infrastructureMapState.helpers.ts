import type { Dispatch, SetStateAction } from "react";
import { createSector } from "@/features/infrastructure-map/api/client";
import { isMarkerCompatibleWithZone } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerSectorCompatibility";
import {
  assignMarkersWithinBoundsToZone,
  reconcileMarkersWithZoneBounds,
} from "@/features/infrastructure-map/markers/logic/interactiveMarkers";
import { applyCatalogIssues } from "@/features/infrastructure-map/model/catalogIssues";
import type {
  InteractiveMarker,
  MapZone,
  PlacementCandidate,
  SectorRecord,
} from "@/features/infrastructure-map/model/types";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { normalizeAppErrorMessage } from "@/features/infrastructure-map/shared/errorMessages";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface ZoneRecordLike {
  code: string;
  id: number;
  name?: string;
  sectorId: number;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

export async function ensureSectorExists(
  sectorName: string,
  sectors: SectorRecord[],
  setSectors: Dispatch<SetStateAction<SectorRecord[]>>,
): Promise<SectorRecord> {
  const normalizedSectorName = normalizeComparableText(sectorName);
  const existingSector = sectors.find((sector) =>
    normalizeComparableText(sector.name) === normalizedSectorName
  );

  if (existingSector !== undefined) {
    return existingSector;
  }

  const createdSector = await createSector(sectorName.trim());

  setSectors((currentSectors) =>
    [...currentSectors, createdSector].sort((firstSector, secondSector) =>
      firstSector.name.localeCompare(secondSector.name)
    )
  );

  return createdSector;
}

export function mapZoneRecordToMapZone(
  zoneRecord: ZoneRecordLike,
  sector: SectorRecord,
): MapZone {
  return {
    bounds: {
      height: zoneRecord.yMax - zoneRecord.yMin,
      width: zoneRecord.xMax - zoneRecord.xMin,
      x: zoneRecord.xMin,
      y: zoneRecord.yMin,
    },
    code: zoneRecord.code,
    color: getSectorColor(sector.name, sector.color),
    id: zoneRecord.id,
    name: zoneRecord.name,
    sectorId: zoneRecord.sectorId,
    sectorName: sector.name,
  };
}

export function removeZoneFromState(
  zones: MapZone[],
  markers: InteractiveMarker[],
  zoneId: number,
): {
  nextMarkers: InteractiveMarker[];
  nextZones: MapZone[];
} {
  return {
    nextMarkers: markers.map((marker) =>
      marker.zoneId !== zoneId
        ? marker
        : {
          ...marker,
          technicalDetails: syncPcTechnicalDetailsWithZone(
            marker.technicalDetails,
            null,
          ),
          zoneId: null,
        }
    ),
    nextZones: zones.filter((zone) => zone.id !== zoneId),
  };
}

export function reconcileMarkersAfterZoneUpdate(
  markers: InteractiveMarker[],
  previousZone: MapZone,
  nextZone: MapZone,
): InteractiveMarker[] {
  const markersWithUpdatedZoneContext = markers.map((marker) => {
    if (marker.zoneId !== nextZone.id) {
      return marker;
    }

    if (!isMarkerCompatibleWithZone(marker, nextZone)) {
      return {
        ...marker,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          null,
        ),
        zoneId: null,
      };
    }

    return {
      ...marker,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        marker.technicalDetails,
        nextZone,
      ),
    };
  });

  if (haveSameBounds(previousZone.bounds, nextZone.bounds)) {
    return assignMarkersWithinBoundsToZone(
      markersWithUpdatedZoneContext,
      nextZone,
      nextZone.bounds,
    );
  }

  return reconcileMarkersWithZoneBounds(
    assignMarkersWithinBoundsToZone(
      markersWithUpdatedZoneContext,
      nextZone,
      nextZone.bounds,
    ),
    previousZone,
    nextZone.bounds,
  );
}

export function haveSameBounds(
  firstBounds: MapZone["bounds"],
  secondBounds: MapZone["bounds"],
): boolean {
  return firstBounds.x === secondBounds.x &&
    firstBounds.y === secondBounds.y &&
    firstBounds.width === secondBounds.width &&
    firstBounds.height === secondBounds.height;
}

export function getHighlightedZoneId(
  hoveredZoneId: number | null,
  selectedMarker: InteractiveMarker | null,
  selectedZoneId: number | null,
): number | null {
  if (hoveredZoneId !== null) {
    return hoveredZoneId;
  }

  if (selectedMarker !== null && selectedMarker.zoneId !== null) {
    return selectedMarker.zoneId;
  }

  return selectedZoneId;
}

export function normalizeOptionalText(value: string): string | null {
  const normalizedValue = value.trim();
  return normalizedValue.length === 0 ? null : normalizedValue;
}

export function getMutationErrorMessage(error: unknown): string {
  return normalizeAppErrorMessage(
    error,
    "Impossible d'enregistrer la modification.",
  );
}

export function updateMarkerTechnicalDetails(
  marker: InteractiveMarker,
  nextTechnicalDetails: InteractiveMarker["technicalDetails"],
  zone: MapZone | null,
): InteractiveMarker {
  return {
    ...marker,
    technicalDetails: applyCatalogIssues(
      syncPcTechnicalDetailsWithZone(nextTechnicalDetails, zone),
    ),
  };
}

export function updatePlacementCandidateTechnicalDetails(
  candidate: PlacementCandidate,
  nextTechnicalDetails: PlacementCandidate["technicalDetails"],
): PlacementCandidate {
  const technicalDetails = applyCatalogIssues(nextTechnicalDetails);
  const sector = technicalDetails.sector ?? "";
  const stationName = technicalDetails.manufacturingStationNames ?? "";
  const prodsheet = technicalDetails.prodsheet;

  return {
    ...candidate,
    hostname: technicalDetails.hostname,
    label: buildPlacementCandidateLabel(stationName, prodsheet, sector),
    sector,
    stationName,
    technicalDetails,
    prodsheet,
  };
}

function normalizeComparableText(value: string): string {
  return value.trim().toUpperCase();
}

function buildPlacementCandidateLabel(
  stationName: string | undefined,
  prodsheet: string | undefined,
  sector: string | undefined,
): string {
  const labelParts = [stationName, prodsheet, sector].filter((value) =>
    value !== undefined && value.trim().length > 0
  );

  return labelParts.length > 0
    ? labelParts.join(" / ")
    : "Donnees CMDB incompletes";
}
