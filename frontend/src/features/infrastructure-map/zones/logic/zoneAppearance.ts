import type { MapZone } from "@/features/infrastructure-map/model/types";

type ZoneDisplaySource = Pick<MapZone, "code" | "name">;

const DEFAULT_SECTOR_COLOR = "hsl(212 13% 45%)";

export function getZoneDisplayLabel(zone: ZoneDisplaySource): string {
  const code = zone.code.trim();

  if (code.length > 0) {
    return code;
  }

  const fallbackLabel = (zone.name ?? "").trim();
  return fallbackLabel.length > 0 ? fallbackLabel : "Zone";
}

export function getSectorColor(sectorName: string): string {
  const normalizedSectorName = normalizeSectorName(sectorName);

  if (normalizedSectorName.length === 0) {
    return DEFAULT_SECTOR_COLOR;
  }

  const hue = hashText(normalizedSectorName) % 360;
  return `hsl(${hue} 58% 46%)`;
}

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
