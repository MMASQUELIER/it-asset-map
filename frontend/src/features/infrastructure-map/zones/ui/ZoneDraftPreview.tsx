import L from "leaflet";
import { Marker, Rectangle } from "react-leaflet";
import type { RectangleBounds } from "@/features/infrastructure-map/model/types";
import { getZoneCenter, toLeafletBounds } from "@/features/infrastructure-map/shared/mapGeometry";

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
    className: "border-0 bg-transparent",
    html:
      `<span class="inline-flex min-w-[56px] max-w-[96px] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-dashed border-sky-400/50 bg-white/98 px-3 py-1.5 text-[0.82rem] font-black tracking-[0.02em] text-sky-800 shadow-[0_10px_22px_rgba(22,67,39,0.12)]">${label}</span>`,
    iconSize: [84, 32],
    iconAnchor: [42, 16],
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
