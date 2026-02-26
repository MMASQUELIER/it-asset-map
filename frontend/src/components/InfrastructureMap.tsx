import { ImageOverlay, MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./InfrastructureMap.css";
import MapHud from "./infrastructure-map/MapHud";
import MapLegend from "./infrastructure-map/MapLegend";
import PointsLayer from "./infrastructure-map/PointsLayer";
import ZonesLayer from "./infrastructure-map/ZonesLayer";
import { EMPTY_POINT_COUNTS, EMPTY_ZONE_COUNTS, resolveZoneColor } from "./infrastructure-map/styles";
import type { PcPoint, ZoneData } from "./infrastructure-map/types";
export type { PcPoint, ZoneData } from "./infrastructure-map/types";

interface InfrastructureMapProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  points: PcPoint[];
  zones: ZoneData[];
}

export default function InfrastructureMap({
  imageUrl,
  imageWidth,
  imageHeight,
  points,
  zones,
}: InfrastructureMapProps) {
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [imageHeight, imageWidth],
  ];
  const zoneByCode = new Map(zones.map((zone) => [zone.code, zone]));
  const zoneCountsByColor = { ...EMPTY_ZONE_COUNTS };
  const pointCountsByColor = { ...EMPTY_POINT_COUNTS };

  for (const zone of zones) {
    const zoneColor = resolveZoneColor(zone.couleur);
    zoneCountsByColor[zoneColor] += 1;
  }

  for (const point of points) {
    const zone = zoneByCode.get(point.zoneCode);
    const zoneColor = resolveZoneColor(zone?.couleur);
    pointCountsByColor[zoneColor] += 1;
  }

  return (
    <div className="map-shell">
      <MapLegend zoneCountsByColor={zoneCountsByColor} pointCountsByColor={pointCountsByColor} />
      <MapHud zoneCount={zones.length} pointCount={points.length} />
      <MapContainer
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={2.0}
        minZoom={-1}
        maxZoom={3}
        zoomSnap={0.25}
        zoomDelta={0.25}
        scrollWheelZoom={true}
        crs={L.CRS.Simple}
        style={{ height: "100%", width: "100%", background: "#0b1322" }}
      >
        <ImageOverlay url={imageUrl} bounds={bounds} opacity={0.98} className="factory-plan-image" />
        <ZonesLayer zones={zones} />
        <PointsLayer points={points} zoneByCode={zoneByCode} />
      </MapContainer>
    </div>
  );
}
