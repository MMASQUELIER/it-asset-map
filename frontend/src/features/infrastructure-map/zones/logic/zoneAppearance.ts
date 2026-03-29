import type { MapZone } from "../../shared/types";

type ZoneDisplaySource = Pick<MapZone, "label" | "prodsched">;

/** Default color used when a sector name does not match a known palette entry. */
const DEFAULT_SECTOR_COLOR = "#64748b";

/** Maps normalized sector names to one stable color per sector. */
const SECTOR_COLOR_BY_NAME: Record<string, string> = {
  "SECTEUR CORPS": "#d65252",
  "SECTEUR FABRICATION": "#2f7edb",
  "SECTEUR MANUEL": "#d48806",
  "SECTEUR TETE": "#199473",
};

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
  return SECTOR_COLOR_BY_NAME[normalizeSectorName(sectorName)] ??
    DEFAULT_SECTOR_COLOR;
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
