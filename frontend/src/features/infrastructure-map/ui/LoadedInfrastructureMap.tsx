import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
  PlacementCandidate,
  SectorRecord,
} from "@/features/infrastructure-map/model/types";
import useInfrastructureMapState from "@/features/infrastructure-map/state/useInfrastructureMapState";
import { createImageBounds } from "@/features/infrastructure-map/shared/mapConfig";
import { InfrastructureMapOverview } from "@/features/infrastructure-map/ui/InfrastructureMapOverview";
import { mapCardClassName } from "@/features/infrastructure-map/ui/uiClassNames";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";
import { findZoneById } from "@/features/infrastructure-map/zones/logic/interactiveZones";
import { InfrastructureMapCanvas } from "@/features/infrastructure-map/ui/InfrastructureMapCanvas";
import { InfrastructureMapControls } from "@/features/infrastructure-map/ui/InfrastructureMapControls";
import { getMapFrameClassName } from "@/features/infrastructure-map/ui/infrastructureMapFrame";
import { InfrastructureMapOverlays } from "@/features/infrastructure-map/ui/InfrastructureMapOverlays";

interface LoadedInfrastructureMapProps {
  availableSectors: SectorRecord[];
  imageUrl: string;
  imageDimensions: MapImageDimensions;
  initialMarkers: InteractiveMarker[];
  initialPlacementCandidates: PlacementCandidate[];
  initialZones: MapZone[];
}

