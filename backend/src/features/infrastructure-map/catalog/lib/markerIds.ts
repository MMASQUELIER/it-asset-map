export function buildUniqueMarkerId(
  baseMarkerId: string,
  markerIdUsage: Map<string, number>,
): string {
  const normalizedBaseMarkerId = normalizeMarkerId(baseMarkerId);
  const nextUsageCount = (markerIdUsage.get(normalizedBaseMarkerId) ?? 0) + 1;

  markerIdUsage.set(normalizedBaseMarkerId, nextUsageCount);

  return nextUsageCount === 1
    ? normalizedBaseMarkerId
    : `${normalizedBaseMarkerId}-${String(nextUsageCount).padStart(2, "0")}`;
}

function normalizeMarkerId(value: string): string {
  return value
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}
