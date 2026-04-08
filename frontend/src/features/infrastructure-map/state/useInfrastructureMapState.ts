import { useRef, useState } from "react";
import {
  createEquipment,
  createZone,
  deleteEquipment,
  deleteZone,
  updateEquipment,
  updateEquipmentDataField,
  updateZone,
} from "@/features/infrastructure-map/api/client";
import useInteractionMode from "@/features/infrastructure-map/editor/model/useInteractionMode";
import { assignMarkersWithinBoundsToZone, moveMarkerToCoordinates, reconcileMarkersWithZoneBounds } from "@/features/infrastructure-map/markers/logic/interactiveMarkers";
import useMarkerDraft from "@/features/infrastructure-map/markers/model/useMarkerDraft";
import { updatePlacementCandidatesFromEquipmentData } from "@/features/infrastructure-map/model/resourceHydration";
import type {
  EditablePcFieldId,
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
  PlacementCandidate,
  SectorRecord,
} from "@/features/infrastructure-map/model/types";
import { applyEditablePcFieldUpdate } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { createInteractionModeHandlers } from "@/features/infrastructure-map/state/handlers/createInteractionModeHandlers";
import {
  ensureSectorExists,
  getHighlightedZoneId,
  getMutationErrorMessage,
  haveSameBounds,
  mapZoneRecordToMapZone,
  normalizeOptionalText,
  reconcileMarkersAfterZoneUpdate,
  removeZoneFromState,
  updateMarkerTechnicalDetails,
  updatePlacementCandidateTechnicalDetails,
} from "@/features/infrastructure-map/state/infrastructureMapState.helpers";
import type { InfrastructureMapState } from "@/features/infrastructure-map/state/infrastructureMapState.shared";
import { useSelectedMarker } from "@/features/infrastructure-map/state/useSelectedMarker";
import { useZoneHoverState } from "@/features/infrastructure-map/state/useZoneHoverState";
import {
  doesZoneOverlap,
  findZoneById,
  resizeZoneBoundsFromHandle,
  sortZonesById,
} from "@/features/infrastructure-map/zones/logic/interactiveZones";
import useZoneDraft from "@/features/infrastructure-map/zones/model/useZoneDraft";
import useZoneSelection from "@/features/infrastructure-map/zones/model/useZoneSelection";

interface UseInfrastructureMapStateOptions {
  availableSectors: SectorRecord[];
  initialMapImage: MapImageDimensions;
  initialMarkers: InteractiveMarker[];
  initialPlacementCandidates: PlacementCandidate[];
  initialZones: MapZone[];
}

