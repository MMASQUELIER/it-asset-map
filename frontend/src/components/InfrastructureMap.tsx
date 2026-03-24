import L from "leaflet";
import { ImageOverlay, MapContainer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./map/controllers/MapClickHandler";
import MapViewportController from "./map/controllers/MapViewportController";
import ZoneDrawHandler from "./map/controllers/ZoneDrawHandler";
import useInfrastructureMapState from "./map/hooks/useInfrastructureMapState";
import { IMAGE_BOUNDS, MAP_STYLE } from "./map/logic/mapConfig";
import MapDraftPanels from "./map/ui/MapDraftPanels";
import MapSearchPanel from "./map/ui/MapSearchPanel";
import MapToolbar from "./map/ui/MapToolbar";
import PcDetailsPanel from "./map/ui/PcDetailsPanel";
import PcLayer from "./map/ui/PcLayer";
import ZoneDraftPreview from "./map/ui/ZoneDraftPreview";
import ZoneLegend from "./map/ui/ZoneLegend";
import ZoneResizeHandles from "./map/ui/ZoneResizeHandles";
import ZonesLayer from "./map/ui/ZonesLayer";
import "./map/styles/InfrastructureMap.css";

interface InfrastructureMapProps {
  imageUrl: string;
}

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
  const mapFrameClassName = `map-frame${isCreationToolActive ? " map-frame--add-mode" : ""}${isMarkerMoveToolActive ? " map-frame--move-mode" : ""}${isDeletionToolActive ? " map-frame--delete-mode" : ""}${isInteractionMode ? " map-frame--interaction" : ""}`;
  const pendingZoneLabel = pendingZoneId.length > 0 ? pendingZoneId : "Zone";
  const selectedMarkerZone =
    selectedMarker === null || selectedMarker.zoneId === null
      ? null
      : (zones.find((zone) => zone.id === selectedMarker.zoneId) ?? null);

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
