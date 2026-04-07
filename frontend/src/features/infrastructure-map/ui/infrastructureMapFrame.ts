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
    "relative isolate h-[68vh] min-h-[420px] overflow-hidden rounded-[24px] border border-schneider-950/10",
    "bg-[#ecf1ed] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:h-[76vh] sm:min-h-[560px]",
    "[&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-transparent",
    "[&_.leaflet-control-zoom]:overflow-hidden [&_.leaflet-control-zoom]:rounded-[18px]",
    "[&_.leaflet-control-zoom]:border [&_.leaflet-control-zoom]:border-white/80 [&_.leaflet-control-zoom]:bg-white/94",
    "[&_.leaflet-control-zoom]:shadow-[0_10px_22px_rgba(16,38,26,0.12)]",
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
