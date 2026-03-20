import { useEffect, useRef, useState } from "react";
import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  ZoneDraft,
} from "../../../types/layout";
import {
  assignMarkersWithinBoundsToZone,
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
  isZoneIdUnique,
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
  const [markerDraft, setMarkerDraft] = useState<MarkerDraft | null>(null);
  const [markerDraftId, setMarkerDraftId] = useState("");
  const [markerDraftError, setMarkerDraftError] = useState<string | null>(null);
  const [zoneDraft, setZoneDraft] = useState<ZoneDraft | null>(null);
  const [zoneDraftId, setZoneDraftId] = useState("");
  const [zoneDraftError, setZoneDraftError] = useState<string | null>(null);
  const hoveredZoneClearTimeoutRef = useRef<number | null>(null);

  const highlightedZoneId = hoveredZoneId ?? selectedZoneId;
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

  function clearHoveredZoneClearTimeout(): void {
    if (hoveredZoneClearTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(hoveredZoneClearTimeoutRef.current);
    hoveredZoneClearTimeoutRef.current = null;
  }

  function handleHoverZone(zoneId: number): void {
    clearHoveredZoneClearTimeout();
    setHoveredZoneId((currentZoneId) =>
      currentZoneId === zoneId ? currentZoneId : zoneId,
    );
  }

  function handleLeaveZone(): void {
    clearHoveredZoneClearTimeout();
    hoveredZoneClearTimeoutRef.current = window.setTimeout(() => {
      setHoveredZoneId(null);
      hoveredZoneClearTimeoutRef.current = null;
    }, 40);
  }

  useEffect(() => {
    return () => {
      clearHoveredZoneClearTimeout();
    };
  }, []);

  function handleZoneInteraction(zoneId: number): void {
    if (!isInteractionMode) {
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
    clearPendingDrafts();
  }

  function handleCloseInteractionMode(): void {
    setIsInteractionMode(false);
    setActiveTool(INITIAL_TOOL);
    clearPendingDrafts();
  }

  function handleSelectTool(tool: InteractionTool): void {
    setActiveTool(tool);
    clearPendingDrafts();
  }

  function handleMarkerPlacement(x: number, y: number): void {
    if (!isMarkerCreationToolActive) {
      return;
    }

    const nextDraft = createMarkerDraft(zones, markers, x, y);

    setMarkerDraft(nextDraft);
    setMarkerDraftId(nextDraft.suggestedId);
    setMarkerDraftError(null);
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

    setZoneDraft((currentDraft) => {
      if (currentDraft === null) {
        const nextDraft = createZoneDraft(MAP_IMAGE, zones, startX, startY);

        if (zoneDraftId.length === 0) {
          setZoneDraftId(String(nextDraft.suggestedId));
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
    setZoneDraftError(null);
  }

  function handleMarkerDraftSave(): void {
    if (markerDraft === null) {
      return;
    }

    const nextMarkerId = markerDraftId.trim();

    if (nextMarkerId.length === 0) {
      setMarkerDraftError("L'identifiant du marqueur est obligatoire.");
      return;
    }

    if (!isMarkerIdUnique(markers, nextMarkerId)) {
      setMarkerDraftError("Cet identifiant existe deja dans la session.");
      return;
    }

    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        id: nextMarkerId,
        x: markerDraft.x,
        y: markerDraft.y,
        zoneId: markerDraft.zoneId,
      },
    ]);
    clearPendingDrafts();
  }

  function handleZoneDraftSave(): void {
    if (zoneDraft === null) {
      return;
    }

    const nextZoneId = Number(zoneDraftId);

    if (!Number.isInteger(nextZoneId) || nextZoneId <= 0) {
      setZoneDraftError("L'identifiant de zone doit etre un nombre entier positif.");
      return;
    }

    if (!isZoneIdUnique(zones, nextZoneId)) {
      setZoneDraftError("Cet identifiant de zone existe deja.");
      return;
    }

    const nextBounds = clampZoneBounds(zoneDraft.bounds, MAP_IMAGE);

    if (doesZoneOverlap(zones, nextBounds)) {
      setZoneDraftError("La nouvelle zone chevauche une zone existante.");
      return;
    }

    const nextZone: MapZone = {
      id: nextZoneId,
      color: zoneDraft.color,
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
    setMarkers((currentMarkers) =>
      currentMarkers.filter((marker) => marker.id !== markerId),
    );
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
    setZoneDraft((currentDraft) =>
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

  function clearPendingDrafts(): void {
    setMarkerDraft(null);
    setMarkerDraftId("");
    setMarkerDraftError(null);
    setZoneDraft(null);
    setZoneDraftId("");
    setZoneDraftError(null);
  }

  return {
    activeTool,
    clearPendingDrafts,
    handleCloseInteractionMode,
    handleDeleteMarker,
    handleHoverZone,
    handleLeaveZone,
    handleMoveMarker,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    handleOpenInteractionMode,
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
    pendingMarkerDraft: markerDraft,
    pendingMarkerDraftError: markerDraftError,
    pendingMarkerId: markerDraftId,
    pendingZoneDraft: zoneDraft,
    pendingZoneDraftError: zoneDraftError,
    pendingZoneId: zoneDraftId,
    selectedZone,
    setPendingMarkerId: setMarkerDraftId,
    setPendingZoneId: setZoneDraftId,
    zones,
  };
}
