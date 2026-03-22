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

const DRAG_START_THRESHOLD = 4;

export default function ZoneDrawHandler({
  isEnabled,
  onDraftDrag,
}: ZoneDrawHandlerProps) {
  const leafletMap = useMap();
  const dragStartLatLngRef = useRef<LatLng | null>(null);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) {
      dragStartLatLngRef.current = null;
      hasDraggedRef.current = false;
      return;
    }

    leafletMap.dragging.disable();

    return () => {
      leafletMap.dragging.enable();
      dragStartLatLngRef.current = null;
      hasDraggedRef.current = false;
    };
  }, [isEnabled, leafletMap]);

  useMapEvents({
    mousedown(mapMouseEvent) {
      if (!isEnabled) {
        return;
      }

      dragStartLatLngRef.current = mapMouseEvent.latlng;
      hasDraggedRef.current = false;
    },
    mousemove(mapMouseEvent) {
      if (!isEnabled || dragStartLatLngRef.current === null) {
        return;
      }

      if (
        !hasDraggedRef.current &&
        !hasReachedDragThreshold(dragStartLatLngRef.current, mapMouseEvent.latlng)
      ) {
        return;
      }

      hasDraggedRef.current = true;

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

      if (
        hasDraggedRef.current ||
        hasReachedDragThreshold(dragStartLatLngRef.current, mapMouseEvent.latlng)
      ) {
        onDraftDrag(
          dragStartLatLngRef.current.lng,
          dragStartLatLngRef.current.lat,
          mapMouseEvent.latlng.lng,
          mapMouseEvent.latlng.lat,
        );
      }

      dragStartLatLngRef.current = null;
      hasDraggedRef.current = false;
    },
  });

  return null;
}

function hasReachedDragThreshold(start: LatLng, current: LatLng): boolean {
  return (
    Math.abs(current.lng - start.lng) >= DRAG_START_THRESHOLD ||
    Math.abs(current.lat - start.lat) >= DRAG_START_THRESHOLD
  );
}
