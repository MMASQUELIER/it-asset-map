import { useEffect, useState } from "react";
import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
  MarkerDraft,
  PlacementPcCandidate,
  ZoneDraft,
} from "../shared/types";
import {
  assignMarkersWithinBoundsToZone,
  createMarkerDraft,
  moveMarkerToCoordinates,
  reconcileMarkersWithZoneBounds,
} from "../markers/logic/interactiveMarkers";
import { doesPlacementCandidateMatchSector } from "../markers/logic/backendPlacementCandidates";
import type {
  InteractionTool,
  ZoneResizeHandle,
} from "../shared/interactionTypes";
import {
  doesZoneOverlap,
  resizeZoneBoundsFromHandle,
  sortZonesById,
} from "../zones/logic/interactiveZones";
import { INITIAL_TOOL } from "../shared/mapConfig";
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
import { syncPcTechnicalDetailsWithZone } from "../pc-details/logic/pcTechnicalDetails";
import { getSectorColor } from "../zones/logic/zoneAppearance";

interface UseInfrastructureMapStateOptions {
  availableSectors: string[];
  initialMapImage: MapImageDimensions;
  initialMarkers: InteractiveMarker[];
  initialZones: MapZone[];
  placementPcCandidates: PlacementPcCandidate[];
}

/**
 * Centralises the full interactive state of the map and the callbacks used by
 * the toolbar, overlays and detail panels.
 *
 * @returns Current map state and all interaction handlers.
 */
