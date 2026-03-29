import type L from "leaflet";
import type { MapImageDimensions } from "./types";
import type { InteractionTool } from "./interactionTypes";

/** Tool automatically selected when interaction mode opens. */
export const INITIAL_TOOL: InteractionTool = "select-zone";

/** Inline map container style used by React Leaflet. */
export const MAP_STYLE = {
  height: "100%",
  width: "100%",
  background: "#d8e1ea",
};

/**
 * Builds fixed Leaflet bounds matching the image size.
 *
 * @param mapImage Map image dimensions loaded from the backend layout.
 * @returns Bounds compatible with React Leaflet.
 */
export function createImageBounds(
  mapImage: MapImageDimensions,
): L.LatLngBoundsExpression {
  return [
    [0, 0],
    [mapImage.height, mapImage.width],
  ];
}
