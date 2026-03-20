import L from "leaflet";
import type { DragEndEvent } from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import type { InteractiveMarker, MapZone } from "../../../types/layout";

interface PcLayerProps {
  activeZoneId: number | null;
  isDeleteMode: boolean;
  isMoveMode: boolean;
  markers: InteractiveMarker[];
  onDeleteMarker: (markerId: string) => void;
  onHoverZone: (zoneId: number) => void;
  onLeaveZone: () => void;
  onMoveMarker: (markerId: string, x: number, y: number) => void;
  zones: MapZone[];
}

export default function PcLayer({
  activeZoneId,
  isDeleteMode,
  isMoveMode,
  markers,
  onDeleteMarker,
  onHoverZone,
  onLeaveZone,
  onMoveMarker,
  zones,
}: PcLayerProps) {
  const zoneColorById = new Map(zones.map((zone) => [zone.id, zone.color]));

  return (
    <>
      {markers.map((marker) => {
        const isActiveZone = marker.zoneId !== null && activeZoneId === marker.zoneId;
        const isDimmed = activeZoneId !== null && marker.zoneId !== activeZoneId;
        const markerColor = marker.zoneId === null
          ? "#64748b"
          : (zoneColorById.get(marker.zoneId) ?? "#64748b");
        const markerSize = isActiveZone ? 14 : 11;

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
              isDimmed,
              isMoveMode,
            )}
            position={[marker.y, marker.x]}
            zIndexOffset={isActiveZone ? 300 : 0}
          >
            <Tooltip
              className={`pc-tooltip${isActiveZone ? " pc-tooltip--active" : ""}`}
              direction="top"
              offset={[0, -8]}
              permanent={isActiveZone}
            >
              {marker.id}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

function createMarkerIcon(
  markerColor: string,
  markerSize: number,
  isActiveZone: boolean,
  isDimmed: boolean,
  isMoveMode: boolean,
): L.DivIcon {
  const markerClassNames = ["pc-marker"];

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
