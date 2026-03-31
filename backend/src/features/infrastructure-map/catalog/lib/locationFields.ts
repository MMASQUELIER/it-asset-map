import { COLUMN_KEYS } from "@/features/infrastructure-map/catalog/lib/columns.ts";
import { readCellText, readMeaningfulCell } from "@/features/infrastructure-map/catalog/lib/cellReaders.ts";
import type {
  BackendAssetRecord,
  PcTechnicalDetailsDto,
} from "@/features/infrastructure-map/catalog/types.ts";

export function buildTechnicalLocationFields(
  asset: BackendAssetRecord,
  sectorColumnName: string,
): Pick<
  PcTechnicalDetailsDto,
  "sector" | "floorLocation" | "manufacturingStationNames"
> {
  const sector = readCellText(asset[sectorColumnName]);
  const manufacturingStationNames =
    readMeaningfulCell(asset[COLUMN_KEYS.stationName]) ?? undefined;

  return {
    sector,
    floorLocation: sector,
    manufacturingStationNames,
  };
}
