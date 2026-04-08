import type {
  EquipmentDataRecord,
  EquipmentRecord,
  InteractiveMarker,
  MapZone,
  PcTechnicalDetails,
  PlacementCandidate,
  RectangleBounds,
  SectorRecord,
  ZoneRecord,
} from "@/features/infrastructure-map/model/types";
import { applyCatalogIssues } from "@/features/infrastructure-map/model/catalogIssues";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

export function hydrateMapZones(
  zoneRecords: ZoneRecord[],
  sectors: SectorRecord[],
): MapZone[] {
  const sectorById = new Map<number, SectorRecord>(
    sectors.map((sector) => [sector.id, sector]),
  );

  return zoneRecords
    .map((zoneRecord) => {
      const sector = sectorById.get(zoneRecord.sectorId);
      const sectorName = sector?.name ?? "";

      return {
        bounds: createBounds(zoneRecord),
        code: zoneRecord.code,
        color: getSectorColor(sectorName, sector?.color),
        id: zoneRecord.id,
        name: zoneRecord.name,
        sectorId: zoneRecord.sectorId,
        sectorName,
      };
    })
    .sort((firstZone, secondZone) => firstZone.id - secondZone.id);
}

export function buildPlacementCandidates(
  equipmentDataRecords: EquipmentDataRecord[],
): PlacementCandidate[] {
  return equipmentDataRecords.map(mapEquipmentDataToPlacementCandidate);
}

export function hydrateInteractiveMarkers(
  equipmentRecords: EquipmentRecord[],
  equipmentDataRecords: EquipmentDataRecord[],
  zones: MapZone[],
): InteractiveMarker[] {
  const equipmentDataById = createEquipmentDataByIdMap(equipmentDataRecords);
  const zoneById = createZoneByIdMap(zones);
  const markers: InteractiveMarker[] = [];

  for (const equipmentRecord of equipmentRecords) {
    const equipmentDataRecord = equipmentDataById.get(
      equipmentRecord.equipmentDataId,
    );

    if (equipmentDataRecord === undefined) {
      continue;
    }

    const resolvedZone = equipmentRecord.zoneId === null
      ? null
      : (zoneById.get(equipmentRecord.zoneId) ?? null);

    markers.push({
      equipmentDataId: equipmentRecord.equipmentDataId,
      id: equipmentRecord.id,
      technicalDetails: applyCatalogIssues(syncPcTechnicalDetailsWithZone(
        mapEquipmentDataToTechnicalDetails(equipmentDataRecord),
        resolvedZone,
      )),
      x: equipmentRecord.x,
      y: equipmentRecord.y,
      zoneId: resolvedZone?.id ?? null,
    });
  }

  return markers;
}

export function updatePlacementCandidatesFromEquipmentData(
  candidates: PlacementCandidate[],
  equipmentDataRecord: EquipmentDataRecord,
): PlacementCandidate[] {
  return candidates.map((candidate) =>
    candidate.equipmentDataId !== equipmentDataRecord.id
      ? candidate
      : mapEquipmentDataToPlacementCandidate(equipmentDataRecord)
  );
}

export function mapEquipmentDataToTechnicalDetails(
  equipmentDataRecord: EquipmentDataRecord,
): PcTechnicalDetails {
  return { ...equipmentDataRecord };
}

function createBounds(zoneRecord: ZoneRecord): RectangleBounds {
  return {
    height: zoneRecord.yMax - zoneRecord.yMin,
    width: zoneRecord.xMax - zoneRecord.xMin,
    x: zoneRecord.xMin,
    y: zoneRecord.yMin,
  };
}

function createEquipmentDataByIdMap(
  equipmentDataRecords: EquipmentDataRecord[],
): Map<number, EquipmentDataRecord> {
  return new Map(
    equipmentDataRecords.map((equipmentDataRecord) => [
      equipmentDataRecord.id,
      equipmentDataRecord,
    ]),
  );
}

function createZoneByIdMap(zones: MapZone[]): Map<number, MapZone> {
  return new Map(zones.map((zone) => [zone.id, zone]));
}

function mapEquipmentDataToPlacementCandidate(
  equipmentDataRecord: EquipmentDataRecord,
): PlacementCandidate {
  const technicalDetails = applyCatalogIssues(
    mapEquipmentDataToTechnicalDetails(equipmentDataRecord),
  );

  return {
    equipmentDataId: equipmentDataRecord.id,
    hostname: technicalDetails.hostname,
    id: String(equipmentDataRecord.id),
    label: buildCandidateLabel(
      technicalDetails.manufacturingStationNames,
      technicalDetails.prodsheet,
      technicalDetails.sector,
    ),
    sector: technicalDetails.sector ?? "",
    stationName: technicalDetails.manufacturingStationNames ?? "",
    technicalDetails,
    prodsheet: technicalDetails.prodsheet,
  };
}

function buildCandidateLabel(
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

