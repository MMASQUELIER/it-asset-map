import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";
import MapToolbar from "@/features/infrastructure-map/editor/ui/MapToolbar";
import MapSearchPanel from "@/features/infrastructure-map/markers/ui/MapSearchPanel";
import type { InteractiveMarker, MapZone } from "@/features/infrastructure-map/model/types";
import {
  infoBadgeClassName,
  joinClassNames,
} from "@/features/infrastructure-map/ui/uiClassNames";
import ZoneLegend from "@/features/infrastructure-map/zones/ui/ZoneLegend";

interface InfrastructureMapControlsProps {
  activeTool: InteractionTool;
  highlightedZoneId: number | null;
  isInteractionMode: boolean;
  isSavingLayout: boolean;
  markers: InteractiveMarker[];
  onCloseInteractionMode: () => void;
  onOpenInteractionMode: () => void;
  onSelectMarker: (markerId: string) => void;
  onSelectTool: (tool: InteractionTool) => void;
  onSelectZone: (zoneId: number) => void;
  saveLayoutErrorMessage: string | null;
  selectedMarkerId: string | null;
  zones: MapZone[];
}

export function InfrastructureMapControls({
  activeTool,
  highlightedZoneId,
  isInteractionMode,
  isSavingLayout,
  markers,
  onCloseInteractionMode,
  onOpenInteractionMode,
  onSelectMarker,
  onSelectTool,
  onSelectZone,
  saveLayoutErrorMessage,
  selectedMarkerId,
  zones,
}: InfrastructureMapControlsProps) {
  return (
    <div className="grid gap-5 p-4 sm:p-5 lg:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.82fr)]">
        <MapToolbar
          activeTool={activeTool}
          isInteractionMode={isInteractionMode}
          onCloseInteractionMode={onCloseInteractionMode}
          onOpenInteractionMode={onOpenInteractionMode}
          onSelectTool={onSelectTool}
        />
        <MapSearchPanel
          markers={markers}
          onSelectMarker={onSelectMarker}
          selectedMarkerId={selectedMarkerId}
          zones={zones}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <ZoneLegend
          activeZoneId={highlightedZoneId}
          onSelectZone={onSelectZone}
          zones={zones}
        />
        {isSavingLayout || saveLayoutErrorMessage !== null
          ? (
            <p
              className={joinClassNames(
                infoBadgeClassName,
                "min-h-12 justify-start rounded-[18px] px-4 py-3 text-[0.86rem] xl:min-w-[20rem]",
                saveLayoutErrorMessage !== null
                  ? "border-rose-300/55 bg-rose-50/88 text-rose-700"
                  : "border-schneider-900/8 bg-schneider-100/78 text-schneider-800",
              )}
            >
              {saveLayoutErrorMessage ?? "Sauvegarde du layout en cours..."}
            </p>
          )
          : null}
      </div>
    </div>
  );
}
