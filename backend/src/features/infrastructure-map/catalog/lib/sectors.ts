import type { PlacementPcCandidateDto } from "@/features/infrastructure-map/catalog/types.ts";

export function buildAvailableSectors(
  placementPcCandidates: PlacementPcCandidateDto[],
): string[] {
  return [...new Set(
    placementPcCandidates
      .map((candidate) => candidate.sector.trim())
      .filter((sector) => sector.length > 0),
  )].sort((firstSector, secondSector) =>
    firstSector.localeCompare(secondSector, "fr", { sensitivity: "base" })
  );
}
