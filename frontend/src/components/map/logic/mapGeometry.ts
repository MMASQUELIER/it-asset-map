import L from "leaflet";
import type { RectangleBounds } from "../../../types/layout";

export function toLeafletBounds(bounds: RectangleBounds): L.LatLngBoundsExpression {
  return [
    [bounds.y, bounds.x],
    [bounds.y + bounds.height, bounds.x + bounds.width],
  ];
}

export function getZoneCenter(bounds: RectangleBounds): L.LatLngExpression {
  return [bounds.y + bounds.height / 2, bounds.x + bounds.width / 2];
}
