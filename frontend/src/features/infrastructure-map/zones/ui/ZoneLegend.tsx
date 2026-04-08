import type { MapZone } from "@/features/infrastructure-map/model/types";
import {
  joinClassNames,
  surfacePanelClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { getZoneDisplayLabel } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface ZoneLegendProps {
  activeZoneId: number | null;
  onSelectZone: (zoneId: number) => void;
  zones: MapZone[];
}

export default function ZoneLegend({
  activeZoneId,
  onSelectZone,
  zones,
}: ZoneLegendProps) {
  return (
    <div className={`${surfacePanelClassName} grid gap-3 p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-schneider-700/72">
            Zones
          </span>
          <strong className="text-sm font-semibold text-schneider-950">{zones.length} zone(s)</strong>
        </div>
        <span className="text-xs text-schneider-800/65">Filtre visuel</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {zones.map(function renderZoneChip(zone) {
          const isActive = zone.id === activeZoneId;
          const chipStyle = isActive
            ? {
              background: zone.color,
              borderColor: `color-mix(in srgb, ${zone.color} 70%, black)`,
              color: "white",
            }
            : {
              background: `color-mix(in srgb, ${zone.color} 16%, white)`,
              borderColor:
                `color-mix(in srgb, ${zone.color} 42%, rgba(16,38,26,0.1))`,
              color: "#10261a",
            };

          return (
            <button
              key={zone.id}
              className={joinClassNames(
                "inline-flex items-center gap-2 rounded-[14px] border px-3.5 py-2 text-[0.82rem] font-semibold transition",
                "hover:brightness-[0.98]",
              )}
              style={chipStyle}
              title={`${zone.sectorName} • Zone ${getZoneDisplayLabel(zone)}`}
              type="button"
              onClick={function handleZoneSelection() {
                onSelectZone(zone.id);
              }}
            >
              <span
                className="size-2.5 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.85)]"
                style={{ backgroundColor: zone.color }}
              />
              {getZoneDisplayLabel(zone)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
