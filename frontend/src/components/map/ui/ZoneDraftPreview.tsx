import L from "leaflet";
import { Marker, Rectangle } from "react-leaflet";
import type { RectangleBounds } from "../../../types/layout";
import { getZoneCenter, toLeafletBounds } from "../logic/mapGeometry";

interface ZoneDraftPreviewProps {
  bounds: RectangleBounds;
  color: string;
  label: string;
}

function createPreviewIcon(label: string): L.DivIcon {
  return L.divIcon({
    className: "zone-badge-wrapper",
    html: `<span class="zone-badge zone-badge--preview">${label}</span>`,
    iconSize: [72, 32],
    iconAnchor: [36, 16],
  });
}

export default function ZoneDraftPreview({
  bounds,
  color,
  label,
}: ZoneDraftPreviewProps) {
  return (
    <>
      <Rectangle
        bounds={toLeafletBounds(bounds)}
        interactive={false}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 2.4,
          dashArray: "8 6",
        }}
      />
      <Marker
        icon={createPreviewIcon(label)}
        interactive={false}
        position={getZoneCenter(bounds)}
      />
    </>
  );
}
