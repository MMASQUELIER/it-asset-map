import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";

export interface ToolDefinition {
  description: string;
  id: InteractionTool;
  label: string;
  tone: "danger" | "move" | "primary" | "zone";
}

export interface ToolSection {
  description: string;
  title: string;
  tools: ToolDefinition[];
}

export const TOOL_SECTIONS: ToolSection[] = [
  {
    title: "Marqueurs",
    description: "Ajouter, deplacer ou supprimer.",
    tools: [
      {
        id: "add-marker",
        label: "Ajouter un marqueur",
        description: "Cliquez sur la carte pour placer un poste.",
        tone: "primary",
      },
      {
        id: "move-marker",
        label: "Deplacer un marqueur",
        description: "Glissez un poste vers sa nouvelle position.",
        tone: "move",
      },
      {
        id: "delete-marker",
        label: "Supprimer un marqueur",
        description: "Cliquez sur un poste pour le retirer.",
        tone: "danger",
      },
    ],
  },
  {
    title: "Zones",
    description: "Creer, modifier ou supprimer.",
    tools: [
      {
        id: "select-zone",
        label: "Editer une zone",
        description: "Selectionnez une zone pour modifier ses infos.",
        tone: "zone",
      },
      {
        id: "add-zone",
        label: "Ajouter une zone",
        description: "Dessinez la zone puis renseignez son code.",
        tone: "zone",
      },
      {
        id: "delete-zone",
        label: "Supprimer une zone",
        description: "Cliquez sur une zone pour la retirer.",
        tone: "danger",
      },
    ],
  },
];

export function getToolDefinition(tool: InteractionTool): ToolDefinition {
  for (const section of TOOL_SECTIONS) {
    const matchingTool = section.tools.find((candidate) =>
      candidate.id === tool
    );

    if (matchingTool !== undefined) {
      return matchingTool;
    }
  }

  return TOOL_SECTIONS[0].tools[0];
}
