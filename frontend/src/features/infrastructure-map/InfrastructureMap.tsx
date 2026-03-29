import L from "leaflet";
import { ImageOverlay, MapContainer, ZoomControl } from "react-leaflet";
import type { MapZone } from "./shared/types";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./editor/controllers/MapClickHandler";
import MapViewportController from "./editor/controllers/MapViewportController";
import ZoneDrawHandler from "./editor/controllers/ZoneDrawHandler";
import useInfrastructureMapState from "./state/useInfrastructureMapState";
import { IMAGE_BOUNDS, MAP_STYLE } from "./shared/mapConfig";
import MapDraftPanels from "./editor/ui/MapDraftPanels";
import MapSearchPanel from "./markers/ui/MapSearchPanel";
import MapToolbar from "./editor/ui/MapToolbar";
import PcDetailsPanel from "./pc-details/ui/PcDetailsPanel";
import PcLayer from "./markers/ui/PcLayer";
import ZoneDraftPreview from "./zones/ui/ZoneDraftPreview";
import ZoneLegend from "./zones/ui/ZoneLegend";
import ZoneResizeHandles from "./zones/ui/ZoneResizeHandles";
import ZonesLayer from "./zones/ui/ZonesLayer";
import "./styles/InfrastructureMap.css";

/** Props required to render the infrastructure map. */
interface InfrastructureMapProps {
  imageUrl: string;
}

/**
 * Main map screen combining the controls, the image overlay and interactive
 * zones and markers.
 *
 * @param imageUrl Backend URL used to retrieve the map image.
 * @returns Full map experience.
 */
export default function InfrastructureMap({
  imageUrl,
}: InfrastructureMapProps) {
  const {
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
    pendingZoneId,
    selectedMarker,
    selectedMarkerFocusToken,
    selectedMarkerId,
    selectedZone,
    setPendingMarkerId,
    setPendingZoneId,
    zones,
  } = useInfrastructureMapState();
  const mapFrameClassName = getMapFrameClassName({
    isCreationToolActive,
    isDeletionToolActive,
    isInteractionMode,
    isMarkerMoveToolActive,
  });
  const pendingZoneLabel = pendingZoneId.length > 0 ? pendingZoneId : "Zone";
  const selectedMarkerZone = findMarkerZone(selectedMarker?.zoneId ?? null, zones);

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
      </div>

      <div className={mapFrameClassName}>
        <MapDraftPanels
          markerDraft={pendingMarkerDraft}
          markerDraftError={pendingMarkerDraftError}
          markerDraftId={pendingMarkerId}
          onCancel={clearPendingDrafts}
          onMarkerIdChange={setPendingMarkerId}
          onMarkerSubmit={handleMarkerDraftSave}
          onZoneColorChange={handleZoneDraftColorChange}
          onZoneIdChange={setPendingZoneId}
          onZoneSubmit={handleZoneDraftSave}
          zoneDraft={pendingZoneDraft}
          zoneDraftError={pendingZoneDraftError}
          zoneDraftId={pendingZoneId}
        />
        {!isInteractionMode && selectedMarker !== null ? (
          <PcDetailsPanel
            marker={selectedMarker}
            onClose={handleCloseSelectedMarker}
            zone={selectedMarkerZone}
          />
        ) : null}

        <MapContainer
          bounds={IMAGE_BOUNDS}
          maxBounds={IMAGE_BOUNDS}
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
            imageBounds={IMAGE_BOUNDS}
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
            bounds={IMAGE_BOUNDS}
            className="map-image"
            url={imageUrl}
          />
          {pendingZoneDraft !== null ? (
            <ZoneDraftPreview
              bounds={pendingZoneDraft.bounds}
              color={pendingZoneDraft.color}
              label={pendingZoneLabel}
            />
          ) : null}
          <ZonesLayer
            activeZoneId={highlightedZoneId}
            onHoverZone={handleHoverZone}
            onLeaveZone={handleLeaveZone}
            onSelectZone={handleZoneInteraction}
            zones={zones}
          />
          {isZoneEditToolActive && selectedZone !== null ? (
            <ZoneResizeHandles
              bounds={selectedZone.bounds}
              onResize={handleZoneResizeDrag}
            />
          ) : null}
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

interface MapFrameClassNameOptions {
  isCreationToolActive: boolean;
  isDeletionToolActive: boolean;
  isInteractionMode: boolean;
  isMarkerMoveToolActive: boolean;
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
function findMarkerZone(zoneId: number | null, zones: MapZone[]): MapZone | null {
  if (zoneId === null) {
    return null;
  }

  return zones.find((zone) => zone.id === zoneId) ?? null;
}
