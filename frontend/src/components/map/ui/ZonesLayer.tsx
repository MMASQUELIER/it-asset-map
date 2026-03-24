import { Fragment } from "react";
import L from "leaflet";
import { Marker, Rectangle } from "react-leaflet";
import type { MapZone } from "../../../types/layout";
import { getZoneCenter, toLeafletBounds } from "../logic/mapGeometry";

interface ZonesLayerProps {
  activeZoneId: number | null;
  onHoverZone: (zoneId: number) => void;
  onLeaveZone: () => void;
  onSelectZone: (zoneId: number) => void;
  zones: MapZone[];
}

function createZoneIcon(zoneId: number, isActive: boolean): L.DivIcon {
  return L.divIcon({
    className: "zone-badge-wrapper",
    html: `<span class="zone-badge${isActive ? " zone-badge--active" : ""}">${zoneId}</span>`,
    iconSize: [64, 32],
    iconAnchor: [32, 16],
  });
}

export default function ZonesLayer({
  activeZoneId,
  onHoverZone,
  onLeaveZone,
  onSelectZone,
  zones,
}: ZonesLayerProps) {
  return (
    <>
      {zones.map((zone) => {
        const isActive = zone.id === activeZoneId;
        const eventHandlers = createZoneEventHandlers(
          zone.id,
          onHoverZone,
          onLeaveZone,
          onSelectZone,
        );

        return (
          <Fragment key={zone.id}>
            <Rectangle
              bounds={toLeafletBounds(zone.bounds)}
              eventHandlers={eventHandlers}
              pathOptions={createZonePathOptions(zone.color, isActive)}
            />

            <Marker
              bubblingMouseEvents={true}
              eventHandlers={eventHandlers}
              icon={createZoneIcon(zone.id, isActive)}
              position={getZoneCenter(zone.bounds)}
            />
          </Fragment>
        );
      })}
    </>
  );
}

function createZoneEventHandlers(
  zoneId: number,
  onHoverZone: (zoneId: number) => void,
  onLeaveZone: () => void,
  onSelectZone: (zoneId: number) => void,
): L.LeafletEventHandlerFnMap {
  return {
    mouseover: () => onHoverZone(zoneId),
    mouseout: onLeaveZone,
    click: () => onSelectZone(zoneId),
  };
}

function createZonePathOptions(
  color: string,
  isActive: boolean,
): L.PathOptions {
  return {
    color,
    fillColor: color,
    fillOpacity: isActive ? 0.24 : 0.1,
    weight: isActive ? 2.8 : 2,
  };
}
