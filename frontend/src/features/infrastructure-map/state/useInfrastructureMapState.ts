import { useState } from "react";
import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  ZoneDraft,
} from "../shared/types";
import {
  assignMarkersWithinBoundsToZone,
  createMarkerDraft,
  moveMarkerToCoordinates,
  reconcileMarkersWithZoneBounds,
} from "../markers/logic/interactiveMarkers";
import type {
  InteractionTool,
  ZoneResizeHandle,
} from "../shared/interactionTypes";
import {
  doesZoneOverlap,
  resizeZoneBoundsFromHandle,
  sortZonesById,
} from "../zones/logic/interactiveZones";
import {
  INITIAL_MARKERS,
  INITIAL_TOOL,
  INITIAL_ZONES,
  MAP_IMAGE,
} from "../shared/mapConfig";
import {
  findSelectedMarker,
  findSelectedZone,
  getHighlightedZoneId,
  getInteractionModeFlags,
  type InfrastructureMapState,
} from "./infrastructureMapState.shared";
import {
  buildZoneDraftPreview,
  validateMarkerDraftSave,
  validateZoneDraftSave,
} from "./infrastructureMapDrafts";
import { useZoneHoverState } from "./useZoneHoverState";

/**
 * Centralises the full interactive state of the map and the callbacks used by
 * the toolbar, overlays and detail panels.
 *
 * @returns Current map state and all interaction handlers.
 */
