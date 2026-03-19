import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

interface MapViewportControllerProps {
  imageBounds: L.LatLngBoundsExpression;
}

export default function MapViewportController({
  imageBounds,
}: MapViewportControllerProps) {
  const leafletMap = useMap();

  useEffect(() => {
    leafletMap.fitBounds(imageBounds, { padding: [32, 32] });
  }, [imageBounds, leafletMap]);

  return null;
}
