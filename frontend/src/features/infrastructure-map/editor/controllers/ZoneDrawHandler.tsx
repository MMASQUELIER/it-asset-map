import { useEffect, useRef } from "react";
import type { LatLng } from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

/** Props used to manage drag-based zone creation. */
interface ZoneDrawHandlerProps {
  isEnabled: boolean;
  onDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
}

/** Minimum movement required before a drag is treated as zone creation. */
const DRAG_START_THRESHOLD = 4;

/**
 * Leaflet controller that turns a drag gesture into a zone draft rectangle.
 *
 * @param isEnabled Whether zone creation mode is active.
 * @param onDraftDrag Callback receiving drag start and current coordinates.
 * @returns Nothing. The component only registers Leaflet event handlers.
 */
export default function ZoneDrawHandler({
  isEnabled,
  onDraftDrag,
}: ZoneDrawHandlerProps) {
  const leafletMap = useMap();
  const dragStartLatLngRef = useRef<LatLng | null>(null);
  const hasDraggedRef = useRef(false);

  function resetDragState(): void {
    dragStartLatLngRef.current = null;
    hasDraggedRef.current = false;
  }

  useEffect(() => {
    if (!isEnabled) {
      resetDragState();
      return;
    }

    leafletMap.dragging.disable();

    return () => {
      leafletMap.dragging.enable();
      resetDragState();
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
      const dragStartLatLng = dragStartLatLngRef.current;

      if (!isEnabled || dragStartLatLng === null) {
        return;
      }

      if (
        !hasDraggedRef.current &&
        !hasReachedDragThreshold(dragStartLatLng, mapMouseEvent.latlng)
      ) {
        return;
      }

      hasDraggedRef.current = true;

      onDraftDrag(
        dragStartLatLng.lng,
        dragStartLatLng.lat,
        mapMouseEvent.latlng.lng,
        mapMouseEvent.latlng.lat,
      );
    },
    mouseup(mapMouseEvent) {
      const dragStartLatLng = dragStartLatLngRef.current;

      if (!isEnabled || dragStartLatLng === null) {
        return;
      }

      if (
        hasDraggedRef.current ||
        hasReachedDragThreshold(dragStartLatLng, mapMouseEvent.latlng)
      ) {
        onDraftDrag(
          dragStartLatLng.lng,
          dragStartLatLng.lat,
          mapMouseEvent.latlng.lng,
          mapMouseEvent.latlng.lat,
        );
      }

      resetDragState();
    },
  });

  return null;
}

/**
 * Checks whether the user moved enough to convert a click into a drag.
 *
 * @param start Drag origin.
 * @param current Current pointer position.
 * @returns `true` when the drag threshold is reached.
 */
function hasReachedDragThreshold(start: LatLng, current: LatLng): boolean {
  return (
    Math.abs(current.lng - start.lng) >= DRAG_START_THRESHOLD ||
    Math.abs(current.lat - start.lat) >= DRAG_START_THRESHOLD
  );
}
