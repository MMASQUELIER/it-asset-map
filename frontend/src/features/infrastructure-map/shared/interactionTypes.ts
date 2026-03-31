/** Outils disponibles quand la carte passe en mode interaction. */
export type InteractionTool =
  | "select-zone"
  | "add-marker"
  | "move-marker"
  | "delete-marker"
  | "add-zone"
  | "delete-zone";

/** Poignees de redimensionnement supportees pour une zone rectangulaire. */
export type ZoneResizeHandle =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
