import L from "leaflet";
import { ImageOverlay, MapContainer, ZoomControl } from "react-leaflet";
import type {
  MapLayoutData,
  MapZone,
  PlacementPcCandidate,
} from "./shared/types";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./editor/controllers/MapClickHandler";
import MapViewportController from "./editor/controllers/MapViewportController";
import ZoneDrawHandler from "./editor/controllers/ZoneDrawHandler";
import useInfrastructureMapState from "./state/useInfrastructureMapState";
import useBackendInfrastructureCatalog from "./state/useBackendInfrastructureCatalog";
import useBackendMapLayout from "./state/useBackendMapLayout";
import usePersistedMapLayout from "./state/usePersistedMapLayout";
import { hydrateInteractiveMapState } from "./state/mapLayoutPersistence";
import { createImageBounds, MAP_STYLE } from "./shared/mapConfig";
import MapDraftPanels from "./editor/ui/MapDraftPanels";
import MapSearchPanel from "./markers/ui/MapSearchPanel";
import MapToolbar from "./editor/ui/MapToolbar";
import PcDetailsPanel from "./pc-details/ui/PcDetailsPanel";
import PcLayer from "./markers/ui/PcLayer";
import ZoneDraftPreview from "./zones/ui/ZoneDraftPreview";
import ZoneLegend from "./zones/ui/ZoneLegend";
import ZoneResizeHandles from "./zones/ui/ZoneResizeHandles";
import ZonesLayer from "./zones/ui/ZonesLayer";
import SelectedZonePanel from "./zones/ui/SelectedZonePanel";
import { getSectorColor } from "./zones/logic/zoneAppearance";
import "./styles/InfrastructureMap.css";

/** Props required to render the infrastructure map. */
interface InfrastructureMapProps {
  assetsUrl: string;
  imageUrl: string;
  layoutUrl: string;
  sectorsUrl: string;
}

interface LoadedInfrastructureMapProps {
  availableSectors: string[];
  imageUrl: string;
  isSavingLayout: boolean;
  layoutData: MapLayoutData;
  onSaveLayout: (layoutData: MapLayoutData) => Promise<void>;
  placementPcCandidates: PlacementPcCandidate[];
  saveLayoutErrorMessage: string | null;
}

/**
 * Main map screen combining the controls, the image overlay and interactive
 * zones and markers.
 *
 * @param imageUrl Backend URL used to retrieve the map image.
 * @returns Full map experience.
 */
export default function InfrastructureMap({
  assetsUrl,
  imageUrl,
  layoutUrl,
  sectorsUrl,
}: InfrastructureMapProps) {
  const {
    availableSectors,
    errorMessage: backendCatalogError,
    isLoading: isBackendCatalogLoading,
    placementPcCandidates,
  } = useBackendInfrastructureCatalog({
    assetsUrl,
    sectorsUrl,
  });
  const {
    errorMessage: backendLayoutError,
    isLoading: isBackendLayoutLoading,
    isSaving: isSavingLayout,
    layoutData,
    saveErrorMessage: saveLayoutErrorMessage,
    saveLayout,
  } = useBackendMapLayout({ layoutUrl });

  if (isBackendCatalogLoading || isBackendLayoutLoading) {
    return (
      <MapStatusCard
        message="Chargement du catalogue Excel et du layout de la carte..."
        title="Chargement"
      />
    );
  }

  if (backendCatalogError !== null) {
    return (
      <MapStatusCard
        message={backendCatalogError}
        title="Catalogue indisponible"
      />
    );
  }

  if (backendLayoutError !== null || layoutData === null) {
    return (
      <MapStatusCard
        message={backendLayoutError ??
          "Impossible de charger le layout de la carte."}
        title="Layout indisponible"
      />
    );
  }

  return (
    <LoadedInfrastructureMap
      availableSectors={availableSectors}
      imageUrl={imageUrl}
      isSavingLayout={isSavingLayout}
      layoutData={layoutData}
      onSaveLayout={saveLayout}
      placementPcCandidates={placementPcCandidates}
      saveLayoutErrorMessage={saveLayoutErrorMessage}
    />
  );
}

