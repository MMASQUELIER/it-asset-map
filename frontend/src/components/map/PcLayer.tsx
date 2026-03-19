import { CircleMarker, Tooltip } from "react-leaflet";
import type { MapZone } from "../../types/layout";

interface PcLayerProps {
  activeZoneId: number | null;
  zones: MapZone[];
}

export default function PcLayer({
  activeZoneId,
  zones,
}: PcLayerProps) {
  return (
    <>
      {zones.flatMap((zone) => {
        const isActiveZone = activeZoneId === zone.id;
        const isDimmed = activeZoneId !== null && !isActiveZone;

        return zone.pcs.map((pc) => (
          <CircleMarker
            key={pc.id}
            center={[pc.y, pc.x]}
            eventHandlers={{
              click: (event) => event.target.openTooltip(),
            }}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: isDimmed ? 0.28 : 0.95,
              opacity: isDimmed ? 0.35 : 1,
              weight: isActiveZone ? 2.6 : 1.8,
            }}
            radius={isActiveZone ? 6 : 4.5}
          >
            <Tooltip
              className={`pc-tooltip${isActiveZone ? " pc-tooltip--active" : ""}`}
              direction="top"
              offset={[0, -8]}
              permanent={isActiveZone}
            >
              {pc.id}
            </Tooltip>
          </CircleMarker>
        ));
      })}
    </>
  );
}
