import L from "leaflet";
import { ImageOverlay, MapContainer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./map/controllers/MapClickHandler";
import MapViewportController from "./map/controllers/MapViewportController";
import ZoneDrawHandler from "./map/controllers/ZoneDrawHandler";
import useInfrastructureMapState from "./map/hooks/useInfrastructureMapState";
import { IMAGE_BOUNDS, MAP_STYLE } from "./map/logic/mapConfig";
import MapDraftPanels from "./map/ui/MapDraftPanels";
import MapToolbar from "./map/ui/MapToolbar";
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
    handleDeleteMarker,
    handleHoverZone,
    handleLeaveZone,
    handleMoveMarker,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    handleOpenInteractionMode,
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
    selectedZone,
    setPendingMarkerId,
    setPendingZoneId,
    zones,
  } = useInfrastructureMapState();

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
      </div>

      <div
        className={`map-frame${isCreationToolActive ? " map-frame--add-mode" : ""}${isMarkerMoveToolActive ? " map-frame--move-mode" : ""}${isDeletionToolActive ? " map-frame--delete-mode" : ""}${isInteractionMode ? " map-frame--interaction" : ""}`}
      >
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
          <MapViewportController imageBounds={IMAGE_BOUNDS} />
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
              label={pendingZoneId.length > 0 ? pendingZoneId : "Zone"}
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
            isDeleteMode={isMarkerDeletionToolActive}
            isMoveMode={isMarkerMoveToolActive}
            markers={markers}
            onDeleteMarker={handleDeleteMarker}
            onHoverZone={handleHoverZone}
            onLeaveZone={handleLeaveZone}
            onMoveMarker={handleMoveMarker}
            zones={zones}
          />
        </MapContainer>
      </div>
    </section>
  );
}
