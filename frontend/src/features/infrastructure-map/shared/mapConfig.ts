import type L from "leaflet";
import { STATIC_MAP_DATA } from "../data/staticMapData";
import { buildInitialMarkers } from "../markers/logic/interactiveMarkers";
import { buildInitialZones } from "../zones/logic/interactiveZones";
import type { InteractionTool } from "./interactionTypes";

/** Tool automatically selected when interaction mode opens. */
export const INITIAL_TOOL: InteractionTool = "select-zone";
/** Static description of the map image dimensions. */
export const MAP_IMAGE = STATIC_MAP_DATA.image;
/** Initial zones cloned from the static dataset. */
export const INITIAL_ZONES = buildInitialZones(STATIC_MAP_DATA.zones);
/** Initial markers flattened from the static dataset. */
export const INITIAL_MARKERS = buildInitialMarkers(STATIC_MAP_DATA.zones);

/** Fixed Leaflet bounds matching the image size. */
export const IMAGE_BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [MAP_IMAGE.height, MAP_IMAGE.width],
];

/** Inline map container style used by React Leaflet. */
export const MAP_STYLE = {
  height: "100%",
  width: "100%",
  background: "#d8e1ea",
};
