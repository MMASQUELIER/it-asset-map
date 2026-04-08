import { Fragment } from "react";
import L from "leaflet";
import { Marker, Rectangle } from "react-leaflet";
import type { MapZone } from "@/features/infrastructure-map/model/types";
import { getZoneCenter, toLeafletBounds } from "@/features/infrastructure-map/shared/mapGeometry";
import { getZoneDisplayLabel } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface ZonesLayerProps {
  activeZoneId: number | null;
  onHoverZone: (zoneId: number) => void;
  onLeaveZone: () => void;
  onSelectZone: (zoneId: number) => void;
  zones: MapZone[];
}

function createZoneIcon(zoneLabel: string, isActive: boolean): L.DivIcon {
  return L.divIcon({
    className: "border-0 bg-transparent",
    html: `<span class="inline-flex min-w-[56px] max-w-[96px] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.82rem] font-black tracking-[0.02em] shadow-[0_10px_22px_rgba(22,67,39,0.18)] ${
      isActive
        ? "border-schneider-500/25 bg-schneider-500 text-white"
        : "border-white/90 bg-white/96 text-[#174b28]"
    }">${zoneLabel}</span>`,
    iconSize: [84, 32],
    iconAnchor: [42, 16],
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
              icon={createZoneIcon(getZoneDisplayLabel(zone), isActive)}
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
