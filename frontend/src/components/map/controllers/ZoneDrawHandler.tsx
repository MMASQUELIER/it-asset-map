import { useEffect, useRef } from "react";
import type { LatLng } from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

interface ZoneDrawHandlerProps {
  isEnabled: boolean;
  onDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
}

export default function ZoneDrawHandler({
  isEnabled,
  onDraftDrag,
}: ZoneDrawHandlerProps) {
  const leafletMap = useMap();
  const dragStartLatLngRef = useRef<LatLng | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      dragStartLatLngRef.current = null;
      return;
    }

    leafletMap.dragging.disable();

    return () => {
      leafletMap.dragging.enable();
      dragStartLatLngRef.current = null;
    };
  }, [isEnabled, leafletMap]);

  useMapEvents({
    mousedown(mapMouseEvent) {
      if (!isEnabled) {
        return;
      }

      dragStartLatLngRef.current = mapMouseEvent.latlng;
      onDraftDrag(
        mapMouseEvent.latlng.lng,
        mapMouseEvent.latlng.lat,
        mapMouseEvent.latlng.lng,
        mapMouseEvent.latlng.lat,
      );
    },
    mousemove(mapMouseEvent) {
      if (!isEnabled || dragStartLatLngRef.current === null) {
        return;
      }

      onDraftDrag(
        dragStartLatLngRef.current.lng,
        dragStartLatLngRef.current.lat,
        mapMouseEvent.latlng.lng,
        mapMouseEvent.latlng.lat,
      );
    },
    mouseup(mapMouseEvent) {
      if (!isEnabled || dragStartLatLngRef.current === null) {
        return;
      }

      onDraftDrag(
        dragStartLatLngRef.current.lng,
        dragStartLatLngRef.current.lat,
        mapMouseEvent.latlng.lng,
        mapMouseEvent.latlng.lat,
      );
      dragStartLatLngRef.current = null;
    },
  });

  return null;
}
