import L from "leaflet";
import { Marker, Rectangle } from "react-leaflet";
import type { RectangleBounds } from "../../shared/types";
import { getZoneCenter, toLeafletBounds } from "../../shared/mapGeometry";

/** Props used to render a temporary zone preview. */
interface ZoneDraftPreviewProps {
  bounds: RectangleBounds;
  color: string;
  label: string;
}

/**
 * Builds the temporary badge displayed at the center of a zone draft.
 *
 * @param label Zone identifier shown inside the badge.
 * @returns Leaflet div icon.
 */
function createPreviewIcon(label: string): L.DivIcon {
  return L.divIcon({
    className: "zone-badge-wrapper",
    html: `<span class="zone-badge zone-badge--preview">${label}</span>`,
    iconSize: [72, 32],
    iconAnchor: [36, 16],
  });
}

/**
 * Displays the temporary rectangle drawn while a zone is being created.
 *
 * @param props Draft bounds and style information.
 * @returns Zone preview elements.
 */
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
