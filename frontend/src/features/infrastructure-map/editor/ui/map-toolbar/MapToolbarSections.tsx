import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";
import {
  TOOL_SECTIONS,
} from "@/features/infrastructure-map/editor/ui/map-toolbar/mapToolbarDefinitions";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

interface MapToolbarSectionsProps {
  activeTool: InteractionTool;
  onSelectTool: (tool: InteractionTool) => void;
}

export function MapToolbarSections({
  activeTool,
  onSelectTool,
}: MapToolbarSectionsProps) {
  return (
    <div className="grid gap-3">
      {TOOL_SECTIONS.map(function renderToolSection(section) {
        return (
          <section
            key={section.title}
            className="grid gap-3 rounded-[20px] border border-schneider-900/8 bg-schneider-50/70 p-4"
          >
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.14em] text-schneider-950">
              {section.title}
            </p>

            <div className="grid gap-2 md:grid-cols-3">
              {section.tools.map(function renderToolButton(tool) {
                const isActive = activeTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    aria-pressed={isActive}
                    className={getToolButtonClasses(tool, isActive)}
                    type="button"
                    onClick={function handleToolSelection() {
                      onSelectTool(tool.id);
                    }}
                  >
                    <span className="text-left text-[0.92rem] font-semibold text-current">
                      {tool.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function getToolButtonClasses(
  tool: { tone: "danger" | "move" | "primary" | "zone" },
  isActive: boolean,
): string {
  return joinClassNames(
    "grid min-h-[54px] rounded-[14px] border px-4 py-3 text-left transition",
    "hover:border-schneider-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/25",
    getToolToneClasses(tool.tone, isActive),
  );
}

function getToolToneClasses(
  tone: "danger" | "move" | "primary" | "zone",
  isActive: boolean,
): string {
  if (tone === "primary") {
    return isActive
      ? "border-schneider-800 bg-schneider-800 text-white shadow-[0_12px_24px_rgba(15,122,70,0.18)]"
      : "border-schneider-900/10 bg-white text-schneider-900";
  }

  if (tone === "move") {
    return isActive
      ? "border-teal-700 bg-teal-700 text-white shadow-[0_12px_24px_rgba(15,118,110,0.16)]"
      : "border-schneider-900/10 bg-white text-schneider-900";
  }

  if (tone === "danger") {
    return isActive
      ? "border-rose-700 bg-rose-700 text-white shadow-[0_12px_24px_rgba(190,24,93,0.14)]"
      : "border-schneider-900/10 bg-white text-schneider-900";
  }

  return isActive
    ? "border-sky-700 bg-sky-700 text-white shadow-[0_12px_24px_rgba(3,105,161,0.14)]"
    : "border-schneider-900/10 bg-white text-schneider-900";
}
