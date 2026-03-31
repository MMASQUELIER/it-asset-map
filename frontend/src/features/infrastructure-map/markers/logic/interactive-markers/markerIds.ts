import type { InteractiveMarker } from "@/features/infrastructure-map/model/types";

export function generateSuggestedMarkerId(
  existingMarkers: InteractiveMarker[],
  zoneId: number | null,
): string {
  const markerIdPrefix = zoneId === null ? "PC-TEMP" : `PC-${zoneId}`;
  const markerIdIndexPattern = new RegExp(
    `^${escapeRegExp(markerIdPrefix.toUpperCase())}-(\\d+)$`,
  );
  let highestExistingIndex = 0;

  for (const marker of existingMarkers) {
    const match = normalizeMarkerId(marker.id).match(markerIdIndexPattern);

    if (match === null) {
      continue;
    }

    const markerIndex = Number.parseInt(match[1], 10);

    if (markerIndex > highestExistingIndex) {
      highestExistingIndex = markerIndex;
    }
  }

  const nextMarkerIndex = String(highestExistingIndex + 1).padStart(2, "0");

  return `${markerIdPrefix}-${nextMarkerIndex}`;
}

export function isMarkerIdUnique(
  existingMarkers: InteractiveMarker[],
  candidateId: string,
): boolean {
  const normalizedCandidateId = normalizeMarkerId(candidateId);

  if (normalizedCandidateId.length === 0) {
    return false;
  }

  return existingMarkers.every(
    (marker) => normalizeMarkerId(marker.id) !== normalizedCandidateId,
  );
}

function normalizeMarkerId(markerId: string): string {
  return markerId.trim().toUpperCase();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
