import type { MapZone } from "@/features/infrastructure-map/model/types";

type ZoneDisplaySource = Pick<MapZone, "label" | "prodsched">;

const DEFAULT_SECTOR_COLOR = "hsl(212 13% 45%)";

/**
 * Resolves the display label shown for one zone on the map.
 *
 * @param zone Zone-like record containing a prodsched and an optional label.
 * @returns Human-readable display label.
 */
export function getZoneDisplayLabel(zone: ZoneDisplaySource): string {
  const prodsched = zone.prodsched.trim();

  if (prodsched.length > 0) {
    return prodsched;
  }

  const fallbackLabel = zone.label.trim();
  return fallbackLabel.length > 0 ? fallbackLabel : "Zone";
}

/**
 * Resolves the stable color attached to one sector.
 *
 * @param sectorName Raw sector name.
 * @returns Hexadecimal color associated with that sector.
 */
export function getSectorColor(sectorName: string): string {
  const normalizedSectorName = normalizeSectorName(sectorName);

  if (normalizedSectorName.length === 0) {
    return DEFAULT_SECTOR_COLOR;
  }

  const hue = hashText(normalizedSectorName) % 360;
  return `hsl(${hue} 58% 46%)`;
}

/**
 * Normalizes sector names so comparisons stay case- and accent-insensitive.
 *
 * @param sectorName Raw sector name.
 * @returns Normalized sector name.
 */
function normalizeSectorName(sectorName: string): string {
  return sectorName
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .trim()
    .toUpperCase();
}

function hashText(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}