export default function useInfrastructureMapState(): InfrastructureMapState {
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [isInteractionMode, setIsInteractionMode] = useState(false);
  const [activeTool, setActiveTool] = useState<InteractionTool>(INITIAL_TOOL);
  const [zones, setZones] = useState<MapZone[]>(() => INITIAL_ZONES);
  const [markers, setMarkers] = useState<InteractiveMarker[]>(() => INITIAL_MARKERS);
  const [pendingMarkerDraft, setPendingMarkerDraft] =
    useState<MarkerDraft | null>(null);
  const [pendingMarkerId, setPendingMarkerId] = useState("");
  const [pendingMarkerDraftError, setPendingMarkerDraftError] = useState<
    string | null
  >(null);
  const [pendingZoneDraft, setPendingZoneDraft] = useState<ZoneDraft | null>(
    null,
  );
  const [pendingZoneId, setPendingZoneId] = useState("");
  const [pendingZoneDraftError, setPendingZoneDraftError] = useState<
    string | null
  >(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [selectedMarkerFocusToken, setSelectedMarkerFocusToken] = useState(0);
  const {
    hoveredZoneId,
    handleHoverZone,
    handleLeaveZone,
    clearHoveredZoneIfMatches,
  } = useZoneHoverState();

  const selectedMarker = findSelectedMarker(markers, selectedMarkerId);
  const selectedZone = findSelectedZone(zones, selectedZoneId);
  const highlightedZoneId = getHighlightedZoneId(
    hoveredZoneId,
    selectedMarker?.zoneId ?? null,
    selectedZoneId,
  );
  const {
    isCreationToolActive,
    isDeletionToolActive,
    isMarkerCreationToolActive,
    isMarkerDeletionToolActive,
    isMarkerMoveToolActive,
    isZoneCreationToolActive,
    isZoneDeletionToolActive,
    isZoneEditToolActive,
  } = getInteractionModeFlags(isInteractionMode, activeTool);

  /**
   * Clears the currently selected marker.
   */
  function clearSelectedMarker(): void {
    setSelectedMarkerId(null);
  }

  /**
   * Selects a marker and increments the focus token so the viewport recentres.
   *
   * @param markerId Marker to focus.
   */
  function focusSelectedMarker(markerId: string): void {
    setSelectedMarkerId(markerId);
    setSelectedMarkerFocusToken((currentToken) => currentToken + 1);
  }

  /**
   * Clears the temporary marker draft and its validation state.
   */
  function clearPendingMarkerDraft(): void {
    setPendingMarkerDraft(null);
    setPendingMarkerId("");
    setPendingMarkerDraftError(null);
  }

  /**
   * Clears the temporary zone draft and its validation state.
   */
  function clearPendingZoneDraft(): void {
    setPendingZoneDraft(null);
    setPendingZoneId("");
    setPendingZoneDraftError(null);
  }

  /**
   * Clears every transient draft currently displayed in the UI.
   */
  function clearPendingDrafts(): void {
    clearPendingMarkerDraft();
    clearPendingZoneDraft();
  }

  /**
   * Clears the current marker selection and every open draft panel.
   */
  function resetTransientUiState(): void {
    clearSelectedMarker();
    clearPendingDrafts();
  }

  /**
   * Handles a zone click in either consultation or interaction mode.
   *
   * @param zoneId Clicked zone identifier.
   */
  function handleZoneInteraction(zoneId: number): void {
    if (!isInteractionMode) {
      clearSelectedMarker();
      toggleZoneSelection(zoneId);
      return;
    }

    if (isZoneDeletionToolActive) {
      handleDeleteZone(zoneId);
      return;
    }

    if (isZoneEditToolActive) {
      toggleZoneSelection(zoneId);
    }
  }

  /**
   * Enables interaction mode and resets transient UI state.
   */
  function handleOpenInteractionMode(): void {
    setIsInteractionMode(true);
    setActiveTool(INITIAL_TOOL);
    resetTransientUiState();
  }

  /**
   * Disables interaction mode and clears transient UI state.
   */
  function handleCloseInteractionMode(): void {
    setIsInteractionMode(false);
    setActiveTool(INITIAL_TOOL);
    resetTransientUiState();
  }

  /**
   * Changes the active interaction tool and resets transient UI state.
   *
   * @param tool Newly selected tool.
   */
  function handleSelectTool(tool: InteractionTool): void {
    setActiveTool(tool);
    resetTransientUiState();
  }

  /**
   * Starts a new marker draft from a clicked map coordinate.
   *
   * @param x Clicked X coordinate.
   * @param y Clicked Y coordinate.
   */
  function handleMarkerPlacement(x: number, y: number): void {
    if (!isMarkerCreationToolActive) {
      return;
    }

    clearSelectedMarker();

    const nextDraft = createMarkerDraft(zones, markers, x, y);

    setPendingMarkerDraft(nextDraft);
    setPendingMarkerId(nextDraft.suggestedId);
    setPendingMarkerDraftError(null);
  }

  /**
   * Moves an existing marker when drag mode is active.
   *
   * @param markerId Marker being moved.
   * @param x New X coordinate.
   * @param y New Y coordinate.
   */
  function handleMoveMarker(markerId: string, x: number, y: number): void {
    if (!isMarkerMoveToolActive) {
      return;
    }

    setMarkers((currentMarkers) =>
      moveMarkerToCoordinates(currentMarkers, zones, markerId, x, y, MAP_IMAGE),
    );
  }

  /**
   * Updates the temporary rectangle displayed while drawing a new zone.
   *
   * @param startX Drag origin X coordinate.
   * @param startY Drag origin Y coordinate.
   * @param currentX Current pointer X coordinate.
   * @param currentY Current pointer Y coordinate.
   */
  function handleZoneDraftDrag(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ): void {
    const nextDraftPreview = buildZoneDraftPreview({
      currentDraft: pendingZoneDraft,
      pendingZoneId,
      zones,
      mapImage: MAP_IMAGE,
      startX,
      startY,
      currentX,
      currentY,
    });

    setPendingZoneDraft(nextDraftPreview.draft);

    if (nextDraftPreview.nextPendingZoneId !== null) {
      setPendingZoneId(nextDraftPreview.nextPendingZoneId);
    }

    setPendingZoneDraftError(null);
  }

  /**
   * Validates and persists the current marker draft.
   */
  function handleMarkerDraftSave(): void {
    const markerDraftSaveResult = validateMarkerDraftSave(
      pendingMarkerDraft,
      pendingMarkerId,
      markers,
    );

    if (markerDraftSaveResult.error !== null) {
      setPendingMarkerDraftError(markerDraftSaveResult.error);
      return;
    }

    if (markerDraftSaveResult.marker === null) {
      return;
    }

    const nextMarker = markerDraftSaveResult.marker;

    setMarkers((currentMarkers) => [
      ...currentMarkers,
      nextMarker,
    ]);
    clearPendingDrafts();
  }

  /**
   * Validates and persists the current zone draft.
   */
  function handleZoneDraftSave(): void {
    const zoneDraftSaveResult = validateZoneDraftSave(
      pendingZoneDraft,
      pendingZoneId,
      zones,
      MAP_IMAGE,
    );

    if (zoneDraftSaveResult.error !== null) {
      setPendingZoneDraftError(zoneDraftSaveResult.error);
      return;
    }

    if (zoneDraftSaveResult.zone === null) {
      return;
    }

    const nextZone = zoneDraftSaveResult.zone;

    setZones((currentZones) =>
      sortZonesById([...currentZones, nextZone]),
    );
    setMarkers((currentMarkers) =>
      assignMarkersWithinBoundsToZone(
        currentMarkers,
        nextZone.id,
        nextZone.bounds,
      ),
    );
    setSelectedZoneId(nextZone.id);
    clearPendingDrafts();
  }

  /**
   * Deletes a marker and clears the selection if it was focused.
   *
   * @param markerId Marker to remove.
   */
  function handleDeleteMarker(markerId: string): void {
    setSelectedMarkerId((currentMarkerId) =>
      currentMarkerId === markerId ? null : currentMarkerId,
    );
    setMarkers((currentMarkers) =>
      currentMarkers.filter((marker) => marker.id !== markerId),
    );
  }

  /**
   * Selects a marker and triggers viewport focus.
   *
   * @param markerId Marker to select.
   */
  function handleSelectMarker(markerId: string): void {
    focusSelectedMarker(markerId);
  }

  /**
   * Closes the currently open PC details panel.
   */
  function handleCloseSelectedMarker(): void {
    clearSelectedMarker();
  }

  /**
   * Resizes the selected zone and reconciles marker membership.
   *
   * @param handle Dragged resize handle.
   * @param x New X coordinate.
   * @param y New Y coordinate.
   */
  function handleZoneResizeDrag(
    handle: ZoneResizeHandle,
    x: number,
    y: number,
  ): void {
    if (selectedZone === null) {
      return;
    }

    const resizedBounds = resizeZoneBoundsFromHandle(
      selectedZone.bounds,
      handle,
      x,
      y,
      MAP_IMAGE,
    );
    const otherZones = zones.filter((zone) => zone.id !== selectedZone.id);

    if (doesZoneOverlap(otherZones, resizedBounds)) {
      return;
    }

    setZones((currentZones) =>
      currentZones.map((zone) =>
        zone.id === selectedZone.id
          ? {
              ...zone,
              bounds: resizedBounds,
            }
          : zone,
      ),
    );
    setMarkers((currentMarkers) =>
      reconcileMarkersWithZoneBounds(
        currentMarkers,
        selectedZone.id,
        resizedBounds,
      ),
    );
  }

  /**
   * Updates the color of the current zone draft.
   *
   * @param color Selected hexadecimal color.
   */
  function handleZoneDraftColorChange(color: string): void {
    setPendingZoneDraft((currentDraft) =>
      currentDraft === null
        ? currentDraft
        : {
            ...currentDraft,
            color,
          },
    );
  }

  /**
   * Deletes a zone and detaches markers that previously belonged to it.
   *
   * @param zoneId Zone to remove.
   */
  function handleDeleteZone(zoneId: number): void {
    setZones((currentZones) =>
      currentZones.filter((zone) => zone.id !== zoneId),
    );
    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) =>
        marker.zoneId === zoneId ? { ...marker, zoneId: null } : marker,
      ),
    );
    clearHoveredZoneIfMatches(zoneId);
    setSelectedZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : currentZoneId,
    );
  }

  /**
   * Toggles the visual selection of a zone.
   *
   * @param zoneId Zone to select or unselect.
   */
  function toggleZoneSelection(zoneId: number): void {
    setSelectedZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : zoneId,
    );
  }

  return {
    activeTool,
    clearPendingDrafts,
    handleCloseInteractionMode,
    handleCloseSelectedMarker,
    handleDeleteMarker,
    handleHoverZone,
    handleLeaveZone,
    handleMoveMarker,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    handleOpenInteractionMode,
    handleSelectMarker,
    handleSelectTool,
    handleZoneDraftDrag,
    handleZoneDraftColorChange,
    handleZoneDraftSave,
    handleZoneInteraction,
    handleZoneResizeDrag,
    highlightedZoneId,
    isCreationToolActive,
    isInteractionMode,
    isDeletionToolActive,
    isMarkerCreationToolActive,
    isMarkerMoveToolActive,
    isMarkerDeletionToolActive,
    isZoneCreationToolActive,
    isZoneEditToolActive,
    markers,
    pendingMarkerDraft,
    pendingMarkerDraftError,
    pendingMarkerId,
    pendingZoneDraft,
    pendingZoneDraftError,
    pendingZoneId,
    selectedMarker,
    selectedMarkerFocusToken,
    selectedMarkerId,
    selectedZone,
    setPendingMarkerId,
    setPendingZoneId,
    zones,
  };
}