export default function useInfrastructureMapState({
  availableSectors,
  initialMapImage,
  initialMarkers,
  initialZones,
  placementPcCandidates,
}: UseInfrastructureMapStateOptions): InfrastructureMapState {
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [isInteractionMode, setIsInteractionMode] = useState(false);
  const [activeTool, setActiveTool] = useState<InteractionTool>(INITIAL_TOOL);
  const [zones, setZones] = useState<MapZone[]>(() => initialZones);
  const [markers, setMarkers] = useState<InteractiveMarker[]>(() =>
    initialMarkers
  );
  const [pendingMarkerDraft, setPendingMarkerDraft] = useState<
    MarkerDraft | null
  >(null);
  const [pendingMarkerId, setPendingMarkerId] = useState("");
  const [pendingMarkerDraftError, setPendingMarkerDraftError] = useState<
    string | null
  >(null);
  const [pendingZoneDraft, setPendingZoneDraft] = useState<ZoneDraft | null>(
    null,
  );
  const [pendingZoneId, setPendingZoneId] = useState("");
  const [pendingZoneSector, setPendingZoneSector] = useState("");
  const [pendingZoneProdsched, setPendingZoneProdsched] = useState("");
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
  const pendingMarkerZone = pendingMarkerDraft?.zoneId === null ||
      pendingMarkerDraft?.zoneId === undefined
    ? null
    : (zones.find((zone) => zone.id === pendingMarkerDraft.zoneId) ?? null);
  const availablePlacementPcCandidates = placementPcCandidates.filter(
    (candidate) => {
      const isAlreadyPlaced = markers.some((marker) =>
        marker.id === candidate.markerId
      );

      if (isAlreadyPlaced) {
        return false;
      }

      if (pendingMarkerZone === null) {
        return true;
      }

      return doesPlacementCandidateMatchSector(
        candidate,
        pendingMarkerZone.sector,
      );
    },
  );
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

  useEffect(() => {
    if (
      pendingZoneDraft !== null &&
      pendingZoneSector.length === 0 &&
      availableSectors.length > 0
    ) {
      setPendingZoneSector(availableSectors[0]);
    }
  }, [availableSectors, pendingZoneDraft, pendingZoneSector]);

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
    setPendingZoneSector("");
    setPendingZoneProdsched("");
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
    setPendingMarkerId("");
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
      moveMarkerToCoordinates(
        currentMarkers,
        zones,
        markerId,
        x,
        y,
        initialMapImage,
      )
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
      mapImage: initialMapImage,
      startX,
      startY,
      currentX,
      currentY,
    });

    setPendingZoneDraft(nextDraftPreview.draft);

    if (nextDraftPreview.nextPendingZoneId !== null) {
      const suggestedZoneId = nextDraftPreview.nextPendingZoneId;

      setPendingZoneId(suggestedZoneId);
      setPendingZoneSector((currentSector) =>
        currentSector.length > 0 ? currentSector : (availableSectors[0] ?? "")
      );
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
      zones,
      availablePlacementPcCandidates,
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
      pendingZoneSector,
      pendingZoneProdsched,
      zones,
      initialMapImage,
    );

    if (zoneDraftSaveResult.error !== null) {
      setPendingZoneDraftError(zoneDraftSaveResult.error);
      return;
    }

    if (zoneDraftSaveResult.zone === null) {
      return;
    }

    const nextZone = zoneDraftSaveResult.zone;

    setZones((currentZones) => sortZonesById([...currentZones, nextZone]));
    setMarkers((currentMarkers) =>
      assignMarkersWithinBoundsToZone(
        currentMarkers,
        nextZone,
        nextZone.bounds,
      )
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
      currentMarkerId === markerId ? null : currentMarkerId
    );
    setMarkers((currentMarkers) =>
      currentMarkers.filter((marker) => marker.id !== markerId)
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
      initialMapImage,
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
          : zone
      )
    );
    setMarkers((currentMarkers) =>
      reconcileMarkersWithZoneBounds(
        currentMarkers,
        selectedZone,
        resizedBounds,
      )
    );
  }

  /**
   * Updates the business sector of the current zone draft.
   *
   * @param sector User-entered sector name.
   */
  function handleZoneDraftSectorChange(sector: string): void {
    setPendingZoneSector(sector);
  }

  /**
   * Updates the prodsched attached to the current zone draft.
   *
   * @param prodsched User-entered prodsched value.
   */
  function handleZoneDraftProdschedChange(prodsched: string): void {
    setPendingZoneProdsched(prodsched);
  }

  /**
   * Updates the sector metadata of the currently selected zone.
   *
   * Incompatible markers are detached, while compatible markers inside the zone
   * keep their assignment.
   *
   * @param sector Newly selected sector.
   */
  function handleSelectedZoneSectorChange(sector: string): void {
    if (selectedZone === null) {
      return;
    }

    const nextSector = sector.trim();
    const nextZone = {
      ...selectedZone,
      color: getSectorColor(nextSector),
      label: selectedZone.prodsched,
      sector: nextSector,
    };

    setZones((currentZones) =>
      currentZones.map((zone) => zone.id === nextZone.id ? nextZone : zone)
    );
    setMarkers((currentMarkers) => {
      const detachedIncompatibleMarkers = currentMarkers.map((marker) => {
        if (marker.zoneId !== nextZone.id) {
          return marker;
        }

        if (doesMarkerMatchZoneSector(marker, nextZone)) {
          return marker;
        }

        return {
          ...marker,
          zoneId: null,
          technicalDetails: syncPcTechnicalDetailsWithZone(
            marker.technicalDetails,
            null,
          ),
        };
      });

      return assignMarkersWithinBoundsToZone(
        detachedIncompatibleMarkers,
        nextZone,
        nextZone.bounds,
      );
    });
  }

  /**
   * Updates the prodsched metadata of the currently selected zone.
   *
   * @param prodsched Newly entered prodsched.
   */
  function handleSelectedZoneProdschedChange(prodsched: string): void {
    if (selectedZone === null) {
      return;
    }

    const nextProdsched = prodsched.trimStart();
    const nextZone = {
      ...selectedZone,
      label: nextProdsched,
      prodsched: nextProdsched,
    };

    setZones((currentZones) =>
      currentZones.map((zone) => zone.id === nextZone.id ? nextZone : zone)
    );
    setMarkers((currentMarkers) =>
      assignMarkersWithinBoundsToZone(currentMarkers, nextZone, nextZone.bounds)
    );
  }

  /**
   * Deletes a zone and detaches markers that previously belonged to it.
   *
   * @param zoneId Zone to remove.
   */
  function handleDeleteZone(zoneId: number): void {
    setZones((currentZones) =>
      currentZones.filter((zone) => zone.id !== zoneId)
    );
    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) =>
        marker.zoneId === zoneId
          ? {
            ...marker,
            zoneId: null,
            technicalDetails: syncPcTechnicalDetailsWithZone(
              marker.technicalDetails,
              null,
            ),
          }
          : marker
      )
    );
    clearHoveredZoneIfMatches(zoneId);
    setSelectedZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : currentZoneId
    );
  }

  /**
   * Toggles the visual selection of a zone.
   *
   * @param zoneId Zone to select or unselect.
   */
  function toggleZoneSelection(zoneId: number): void {
    setSelectedZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : zoneId
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
    handleSelectedZoneProdschedChange,
    handleSelectedZoneSectorChange,
    handleSelectMarker,
    handleSelectTool,
    handleZoneDraftDrag,
    handleZoneDraftProdschedChange,
    handleZoneDraftSectorChange,
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
    availablePlacementPcCandidates,
    availableSectors,
    pendingZoneDraft,
    pendingZoneDraftError,
    pendingZoneProdsched,
    pendingZoneSector,
    selectedMarker,
    selectedMarkerFocusToken,
    selectedMarkerId,
    selectedZone,
    setPendingMarkerId,
    zones,
  };
}

function doesMarkerMatchZoneSector(
  marker: InteractiveMarker,
  zone: MapZone,
): boolean {
  const markerSector = normalizeSectorName(
    marker.technicalDetails.floorLocation ?? marker.technicalDetails.sector,
  );
  const zoneSector = normalizeSectorName(zone.sector);

  return markerSector.length === 0 || zoneSector.length === 0 ||
    markerSector === zoneSector;
}

function normalizeSectorName(value: string | undefined): string {
  return value?.trim().toUpperCase() ?? "";
}
