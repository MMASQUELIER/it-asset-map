import type { Dispatch, SetStateAction } from "react";
import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import { moveMarkerToCoordinates } from "@/features/infrastructure-map/markers/logic/interactiveMarkers";

interface MarkerDraftController {
  clearPendingMarkerDraft: () => void;
  handleMarkerDraftSave: () => InteractiveMarker | null;
  handleMarkerPlacement: (x: number, y: number) => void;
}

interface MarkerInteractionModeState {
  isMarkerCreationToolActive: boolean;
  isMarkerMoveToolActive: boolean;
}

interface CreateMarkerHandlersOptions {
  clearSelectedMarker: () => void;
  focusSelectedMarker: (markerId: string) => void;
  initialMapImage: MapImageDimensions;
  interactionMode: MarkerInteractionModeState;
  markerDraft: MarkerDraftController;
  setMarkers: Dispatch<SetStateAction<InteractiveMarker[]>>;
  setSelectedMarkerId: Dispatch<SetStateAction<string | null>>;
  zones: MapZone[];
}

export function createMarkerHandlers({
  clearSelectedMarker,
  focusSelectedMarker,
  initialMapImage,
  interactionMode,
  markerDraft,
  setMarkers,
  setSelectedMarkerId,
  zones,
}: CreateMarkerHandlersOptions) {
  function handleMarkerPlacement(x: number, y: number): void {
    if (!interactionMode.isMarkerCreationToolActive) {
      return;
    }

    clearSelectedMarker();
    markerDraft.handleMarkerPlacement(x, y);
  }

  function handleMoveMarker(markerId: string, x: number, y: number): void {
    if (!interactionMode.isMarkerMoveToolActive) {
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

  function handleMarkerDraftSave(): void {
    const nextMarker = markerDraft.handleMarkerDraftSave();

    if (nextMarker === null) {
      return;
    }

    setMarkers((currentMarkers) => [...currentMarkers, nextMarker]);
  }

  function handleDeleteMarker(markerId: string): void {
    setSelectedMarkerId(function clearDeletedMarkerSelection(currentMarkerId) {
      if (currentMarkerId !== markerId) {
        return currentMarkerId;
      }

      return null;
    });
    setMarkers((currentMarkers) =>
      currentMarkers.filter((marker) => marker.id !== markerId)
    );
  }

  return {
    clearPendingMarkerDraft: markerDraft.clearPendingMarkerDraft,
    handleCloseSelectedMarker: clearSelectedMarker,
    handleDeleteMarker,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    handleMoveMarker,
    handleSelectMarker: focusSelectedMarker,
  };
}
