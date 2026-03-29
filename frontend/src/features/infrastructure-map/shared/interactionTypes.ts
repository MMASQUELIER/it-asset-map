/** Tools available when the map enters interaction mode. */
export type InteractionTool =
  | "select-zone"
  | "add-marker"
  | "move-marker"
  | "delete-marker"
  | "add-zone"
  | "delete-zone";

/** Supported drag handles used to resize a rectangular zone. */
export type ZoneResizeHandle =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
