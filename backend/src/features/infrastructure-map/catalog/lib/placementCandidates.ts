import { readCellText, readMeaningfulCell } from "@/features/infrastructure-map/catalog/lib/cellReaders.ts";
import { COLUMN_KEYS, PC_ASSET_TYPE } from "@/features/infrastructure-map/catalog/lib/columns.ts";
import { buildUniqueMarkerId } from "@/features/infrastructure-map/catalog/lib/markerIds.ts";
import { mapAssetToTechnicalDetails } from "@/features/infrastructure-map/catalog/lib/technicalDetails.ts";
import type {
  BackendAssetRecord,
  PlacementPcCandidateDto,
} from "@/features/infrastructure-map/catalog/types.ts";

export function isPcAsset(asset: BackendAssetRecord): boolean {
  return readCellText(asset[COLUMN_KEYS.assetType]).toUpperCase() === PC_ASSET_TYPE;
}

export function createPlacementPcCandidate(
  asset: BackendAssetRecord,
  index: number,
  markerIdUsage: Map<string, number>,
  sectorColumnName: string,
): PlacementPcCandidateDto {
  const hostname = readMeaningfulCell(asset[COLUMN_KEYS.hostname]);
  const serialNumber = readMeaningfulCell(asset[COLUMN_KEYS.serialNumber]);
  const stationName = readMeaningfulCell(asset[COLUMN_KEYS.stationName]) ?? "";
  const prodsched = readCellText(asset[COLUMN_KEYS.prodsched]);
  const sector = readCellText(asset[sectorColumnName]);
  const preferredMarkerId = hostname ?? serialNumber ??
    buildFallbackMarkerIdSeed(prodsched, stationName, index);
  const markerId = buildUniqueMarkerId(preferredMarkerId, markerIdUsage);

  return {
    id: `${markerId}-${index}`,
    markerId,
    hostname: hostname ?? undefined,
    label: buildCandidateLabel(stationName, prodsched, sector),
    prodsched,
    sector,
    stationName,
    technicalDetails: mapAssetToTechnicalDetails(asset, sectorColumnName),
  };
}

function buildFallbackMarkerIdSeed(
  prodsched: string,
  stationName: string,
  index: number,
): string {
  const labelParts = [prodsched, stationName].filter((value) => value.length > 0);

  return labelParts.length > 0
    ? `${labelParts.join("-")}-EXCEL-INCOMPLET`
    : `PC-EXCEL-INCOMPLET-${index + 1}`;
}

function buildCandidateLabel(
  stationName: string,
  prodsched: string,
  sector: string,
): string {
  const labelParts = [stationName, prodsched, sector].filter((value) =>
    value.length > 0
  );

  return labelParts.length > 0
    ? labelParts.join(" • ")
    : "Catalogue Excel incomplet";
}
