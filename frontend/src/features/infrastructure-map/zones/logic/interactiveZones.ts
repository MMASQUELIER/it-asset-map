/**
 * Public facade for zone-related helpers used by the interactive map.
 *
 * Keeping these re-exports in one place makes consumers simpler and avoids
 * leaking low-level implementation file names across the UI.
 */
export {
  doesZoneOverlap,
  findZoneById,
  sortZonesById,
} from "./zoneCollections";
export { createZoneDraft } from "./zoneDrafts";
export {
  clampZoneBounds,
  createBoundsFromDragPoints,
  hasMinimumZoneDimensions,
  MIN_ZONE_DIMENSION,
  resizeZoneBoundsFromHandle,
} from "./zoneGeometry";
