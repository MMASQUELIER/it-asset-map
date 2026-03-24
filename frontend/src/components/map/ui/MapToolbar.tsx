import type { InteractionTool } from "../logic/interactionTypes";

interface MapToolbarProps {
  activeTool: InteractionTool;
  isInteractionMode: boolean;
  onCloseInteractionMode: () => void;
  onOpenInteractionMode: () => void;
  onSelectTool: (tool: InteractionTool) => void;
}

interface ToolDefinition {
  className: string;
  description: string;
  id: InteractionTool;
  label: string;
}

interface ToolSection {
  description: string;
  title: string;
  tools: ToolDefinition[];
}

const TOOL_SECTIONS: ToolSection[] = [
  {
    title: "Marqueurs",
    description: "Agir sur les PC affiches sur le plan.",
    tools: [
      {
        id: "add-marker",
        label: "Ajouter un marqueur",
        description: "Cliquez sur la carte pour preparer un nouveau PC.",
        className: "map-toolbar__button--primary",
      },
      {
        id: "move-marker",
        label: "Deplacer un marqueur",
        description: "Glissez un PC vers sa nouvelle position.",
        className: "map-toolbar__button--move",
      },
      {
        id: "delete-marker",
        label: "Supprimer un marqueur",
        description: "Cliquez sur un PC pour le retirer.",
        className: "map-toolbar__button--danger",
      },
    ],
  },
  {
    title: "Zones",
    description: "Mettre a jour les zones et leur contour.",
    tools: [
      {
        id: "select-zone",
        label: "Editer une zone",
        description: "Selectionnez une zone puis ajustez ses coins.",
        className: "map-toolbar__button--zone",
      },
      {
        id: "add-zone",
        label: "Ajouter une zone",
        description: "Dessinez un rectangle directement sur le plan.",
        className: "map-toolbar__button--zone",
      },
      {
        id: "delete-zone",
        label: "Supprimer une zone",
        description: "Cliquez sur une zone pour retirer son contour.",
        className: "map-toolbar__button--danger",
      },
    ],
  },
];

export default function MapToolbar({
  activeTool,
  isInteractionMode,
  onCloseInteractionMode,
  onOpenInteractionMode,
  onSelectTool,
}: MapToolbarProps) {
  const activeToolDefinition = getToolDefinition(activeTool);

  return (
    <div className="map-toolbar">
      <div className="map-toolbar__panel">
        <div className="map-toolbar__top">
          <div className="map-toolbar__intro">
            <p className="map-toolbar__eyebrow">Outils de carte</p>
            <p className="map-toolbar__title">
              {isInteractionMode ? "Mode interaction actif" : "Carte en lecture"}
            </p>
            <p className="map-toolbar__description">
              {isInteractionMode
                ? "Choisissez un outil puis intervenez directement sur le plan."
                : "Activez le mode interaction pour modifier les zones et les marqueurs."}
            </p>
          </div>

          <div className="map-toolbar__actions">
            <span
              className={`map-toolbar__status${isInteractionMode ? " map-toolbar__status--interactive" : ""}`}
            >
              {isInteractionMode
                ? `Outil actif : ${activeToolDefinition.label}`
                : "Navigation libre"}
            </span>

            <button
              aria-pressed={isInteractionMode}
              className={`map-toolbar__button map-toolbar__button--interaction${isInteractionMode ? " map-toolbar__button--active" : ""}`}
              type="button"
              onClick={isInteractionMode ? onCloseInteractionMode : onOpenInteractionMode}
            >
              {isInteractionMode
                ? "Fermer le mode interaction"
                : "Activer le mode interaction"}
            </button>
          </div>
        </div>

        {isInteractionMode ? (
          <>
            <div className="map-toolbar__active-tool">
              <div className="map-toolbar__active-tool-copy">
                <span className="map-toolbar__active-tool-label">Aide rapide</span>
                <p className="map-toolbar__active-tool-title">
                  {activeToolDefinition.label}
                </p>
                <p className="map-toolbar__active-tool-description">
                  {activeToolDefinition.description}
                </p>
              </div>
            </div>

            <div className="map-toolbar__groups">
              {TOOL_SECTIONS.map((section) => (
                <section key={section.title} className="map-toolbar__group">
                  <div className="map-toolbar__group-header">
                    <p className="map-toolbar__group-title">{section.title}</p>
                    <p className="map-toolbar__group-description">
                      {section.description}
                    </p>
                  </div>

                  <div className="map-toolbar__tools">
                    {section.tools.map((tool) => (
                      <button
                        key={tool.id}
                        aria-pressed={activeTool === tool.id}
                        className={`map-toolbar__tool ${tool.className}${activeTool === tool.id ? " map-toolbar__button--active" : ""}`}
                        type="button"
                        onClick={() => onSelectTool(tool.id)}
                      >
                        <span className="map-toolbar__tool-label">{tool.label}</span>
                        <span className="map-toolbar__tool-description">
                          {tool.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function getToolDefinition(tool: InteractionTool): ToolDefinition {
  for (const section of TOOL_SECTIONS) {
    const matchingTool = section.tools.find((candidate) => candidate.id === tool);

    if (matchingTool !== undefined) {
      return matchingTool;
    }
  }

  return TOOL_SECTIONS[0].tools[0];
}
