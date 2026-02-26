import type { ZoneColor, ZoneStyle } from "./types";

export const ZONE_STYLES: Record<ZoneColor, ZoneStyle> = {
  green: { stroke: "#0ea85e", fill: "#b9efcf", label: "Vert", ring: "#065f3d" },
  blue: { stroke: "#0595d7", fill: "#c7ecff", label: "Bleu", ring: "#0b4a6a" },
  yellow: { stroke: "#e3a008", fill: "#ffeeb3", label: "Jaune", ring: "#7a4f00" },
  red: { stroke: "#ef4444", fill: "#ffd2d2", label: "Rouge", ring: "#7f1d1d" },
  purple: { stroke: "#b4539d", fill: "#f7d9ef", label: "Magenta", ring: "#6a2b59" },
};

export const ZONE_ORDER: ZoneColor[] = ["green", "blue", "yellow", "red", "purple"];

export const EMPTY_ZONE_COUNTS: Record<ZoneColor, number> = {
  green: 0,
  blue: 0,
  yellow: 0,
  red: 0,
  purple: 0,
};

export const EMPTY_POINT_COUNTS: Record<ZoneColor, number> = {
  green: 0,
  blue: 0,
  yellow: 0,
  red: 0,
  purple: 0,
};

export function resolveZoneColor(color?: string): ZoneColor {
  return color && color in ZONE_STYLES ? (color as ZoneColor) : "purple";
}
