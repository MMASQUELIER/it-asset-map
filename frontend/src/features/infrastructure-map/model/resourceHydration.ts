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
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

export function hydrateMapZones(
  zoneRecords: ZoneRecord[],
  sectors: SectorRecord[],
): MapZone[] {
  const sectorNameById = new Map<number, string>(
    sectors.map((sector) => [sector.id, sector.name]),
  );

  return zoneRecords
    .map((zoneRecord) => {
      const sectorName = sectorNameById.get(zoneRecord.sectorId) ?? "";

      return {
        bounds: createBounds(zoneRecord),
        code: zoneRecord.code,
        color: getSectorColor(sectorName),
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
      technicalDetails: syncPcTechnicalDetailsWithZone(
        mapEquipmentDataToTechnicalDetails(equipmentDataRecord),
        resolvedZone,
      ),
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
  return {
    ...equipmentDataRecord,
    catalogIssues: buildCatalogIssues(equipmentDataRecord),
  };
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
  return {
    equipmentDataId: equipmentDataRecord.id,
    equipmentId: equipmentDataRecord.equipmentId,
    hostname: equipmentDataRecord.hostname,
    id: equipmentDataRecord.equipmentId,
    label: buildCandidateLabel(
      equipmentDataRecord.manufacturingStationNames,
      equipmentDataRecord.zoneCode,
      equipmentDataRecord.sector,
    ),
    sector: equipmentDataRecord.sector ?? "",
    stationName: equipmentDataRecord.manufacturingStationNames ?? "",
    technicalDetails: mapEquipmentDataToTechnicalDetails(equipmentDataRecord),
    zoneCode: equipmentDataRecord.zoneCode,
  };
}

function buildCandidateLabel(
  stationName: string | undefined,
  zoneCode: string | undefined,
  sector: string | undefined,
): string {
  const labelParts = [stationName, zoneCode, sector].filter((value) =>
    value !== undefined && value.trim().length > 0
  );

  return labelParts.length > 0
    ? labelParts.join(" • ")
    : "Donnees CMDB incompletes";
}

function buildCatalogIssues(
  equipmentDataRecord: EquipmentDataRecord,
): string[] | undefined {
  const issues = [
    createMissingFieldIssue("nom machine", equipmentDataRecord.hostname),
    createMissingFieldIssue("code zone", equipmentDataRecord.zoneCode),
    createMissingFieldIssue(
      "poste de fabrication",
      equipmentDataRecord.manufacturingStationNames,
    ),
    createMissingFieldIssue(
      "emplacement",
      equipmentDataRecord.floorLocation ?? equipmentDataRecord.sector,
    ),
  ].filter((issue): issue is string => issue !== null);

  return issues.length === 0 ? undefined : issues;
}

function createMissingFieldIssue(
  label: string,
  value: string | undefined,
): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? null
    : `CMDB incomplete : ${label} non renseigne.`;
}
