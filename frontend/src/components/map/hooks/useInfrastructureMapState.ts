import { useEffect, useRef, useState } from "react";
import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  ZoneDraft,
} from "../../../types/layout";
import {
  assignMarkersWithinBoundsToZone,
  createDefaultMarkerTechnicalDetails,
  createMarkerDraft,
  isMarkerIdUnique,
  moveMarkerToCoordinates,
  reconcileMarkersWithZoneBounds,
} from "../logic/interactiveMarkers";
import type {
  InteractionTool,
  ZoneResizeHandle,
} from "../logic/interactionTypes";
import {
  clampZoneBounds,
  createBoundsFromDragPoints,
  createZoneDraft,
  doesZoneOverlap,
  hasMinimumZoneDimensions,
  isZoneIdUnique,
  MIN_ZONE_DIMENSION,
  resizeZoneBoundsFromHandle,
  sortZonesById,
} from "../logic/interactiveZones";
import {
  INITIAL_MARKERS,
  INITIAL_TOOL,
  INITIAL_ZONES,
  MAP_IMAGE,
} from "../logic/mapConfig";

interface UseInfrastructureMapStateResult {
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
  hoveredZoneId: number | null;
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

export default function useInfrastructureMapState(): UseInfrastructureMapStateResult {
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);
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
  const leaveZoneTimeoutRef = useRef<number | null>(null);

  const selectedMarker =
    markers.find((marker) => marker.id === selectedMarkerId) ?? null;
  const highlightedZoneId = hoveredZoneId ?? selectedMarker?.zoneId ?? selectedZoneId;
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? null;
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
  const isCreationToolActive =
    isMarkerCreationToolActive || isZoneCreationToolActive;
  const isDeletionToolActive =
    isMarkerDeletionToolActive || isZoneDeletionToolActive;

  // Selection
  function clearSelectedMarker(): void {
    setSelectedMarkerId(null);
  }

  function focusSelectedMarker(markerId: string): void {
    setSelectedMarkerId(markerId);
    setSelectedMarkerFocusToken((currentToken) => currentToken + 1);
  }

  // Drafts
  function clearPendingMarkerDraft(): void {
    setPendingMarkerDraft(null);
    setPendingMarkerId("");
    setPendingMarkerDraftError(null);
  }

  function clearPendingZoneDraft(): void {
    setPendingZoneDraft(null);
    setPendingZoneId("");
    setPendingZoneDraftError(null);
  }

  function clearPendingDrafts(): void {
    clearPendingMarkerDraft();
    clearPendingZoneDraft();
  }

