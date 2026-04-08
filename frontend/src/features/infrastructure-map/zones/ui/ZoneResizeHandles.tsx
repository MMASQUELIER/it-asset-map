import L from "leaflet";
import { Marker } from "react-leaflet";
import type { RectangleBounds } from "@/features/infrastructure-map/model/types";
import type { ZoneResizeHandle } from "@/features/infrastructure-map/shared/interactionTypes";

interface ZoneResizeHandlesProps {
  bounds: RectangleBounds;
  onResizeCommit: (handle: ZoneResizeHandle, x: number, y: number) => void;
  onResizePreview: (handle: ZoneResizeHandle, x: number, y: number) => void;
}

const HANDLE_POSITIONS: ZoneResizeHandle[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const HANDLE_ICON = L.divIcon({
  className: "bg-transparent border-0",
  html:
    '<span class="inline-flex h-4 w-4 rounded-[5px] border-2 border-[#12311f] bg-white shadow-[0_6px_16px_rgba(20,54,34,0.22)]"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function ZoneResizeHandles({
  bounds,
  onResizeCommit,
  onResizePreview,
}: ZoneResizeHandlesProps) {
  return (
    <>
      {HANDLE_POSITIONS.map((handle) => (
        <Marker
          key={handle}
          bubblingMouseEvents={false}
          draggable={true}
          eventHandlers={{
            drag: (event) => {
              const { lat, lng } = event.target.getLatLng();
              onResizePreview(handle, lng, lat);
            },
            dragend: (event) => {
              const { lat, lng } = event.target.getLatLng();
              onResizeCommit(handle, lng, lat);
            },
          }}
          icon={HANDLE_ICON}
          position={getHandlePosition(bounds, handle)}
        />
      ))}
    </>
  );
}

function getHandlePosition(
  bounds: RectangleBounds,
  handle: ZoneResizeHandle,
): [number, number] {
  const top = bounds.y;
  const left = bounds.x;
  const right = bounds.x + bounds.width;
  const bottom = bounds.y + bounds.height;

  switch (handle) {
    case "top-left":
      return [top, left];
    case "top-right":
      return [top, right];
    case "bottom-left":
      return [bottom, left];
    case "bottom-right":
      return [bottom, right];
  }
}
