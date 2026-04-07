import type { CSSProperties } from "react";
import type { MarkerSearchResult } from "@/features/infrastructure-map/markers/logic/markerSearch";
import { getCatalogIssueSummary } from "@/features/infrastructure-map/model/catalogIssues";
import type { MapZone } from "@/features/infrastructure-map/model/types";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";
import { getZoneDisplayLabel } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface MapSearchResultCardProps {
  isSelected: boolean;
  onSelect: (markerId: string) => void;
  result: MarkerSearchResult;
  zone: MapZone | null;
}

export function MapSearchResultCard({
  isSelected,
  onSelect,
  result,
  zone,
}: MapSearchResultCardProps) {
  const catalogIssueSummary = getCatalogIssueSummary(
    result.marker.technicalDetails.catalogIssues,
  );
  const secondaryLabel = getSearchResultSecondaryLabel(result, catalogIssueSummary);
  const zoneLabel = getSearchResultZoneLabel(zone);

  return (
    <button
      className={joinClassNames(
        "grid gap-2 rounded-[24px] border p-4 text-left transition",
        "border-schneider-950/10 bg-white/94 text-schneider-950 shadow-[0_12px_26px_rgba(16,38,26,0.06)]",
        "hover:-translate-y-0.5 hover:border-schneider-500/20 hover:bg-schneider-50",
        isSelected &&
          "border-schneider-500/25 bg-schneider-500 text-white shadow-[0_16px_28px_rgba(61,205,88,0.2)]",
      )}
      type="button"
      onClick={function handleSearchResultSelection() {
        onSelect(result.marker.id);
      }}
    >
      <span className="flex flex-wrap items-center justify-between gap-3">
        <strong className="text-sm font-black uppercase tracking-[0.08em]">
          {result.marker.id}
        </strong>
        <span
          className="inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.12em]"
          style={buildZoneBadgeStyle(zone)}
        >
          {zoneLabel}
        </span>
      </span>

      <span className="text-sm font-medium text-current/80">{secondaryLabel}</span>

      {renderSearchResultIssue(catalogIssueSummary, isSelected)}
      {renderSearchResultSector(zone)}

      <span className="text-xs font-bold uppercase tracking-[0.08em] text-current/70">
        {result.matchedFieldLabel} : {result.matchedValue}
      </span>
    </button>
  );
}

function getSearchResultSecondaryLabel(
  result: MarkerSearchResult,
  catalogIssueSummary: string | null,
): string {
  const hostname = result.marker.technicalDetails.hostname;

  if (hostname === undefined || hostname === result.marker.id) {
    return catalogIssueSummary ?? result.matchedValue;
  }

  return hostname;
}

function getSearchResultZoneLabel(zone: MapZone | null): string {
  if (zone === null) {
    return "Hors zone";
  }

  return `Zone ${getZoneDisplayLabel(zone)}`;
}

function renderSearchResultIssue(
  catalogIssueSummary: string | null,
  isSelected: boolean,
) {
  if (catalogIssueSummary === null) {
    return null;
  }

  return (
    <span
      className={joinClassNames(
        "text-xs font-bold uppercase tracking-[0.08em]",
        isSelected ? "text-white/85" : "text-amber-700",
      )}
    >
      {catalogIssueSummary}
    </span>
  );
}

function renderSearchResultSector(zone: MapZone | null) {
  if (zone === null) {
    return null;
  }

  return (
    <span className="text-xs font-bold uppercase tracking-[0.08em] text-current/70">
      Secteur : {zone.sectorName}
    </span>
  );
}

function buildZoneBadgeStyle(zone: MapZone | null): CSSProperties | undefined {
  if (zone === null) {
    return undefined;
  }

  return {
    borderColor: `color-mix(in srgb, ${zone.color} 40%, rgba(16,38,26,0.1))`,
    background: `color-mix(in srgb, ${zone.color} 18%, white)`,
    color: "#10261a",
  } as CSSProperties;
}
