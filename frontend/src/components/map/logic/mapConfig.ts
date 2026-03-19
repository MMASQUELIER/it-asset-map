import type L from "leaflet";
import { STATIC_MAP_DATA } from "./staticMapData";
import { buildInitialMarkers } from "./interactiveMarkers";
import { buildInitialZones } from "./interactiveZones";
import type { InteractionTool } from "./interactionTypes";

export const INITIAL_TOOL: InteractionTool = "select-zone";
export const MAP_IMAGE = STATIC_MAP_DATA.image;
export const INITIAL_ZONES = buildInitialZones(STATIC_MAP_DATA.zones);
export const INITIAL_MARKERS = buildInitialMarkers(STATIC_MAP_DATA.zones);

export const IMAGE_BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [MAP_IMAGE.height, MAP_IMAGE.width],
];

export const MAP_STYLE = {
  height: "100%",
  width: "100%",
  background: "#d8e1ea",
};
