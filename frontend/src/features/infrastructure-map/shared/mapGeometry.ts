import L from "leaflet";
import type { RectangleBounds } from "./types";

/**
 * Converts image-space rectangle bounds into Leaflet bounds.
 *
 * @param bounds Rectangle expressed in image coordinates.
 * @returns Leaflet bounds in `[lat, lng]` order.
 */
export function toLeafletBounds(bounds: RectangleBounds): L.LatLngBoundsExpression {
  return [
    [bounds.y, bounds.x],
    [bounds.y + bounds.height, bounds.x + bounds.width],
  ];
}

/**
 * Returns the visual centre of a zone for badge placement.
 *
 * @param bounds Zone rectangle.
 * @returns Leaflet coordinates located at the rectangle centre.
 */
export function getZoneCenter(bounds: RectangleBounds): L.LatLngExpression {
  return [bounds.y + bounds.height / 2, bounds.x + bounds.width / 2];
}
