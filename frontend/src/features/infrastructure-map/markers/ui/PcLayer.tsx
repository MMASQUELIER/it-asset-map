import L from "leaflet";
import type { DragEndEvent } from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import type { InteractiveMarker, MapZone } from "../../shared/types";

/** Props used to render the PC marker layer. */
interface PcLayerProps {
  activeZoneId: number | null;
  isConsultationEnabled: boolean;
  isDeleteMode: boolean;
  isMoveMode: boolean;
  markers: InteractiveMarker[];
  onDeleteMarker: (markerId: string) => void;
  onHoverZone: (zoneId: number) => void;
  onLeaveZone: () => void;
  onMoveMarker: (markerId: string, x: number, y: number) => void;
  onSelectMarker: (markerId: string) => void;
  selectedMarkerId: string | null;
  zones: MapZone[];
}

/**
 * Renders every interactive PC marker on the map.
 *
 * @param props Marker data and interaction callbacks.
 * @returns Leaflet marker elements.
 */
export default function PcLayer({
  activeZoneId,
  isConsultationEnabled,
  isDeleteMode,
  isMoveMode,
  markers,
  onDeleteMarker,
  onHoverZone,
  onLeaveZone,
  onMoveMarker,
  onSelectMarker,
  selectedMarkerId,
  zones,
}: PcLayerProps) {
  const zoneColorById = new Map(zones.map((zone) => [zone.id, zone.color]));

  return (
    <>
      {markers.map((marker) => {
        const isSelectedMarker = selectedMarkerId === marker.id;
        const isActiveZone = marker.zoneId !== null && activeZoneId === marker.zoneId;
        const isDimmed =
          activeZoneId !== null &&
          marker.zoneId !== activeZoneId &&
          !isSelectedMarker;
        const markerColor =
          marker.zoneId === null
            ? "#64748b"
            : (zoneColorById.get(marker.zoneId) ?? "#64748b");
        const markerSize = isSelectedMarker ? 16 : (isActiveZone ? 14 : 11);
        const tooltipClassName = `pc-tooltip${isActiveZone ? " pc-tooltip--active" : ""}${isSelectedMarker ? " pc-tooltip--selected" : ""}`;
        const zIndexOffset = isSelectedMarker ? 450 : (isActiveZone ? 300 : 0);

        return (
          <Marker
            key={marker.id}
            autoPan={isMoveMode}
            bubblingMouseEvents={false}
            draggable={isMoveMode}
            eventHandlers={{
              click: (event) => {
                if (isDeleteMode) {
                  onDeleteMarker(marker.id);
                  return;
                }

                if (!isConsultationEnabled) {
                  return;
                }

                onSelectMarker(marker.id);
                event.target.openTooltip();
              },
              mouseover: () => {
                if (marker.zoneId !== null) {
                  onHoverZone(marker.zoneId);
                }
              },
              mouseout: () => {
                if (marker.zoneId !== null) {
                  onLeaveZone();
                }
              },
              dragend: (event: DragEndEvent) => {
                if (!isMoveMode) {
                  return;
                }

                const { lat, lng } = event.target.getLatLng();

                onMoveMarker(marker.id, lng, lat);
                event.target.openTooltip();
              },
            }}
            icon={createMarkerIcon(
              markerColor,
              markerSize,
              isActiveZone,
              isSelectedMarker,
              isDimmed,
              isMoveMode,
            )}
            position={[marker.y, marker.x]}
            zIndexOffset={zIndexOffset}
          >
            <Tooltip
              className={tooltipClassName}
              direction="top"
              offset={[0, -8]}
              permanent={isActiveZone || isSelectedMarker}
            >
              {marker.id}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

/**
 * Builds a Leaflet icon matching the visual state of a marker.
 *
 * @param markerColor Marker color.
 * @param markerSize Marker diameter.
 * @param isActiveZone Whether the marker belongs to the highlighted zone.
 * @param isSelectedMarker Whether the marker is selected.
 * @param isDimmed Whether the marker should be visually muted.
 * @param isMoveMode Whether move mode is active.
 * @returns Leaflet div icon.
 */
function createMarkerIcon(
  markerColor: string,
  markerSize: number,
  isActiveZone: boolean,
  isSelectedMarker: boolean,
  isDimmed: boolean,
  isMoveMode: boolean,
): L.DivIcon {
  const markerClassNames = ["pc-marker"];

  if (isSelectedMarker) {
    markerClassNames.push("pc-marker--selected");
  }

  if (isActiveZone) {
    markerClassNames.push("pc-marker--active");
  }

  if (isDimmed) {
    markerClassNames.push("pc-marker--dimmed");
  }

  if (isMoveMode) {
    markerClassNames.push("pc-marker--move");
  }

  return L.divIcon({
    className: "pc-marker-wrapper",
    html: `<span class="${markerClassNames.join(" ")}" style="--pc-marker-color: ${markerColor}; width: ${markerSize}px; height: ${markerSize}px;"></span>`,
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerSize / 2, markerSize / 2],
  });
}
