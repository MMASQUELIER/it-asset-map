import type { MapZone } from "../../shared/types";

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
    <div className="zone-legend">
      {zones.map((zone) => {
        const isActive = zone.id === activeZoneId;

        return (
          <button
            key={zone.id}
            className={`zone-chip${isActive ? " zone-chip--active" : ""}`}
            type="button"
            onClick={() => onSelectZone(zone.id)}
          >
            <span
              className="zone-chip__dot"
              style={{ backgroundColor: zone.color }}
            />
            Zone {zone.id}
          </button>
        );
      })}
    </div>
  );
}