export function LoadedInfrastructureMap({
  availableSectors,
  imageUrl,
  imageDimensions,
  initialMarkers,
  initialPlacementCandidates,
  initialZones,
}: LoadedInfrastructureMapProps) {
  const interactiveMapState = useInfrastructureMapState({
    availableSectors,
    initialMapImage: imageDimensions,
    initialMarkers,
    initialPlacementCandidates,
    initialZones,
  });
  const imageBounds = createImageBounds(imageDimensions);
  const selectedMarkerAssignedZone = findZoneById(
    interactiveMapState.zones,
    interactiveMapState.selectedMarker?.zoneId ?? null,
  );
  const mapFrameClassName = getMapFrameClassName({
    isCreationToolActive: interactiveMapState.isCreationToolActive,
    isDeletionToolActive: interactiveMapState.isDeletionToolActive,
    isInteractionMode: interactiveMapState.isInteractionMode,
    isMarkerMoveToolActive: interactiveMapState.isMarkerMoveToolActive,
  });
  const uiErrorMessage = getUiErrorMessage(
    interactiveMapState.pendingZoneDraftError,
    interactiveMapState.pendingMarkerDraftError,
    interactiveMapState.saveErrorMessage,
  );
  const selectedMarkerPosition = getSelectedMarkerPosition(
    interactiveMapState.selectedMarker,
  );
  const pendingZonePreviewLabel = interactiveMapState.pendingZoneCode || "Zone";
  const handleSelectedZoneClose = createSelectedZoneCloseHandler(
    interactiveMapState.selectedZone,
    interactiveMapState.handleZoneInteraction,
  );

  return (
    <section className={mapCardClassName}>
      <InfrastructureMapOverview
        isInteractionMode={interactiveMapState.isInteractionMode}
        markerCount={interactiveMapState.markers.length}
        zoneCount={interactiveMapState.zones.length}
      />
      <InfrastructureMapControls
        activeTool={interactiveMapState.activeTool}
        highlightedZoneId={interactiveMapState.highlightedZoneId}
        errorMessage={uiErrorMessage}
        isInteractionMode={interactiveMapState.isInteractionMode}
        isSavingChanges={interactiveMapState.isSavingChanges}
        markers={interactiveMapState.markers}
        onCloseInteractionMode={interactiveMapState.handleCloseInteractionMode}
        onOpenInteractionMode={interactiveMapState.handleOpenInteractionMode}
        onSelectMarker={interactiveMapState.handleSelectMarker}
        onSelectTool={interactiveMapState.handleSelectTool}
        onSelectZone={interactiveMapState.handleZoneInteraction}
        selectedMarkerId={interactiveMapState.selectedMarkerId}
        zones={interactiveMapState.zones}
      />
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
        <div className={mapFrameClassName}>
          <InfrastructureMapOverlays
            availablePlacementCandidates={interactiveMapState.availablePlacementCandidates}
            availableSectors={interactiveMapState.availableSectors}
            isInteractionMode={interactiveMapState.isInteractionMode}
            isSaving={interactiveMapState.isSavingChanges}
            isZoneEditToolActive={interactiveMapState.isZoneEditToolActive}
            markerDraft={interactiveMapState.pendingMarkerDraft}
            markerDraftId={interactiveMapState.pendingEquipmentId}
            onCancelDrafts={interactiveMapState.clearPendingDrafts}
            onCloseSelectedMarker={interactiveMapState.handleCloseSelectedMarker}
            onMarkerIdChange={interactiveMapState.setPendingEquipmentId}
            onMarkerSubmit={interactiveMapState.handleMarkerDraftSave}
            onSelectedZoneClose={handleSelectedZoneClose}
            onSelectedZoneInputChange={interactiveMapState.clearRuntimeError}
            onSelectedZoneSubmit={interactiveMapState.handleSelectedZoneSave}
            onZoneCodeChange={interactiveMapState.handleZoneDraftCodeChange}
            onZoneNameChange={interactiveMapState.handleZoneDraftNameChange}
            onZoneSectorChange={interactiveMapState.handleZoneDraftSectorChange}
            onZoneSubmit={interactiveMapState.handleZoneDraftSave}
            onUpdatePcField={interactiveMapState.handleUpdateMarkerTechnicalDetails}
            selectedMarker={interactiveMapState.selectedMarker}
            selectedMarkerAssignedZone={selectedMarkerAssignedZone}
            selectedZone={interactiveMapState.selectedZone}
            zoneDraft={interactiveMapState.pendingZoneDraft}
            zoneDraftCode={interactiveMapState.pendingZoneCode}
            zoneDraftName={interactiveMapState.pendingZoneName}
            zoneDraftSectorName={interactiveMapState.pendingZoneSectorName}
          />
          <InfrastructureMapCanvas
            highlightedZoneId={interactiveMapState.highlightedZoneId}
            imageBounds={imageBounds}
            imageUrl={imageUrl}
            isConsultationEnabled={!interactiveMapState.isInteractionMode}
            isDeleteMode={interactiveMapState.isMarkerDeletionToolActive}
            isMarkerCreationToolActive={interactiveMapState.isMarkerCreationToolActive}
            isMoveMode={interactiveMapState.isMarkerMoveToolActive}
            isZoneCreationToolActive={interactiveMapState.isZoneCreationToolActive}
            isZoneEditToolActive={interactiveMapState.isZoneEditToolActive}
            markers={interactiveMapState.markers}
            onDeleteMarker={interactiveMapState.handleDeleteMarker}
            onHoverZone={interactiveMapState.handleHoverZone}
            onLeaveZone={interactiveMapState.handleLeaveZone}
            onMarkerPlacement={interactiveMapState.handleMarkerPlacement}
            onMoveMarker={interactiveMapState.handleMoveMarker}
            onResizeZoneCommit={interactiveMapState.handleZoneResizeCommit}
            onResizeZonePreview={interactiveMapState.handleZoneResizePreview}
            onSelectMarker={interactiveMapState.handleSelectMarker}
            onSelectZone={interactiveMapState.handleZoneInteraction}
            onZoneDraftDrag={interactiveMapState.handleZoneDraftDrag}
            pendingZoneDraft={interactiveMapState.pendingZoneDraft}
            pendingZonePreviewColor={getSectorColor(
              interactiveMapState.pendingZoneSectorName,
            )}
            pendingZonePreviewLabel={pendingZonePreviewLabel}
            selectedMarkerFocusToken={interactiveMapState.selectedMarkerFocusToken}
            selectedMarkerId={interactiveMapState.selectedMarkerId}
            selectedMarkerPosition={selectedMarkerPosition}
            selectedZone={interactiveMapState.selectedZone}
            zones={interactiveMapState.zones}
          />
        </div>
      </div>
    </section>
  );
}

function getUiErrorMessage(
  pendingZoneDraftError: string | null,
  pendingMarkerDraftError: string | null,
  saveErrorMessage: string | null,
): string | null {
  return pendingZoneDraftError ??
    pendingMarkerDraftError ??
    saveErrorMessage;
}

function getSelectedMarkerPosition(
  selectedMarker: InteractiveMarker | null,
): { x: number; y: number } | null {
  if (selectedMarker === null) {
    return null;
  }

  return {
    x: selectedMarker.x,
    y: selectedMarker.y,
  };
}

function createSelectedZoneCloseHandler(
  selectedZone: MapZone | null,
  onToggleZoneSelection: (zoneId: number) => void,
): () => void {
  return function handleSelectedZoneClose(): void {
    if (selectedZone === null) {
      return;
    }

    onToggleZoneSelection(selectedZone.id);
  };
}
