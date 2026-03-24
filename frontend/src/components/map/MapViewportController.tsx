import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

interface MapViewportControllerProps {
  bounds: L.LatLngBoundsExpression;
}

export default function MapViewportController({
  bounds,
}: MapViewportControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [bounds, map]);

  return null;
}
