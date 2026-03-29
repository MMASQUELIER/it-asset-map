import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

/** Props used to keep the viewport aligned with the selected marker. */
interface MapViewportControllerProps {
  focusX: number | null;
  focusY: number | null;
  focusToken: number;
  imageBounds: L.LatLngBoundsExpression;
}

/**
 * Applies one-time initial fitting and selected-marker focus transitions.
 *
 * @param focusX Selected marker X coordinate.
 * @param focusY Selected marker Y coordinate.
 * @param focusToken Token incremented whenever focus must be reapplied.
 * @param imageBounds Full image bounds.
 * @returns Nothing. The component only synchronises Leaflet side effects.
 */
export default function MapViewportController({
  focusX,
  focusY,
  focusToken,
  imageBounds,
}: MapViewportControllerProps) {
  const leafletMap = useMap();
  const hasFittedInitialBoundsRef = useRef(false);

  useEffect(() => {
    if (hasFittedInitialBoundsRef.current) {
      return;
    }

    leafletMap.fitBounds(imageBounds, { padding: [32, 32] });
    hasFittedInitialBoundsRef.current = true;
  }, [imageBounds, leafletMap]);

  useEffect(() => {
    if (focusX === null || focusY === null) {
      return;
    }

    leafletMap.flyTo([focusY, focusX], Math.max(leafletMap.getZoom(), 1.5), {
      animate: true,
      duration: 0.5,
    });
  }, [focusToken, focusX, focusY, leafletMap]);

  return null;
}
