import L from "leaflet";
import { Marker } from "react-leaflet";
import type { RectangleBounds } from "../../../types/layout";
import type { ZoneResizeHandle } from "../logic/interactionTypes";

interface ZoneResizeHandlesProps {
  bounds: RectangleBounds;
  onResize: (handle: ZoneResizeHandle, x: number, y: number) => void;
}

const HANDLE_POSITIONS: ZoneResizeHandle[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const HANDLE_ICON = L.divIcon({
  className: "zone-resize-handle-wrapper",
  html: '<span class="zone-resize-handle"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function ZoneResizeHandles({
  bounds,
  onResize,
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
              onResize(handle, lng, lat);
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
