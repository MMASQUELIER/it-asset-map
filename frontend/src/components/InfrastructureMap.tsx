import { useState } from "react";
import L from "leaflet";
import { ImageOverlay, MapContainer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapViewportController from "./map/MapViewportController";
import PcLayer from "./map/PcLayer";
import { STATIC_MAP_DATA } from "./map/staticMapData";
import ZoneLegend from "./map/ZoneLegend";
import ZonesLayer from "./map/ZonesLayer";
import "./map/InfrastructureMap.css";

interface InfrastructureMapProps {
  imageUrl: string;
}

const IMAGE_BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [STATIC_MAP_DATA.image.height, STATIC_MAP_DATA.image.width],
];

const MAP_STYLE = {
  height: "100%",
  width: "100%",
  background: "#d8e1ea",
};

export default function InfrastructureMap({
  imageUrl,
}: InfrastructureMapProps) {
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);

  const activeZoneId = hoveredZoneId ?? selectedZoneId;

  function handleZoneClick(zoneId: number): void {
    setSelectedZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : zoneId,
    );
  }

  return (
    <section className="map-card">
      <ZoneLegend
        activeZoneId={activeZoneId}
        onSelectZone={handleZoneClick}
        zones={STATIC_MAP_DATA.zones}
      />

      <div className="map-frame">
        <MapContainer
          bounds={IMAGE_BOUNDS}
          maxBounds={IMAGE_BOUNDS}
          maxBoundsViscosity={1}
          minZoom={-0.25}
          maxZoom={4}
          preferCanvas={true}
          scrollWheelZoom={true}
          wheelPxPerZoomLevel={160}
          zoomControl={false}
          zoomSnap={0.25}
          crs={L.CRS.Simple}
          style={MAP_STYLE}
        >
          <MapViewportController bounds={IMAGE_BOUNDS} />
          <ZoomControl position="bottomright" />
          <ImageOverlay
            bounds={IMAGE_BOUNDS}
            className="map-image"
            url={imageUrl}
          />
          <ZonesLayer
            activeZoneId={activeZoneId}
            onHoverZone={setHoveredZoneId}
            onLeaveZone={() => setHoveredZoneId(null)}
            onSelectZone={handleZoneClick}
            zones={STATIC_MAP_DATA.zones}
          />
          <PcLayer
            activeZoneId={activeZoneId}
            zones={STATIC_MAP_DATA.zones}
          />
        </MapContainer>
      </div>
    </section>
  );
}
