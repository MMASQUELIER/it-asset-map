import type { MapZone } from "@/features/infrastructure-map/model/types";
import {
  joinClassNames,
  surfacePanelClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { getZoneDisplayLabel } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

/** Props used by the zone legend shown above the map. */
interface ZoneLegendProps {
  activeZoneId: number | null;
  onSelectZone: (zoneId: number) => void;
  zones: MapZone[];
}

/**
 * Displays one clickable chip per zone.
 *
 * @param props Available zones and selection callback.
 * @returns Zone legend UI.
 */
export default function ZoneLegend({
  activeZoneId,
  onSelectZone,
  zones,
}: ZoneLegendProps) {
  return (
    <div className={`${surfacePanelClassName} grid gap-3 p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-schneider-700">
            Zones
          </span>
          <strong className="text-sm text-schneider-950">
            {zones.length} zone(s) visibles
          </strong>
        </div>
        <span className="text-xs font-medium text-schneider-800/72">
          Cliquez pour mettre une zone en avant
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {zones.map(function renderZoneChip(zone) {
          const isActive = zone.id === activeZoneId;

          return (
            <button
              key={zone.id}
              className={joinClassNames(
                "inline-flex items-center gap-2 rounded-[18px] border px-3.5 py-2 text-[0.82rem] font-black transition",
                "border-schneider-900/8 bg-schneider-100/78 text-schneider-900 hover:-translate-y-0.5",
                isActive &&
                  "border-schneider-600/20 bg-schneider-600 text-white shadow-[0_12px_24px_rgba(15,122,70,0.18)]",
              )}
              title={`${zone.sector} • Prodsched ${getZoneDisplayLabel(zone)}`}
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
