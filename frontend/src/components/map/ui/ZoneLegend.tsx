import type { MapZone } from "../../../types/layout";

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
