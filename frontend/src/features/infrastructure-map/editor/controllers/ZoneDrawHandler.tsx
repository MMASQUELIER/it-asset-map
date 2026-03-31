import { useEffect, useRef } from "react";
import type { LatLng } from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

/** Props du controleur de dessin de zone par glisser-deposer. */
interface ZoneDrawHandlerProps {
  isEnabled: boolean;
  onDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
}

/** Distance minimale avant de transformer un clic en dessin de zone. */
const DRAG_START_THRESHOLD = 4;

/**
 * Transforme un glisser sur la carte en rectangle de draft de zone.
 *
 * Le composant n'affiche rien: il enregistre seulement les evenements Leaflet
 * necessaires au mode de creation de zone.
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
 * Verifie si le pointeur a suffisamment bouge pour considerer le geste
 * comme un vrai dessin de zone.
 */
function hasReachedDragThreshold(start: LatLng, current: LatLng): boolean {
  return (
    Math.abs(current.lng - start.lng) >= DRAG_START_THRESHOLD ||
    Math.abs(current.lat - start.lat) >= DRAG_START_THRESHOLD
  );
}
