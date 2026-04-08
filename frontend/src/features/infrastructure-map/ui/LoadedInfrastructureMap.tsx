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
import { getSectorColorByName } from "@/features/infrastructure-map/zones/logic/zoneAppearance";
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
  const {
    activeTool,
    availablePlacementCandidates,
    availableSectors: zoneSectorOptions,
    clearPendingDrafts,
    clearRuntimeError,
    handleCloseInteractionMode,
    handleCloseSelectedMarker,
    handleDeleteMarker,
    handleHoverZone,
    handleLeaveZone,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    handleMoveMarker,
    handleOpenInteractionMode,
    handleSelectMarker,
    handleSelectTool,
    handleSelectedZoneSave,
    handleUpdateMarkerTechnicalDetails,
    handleZoneDraftCodeChange,
    handleZoneDraftDrag,
    handleZoneDraftNameChange,
    handleZoneDraftSave,
    handleZoneDraftSectorChange,
    handleZoneInteraction,
    handleZoneResizeCommit,
    handleZoneResizePreview,
    highlightedZoneId,
    isCreationToolActive,
    isInteractionMode,
    isMarkerCreationToolActive,
    isMarkerDeletionToolActive,
    isMarkerMoveToolActive,
    isSavingChanges,
    isZoneCreationToolActive,
    isZoneEditToolActive,
    markers,
    pendingMarkerDraft,
    pendingMarkerDraftError,
    pendingMarkerId,
    pendingZoneCode,
    pendingZoneDraft,
    pendingZoneDraftError,
    pendingZoneName,
    pendingZoneSectorName,
    saveErrorMessage,
    selectedMarker,
    selectedMarkerFocusToken,
    selectedMarkerId,
    selectedZone,
    setPendingMarkerId,
    zones,
  } = interactiveMapState;
  const imageBounds = createImageBounds(imageDimensions);
  const selectedMarkerAssignedZone = findZoneById(
    zones,
    selectedMarker?.zoneId ?? null,
  );
  const mapFrameClassName = getMapFrameClassName({
    isCreationToolActive,
    isDeletionToolActive: interactiveMapState.isDeletionToolActive,
    isInteractionMode,
    isMarkerMoveToolActive,
  });
  const uiErrorMessage = pendingZoneDraftError ??
    pendingMarkerDraftError ??
    saveErrorMessage;
  const selectedMarkerPosition = selectedMarker === null
    ? null
    : { x: selectedMarker.x, y: selectedMarker.y };
  const pendingZonePreviewLabel = pendingZoneCode || "Zone";
  const handleSelectedZoneClose = () => {
    if (selectedZone !== null) {
      handleZoneInteraction(selectedZone.id);
    }
  };

  return (
    <section className={mapCardClassName}>
      <InfrastructureMapOverview
        isInteractionMode={isInteractionMode}
        markerCount={markers.length}
        zoneCount={zones.length}
      />
      <InfrastructureMapControls
        activeTool={activeTool}
        highlightedZoneId={highlightedZoneId}
        errorMessage={uiErrorMessage}
        isInteractionMode={isInteractionMode}
        isSavingChanges={isSavingChanges}
        markers={markers}
        onCloseInteractionMode={handleCloseInteractionMode}
        onOpenInteractionMode={handleOpenInteractionMode}
        onSelectMarker={handleSelectMarker}
        onSelectTool={handleSelectTool}
        onSelectZone={handleZoneInteraction}
        selectedMarkerId={selectedMarkerId}
        zones={zones}
      />
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
        <div className={mapFrameClassName}>
          <InfrastructureMapOverlays
            availablePlacementCandidates={availablePlacementCandidates}
            availableSectors={zoneSectorOptions}
            isInteractionMode={isInteractionMode}
            isSaving={isSavingChanges}
            isZoneEditToolActive={isZoneEditToolActive}
            markerDraft={pendingMarkerDraft}
            markerDraftId={pendingMarkerId}
            onCancelDrafts={clearPendingDrafts}
            onCloseSelectedMarker={handleCloseSelectedMarker}
            onMarkerIdChange={setPendingMarkerId}
            onMarkerSubmit={handleMarkerDraftSave}
            onSelectedZoneClose={handleSelectedZoneClose}
            onSelectedZoneInputChange={clearRuntimeError}
            onSelectedZoneSubmit={handleSelectedZoneSave}
            onZoneCodeChange={handleZoneDraftCodeChange}
            onZoneNameChange={handleZoneDraftNameChange}
            onZoneSectorChange={handleZoneDraftSectorChange}
            onZoneSubmit={handleZoneDraftSave}
            onUpdatePcField={handleUpdateMarkerTechnicalDetails}
            selectedMarker={selectedMarker}
            selectedMarkerAssignedZone={selectedMarkerAssignedZone}
            selectedZone={selectedZone}
            zoneDraft={pendingZoneDraft}
            zoneDraftCode={pendingZoneCode}
            zoneDraftName={pendingZoneName}
            zoneDraftSectorName={pendingZoneSectorName}
          />
          <InfrastructureMapCanvas
            highlightedZoneId={highlightedZoneId}
            imageBounds={imageBounds}
            imageUrl={imageUrl}
            isConsultationEnabled={!isInteractionMode}
            isDeleteMode={isMarkerDeletionToolActive}
            isMarkerCreationToolActive={isMarkerCreationToolActive}
            isMoveMode={isMarkerMoveToolActive}
            isZoneCreationToolActive={isZoneCreationToolActive}
            isZoneEditToolActive={isZoneEditToolActive}
            markers={markers}
            onDeleteMarker={handleDeleteMarker}
            onHoverZone={handleHoverZone}
            onLeaveZone={handleLeaveZone}
            onMarkerPlacement={handleMarkerPlacement}
            onMoveMarker={handleMoveMarker}
            onResizeZoneCommit={handleZoneResizeCommit}
            onResizeZonePreview={handleZoneResizePreview}
            onSelectMarker={handleSelectMarker}
            onSelectZone={handleZoneInteraction}
            onZoneDraftDrag={handleZoneDraftDrag}
            pendingZoneDraft={pendingZoneDraft}
            pendingZonePreviewColor={getSectorColorByName(
              pendingZoneSectorName,
              zoneSectorOptions,
            )}
            pendingZonePreviewLabel={pendingZonePreviewLabel}
            selectedMarkerFocusToken={selectedMarkerFocusToken}
            selectedMarkerId={selectedMarkerId}
            selectedMarkerPosition={selectedMarkerPosition}
            selectedZone={selectedZone}
            zones={zones}
          />
        </div>
      </div>
    </section>
  );
}
