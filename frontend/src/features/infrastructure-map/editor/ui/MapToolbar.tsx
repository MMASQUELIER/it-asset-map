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
      <div className={`${surfacePanelClassName} relative overflow-hidden grid gap-4 p-5`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(15,122,70,0.08),transparent)]" />
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
              activeToolDefinition={activeToolDefinition}
              onSelectTool={onSelectTool}
            />
          )
          : null}
      </div>
    </div>
  );
}
