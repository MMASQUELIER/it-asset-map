import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";
import {
  TOOL_SECTIONS,
  type ToolDefinition,
} from "@/features/infrastructure-map/editor/ui/map-toolbar/mapToolbarDefinitions";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

interface MapToolbarSectionsProps {
  activeTool: InteractionTool;
  activeToolDefinition: ToolDefinition;
  onSelectTool: (tool: InteractionTool) => void;
}

export function MapToolbarSections({
  activeTool,
  activeToolDefinition,
  onSelectTool,
}: MapToolbarSectionsProps) {
  return (
    <>
      <div className="rounded-[24px] border border-schneider-700/10 bg-[linear-gradient(135deg,rgba(15,122,70,0.12),rgba(231,238,233,0.96))] p-4">
        <div className="grid gap-1">
          <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-schneider-700">
            Aide rapide
          </span>
          <p className="m-0 text-base font-black text-schneider-950">
            {activeToolDefinition.label}
          </p>
          <p className="m-0 text-sm leading-6 text-schneider-800/75">
            {activeToolDefinition.description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {TOOL_SECTIONS.map(function renderToolSection(section) {
          return (
            <section
              key={section.title}
              className="grid gap-3 rounded-[24px] border border-schneider-900/8 bg-schneider-100/64 p-4"
            >
              <div className="grid gap-1">
                <p className="m-0 text-sm font-black uppercase tracking-[0.14em] text-schneider-700">
                  {section.title}
                </p>
                <p className="m-0 text-sm leading-6 text-schneider-800/75">
                  {section.description}
                </p>
              </div>

              <div className="grid gap-2">
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
                      <span className="text-left text-[0.94rem] font-black text-current">
                        {tool.label}
                      </span>
                      <span className="text-left text-[0.82rem] leading-5 text-current/75">
                        {tool.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function getToolButtonClasses(
  tool: ToolDefinition,
  isActive: boolean,
): string {
  return joinClassNames(
    "grid gap-1 rounded-[22px] border p-3.5 text-left transition",
    "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/25",
    getToolToneClasses(tool.tone, isActive),
  );
}

function getToolToneClasses(
  tone: ToolDefinition["tone"],
  isActive: boolean,
): string {
  if (tone === "primary") {
    return isActive
      ? "border-schneider-700 bg-schneider-700 text-white shadow-[0_16px_30px_rgba(15,122,70,0.2)]"
      : "border-schneider-700/10 bg-[#eef4ef] text-schneider-900";
  }

  if (tone === "move") {
    return isActive
      ? "border-teal-700 bg-teal-700 text-white shadow-[0_16px_30px_rgba(15,118,110,0.2)]"
      : "border-teal-700/12 bg-[#eaf2f1] text-teal-900";
  }

  if (tone === "danger") {
    return isActive
      ? "border-rose-700 bg-rose-700 text-white shadow-[0_16px_30px_rgba(190,24,93,0.16)]"
      : "border-rose-700/12 bg-[#f6ecef] text-rose-900";
  }

  return isActive
    ? "border-sky-700 bg-sky-700 text-white shadow-[0_16px_30px_rgba(3,105,161,0.16)]"
    : "border-sky-700/12 bg-[#edf3f6] text-sky-900";
}
