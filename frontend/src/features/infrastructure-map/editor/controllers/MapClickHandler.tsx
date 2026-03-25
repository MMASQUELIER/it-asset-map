import type { LeafletMouseEvent } from "leaflet";
import { useMapEvents } from "react-leaflet";

/** Props used to enable marker placement clicks on the map. */
interface MapClickHandlerProps {
  isEnabled: boolean;
  onCoordinateClick: (x: number, y: number) => void;
}

/**
 * Leaflet controller that forwards click coordinates when marker creation is enabled.
 *
 * @param isEnabled Whether click handling is active.
 * @param onCoordinateClick Callback receiving image coordinates.
 * @returns Nothing. The component only registers Leaflet events.
 */
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
