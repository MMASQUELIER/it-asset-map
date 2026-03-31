import type { Dispatch, SetStateAction } from "react";
import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import {
  assignMarkersWithinBoundsToZone,
  reconcileMarkersWithZoneBounds,
} from "@/features/infrastructure-map/markers/logic/interactiveMarkers";
import type { ZoneResizeHandle } from "@/features/infrastructure-map/shared/interactionTypes";
import {
  doesZoneOverlap,
  resizeZoneBoundsFromHandle,
  sortZonesById,
} from "@/features/infrastructure-map/zones/logic/interactiveZones";
import { createSelectedZoneMutationHandlers } from "@/features/infrastructure-map/state/handlers/createSelectedZoneMutationHandlers";

interface ZoneDraftController {
  clearPendingZoneDraft: () => void;
  handleZoneDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
  handleZoneDraftProdschedChange: (prodsched: string) => void;
  handleZoneDraftSave: () => MapZone | null;
  handleZoneDraftSectorChange: (sector: string) => void;
}

interface ZoneInteractionModeState {
  isInteractionMode: boolean;
  isZoneCreationToolActive: boolean;
  isZoneDeletionToolActive: boolean;
  isZoneEditToolActive: boolean;
}

interface CreateZoneHandlersOptions {
  clearHoveredZoneIfMatches: (zoneId: number) => void;
  clearSelectedMarker: () => void;
  clearSelectedZone: () => void;
  initialMapImage: MapImageDimensions;
  interactionMode: ZoneInteractionModeState;
  markers: InteractiveMarker[];
  selectedZone: MapZone | null;
  selectedZoneId: number | null;
  selectZone: (zoneId: number | null) => void;
  setMarkers: Dispatch<SetStateAction<InteractiveMarker[]>>;
  setZones: Dispatch<SetStateAction<MapZone[]>>;
  toggleZoneSelection: (zoneId: number) => void;
  zoneDraft: ZoneDraftController;
  zones: MapZone[];
}

export function createZoneHandlers({
  clearHoveredZoneIfMatches,
  clearSelectedMarker,
  clearSelectedZone,
  initialMapImage,
  interactionMode,
  markers,
  selectedZone,
  selectedZoneId,
  selectZone,
  setMarkers,
  setZones,
  toggleZoneSelection,
  zoneDraft,
  zones,
}: CreateZoneHandlersOptions) {
  const selectedZoneMutationHandlers = createSelectedZoneMutationHandlers({
    clearHoveredZoneIfMatches,
    clearSelectedZone,
    markers,
    selectedZone,
    selectedZoneId,
    setMarkers,
    setZones,
    zones,
  });

  function handleZoneInteraction(zoneId: number): void {
    if (!interactionMode.isInteractionMode) {
      clearSelectedMarker();
      toggleZoneSelection(zoneId);
      return;
    }

    if (interactionMode.isZoneDeletionToolActive) {
      selectedZoneMutationHandlers.handleDeleteZone(zoneId);
      return;
    }

    if (interactionMode.isZoneEditToolActive) {
      toggleZoneSelection(zoneId);
    }
  }

  function handleZoneDraftDrag(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ): void {
    if (!interactionMode.isZoneCreationToolActive) {
      return;
    }

    zoneDraft.handleZoneDraftDrag(startX, startY, currentX, currentY);
  }

  function handleZoneDraftSave(): void {
    const nextZone = zoneDraft.handleZoneDraftSave();

    if (nextZone === null) {
      return;
    }

    setZones((currentZones) => sortZonesById([...currentZones, nextZone]));
    setMarkers((currentMarkers) =>
      assignMarkersWithinBoundsToZone(
        currentMarkers,
        nextZone,
        nextZone.bounds,
      )
    );
    selectZone(nextZone.id);
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
      initialMapImage,
    );
    const otherZones = zones.filter((zone) => zone.id !== selectedZone.id);

    if (doesZoneOverlap(otherZones, resizedBounds)) {
      return;
    }

    setZones((currentZones) =>
      currentZones.map(function resizeCurrentZone(zone) {
        if (zone.id !== selectedZone.id) {
          return zone;
        }

        return {
          ...zone,
          bounds: resizedBounds,
        };
      })
    );
    setMarkers((currentMarkers) =>
      reconcileMarkersWithZoneBounds(
        currentMarkers,
        selectedZone,
        resizedBounds,
      )
    );
  }

  return {
    clearPendingZoneDraft: zoneDraft.clearPendingZoneDraft,
    ...selectedZoneMutationHandlers,
    handleZoneDraftDrag,
    handleZoneDraftProdschedChange: zoneDraft.handleZoneDraftProdschedChange,
    handleZoneDraftSave,
    handleZoneDraftSectorChange: zoneDraft.handleZoneDraftSectorChange,
    handleZoneInteraction,
    handleZoneResizeDrag,
  };
}
