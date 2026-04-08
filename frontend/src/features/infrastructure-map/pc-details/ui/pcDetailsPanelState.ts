import {
  getResolvedPcConnectionType,
  getResolvedPcDisplayName,
  getResolvedPcStatus,
} from "@/features/infrastructure-map/model/pcValueResolvers";
import type {
  InteractiveMarker,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import {
  filterVisiblePcDetailFields,
  filterVisiblePcDetailSections,
} from "@/features/infrastructure-map/pc-details/ui/content/filterVisiblePcDetails";
import {
  buildPcDetailSections,
  buildPcSubtitle,
  buildPcSummaryFields,
  type VisiblePcDetailSection,
  type VisiblePcDetailField,
} from "@/features/infrastructure-map/pc-details/ui/pcDetailsContent";
import { formatPcDetailValue } from "@/features/infrastructure-map/pc-details/ui/content/valueFormatting";
import { getZoneDisplayLabel } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

export interface PcDetailsPanelState {
  catalogIssues: string[];
  connectionLabel: string | undefined;
  markerDisplayName: string;
  shouldForceOpenSections: boolean;
  statusLabel: string;
  subtitle: string;
  visibleDetailSections: VisiblePcDetailSection[];
  visibleFieldCount: number;
  visibleSummaryFields: VisiblePcDetailField[];
  zoneLabel: string;
}

export function buildPcDetailsPanelState(
  marker: InteractiveMarker,
  zone: MapZone | null,
  detailSearchQuery: string,
): PcDetailsPanelState {
  const visibleSummaryFields = filterVisiblePcDetailFields(
    buildPcSummaryFields(marker),
    detailSearchQuery,
  );
  const visibleDetailSections = filterVisiblePcDetailSections(
    buildPcDetailSections(marker),
    detailSearchQuery,
  );

  return {
    catalogIssues: marker.technicalDetails.catalogIssues ?? [],
    connectionLabel: formatPcDetailValue(
      "wifi-wired-connection",
      getResolvedPcConnectionType(marker.technicalDetails),
    ),
    markerDisplayName: getResolvedPcDisplayName(
      marker.technicalDetails,
      marker.id,
    ),
    shouldForceOpenSections: detailSearchQuery.trim().length > 0,
    statusLabel: formatPcDetailValue(
      "status",
      getResolvedPcStatus(marker.technicalDetails),
    ) ?? "Non renseigne",
    subtitle: buildPcSubtitle(marker),
    visibleDetailSections,
    visibleFieldCount: countVisibleFields(
      visibleSummaryFields.length,
      visibleDetailSections,
    ),
    visibleSummaryFields,
    zoneLabel: zone === null ? "Hors zone" : `Zone ${getZoneDisplayLabel(zone)}`,
  };
}

function countVisibleFields(
  visibleSummaryFieldCount: number,
  visibleDetailSections: VisiblePcDetailSection[],
): number {
  return visibleSummaryFieldCount +
    visibleDetailSections.reduce((total, section) => total + section.items.length, 0);
}
