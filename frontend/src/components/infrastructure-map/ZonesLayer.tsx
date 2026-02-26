import { Fragment } from "react";
import { CircleMarker, Pane, Popup, Rectangle, Tooltip } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { resolveZoneColor, ZONE_STYLES } from "./styles";
import type { ZoneData } from "./types";

interface ZonesLayerProps {
  zones: ZoneData[];
}

export default function ZonesLayer({ zones }: ZonesLayerProps) {
  return (
    <Pane name="zones" style={{ zIndex: 430 }}>
      {zones.map((zone) => {
        const [xMin, yMin, xMax, yMax] = zone.position;
        const zoneColor = resolveZoneColor(zone.couleur);
        const style = ZONE_STYLES[zoneColor];
        const zoneWidth = xMax - xMin;
        const zoneHeight = yMax - yMin;
        const compactLabel = zoneWidth < 52 || zoneHeight < 34;
        const boundsForZone: LatLngBoundsExpression = [
          [yMin, xMin],
          [yMax, xMax],
        ];
        const labelX = compactLabel
          ? xMin + Math.max(8, Math.min(18, zoneWidth * 0.35))
          : (xMin + xMax) / 2;
        const labelY = compactLabel
          ? yMin + Math.max(7, Math.min(14, zoneHeight * 0.45))
          : (yMin + yMax) / 2;

        return (
          <Fragment key={zone.id}>
            <Rectangle
              bounds={boundsForZone}
              pathOptions={{
                className: "zone-fill",
                color: style.ring,
                weight: 4,
                opacity: 0.72,
                fillColor: style.fill,
                fillOpacity: 0.18,
              }}
            />
            <Rectangle
              bounds={boundsForZone}
              pathOptions={{
                className: "zone-outline",
                color: style.stroke,
                weight: 2.6,
                opacity: 1,
                fillOpacity: 0,
              }}
            >
              <Popup pane="popupPane">
                <strong>{zone.nom}</strong>
                <br />
                Code zone: {zone.code}
                <br />
                PC dans la zone: {zone.pcs?.length ?? 0}
              </Popup>
            </Rectangle>

            <CircleMarker
              center={[labelY, labelX]}
              radius={1}
              interactive={false}
              pathOptions={{ opacity: 0, fillOpacity: 0, weight: 0 }}
            >
              <Tooltip
                direction="center"
                permanent={true}
                pane="tooltipPane"
                className={`zone-label zone-label--${zoneColor} ${compactLabel ? "zone-label--compact" : ""}`}
              >
                {zone.code}
              </Tooltip>
            </CircleMarker>
          </Fragment>
        );
      })}
    </Pane>
  );
}