function LoadedInfrastructureMap({
  availableSectors,
  imageUrl,
  isSavingLayout,
  layoutData,
  onSaveLayout,
  placementPcCandidates,
  saveLayoutErrorMessage,
}: LoadedInfrastructureMapProps) {
  const hydratedMapState = hydrateInteractiveMapState(
    layoutData,
    placementPcCandidates,
  );
  const imageBounds = createImageBounds(hydratedMapState.mapImage);
  const {
    activeTool,
    availablePlacementPcCandidates,
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
    isZoneCreationToolActive,
    isMarkerCreationToolActive,
    isMarkerMoveToolActive,
    isMarkerDeletionToolActive,
    isDeletionToolActive,
    isInteractionMode,
    isZoneEditToolActive,
    markers,
    pendingMarkerDraft,
    pendingMarkerDraftError,
    pendingMarkerId,
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
  } = useInfrastructureMapState({
    availableSectors,
    initialMapImage: hydratedMapState.mapImage,
    initialMarkers: hydratedMapState.markers,
    initialZones: hydratedMapState.zones,
    placementPcCandidates,
  });
  const mapFrameClassName = getMapFrameClassName({
    isCreationToolActive,
    isDeletionToolActive,
    isInteractionMode,
    isMarkerMoveToolActive,
  });
  const pendingZonePreviewLabel = pendingZoneProdsched.length > 0
    ? pendingZoneProdsched
    : "Zone";
  const pendingZonePreviewColor = getSectorColor(pendingZoneSector);
  const selectedMarkerZone = findMarkerZone(
    selectedMarker?.zoneId ?? null,
    zones,
  );

  usePersistedMapLayout({
    mapImage: hydratedMapState.mapImage,
    markers,
    onSaveLayout,
    zones,
  });

  return (
    <section className="map-card">
      <div className="map-controls">
        <MapToolbar
          activeTool={activeTool}
          isInteractionMode={isInteractionMode}
          onCloseInteractionMode={handleCloseInteractionMode}
          onOpenInteractionMode={handleOpenInteractionMode}
          onSelectTool={handleSelectTool}
        />
        <ZoneLegend
          activeZoneId={highlightedZoneId}
          onSelectZone={handleZoneInteraction}
          zones={zones}
        />
        <MapSearchPanel
          markers={markers}
          onSelectMarker={handleSelectMarker}
          selectedMarkerId={selectedMarkerId}
          zones={zones}
        />
        {isSavingLayout || saveLayoutErrorMessage !== null
          ? (
            <p
              className={`map-layout-status${
                saveLayoutErrorMessage !== null
                  ? " map-layout-status--error"
                  : ""
              }`}
            >
              {saveLayoutErrorMessage ?? "Sauvegarde du layout en cours..."}
            </p>
          )
          : null}
      </div>

      <div className={mapFrameClassName}>
        <MapDraftPanels
          markerDraft={pendingMarkerDraft}
          markerDraftError={pendingMarkerDraftError}
          markerDraftId={pendingMarkerId}
          markerPlacementCatalogError={null}
          markerPlacementCandidates={availablePlacementPcCandidates}
          markerPlacementCatalogLoading={false}
          onCancel={clearPendingDrafts}
          onMarkerIdChange={setPendingMarkerId}
          onMarkerSubmit={handleMarkerDraftSave}
          availableSectors={availableSectors}
          onZoneProdschedChange={handleZoneDraftProdschedChange}
          onZoneSectorChange={handleZoneDraftSectorChange}
          onZoneSubmit={handleZoneDraftSave}
          zoneDraft={pendingZoneDraft}
          zoneDraftError={pendingZoneDraftError}
          zoneDraftProdsched={pendingZoneProdsched}
          zoneDraftSector={pendingZoneSector}
        />
        {isInteractionMode && isZoneEditToolActive && selectedZone !== null &&
            pendingMarkerDraft === null && pendingZoneDraft === null
          ? (
            <SelectedZonePanel
              availableSectors={availableSectors}
              onClose={() => handleZoneInteraction(selectedZone.id)}
              onProdschedChange={handleSelectedZoneProdschedChange}
              onSectorChange={handleSelectedZoneSectorChange}
              zone={selectedZone}
            />
          )
          : null}
        {!isInteractionMode && selectedMarker !== null
          ? (
            <PcDetailsPanel
              marker={selectedMarker}
              onClose={handleCloseSelectedMarker}
              zone={selectedMarkerZone}
            />
          )
          : null}

        <MapContainer
          bounds={imageBounds}
          maxBounds={imageBounds}
          maxBoundsViscosity={1}
          minZoom={-0.25}
          maxZoom={4}
          preferCanvas={true}
          scrollWheelZoom={true}
          wheelPxPerZoomLevel={160}
          zoomControl={false}
          zoomSnap={0.25}
          crs={L.CRS.Simple}
          style={MAP_STYLE}
        >
          <MapViewportController
            focusToken={selectedMarkerFocusToken}
            focusX={selectedMarker?.x ?? null}
            focusY={selectedMarker?.y ?? null}
            imageBounds={imageBounds}
          />
          <MapClickHandler
            isEnabled={isMarkerCreationToolActive}
            onCoordinateClick={handleMarkerPlacement}
          />
          <ZoneDrawHandler
            isEnabled={isZoneCreationToolActive}
            onDraftDrag={handleZoneDraftDrag}
          />
          <ZoomControl position="bottomright" />
          <ImageOverlay
            bounds={imageBounds}
            className="map-image"
            url={imageUrl}
          />
          {pendingZoneDraft !== null
            ? (
              <ZoneDraftPreview
                bounds={pendingZoneDraft.bounds}
                color={pendingZonePreviewColor}
                label={pendingZonePreviewLabel}
              />
            )
            : null}
          <ZonesLayer
            activeZoneId={highlightedZoneId}
            onHoverZone={handleHoverZone}
            onLeaveZone={handleLeaveZone}
            onSelectZone={handleZoneInteraction}
            zones={zones}
          />
          {isZoneEditToolActive && selectedZone !== null
            ? (
              <ZoneResizeHandles
                bounds={selectedZone.bounds}
                onResize={handleZoneResizeDrag}
              />
            )
            : null}
          <PcLayer
            activeZoneId={highlightedZoneId}
            isConsultationEnabled={!isInteractionMode}
            isDeleteMode={isMarkerDeletionToolActive}
            isMoveMode={isMarkerMoveToolActive}
            markers={markers}
            onDeleteMarker={handleDeleteMarker}
            onHoverZone={handleHoverZone}
            onLeaveZone={handleLeaveZone}
            onMoveMarker={handleMoveMarker}
            onSelectMarker={handleSelectMarker}
            selectedMarkerId={selectedMarkerId}
            zones={zones}
          />
        </MapContainer>
      </div>
    </section>
  );
}

