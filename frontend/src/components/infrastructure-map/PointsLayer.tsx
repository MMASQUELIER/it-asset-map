import { Fragment } from "react";
import { CircleMarker, Pane, Popup, Tooltip } from "react-leaflet";
import { resolveZoneColor, ZONE_STYLES } from "./styles";
import type { PcPoint, ZoneData } from "./types";

interface PointsLayerProps {
  points: PcPoint[];
  zoneByCode: ReadonlyMap<string, ZoneData>;
}

export default function PointsLayer({ points, zoneByCode }: PointsLayerProps) {
  return (
    <Pane name="points" style={{ zIndex: 680 }}>
      {points.map((point) => {
        const zone = zoneByCode.get(point.zoneCode);
        const zoneColor = resolveZoneColor(zone?.couleur);
        const markerColor = ZONE_STYLES[zoneColor].stroke;
        const ringColor = ZONE_STYLES[zoneColor].ring;

        return (
          <Fragment key={point.id}>
            <CircleMarker
              center={[point.y, point.x]}
              radius={6.6}
              pathOptions={{
                className: "point-halo",
                color: "#ffffff",
                weight: 1.4,
                fillColor: ringColor,
                fillOpacity: 0.95,
              }}
            />
            <CircleMarker
              center={[point.y, point.x]}
              radius={3.9}
              pathOptions={{
                className: "point-core",
                color: "#0f172a",
                weight: 1.5,
                fillColor: markerColor,
                fillOpacity: 1,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -7]}
                opacity={0.98}
                pane="tooltipPane"
                className="point-label"
              >
                {point.nom}
              </Tooltip>
              <Popup pane="popupPane">
                <strong>{point.nom}</strong>
                <br />
                {point.description}
                <br />
                Zone: {point.zoneCode}
                <br />
                Coordonnees: x={point.x}, y={point.y}
              </Popup>
            </CircleMarker>
          </Fragment>
        );
      })}
    </Pane>
  );
}
