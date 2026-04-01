import { useState } from "react";
import type {
  EditablePcFieldId,
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";
import useInteractionMode from "@/features/infrastructure-map/editor/model/useInteractionMode";
import useMarkerDraft from "@/features/infrastructure-map/markers/model/useMarkerDraft";
import type { InfrastructureMapState } from "@/features/infrastructure-map/state/infrastructureMapState.shared";
import { createInteractionModeHandlers } from "@/features/infrastructure-map/state/handlers/createInteractionModeHandlers";
import { createMarkerHandlers } from "@/features/infrastructure-map/state/handlers/createMarkerHandlers";
import { createZoneHandlers } from "@/features/infrastructure-map/state/handlers/createZoneHandlers";
import { applyEditablePcFieldUpdate } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { useSelectedMarker } from "@/features/infrastructure-map/state/useSelectedMarker";
import { useZoneHoverState } from "@/features/infrastructure-map/state/useZoneHoverState";
import useZoneDraft from "@/features/infrastructure-map/zones/model/useZoneDraft";
import useZoneSelection from "@/features/infrastructure-map/zones/model/useZoneSelection";

interface UseInfrastructureMapStateOptions {
  availableSectors: string[];
  initialMapImage: MapImageDimensions;
  initialMarkers: InteractiveMarker[];
  initialZones: MapZone[];
  placementPcCandidates: PlacementPcCandidate[];
}

export default function useInfrastructureMapState({
  availableSectors,
  initialMapImage,
  initialMarkers,
  initialZones,
  placementPcCandidates,
}: UseInfrastructureMapStateOptions): InfrastructureMapState {
  const [zones, setZones] = useState<MapZone[]>(initialZones);
  const [markers, setMarkers] = useState<InteractiveMarker[]>(initialMarkers);
  const interactionMode = useInteractionMode();
  const markerDraft = useMarkerDraft({ markers, placementPcCandidates, zones });
  const zoneDraft = useZoneDraft({
    availableSectors,
    mapImage: initialMapImage,
    zones,
  });
  const selectedMarkerState = useSelectedMarker(markers);
  const zoneSelection = useZoneSelection(zones);
  const zoneHover = useZoneHoverState();

  function clearPendingDrafts(): void {
    markerDraft.clearPendingMarkerDraft();
    zoneDraft.clearPendingZoneDraft();
  }

  function resetTransientUiState(): void {
    selectedMarkerState.clearSelectedMarker();
    clearPendingDrafts();
  }

  function handleUpdateMarkerTechnicalDetails(
    markerId: string,
    fieldId: EditablePcFieldId,
    value: string,
  ): void {
    setMarkers((currentMarkers) =>
      currentMarkers.map(function updateMarkerTechnicalDetails(marker) {
        if (marker.id !== markerId) {
          return marker;
        }

        return {
          ...marker,
          technicalDetails: applyEditablePcFieldUpdate(
            marker.technicalDetails,
            fieldId,
            value,
          ),
        };
      })
    );
  }

  const interactionHandlers = createInteractionModeHandlers({
    interactionMode,
    resetTransientUiState,
  });
  const markerHandlers = createMarkerHandlers({
    clearSelectedMarker: selectedMarkerState.clearSelectedMarker,
    focusSelectedMarker: selectedMarkerState.focusSelectedMarker,
    initialMapImage,
    interactionMode,
    markerDraft,
    setMarkers,
    setSelectedMarkerId: selectedMarkerState.setSelectedMarkerId,
    zones,
  });
  const zoneHandlers = createZoneHandlers({
    clearHoveredZoneIfMatches: zoneHover.clearHoveredZoneIfMatches,
    clearSelectedMarker: selectedMarkerState.clearSelectedMarker,
    clearSelectedZone: zoneSelection.clearSelectedZone,
    initialMapImage,
    interactionMode,
    markers,
    selectedZone: zoneSelection.selectedZone,
    selectedZoneId: zoneSelection.selectedZoneId,
    selectZone: zoneSelection.selectZone,
    setMarkers,
    setZones,
    toggleZoneSelection: zoneSelection.toggleZoneSelection,
    zoneDraft,
    zones,
  });
  const highlightedZoneId = getHighlightedZoneId(
    zoneHover.hoveredZoneId,
    selectedMarkerState.selectedMarker,
    zoneSelection.selectedZoneId,
  );

  return {
    activeTool: interactionMode.activeTool,
    availablePlacementPcCandidates: markerDraft.availablePlacementPcCandidates,
    availableSectors,
    clearPendingDrafts,
    handleCloseInteractionMode: interactionHandlers.handleCloseInteractionMode,
    handleCloseSelectedMarker: markerHandlers.handleCloseSelectedMarker,
    handleDeleteMarker: markerHandlers.handleDeleteMarker,
    handleHoverZone: zoneHover.handleHoverZone,
    handleLeaveZone: zoneHover.handleLeaveZone,
    handleMarkerDraftSave: markerHandlers.handleMarkerDraftSave,
    handleMarkerPlacement: markerHandlers.handleMarkerPlacement,
    handleMoveMarker: markerHandlers.handleMoveMarker,
    handleOpenInteractionMode: interactionHandlers.handleOpenInteractionMode,
    handleSelectedZoneProdschedChange:
      zoneHandlers.handleSelectedZoneProdschedChange,
    handleSelectedZoneSectorChange: zoneHandlers.handleSelectedZoneSectorChange,
    handleSelectMarker: markerHandlers.handleSelectMarker,
    handleSelectTool: interactionHandlers.handleSelectTool,
    handleUpdateMarkerTechnicalDetails,
    handleZoneDraftDrag: zoneHandlers.handleZoneDraftDrag,
    handleZoneDraftProdschedChange: zoneHandlers.handleZoneDraftProdschedChange,
    handleZoneDraftSave: zoneHandlers.handleZoneDraftSave,
    handleZoneDraftSectorChange: zoneHandlers.handleZoneDraftSectorChange,
    handleZoneInteraction: zoneHandlers.handleZoneInteraction,
    handleZoneResizeDrag: zoneHandlers.handleZoneResizeDrag,
    highlightedZoneId,
    isCreationToolActive: interactionMode.isCreationToolActive,
    isDeletionToolActive: interactionMode.isDeletionToolActive,
    isInteractionMode: interactionMode.isInteractionMode,
    isMarkerCreationToolActive: interactionMode.isMarkerCreationToolActive,
    isMarkerDeletionToolActive: interactionMode.isMarkerDeletionToolActive,
    isMarkerMoveToolActive: interactionMode.isMarkerMoveToolActive,
    isZoneCreationToolActive: interactionMode.isZoneCreationToolActive,
    isZoneEditToolActive: interactionMode.isZoneEditToolActive,
    markers,
    pendingMarkerDraft: markerDraft.pendingMarkerDraft,
    pendingMarkerDraftError: markerDraft.pendingMarkerDraftError,
    pendingMarkerId: markerDraft.pendingMarkerId,
    pendingZoneDraft: zoneDraft.pendingZoneDraft,
    pendingZoneDraftError: zoneDraft.pendingZoneDraftError,
    pendingZoneProdsched: zoneDraft.pendingZoneProdsched,
    pendingZoneSector: zoneDraft.pendingZoneSector,
    selectedMarker: selectedMarkerState.selectedMarker,
    selectedMarkerFocusToken: selectedMarkerState.selectedMarkerFocusToken,
    selectedMarkerId: selectedMarkerState.selectedMarkerId,
    selectedZone: zoneSelection.selectedZone,
    setPendingMarkerId: markerDraft.setPendingMarkerId,
    zones,
  };
}

function getHighlightedZoneId(
  hoveredZoneId: number | null,
  selectedMarker: InteractiveMarker | null,
  selectedZoneId: number | null,
): number | null {
  if (hoveredZoneId !== null) {
    return hoveredZoneId;
  }

  if (selectedMarker !== null && selectedMarker.zoneId !== null) {
    return selectedMarker.zoneId;
  }

  return selectedZoneId;
}