export default function useInfrastructureMapState({
  availableSectors: initialSectors,
  initialMapImage,
  initialMarkers,
  initialPlacementCandidates,
  initialZones,
}: UseInfrastructureMapStateOptions): InfrastructureMapState {
  const [sectors, setSectors] = useState<SectorRecord[]>(initialSectors);
  const [zones, setZones] = useState<MapZone[]>(initialZones);
  const [markers, setMarkers] = useState<InteractiveMarker[]>(initialMarkers);
  const [placementCandidates, setPlacementCandidates] = useState<
    PlacementCandidate[]
  >(initialPlacementCandidates);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const interactionMode = useInteractionMode();
  const markerDraft = useMarkerDraft({
    markers,
    placementCandidates,
    zones,
  });
  const zoneDraft = useZoneDraft({
    availableSectorNames: sectors.map((sector) => sector.name),
    mapImage: initialMapImage,
    zones,
  });
  const selectedMarkerState = useSelectedMarker(markers);
  const zoneSelection = useZoneSelection(zones);
  const zoneHover = useZoneHoverState();
  const zoneResizeBaseline = useRef<MapZone | null>(null);

  function clearRuntimeError(): void {
    setSaveErrorMessage(null);
  }

  function clearPendingDrafts(): void {
    clearRuntimeError();
    markerDraft.clearPendingMarkerDraft();
    zoneDraft.clearPendingZoneDraft();
  }

  function resetTransientUiState(): void {
    selectedMarkerState.clearSelectedMarker();
    zoneSelection.clearSelectedZone();
    clearPendingDrafts();
  }

  const interactionHandlers = createInteractionModeHandlers({
    interactionMode,
    resetTransientUiState,
  });

  function runMutation(
    action: () => Promise<void>,
    onRollback?: () => void,
    onSuccess?: () => void,
  ): void {
    setIsSavingChanges(true);
    setSaveErrorMessage(null);

    void action()
      .then(() => {
        onSuccess?.();
      })
      .catch((error) => {
        onRollback?.();
        setSaveErrorMessage(getMutationErrorMessage(error));
      })
      .finally(() => {
        setIsSavingChanges(false);
      });
  }

  function handleUpdateMarkerTechnicalDetails(
    _markerId: string,
    equipmentDataId: number,
    fieldId: EditablePcFieldId,
    value: string,
  ): void {
    const previousMarkers = markers;
    const previousCandidates = placementCandidates;

    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) =>
        marker.equipmentDataId !== equipmentDataId
          ? marker
          : updateMarkerTechnicalDetails(
            marker,
            applyEditablePcFieldUpdate(marker.technicalDetails, fieldId, value),
            findZoneById(zones, marker.zoneId),
          )
      )
    );
    setPlacementCandidates((currentCandidates) =>
      currentCandidates.map((candidate) =>
        candidate.equipmentDataId !== equipmentDataId
          ? candidate
          : updatePlacementCandidateTechnicalDetails(
            candidate,
            applyEditablePcFieldUpdate(candidate.technicalDetails, fieldId, value),
          )
      )
    );

    runMutation(
      async () => {
        const updatedEquipmentData = await updateEquipmentDataField(
          equipmentDataId,
          fieldId,
          value,
        );

        setPlacementCandidates((currentCandidates) =>
          updatePlacementCandidatesFromEquipmentData(
            currentCandidates,
            updatedEquipmentData,
          )
        );
        setMarkers((currentMarkers) =>
          currentMarkers.map((marker) => {
            if (marker.equipmentDataId !== equipmentDataId) {
              return marker;
            }

            const resolvedZone = findZoneById(zones, marker.zoneId);

            return updateMarkerTechnicalDetails(
              marker,
              updatedEquipmentData,
              resolvedZone,
            );
          })
        );
      },
      () => {
        setMarkers(previousMarkers);
        setPlacementCandidates(previousCandidates);
      },
    );
  }

  function handleMarkerPlacement(x: number, y: number): void {
    if (!interactionMode.isMarkerCreationToolActive) {
      return;
    }

    selectedMarkerState.clearSelectedMarker();
    markerDraft.handleMarkerPlacement(x, y);
  }

  function handleMarkerDraftSave(): void {
    const nextMarkerDraft = markerDraft.handleMarkerDraftSave();

    if (nextMarkerDraft === null) {
      return;
    }

    const nextMarker: InteractiveMarker = {
      equipmentDataId: nextMarkerDraft.equipmentDataId,
      id: nextMarkerDraft.markerId,
      technicalDetails: nextMarkerDraft.technicalDetails,
      x: nextMarkerDraft.x,
      y: nextMarkerDraft.y,
      zoneId: nextMarkerDraft.zoneId,
    };

    runMutation(
      async () => {
        await createEquipment({
          equipmentDataId: nextMarkerDraft.equipmentDataId,
          x: nextMarkerDraft.x,
          y: nextMarkerDraft.y,
          zoneId: nextMarkerDraft.zoneId,
        });

        setMarkers((currentMarkers) => [...currentMarkers, nextMarker]);
      },
      undefined,
      () => {
        markerDraft.clearPendingMarkerDraft();
        selectedMarkerState.focusSelectedMarker(nextMarker.id);
      },
    );
  }

  function handleDeleteMarker(markerId: string): void {
    const previousMarkers = markers;

    setMarkers((currentMarkers) =>
      currentMarkers.filter((marker) => marker.id !== markerId)
    );
    selectedMarkerState.setSelectedMarkerId((currentMarkerId) =>
      currentMarkerId === markerId ? null : currentMarkerId
    );

    runMutation(
      async () => {
        await deleteEquipment(markerId);
      },
      () => {
        setMarkers(previousMarkers);
      },
    );
  }

  function handleMoveMarker(markerId: string, x: number, y: number): void {
    if (!interactionMode.isMarkerMoveToolActive) {
      return;
    }

    const previousMarkers = markers;
    const nextMarkers = moveMarkerToCoordinates(
      markers,
      zones,
      markerId,
      x,
      y,
      initialMapImage,
    );
    const movedMarker = nextMarkers.find((marker) => marker.id === markerId);

    if (movedMarker === undefined) {
      return;
    }

    setMarkers(nextMarkers);

    runMutation(
      async () => {
        await updateEquipment(markerId, {
          x: movedMarker.x,
          y: movedMarker.y,
          zoneId: movedMarker.zoneId,
        });
      },
      () => {
        setMarkers(previousMarkers);
      },
    );
  }

  function handleZoneInteraction(zoneId: number): void {
    if (!interactionMode.isInteractionMode) {
      selectedMarkerState.clearSelectedMarker();
      zoneSelection.toggleZoneSelection(zoneId);
      return;
    }

    if (interactionMode.isZoneDeletionToolActive) {
      handleDeleteZone(zoneId);
      return;
    }

    if (interactionMode.isZoneEditToolActive) {
      zoneSelection.toggleZoneSelection(zoneId);
    }
  }

  function handleDeleteZone(zoneId: number): void {
    const previousZones = zones;
    const previousMarkers = markers;
    const { nextMarkers, nextZones } = removeZoneFromState(zones, markers, zoneId);

    setZones(nextZones);
    setMarkers(nextMarkers);
    zoneHover.clearHoveredZoneIfMatches(zoneId);

    if (zoneSelection.selectedZoneId === zoneId) {
      zoneSelection.clearSelectedZone();
    }

    runMutation(
      async () => {
        await deleteZone(zoneId);
      },
      () => {
        setZones(previousZones);
        setMarkers(previousMarkers);
      },
    );
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
    const nextZoneDraft = zoneDraft.handleZoneDraftSave();

    if (nextZoneDraft === null) {
      return;
    }

    runMutation(
      async () => {
        const sector = await ensureSectorExists(
          nextZoneDraft.sectorName,
          sectors,
          setSectors,
        );
        const createdZoneRecord = await createZone({
          code: nextZoneDraft.code,
          name: normalizeOptionalText(nextZoneDraft.name) ?? undefined,
          sectorId: sector.id,
          xMax: nextZoneDraft.bounds.x + nextZoneDraft.bounds.width,
          xMin: nextZoneDraft.bounds.x,
          yMax: nextZoneDraft.bounds.y + nextZoneDraft.bounds.height,
          yMin: nextZoneDraft.bounds.y,
        });
        const nextZone = mapZoneRecordToMapZone(createdZoneRecord, sector);

        setZones((currentZones) => sortZonesById([...currentZones, nextZone]));
        setMarkers((currentMarkers) =>
          assignMarkersWithinBoundsToZone(
            currentMarkers,
            nextZone,
            nextZone.bounds,
          )
        );
        zoneSelection.selectZone(nextZone.id);
      },
      undefined,
      () => {
        zoneDraft.clearPendingZoneDraft();
      },
    );
  }

  function handleSelectedZoneSave(input: {
    code: string;
    name: string;
    sectorName: string;
  }): void {
    if (zoneSelection.selectedZone === null) {
      return;
    }

    const previousZone = zoneSelection.selectedZone;
    const previousZones = zones;
    const previousMarkers = markers;

    runMutation(
      async () => {
        const sector = await ensureSectorExists(input.sectorName, sectors, setSectors);
        const updatedZoneRecord = await updateZone(previousZone.id, {
          code: input.code.trim(),
          name: normalizeOptionalText(input.name),
          sectorId: sector.id,
        });
        const nextZone = mapZoneRecordToMapZone(updatedZoneRecord, sector);

        setZones((currentZones) =>
          currentZones.map((zone) =>
            zone.id === nextZone.id ? nextZone : zone
          )
        );
        setMarkers((currentMarkers) =>
          reconcileMarkersAfterZoneUpdate(
            currentMarkers,
            previousZone,
            nextZone,
          )
        );
      },
      () => {
        setZones(previousZones);
        setMarkers(previousMarkers);
      },
    );
  }

  function handleZoneResizePreview(
    handle: Parameters<InfrastructureMapState["handleZoneResizePreview"]>[0],
    x: number,
    y: number,
  ): void {
    if (zoneSelection.selectedZone === null) {
      return;
    }

    if (
      zoneResizeBaseline.current === null ||
      zoneResizeBaseline.current.id !== zoneSelection.selectedZone.id
    ) {
      zoneResizeBaseline.current = zoneSelection.selectedZone;
    }

    const resizedBounds = resizeZoneBoundsFromHandle(
      zoneSelection.selectedZone.bounds,
      handle,
      x,
      y,
      initialMapImage,
    );
    const otherZones = zones.filter((zone) => zone.id !== zoneSelection.selectedZone?.id);

    if (doesZoneOverlap(otherZones, resizedBounds)) {
      return;
    }

    setZones((currentZones) =>
      currentZones.map((zone) =>
        zone.id !== zoneSelection.selectedZone?.id
          ? zone
          : {
            ...zone,
            bounds: resizedBounds,
          }
      )
    );
    setMarkers((currentMarkers) =>
      reconcileMarkersWithZoneBounds(
        currentMarkers,
        zoneSelection.selectedZone!,
        resizedBounds,
      )
    );
  }

  const handleZoneResizeCommit: InfrastructureMapState["handleZoneResizeCommit"] = () => {
    if (zoneSelection.selectedZone === null) {
      return;
    }

    const baselineZone = zoneResizeBaseline.current;
    const resizedZone = zoneSelection.selectedZone;

    if (
      baselineZone === null ||
      haveSameBounds(baselineZone.bounds, resizedZone.bounds)
    ) {
      zoneResizeBaseline.current = null;
      return;
    }

    const previousZones = zones;
    const previousMarkers = markers;

    runMutation(
      async () => {
        await updateZone(resizedZone.id, {
          xMax: resizedZone.bounds.x + resizedZone.bounds.width,
          xMin: resizedZone.bounds.x,
          yMax: resizedZone.bounds.y + resizedZone.bounds.height,
          yMin: resizedZone.bounds.y,
        });
      },
      () => {
        setZones(previousZones);
        setMarkers(previousMarkers);
        zoneResizeBaseline.current = null;
      },
      () => {
        zoneResizeBaseline.current = null;
      },
    );
  };

  const highlightedZoneId = getHighlightedZoneId(
    zoneHover.hoveredZoneId,
    selectedMarkerState.selectedMarker,
    zoneSelection.selectedZoneId,
  );

  return {
    activeTool: interactionMode.activeTool,
    availablePlacementCandidates: markerDraft.availablePlacementCandidates,
    availableSectors: sectors,
    clearRuntimeError,
    clearPendingDrafts,
    handleCloseInteractionMode: interactionHandlers.handleCloseInteractionMode,
    handleCloseSelectedMarker: selectedMarkerState.clearSelectedMarker,
    handleDeleteMarker,
    handleHoverZone: zoneHover.handleHoverZone,
    handleLeaveZone: zoneHover.handleLeaveZone,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    handleMoveMarker,
    handleOpenInteractionMode: interactionHandlers.handleOpenInteractionMode,
    handleSelectedZoneSave,
    handleSelectMarker: selectedMarkerState.focusSelectedMarker,
    handleSelectTool: interactionHandlers.handleSelectTool,
    handleUpdateMarkerTechnicalDetails,
    handleZoneDraftCodeChange(value: string) {
      clearRuntimeError();
      zoneDraft.handleZoneDraftCodeChange(value);
    },
    handleZoneDraftDrag,
    handleZoneDraftNameChange(value: string) {
      clearRuntimeError();
      zoneDraft.handleZoneDraftNameChange(value);
    },
    handleZoneDraftSave,
    handleZoneDraftSectorChange(value: string) {
      clearRuntimeError();
      zoneDraft.handleZoneDraftSectorChange(value);
    },
    handleZoneInteraction,
    handleZoneResizeCommit,
    handleZoneResizePreview,
    highlightedZoneId,
    isCreationToolActive: interactionMode.isCreationToolActive,
    isDeletionToolActive: interactionMode.isDeletionToolActive,
    isInteractionMode: interactionMode.isInteractionMode,
    isMarkerCreationToolActive: interactionMode.isMarkerCreationToolActive,
    isMarkerDeletionToolActive: interactionMode.isMarkerDeletionToolActive,
    isMarkerMoveToolActive: interactionMode.isMarkerMoveToolActive,
    isSavingChanges,
    isZoneCreationToolActive: interactionMode.isZoneCreationToolActive,
    isZoneEditToolActive: interactionMode.isZoneEditToolActive,
    markers,
    pendingMarkerId: markerDraft.pendingMarkerId,
    pendingMarkerDraft: markerDraft.pendingMarkerDraft,
    pendingMarkerDraftError: markerDraft.pendingMarkerDraftError,
    pendingZoneCode: zoneDraft.pendingZoneCode,
    pendingZoneDraft: zoneDraft.pendingZoneDraft,
    pendingZoneDraftError: zoneDraft.pendingZoneDraftError,
    pendingZoneName: zoneDraft.pendingZoneName,
    pendingZoneSectorName: zoneDraft.pendingZoneSectorName,
    saveErrorMessage,
    sectors,
    selectedMarker: selectedMarkerState.selectedMarker,
    selectedMarkerFocusToken: selectedMarkerState.selectedMarkerFocusToken,
    selectedMarkerId: selectedMarkerState.selectedMarkerId,
    selectedZone: zoneSelection.selectedZone,
    setPendingMarkerId(value: string) {
      clearRuntimeError();
      markerDraft.setPendingMarkerId(value);
    },
    zones,
  };
}
