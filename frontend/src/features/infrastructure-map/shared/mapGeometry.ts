import L from "leaflet";
import type { RectangleBounds } from "@/features/infrastructure-map/model/types";

/**
 * Convertit un rectangle exprime en coordonnees image vers des bornes Leaflet.
 */
export function toLeafletBounds(bounds: RectangleBounds): L.LatLngBoundsExpression {
  const topLeft: [number, number] = [bounds.y, bounds.x];
  const bottomRight: [number, number] = [
    bounds.y + bounds.height,
    bounds.x + bounds.width,
  ];

  return [
    topLeft,
    bottomRight,
  ];
}

/**
 * Retourne le centre visuel d'une zone pour placer badge ou etiquette.
 */
export function getZoneCenter(bounds: RectangleBounds): L.LatLngExpression {
  const centerY = bounds.y + bounds.height / 2;
  const centerX = bounds.x + bounds.width / 2;

  return [centerY, centerX];
}
