import type L from "leaflet";
import type { MapImageDimensions } from "@/features/infrastructure-map/model/types";

export const MAP_STYLE = {
  height: "100%",
  width: "100%",
  background: "#d8e1ea",
};

export function createImageBounds(
  mapImage: MapImageDimensions,
): L.LatLngBoundsExpression {
  return [
    [0, 0],
    [mapImage.height, mapImage.width],
  ];
}
