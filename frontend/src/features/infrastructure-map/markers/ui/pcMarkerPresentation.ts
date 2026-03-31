import L from "leaflet";

export function buildPcMarkerIcon(
  markerColor: string,
  markerSize: number,
  isHighlightedByZone: boolean,
  isSelected: boolean,
  isDimmed: boolean,
  isMoveModeEnabled: boolean,
): L.DivIcon {
  const markerClassNames = [
    "inline-flex rounded-full border-2 border-white/95",
    "shadow-[0_0_0_1px_rgba(20,54,34,0.22),0_10px_20px_rgba(20,54,34,0.18)] transition-all duration-150",
  ];

  if (isSelected) {
    markerClassNames.push(
      "scale-[1.08] shadow-[0_0_0_2px_rgba(255,255,255,0.98),0_0_0_6px_rgba(61,205,88,0.56),0_16px_28px_rgba(20,54,34,0.24)]",
    );
  }

  if (isHighlightedByZone) {
    markerClassNames.push(
      "scale-[1.05] shadow-[0_0_0_2px_rgba(255,255,255,0.98),0_0_0_4px_rgba(61,205,88,0.42),0_12px_22px_rgba(20,54,34,0.2)]",
    );
  }

  if (isDimmed) {
    markerClassNames.push("opacity-35");
  }

  if (isMoveModeEnabled) {
    markerClassNames.push("cursor-grab active:cursor-grabbing");
  }

  return L.divIcon({
    className: "border-0 bg-transparent",
    html: `<span class="${markerClassNames.join(" ")}" style="background:${markerColor}; width:${markerSize}px; height:${markerSize}px;"></span>`,
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerSize / 2, markerSize / 2],
  });
}

export function buildPcMarkerTooltipClassName(
  isHighlightedByZone: boolean,
  isSelected: boolean,
): string {
  if (isSelected) {
    return [
      "!rounded-xl !border-0 !bg-[#e8f7ec] !px-3 !py-2 !text-[0.84rem] !font-bold !text-[#12311f]",
      "before:!border-t-[#e8f7ec] shadow-[0_12px_24px_rgba(22,67,39,0.18)]",
    ].join(" ");
  }

  if (isHighlightedByZone) {
    return [
      "!rounded-xl !border-0 !bg-white !px-3 !py-2 !text-[0.84rem] !font-bold !text-[#12311f]",
      "before:!border-t-white shadow-[0_12px_24px_rgba(22,67,39,0.18)]",
    ].join(" ");
  }

  return [
    "!rounded-xl !border-0 !bg-[#143622]/95 !px-3 !py-2 !text-[0.84rem] !font-bold !text-white",
    "before:!border-t-[#143622] shadow-[0_12px_24px_rgba(22,67,39,0.18)]",
  ].join(" ");
}
