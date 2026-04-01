import type {
  MapLayoutData,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";
import usePersistedMapLayout from "@/features/infrastructure-map/layout/model/usePersistedMapLayout";
import { hydrateInteractiveMapState } from "@/features/infrastructure-map/layout/services/mapLayoutPersistence";
import useInfrastructureMapState from "@/features/infrastructure-map/state/useInfrastructureMapState";
import { createImageBounds } from "@/features/infrastructure-map/shared/mapConfig";
import { InfrastructureMapOverview } from "@/features/infrastructure-map/ui/InfrastructureMapOverview";
import { mapCardClassName } from "@/features/infrastructure-map/ui/uiClassNames";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";
import { InfrastructureMapCanvas } from "@/features/infrastructure-map/ui/InfrastructureMapCanvas";
import { InfrastructureMapControls } from "@/features/infrastructure-map/ui/InfrastructureMapControls";
import { getMapFrameClassName, findMarkerZone } from "@/features/infrastructure-map/ui/infrastructureMapFrame";
import { InfrastructureMapOverlays } from "@/features/infrastructure-map/ui/InfrastructureMapOverlays";

interface LoadedInfrastructureMapProps {
  availableSectors: string[];
  imageUrl: string;
  isSavingLayout: boolean;
  layoutData: MapLayoutData;
  onSaveLayout: (layoutData: MapLayoutData) => Promise<void>;
  placementPcCandidates: PlacementPcCandidate[];
  saveLayoutErrorMessage: string | null;
}

export function LoadedInfrastructureMap({
  availableSectors,
  imageUrl,
  isSavingLayout,
  layoutData,
  onSaveLayout,
  placementPcCandidates,
  saveLayoutErrorMessage,
}: LoadedInfrastructureMapProps) {
  const hydratedLayoutState = hydrateInteractiveMapState(
    layoutData,
    placementPcCandidates,
  );
  const imageBounds = createImageBounds(hydratedLayoutState.mapImage);
  const interactiveMapState = useInfrastructureMapState({
    availableSectors,
    initialMapImage: hydratedLayoutState.mapImage,
    initialMarkers: hydratedLayoutState.markers,
    initialZones: hydratedLayoutState.zones,
    placementPcCandidates,
  });
  const selectedMarkerAssignedZone = findMarkerZone(
    interactiveMapState.selectedMarker?.zoneId ?? null,
    interactiveMapState.zones,
  );
  const mapFrameClassName = getMapFrameClassName({
    isCreationToolActive: interactiveMapState.isCreationToolActive,
    isDeletionToolActive: interactiveMapState.isDeletionToolActive,
    isInteractionMode: interactiveMapState.isInteractionMode,
    isMarkerMoveToolActive: interactiveMapState.isMarkerMoveToolActive,
  });

  usePersistedMapLayout({
    mapImage: hydratedLayoutState.mapImage,
    markers: interactiveMapState.markers,
    onSaveLayout,
    zones: interactiveMapState.zones,
  });

  return (
    <section className={mapCardClassName}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[linear-gradient(180deg,rgba(15,122,70,0.08),rgba(15,122,70,0.02)_58%,transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[58%] hidden w-px bg-schneider-900/6 xl:block" />
      <div className="relative">
        <InfrastructureMapOverview
          availableSectorCount={availableSectors.length}
          isInteractionMode={interactiveMapState.isInteractionMode}
          markerCount={interactiveMapState.markers.length}
          selectedMarkerId={interactiveMapState.selectedMarkerId}
          zoneCount={interactiveMapState.zones.length}
        />
        <InfrastructureMapControls
          activeTool={interactiveMapState.activeTool}
          highlightedZoneId={interactiveMapState.highlightedZoneId}
          isInteractionMode={interactiveMapState.isInteractionMode}
          isSavingLayout={isSavingLayout}
          markers={interactiveMapState.markers}
          onCloseInteractionMode={interactiveMapState.handleCloseInteractionMode}
          onOpenInteractionMode={interactiveMapState.handleOpenInteractionMode}
          onSelectMarker={interactiveMapState.handleSelectMarker}
          onSelectTool={interactiveMapState.handleSelectTool}
          onSelectZone={interactiveMapState.handleZoneInteraction}
          saveLayoutErrorMessage={saveLayoutErrorMessage}
          selectedMarkerId={interactiveMapState.selectedMarkerId}
          zones={interactiveMapState.zones}
        />
        <div className={mapFrameClassName}>
          <InfrastructureMapOverlays
            availablePlacementPcCandidates={interactiveMapState.availablePlacementPcCandidates}
            availableSectors={availableSectors}
            isInteractionMode={interactiveMapState.isInteractionMode}
            isZoneEditToolActive={interactiveMapState.isZoneEditToolActive}
            markerDraft={interactiveMapState.pendingMarkerDraft}
            markerDraftError={interactiveMapState.pendingMarkerDraftError}
            markerDraftId={interactiveMapState.pendingMarkerId}
            onCancelDrafts={interactiveMapState.clearPendingDrafts}
            onCloseSelectedMarker={interactiveMapState.handleCloseSelectedMarker}
            onMarkerIdChange={interactiveMapState.setPendingMarkerId}
            onMarkerSubmit={interactiveMapState.handleMarkerDraftSave}
            onSelectedZoneClose={() =>
              interactiveMapState.selectedZone !== null
                ? interactiveMapState.handleZoneInteraction(
                  interactiveMapState.selectedZone.id,
                )
                : undefined}
            onSelectedZoneProdschedChange={interactiveMapState.handleSelectedZoneProdschedChange}
            onSelectedZoneSectorChange={interactiveMapState.handleSelectedZoneSectorChange}
            onZoneProdschedChange={interactiveMapState.handleZoneDraftProdschedChange}
            onZoneSectorChange={interactiveMapState.handleZoneDraftSectorChange}
            onZoneSubmit={interactiveMapState.handleZoneDraftSave}
            selectedMarker={interactiveMapState.selectedMarker}
            selectedMarkerAssignedZone={selectedMarkerAssignedZone}
            selectedZone={interactiveMapState.selectedZone}
            zoneDraft={interactiveMapState.pendingZoneDraft}
            zoneDraftError={interactiveMapState.pendingZoneDraftError}
            zoneDraftProdsched={interactiveMapState.pendingZoneProdsched}
            zoneDraftSector={interactiveMapState.pendingZoneSector}
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
            onResizeZone={interactiveMapState.handleZoneResizeDrag}
            onSelectMarker={interactiveMapState.handleSelectMarker}
            onSelectZone={interactiveMapState.handleZoneInteraction}
            onZoneDraftDrag={interactiveMapState.handleZoneDraftDrag}
            pendingZoneDraft={interactiveMapState.pendingZoneDraft}
            pendingZonePreviewColor={getSectorColor(
              interactiveMapState.pendingZoneSector,
            )}
            pendingZonePreviewLabel={interactiveMapState.pendingZoneProdsched || "Zone"}
            selectedMarkerFocusToken={interactiveMapState.selectedMarkerFocusToken}
            selectedMarkerId={interactiveMapState.selectedMarkerId}
            selectedMarkerPosition={interactiveMapState.selectedMarker === null
              ? null
              : {
                x: interactiveMapState.selectedMarker.x,
                y: interactiveMapState.selectedMarker.y,
              }}
            selectedZone={interactiveMapState.selectedZone}
            zones={interactiveMapState.zones}
          />
        </div>
      </div>
    </section>
  );
}
