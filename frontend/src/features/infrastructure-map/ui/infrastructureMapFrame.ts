import type { MapZone } from "@/features/infrastructure-map/model/types";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

interface MapFrameClassNameOptions {
  isCreationToolActive: boolean;
  isDeletionToolActive: boolean;
  isInteractionMode: boolean;
  isMarkerMoveToolActive: boolean;
}

export function getMapFrameClassName({
  isCreationToolActive,
  isDeletionToolActive,
  isInteractionMode,
  isMarkerMoveToolActive,
}: MapFrameClassNameOptions): string {
  return joinClassNames(
    "relative isolate h-[70vh] min-h-[420px] overflow-hidden rounded-[30px] border border-schneider-950/10",
    "bg-[radial-gradient(circle_at_top,_rgba(61,205,88,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(236,245,239,0.9))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:h-[78vh] sm:min-h-[560px]",
    "[&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-transparent",
    "[&_.leaflet-control-zoom]:overflow-hidden [&_.leaflet-control-zoom]:rounded-2xl",
    "[&_.leaflet-control-zoom]:border [&_.leaflet-control-zoom]:border-white/80 [&_.leaflet-control-zoom]:bg-white/94",
    "[&_.leaflet-control-zoom]:shadow-[0_16px_32px_rgba(16,38,26,0.16)]",
    "[&_.leaflet-control-zoom_a]:!border-0 [&_.leaflet-control-zoom_a]:!bg-transparent",
    "[&_.leaflet-control-zoom_a]:!text-schneider-950 [&_.leaflet-control-zoom_a]:transition-colors",
    "[&_.leaflet-control-zoom_a:hover]:!bg-schneider-50",
    isCreationToolActive &&
      "[&_.leaflet-container]:cursor-crosshair [&_.leaflet-image-layer]:cursor-crosshair [&_.leaflet-interactive]:cursor-crosshair [&_.leaflet-marker-icon]:cursor-crosshair",
    isMarkerMoveToolActive &&
      "[&_.leaflet-marker-icon]:cursor-grab [&_.leaflet-marker-icon:active]:cursor-grabbing [&_.leaflet-tooltip]:opacity-90",
    isDeletionToolActive &&
      "[&_.leaflet-interactive]:cursor-not-allowed [&_.leaflet-marker-icon]:cursor-not-allowed",
    isInteractionMode && "[&_.leaflet-pane]:select-none",
  );
}

export function findMarkerZone(
  zoneId: number | null,
  zones: MapZone[],
): MapZone | null {
  if (zoneId === null) {
    return null;
  }

  return zones.find((zone) => zone.id === zoneId) ?? null;
}
