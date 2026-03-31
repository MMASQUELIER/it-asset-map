import { createPlacementPcCandidate, isPcAsset } from "@/features/infrastructure-map/catalog/lib/placementCandidates.ts";
import { buildAvailableSectors } from "@/features/infrastructure-map/catalog/lib/sectors.ts";
import type {
  BackendAssetRecord,
  CatalogResponseDto,
} from "@/features/infrastructure-map/catalog/types.ts";

export function buildInfrastructureCatalog(
  assets: BackendAssetRecord[],
  sectorColumnName: string,
): CatalogResponseDto {
  const markerIdUsage = new Map<string, number>();
  const placementPcCandidates = assets
    .filter(isPcAsset)
    .map((asset, index) =>
      createPlacementPcCandidate(asset, index, markerIdUsage, sectorColumnName)
    );

  return {
    availableSectors: buildAvailableSectors(placementPcCandidates),
    placementPcCandidates,
  };
}
