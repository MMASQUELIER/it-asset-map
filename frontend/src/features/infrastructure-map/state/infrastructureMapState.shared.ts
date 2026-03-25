import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  ZoneDraft,
} from "../shared/types";
import type {
  InteractionTool,
  ZoneResizeHandle,
} from "../shared/interactionTypes";

/** Public state and callbacks exposed by the infrastructure map hook. */
export interface InfrastructureMapState {
  activeTool: InteractionTool;
  highlightedZoneId: number | null;
  clearPendingDrafts: () => void;
  handleCloseInteractionMode: () => void;
  handleDeleteMarker: (markerId: string) => void;
  handleLeaveZone: () => void;
  handleMoveMarker: (markerId: string, x: number, y: number) => void;
  handleMarkerPlacement: (x: number, y: number) => void;
  handleMarkerDraftSave: () => void;
  handleOpenInteractionMode: () => void;
  handleHoverZone: (zoneId: number) => void;
  handleSelectTool: (tool: InteractionTool) => void;
  handleZoneInteraction: (zoneId: number) => void;
  handleZoneDraftColorChange: (color: string) => void;
  handleZoneDraftSave: () => void;
  handleZoneDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
  handleZoneResizeDrag: (
    handle: ZoneResizeHandle,
    x: number,
    y: number,
  ) => void;
  handleCloseSelectedMarker: () => void;
  handleSelectMarker: (markerId: string) => void;
  isMarkerCreationToolActive: boolean;
  isMarkerMoveToolActive: boolean;
  isCreationToolActive: boolean;
  isZoneCreationToolActive: boolean;
  isMarkerDeletionToolActive: boolean;
  isDeletionToolActive: boolean;
  isInteractionMode: boolean;
  isZoneEditToolActive: boolean;
  pendingMarkerDraft: MarkerDraft | null;
  pendingMarkerDraftError: string | null;
  pendingMarkerId: string;
  markers: InteractiveMarker[];
  selectedMarker: InteractiveMarker | null;
  selectedMarkerFocusToken: number;
  selectedMarkerId: string | null;
  selectedZone: MapZone | null;
  setPendingMarkerId: (value: string) => void;
  setPendingZoneId: (value: string) => void;
  pendingZoneDraft: ZoneDraft | null;
  pendingZoneDraftError: string | null;
  pendingZoneId: string;
  zones: MapZone[];
}

/** Derived booleans describing the active interaction mode. */
interface InteractionModeFlags {
  isCreationToolActive: boolean;
  isDeletionToolActive: boolean;
  isMarkerCreationToolActive: boolean;
  isMarkerDeletionToolActive: boolean;
  isMarkerMoveToolActive: boolean;
  isZoneCreationToolActive: boolean;
  isZoneDeletionToolActive: boolean;
  isZoneEditToolActive: boolean;
}

/**
 * Resolves the marker currently selected in the UI.
 *
 * @param markers Available markers.
 * @param selectedMarkerId Selected marker identifier.
 * @returns Matching marker or `null`.
 */
export function findSelectedMarker(
  markers: InteractiveMarker[],
  selectedMarkerId: string | null,
): InteractiveMarker | null {
  if (selectedMarkerId === null) {
    return null;
  }

  return markers.find((marker) => marker.id === selectedMarkerId) ?? null;
}

/**
 * Resolves the zone currently selected in the UI.
 *
 * @param zones Available zones.
 * @param selectedZoneId Selected zone identifier.
 * @returns Matching zone or `null`.
 */
export function findSelectedZone(
  zones: MapZone[],
  selectedZoneId: number | null,
): MapZone | null {
  if (selectedZoneId === null) {
    return null;
  }

  return zones.find((zone) => zone.id === selectedZoneId) ?? null;
}

/**
 * Computes the zone that should be visually highlighted.
 *
 * @param hoveredZoneId Zone currently hovered by the pointer.
 * @param selectedMarkerZoneId Zone containing the selected marker.
 * @param selectedZoneId Explicitly selected zone.
 * @returns Zone identifier to highlight or `null`.
 */
export function getHighlightedZoneId(
  hoveredZoneId: number | null,
  selectedMarkerZoneId: number | null,
  selectedZoneId: number | null,
): number | null {
  return hoveredZoneId ?? selectedMarkerZoneId ?? selectedZoneId;
}

/**
 * Derives the active tool flags from the interaction mode and selected tool.
 *
 * @param isInteractionMode Whether interaction mode is enabled.
 * @param activeTool Currently selected tool.
 * @returns All derived booleans used by the map UI.
 */
export function getInteractionModeFlags(
  isInteractionMode: boolean,
  activeTool: InteractionTool,
): InteractionModeFlags {
  const isMarkerCreationToolActive =
    isInteractionMode && activeTool === "add-marker";
  const isMarkerMoveToolActive =
    isInteractionMode && activeTool === "move-marker";
  const isMarkerDeletionToolActive =
    isInteractionMode && activeTool === "delete-marker";
  const isZoneCreationToolActive =
    isInteractionMode && activeTool === "add-zone";
  const isZoneDeletionToolActive =
    isInteractionMode && activeTool === "delete-zone";
  const isZoneEditToolActive =
    isInteractionMode && activeTool === "select-zone";

  return {
    isCreationToolActive:
      isMarkerCreationToolActive || isZoneCreationToolActive,
    isDeletionToolActive:
      isMarkerDeletionToolActive || isZoneDeletionToolActive,
    isMarkerCreationToolActive,
    isMarkerDeletionToolActive,
    isMarkerMoveToolActive,
    isZoneCreationToolActive,
    isZoneDeletionToolActive,
    isZoneEditToolActive,
  };
}