  // Hover
  function clearLeaveZoneTimeout(): void {
    if (leaveZoneTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(leaveZoneTimeoutRef.current);
    leaveZoneTimeoutRef.current = null;
  }

  function handleHoverZone(zoneId: number): void {
    clearLeaveZoneTimeout();
    setHoveredZoneId((currentZoneId) =>
      currentZoneId === zoneId ? currentZoneId : zoneId,
    );
  }

  function handleLeaveZone(): void {
    clearLeaveZoneTimeout();
    leaveZoneTimeoutRef.current = window.setTimeout(() => {
      setHoveredZoneId(null);
      leaveZoneTimeoutRef.current = null;
    }, 40);
  }

  useEffect(() => {
    return () => {
      clearLeaveZoneTimeout();
    };
  }, []);

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

  function handleOpenInteractionMode(): void {
    setIsInteractionMode(true);
    setActiveTool(INITIAL_TOOL);
    clearSelectedMarker();
    clearPendingDrafts();
  }

  function handleCloseInteractionMode(): void {
    setIsInteractionMode(false);
    setActiveTool(INITIAL_TOOL);
    clearPendingDrafts();
  }

  function handleSelectTool(tool: InteractionTool): void {
    setActiveTool(tool);
    clearSelectedMarker();
    clearPendingDrafts();
  }

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

  function handleMoveMarker(markerId: string, x: number, y: number): void {
    if (!isMarkerMoveToolActive) {
      return;
    }

    setMarkers((currentMarkers) =>
      moveMarkerToCoordinates(currentMarkers, zones, markerId, x, y, MAP_IMAGE),
    );
  }

  function handleZoneDraftDrag(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ): void {
    const nextBounds = createBoundsFromDragPoints(
      MAP_IMAGE,
      startX,
      startY,
      currentX,
      currentY,
    );

    setPendingZoneDraft((currentDraft) => {
      if (currentDraft === null) {
        const nextDraft = createZoneDraft(MAP_IMAGE, zones, startX, startY);

        if (pendingZoneId.length === 0) {
          setPendingZoneId(String(nextDraft.suggestedId));
        }

        return {
          ...nextDraft,
          bounds: nextBounds,
        };
      }

      return {
        ...currentDraft,
        bounds: nextBounds,
      };
    });
    setPendingZoneDraftError(null);
  }

  function handleMarkerDraftSave(): void {
    if (pendingMarkerDraft === null) {
      return;
    }

    const nextMarkerId = pendingMarkerId.trim();

    if (nextMarkerId.length === 0) {
      setPendingMarkerDraftError("L'identifiant du marqueur est obligatoire.");
      return;
    }

    if (!isMarkerIdUnique(markers, nextMarkerId)) {
      setPendingMarkerDraftError("Cet identifiant existe deja dans la session.");
      return;
    }

    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        id: nextMarkerId,
        x: pendingMarkerDraft.x,
        y: pendingMarkerDraft.y,
        technicalDetails: createDefaultMarkerTechnicalDetails(
          nextMarkerId,
          pendingMarkerDraft.zoneId,
        ),
        zoneId: pendingMarkerDraft.zoneId,
      },
    ]);
    clearPendingDrafts();
  }

  function handleZoneDraftSave(): void {
    if (pendingZoneDraft === null) {
      return;
    }

    const nextZoneId = Number(pendingZoneId);

    if (!Number.isInteger(nextZoneId) || nextZoneId <= 0) {
      setPendingZoneDraftError(
        "L'identifiant de zone doit etre un nombre entier positif.",
      );
      return;
    }

    if (!isZoneIdUnique(zones, nextZoneId)) {
      setPendingZoneDraftError("Cet identifiant de zone existe deja.");
      return;
    }

    if (!hasMinimumZoneDimensions(pendingZoneDraft.bounds)) {
      setPendingZoneDraftError(
        `La zone doit faire au moins ${MIN_ZONE_DIMENSION} x ${MIN_ZONE_DIMENSION} pixels.`,
      );
      return;
    }

    const nextBounds = clampZoneBounds(pendingZoneDraft.bounds, MAP_IMAGE);

    if (doesZoneOverlap(zones, nextBounds)) {
      setPendingZoneDraftError("La nouvelle zone chevauche une zone existante.");
      return;
    }

    const nextZone: MapZone = {
      id: nextZoneId,
      color: pendingZoneDraft.color,
      bounds: nextBounds,
      pcs: [],
    };

    setZones((currentZones) => sortZonesById([...currentZones, nextZone]));
    setMarkers((currentMarkers) =>
      assignMarkersWithinBoundsToZone(currentMarkers, nextZoneId, nextBounds),
    );
    setSelectedZoneId(nextZoneId);
    clearPendingDrafts();
  }

  function handleDeleteMarker(markerId: string): void {
    setSelectedMarkerId((currentMarkerId) =>
      currentMarkerId === markerId ? null : currentMarkerId,
    );
    setMarkers((currentMarkers) =>
      currentMarkers.filter((marker) => marker.id !== markerId),
    );
  }

  function handleSelectMarker(markerId: string): void {
    focusSelectedMarker(markerId);
  }

  function handleCloseSelectedMarker(): void {
    clearSelectedMarker();
  }

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

  function handleDeleteZone(zoneId: number): void {
    setZones((currentZones) =>
      currentZones.filter((zone) => zone.id !== zoneId),
    );
    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) =>
        marker.zoneId === zoneId ? { ...marker, zoneId: null } : marker,
      ),
    );
    setHoveredZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : currentZoneId,
    );
    setSelectedZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : currentZoneId,
    );
  }

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
    hoveredZoneId,
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