interface MapStatusCardProps {
  message: string;
  title: string;
}

interface MapFrameClassNameOptions {
  isCreationToolActive: boolean;
  isDeletionToolActive: boolean;
  isInteractionMode: boolean;
  isMarkerMoveToolActive: boolean;
}

function MapStatusCard({ message, title }: MapStatusCardProps) {
  return (
    <section className="map-card">
      <div className="map-controls">
        <div className="map-status-card">
          <p className="map-toolbar__eyebrow">{title}</p>
          <h2 className="map-toolbar__title">Infrastructure map</h2>
          <p className="map-toolbar__description">{message}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * Builds the CSS class list used to reflect the active interaction mode.
 *
 * @param options Active visual states.
 * @returns Concatenated class name string.
 */
function getMapFrameClassName({
  isCreationToolActive,
  isDeletionToolActive,
  isInteractionMode,
  isMarkerMoveToolActive,
}: MapFrameClassNameOptions): string {
  return [
    "map-frame",
    isCreationToolActive ? "map-frame--add-mode" : "",
    isMarkerMoveToolActive ? "map-frame--move-mode" : "",
    isDeletionToolActive ? "map-frame--delete-mode" : "",
    isInteractionMode ? "map-frame--interaction" : "",
  ]
    .filter((className) => className.length > 0)
    .join(" ");
}

/**
 * Finds the zone associated with the currently selected marker.
 *
 * @param zoneId Marker zone identifier.
 * @param zones Available zones.
 * @returns Matching zone or `null`.
 */
function findMarkerZone(
  zoneId: number | null,
  zones: MapZone[],
): MapZone | null {
  if (zoneId === null) {
    return null;
  }

  return zones.find((zone) => zone.id === zoneId) ?? null;
}
