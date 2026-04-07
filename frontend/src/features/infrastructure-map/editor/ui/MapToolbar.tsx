import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";
import { MapToolbarHeader } from "@/features/infrastructure-map/editor/ui/map-toolbar/MapToolbarHeader";
import {
  getToolDefinition,
} from "@/features/infrastructure-map/editor/ui/map-toolbar/mapToolbarDefinitions";
import { MapToolbarSections } from "@/features/infrastructure-map/editor/ui/map-toolbar/MapToolbarSections";
import { surfacePanelClassName } from "@/features/infrastructure-map/ui/uiClassNames";

interface MapToolbarProps {
  activeTool: InteractionTool;
  isInteractionMode: boolean;
  onCloseInteractionMode: () => void;
  onOpenInteractionMode: () => void;
  onSelectTool: (tool: InteractionTool) => void;
}

export default function MapToolbar({
  activeTool,
  isInteractionMode,
  onCloseInteractionMode,
  onOpenInteractionMode,
  onSelectTool,
}: MapToolbarProps) {
  const activeToolDefinition = getToolDefinition(activeTool);

  return (
    <div className="min-w-0">
      <div className={`${surfacePanelClassName} grid gap-4 p-4 sm:p-5`}>
        <MapToolbarHeader
          activeToolDefinition={activeToolDefinition}
          isInteractionMode={isInteractionMode}
          onCloseInteractionMode={onCloseInteractionMode}
          onOpenInteractionMode={onOpenInteractionMode}
        />
        {isInteractionMode
          ? (
            <MapToolbarSections
              activeTool={activeTool}
              onSelectTool={onSelectTool}
            />
          )
          : null}
      </div>
    </div>
  );
}
