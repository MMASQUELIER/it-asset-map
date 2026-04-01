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
  const placementPcCandidates = assets.reduce(function collectPlacementPcCandidates(
    candidates,
    asset,
    sourceRowIndex,
  ) {
    if (!isPcAsset(asset)) {
      return candidates;
    }

    candidates.push(
      createPlacementPcCandidate(
        asset,
        sourceRowIndex,
        markerIdUsage,
        sectorColumnName,
      ),
    );

    return candidates;
  }, [] as CatalogResponseDto["placementPcCandidates"]);

  return {
    availableSectors: buildAvailableSectors(placementPcCandidates),
    placementPcCandidates,
  };
}
