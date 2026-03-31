import type L from "leaflet";
import type { MapImageDimensions } from "@/features/infrastructure-map/model/types";

/** Style inline du conteneur React Leaflet. */
export const MAP_STYLE = {
  height: "100%",
  width: "100%",
  background: "#d8e1ea",
};

/**
 * Construit les bornes Leaflet fixes correspondant a la taille de l'image.
 */
export function createImageBounds(
  mapImage: MapImageDimensions,
): L.LatLngBoundsExpression {
  return [
    [0, 0],
    [mapImage.height, mapImage.width],
  ];
}
