import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";
import MapToolbar from "@/features/infrastructure-map/editor/ui/MapToolbar";
import MapSearchPanel from "@/features/infrastructure-map/markers/ui/MapSearchPanel";
import type { InteractiveMarker, MapZone } from "@/features/infrastructure-map/model/types";
import {
  joinClassNames,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { FeedbackNotice } from "@/features/infrastructure-map/ui/FeedbackNotice";
import ZoneLegend from "@/features/infrastructure-map/zones/ui/ZoneLegend";

interface InfrastructureMapControlsProps {
  activeTool: InteractionTool;
  errorMessage: string | null;
  highlightedZoneId: number | null;
  isInteractionMode: boolean;
  isSavingChanges: boolean;
  markers: InteractiveMarker[];
  onCloseInteractionMode: () => void;
  onOpenInteractionMode: () => void;
  onSelectMarker: (markerId: string) => void;
  onSelectTool: (tool: InteractionTool) => void;
  onSelectZone: (zoneId: number) => void;
  selectedMarkerId: string | null;
  zones: MapZone[];
}

export function InfrastructureMapControls({
  activeTool,
  errorMessage,
  highlightedZoneId,
  isInteractionMode,
  isSavingChanges,
  markers,
  onCloseInteractionMode,
  onOpenInteractionMode,
  onSelectMarker,
  onSelectTool,
  onSelectZone,
  selectedMarkerId,
  zones,
}: InfrastructureMapControlsProps) {
  const shouldShowFeedbackNotice = errorMessage !== null || isSavingChanges;
  const feedbackMessage = errorMessage ?? "Enregistrement en cours...";
  const feedbackTone = errorMessage !== null ? "error" : "info";
  const feedbackClassName = joinClassNames(
    "w-full",
    errorMessage === null && "border-schneider-900/10 bg-schneider-50/70",
  );

  return (
    <div className="grid gap-3 p-4 sm:p-5 lg:p-6">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(19rem,0.9fr)]">
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

      {shouldShowFeedbackNotice
        ? (
          <FeedbackNotice
            className={feedbackClassName}
            message={feedbackMessage}
            tone={feedbackTone}
          />
        )
        : null}

      <div className="grid gap-3">
        <ZoneLegend
          activeZoneId={highlightedZoneId}
          onSelectZone={onSelectZone}
          zones={zones}
        />
      </div>
    </div>
  );
}
