import type { ZoneColor } from "./types";
import { ZONE_ORDER, ZONE_STYLES } from "./styles";

interface MapLegendProps {
  zoneCountsByColor: Record<ZoneColor, number>;
  pointCountsByColor: Record<ZoneColor, number>;
}

export default function MapLegend({ zoneCountsByColor, pointCountsByColor }: MapLegendProps) {
  return (
    <div className="map-legend">
      <p className="map-legend-title">Zones et densite PC</p>
      {ZONE_ORDER.map((color) => (
        <div key={color} className="map-legend-item">
          <span
            className="map-legend-swatch"
            style={{ backgroundColor: ZONE_STYLES[color].fill, borderColor: ZONE_STYLES[color].stroke }}
          />
          <span className="map-legend-name">{ZONE_STYLES[color].label}</span>
          <span className="map-legend-meta">{zoneCountsByColor[color]} zones · {pointCountsByColor[color]} PC</span>
        </div>
      ))}
    </div>
  );
}
