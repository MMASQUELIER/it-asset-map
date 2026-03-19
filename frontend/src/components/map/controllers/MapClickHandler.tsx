import type { LeafletMouseEvent } from "leaflet";
import { useMapEvents } from "react-leaflet";

interface MapClickHandlerProps {
  isEnabled: boolean;
  onCoordinateClick: (x: number, y: number) => void;
}

export default function MapClickHandler({
  isEnabled,
  onCoordinateClick,
}: MapClickHandlerProps) {
  useMapEvents({
    click(mapMouseEvent: LeafletMouseEvent) {
      if (!isEnabled) {
        return;
      }

      onCoordinateClick(mapMouseEvent.latlng.lng, mapMouseEvent.latlng.lat);
    },
  });

  return null;
}
