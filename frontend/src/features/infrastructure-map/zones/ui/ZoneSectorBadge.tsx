import type { CSSProperties } from "react";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface ZoneSectorBadgeProps {
  emptyLabel?: string;
  sectorColor?: string;
  sectorName: string;
}

export function ZoneSectorBadge({
  emptyLabel,
  sectorColor,
  sectorName,
}: ZoneSectorBadgeProps) {
  const label = sectorName.length > 0
    ? sectorName
    : (emptyLabel ?? sectorName);

  return (
    <strong
      className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-bold text-schneider-900"
      style={getZoneSectorBadgeStyle(sectorName, sectorColor)}
    >
      {label}
    </strong>
  );
}

function getZoneSectorBadgeStyle(
  sectorName: string,
  sectorColor?: string,
): CSSProperties {
  const sectorAccentColor = getSectorColor(sectorName, sectorColor);

  return {
    background: `color-mix(in srgb, ${sectorAccentColor} 18%, white)`,
    borderColor: `color-mix(in srgb, ${sectorAccentColor} 40%, rgba(16,38,26,0.1))`,
  };
}
