import L from "leaflet";
import { ImageOverlay, MapContainer, ZoomControl } from "react-leaflet";
import type {
  InteractiveMarker,
  MapZone,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import type { LatLngBoundsExpression } from "leaflet";
import MapClickHandler from "@/features/infrastructure-map/editor/controllers/MapClickHandler";
import MapViewportController from "@/features/infrastructure-map/editor/controllers/MapViewportController";
import ZoneDrawHandler from "@/features/infrastructure-map/editor/controllers/ZoneDrawHandler";
import { MAP_STYLE } from "@/features/infrastructure-map/shared/mapConfig";
import PcLayer from "@/features/infrastructure-map/markers/ui/PcLayer";
import type { ZoneResizeHandle } from "@/features/infrastructure-map/shared/interactionTypes";
import ZoneDraftPreview from "@/features/infrastructure-map/zones/ui/ZoneDraftPreview";
import ZoneResizeHandles from "@/features/infrastructure-map/zones/ui/ZoneResizeHandles";
import ZonesLayer from "@/features/infrastructure-map/zones/ui/ZonesLayer";

interface InfrastructureMapCanvasProps {
  highlightedZoneId: number | null;
  imageBounds: LatLngBoundsExpression;
  imageUrl: string;
  isConsultationEnabled: boolean;
  isDeleteMode: boolean;
  isMarkerCreationToolActive: boolean;
  isMoveMode: boolean;
  isZoneCreationToolActive: boolean;
  isZoneEditToolActive: boolean;
  markers: InteractiveMarker[];
  onDeleteMarker: (markerId: string) => void;
  onHoverZone: (zoneId: number) => void;
  onLeaveZone: () => void;
  onMarkerPlacement: (x: number, y: number) => void;
  onMoveMarker: (markerId: string, x: number, y: number) => void;
  onResizeZone: (handle: ZoneResizeHandle, x: number, y: number) => void;
  onSelectMarker: (markerId: string) => void;
  onSelectZone: (zoneId: number) => void;
  onZoneDraftDrag: (startX: number, startY: number, currentX: number, currentY: number) => void;
  pendingZoneDraft: ZoneDraft | null;
  pendingZonePreviewColor: string;
  pendingZonePreviewLabel: string;
  selectedMarkerFocusToken: number;
  selectedMarkerId: string | null;
  selectedMarkerPosition: { x: number; y: number } | null;
  selectedZone: MapZone | null;
  zones: MapZone[];
}

export function InfrastructureMapCanvas({
  highlightedZoneId,
  imageBounds,
  imageUrl,
  isConsultationEnabled,
  isDeleteMode,
  isMarkerCreationToolActive,
  isMoveMode,
  isZoneCreationToolActive,
  isZoneEditToolActive,
  markers,
  onDeleteMarker,
  onHoverZone,
  onLeaveZone,
  onMarkerPlacement,
  onMoveMarker,
  onResizeZone,
  onSelectMarker,
  onSelectZone,
  onZoneDraftDrag,
  pendingZoneDraft,
  pendingZonePreviewColor,
  pendingZonePreviewLabel,
  selectedMarkerFocusToken,
  selectedMarkerId,
  selectedMarkerPosition,
  selectedZone,
  zones,
}: InfrastructureMapCanvasProps) {
  return (
    <MapContainer
      bounds={imageBounds}
      crs={L.CRS.Simple}
      maxBounds={imageBounds}
      maxBoundsViscosity={1}
      maxZoom={4}
      minZoom={-0.25}
      preferCanvas={true}
      scrollWheelZoom={true}
      style={MAP_STYLE}
      wheelPxPerZoomLevel={160}
      zoomControl={false}
      zoomSnap={0.25}
    >
      <MapViewportController
        focusToken={selectedMarkerFocusToken}
        focusX={selectedMarkerPosition?.x ?? null}
        focusY={selectedMarkerPosition?.y ?? null}
        imageBounds={imageBounds}
      />
      <MapClickHandler
        isEnabled={isMarkerCreationToolActive}
        onCoordinateClick={onMarkerPlacement}
      />
      <ZoneDrawHandler
        isEnabled={isZoneCreationToolActive}
        onDraftDrag={onZoneDraftDrag}
      />
      <ZoomControl position="bottomright" />
      <ImageOverlay
        bounds={imageBounds}
        className="select-none saturate-[0.97]"
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
        onHoverZone={onHoverZone}
        onLeaveZone={onLeaveZone}
        onSelectZone={onSelectZone}
        zones={zones}
      />
      {isZoneEditToolActive && selectedZone !== null
        ? (
          <ZoneResizeHandles
            bounds={selectedZone.bounds}
            onResize={onResizeZone}
          />
        )
        : null}
      <PcLayer
        activeZoneId={highlightedZoneId}
        isConsultationEnabled={isConsultationEnabled}
        isDeleteMode={isDeleteMode}
        isMoveMode={isMoveMode}
        markers={markers}
        onDeleteMarker={onDeleteMarker}
        onHoverZone={onHoverZone}
        onLeaveZone={onLeaveZone}
        onMoveMarker={onMoveMarker}
        onSelectMarker={onSelectMarker}
        selectedMarkerId={selectedMarkerId}
        zones={zones}
      />
    </MapContainer>
  );
}
