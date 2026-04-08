import { useState } from "react";
import type {
  InteractiveMarker,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import {
  getResolvedPcConnectionType,
  getResolvedPcDisplayName,
  getResolvedPcStatus,
} from "@/features/infrastructure-map/model/pcValueResolvers";
import { PcDetailFieldCard } from "@/features/infrastructure-map/pc-details/ui/components/PcDetailFieldCard";
import { PcCatalogIssues } from "@/features/infrastructure-map/pc-details/ui/components/PcCatalogIssues";
import { PcDetailsPanelHeader } from "@/features/infrastructure-map/pc-details/ui/components/PcDetailsPanelHeader";
import { PcDetailsSection } from "@/features/infrastructure-map/pc-details/ui/components/PcDetailsSection";
import { useCopiedField } from "@/features/infrastructure-map/pc-details/ui/components/useCopiedField";
import {
  filterVisiblePcDetailFields,
  filterVisiblePcDetailSections,
} from "@/features/infrastructure-map/pc-details/ui/content/filterVisiblePcDetails";
import {
  buildPcDetailSections,
  buildPcSubtitle,
  buildPcSummaryFields,
  type VisiblePcDetailField,
} from "@/features/infrastructure-map/pc-details/ui/pcDetailsContent";
import { formatPcDetailValue } from "@/features/infrastructure-map/pc-details/ui/content/valueFormatting";
import {
  joinClassNames,
  scrollableFloatingPanelClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { getZoneDisplayLabel } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface PcDetailsPanelProps {
  marker: InteractiveMarker;
  onClose: () => void;
  onUpdatePcField: (
    markerId: string,
    equipmentDataId: number,
    fieldId: NonNullable<VisiblePcDetailField["editableFieldId"]>,
    value: string,
  ) => Promise<void> | void;
  zone: MapZone | null;
}

export default function PcDetailsPanel({
  marker,
  onClose,
  onUpdatePcField,
  zone,
}: PcDetailsPanelProps) {
  const { copiedFieldId, handleCopy } = useCopiedField();
  const [detailSearchQuery, setDetailSearchQuery] = useState("");
  const visibleSummaryFields = filterVisiblePcDetailFields(
    buildPcSummaryFields(marker),
    detailSearchQuery,
  );
  const visibleDetailSections = filterVisiblePcDetailSections(
    buildPcDetailSections(marker),
    detailSearchQuery,
  );
  const visibleFieldCount = getVisibleFieldCount(
    visibleSummaryFields.length,
    visibleDetailSections,
  );
  const markerDisplayName = getResolvedPcDisplayName(
    marker.technicalDetails,
    marker.id,
  );
  const connectionLabel = formatPcDetailValue(
    "wifi-wired-connection",
    getResolvedPcConnectionType(marker.technicalDetails),
  );
  const statusLabel = formatPcDetailValue(
    "status",
    getResolvedPcStatus(marker.technicalDetails),
  ) ?? "Non renseigne";
  const zoneLabel = zone === null ? "Hors zone" : `Zone ${getZoneDisplayLabel(zone)}`;
  const catalogIssues = marker.technicalDetails.catalogIssues ?? [];
  const shouldForceOpenSections = detailSearchQuery.trim().length > 0;

  async function handleFieldSave(
    field: VisiblePcDetailField,
    nextValue: string,
  ): Promise<void> {
    if (field.editableFieldId === undefined) {
      return;
    }

    await onUpdatePcField(
      marker.id,
      marker.equipmentDataId,
      field.editableFieldId,
      nextValue,
    );
  }

  return (
    <aside
      className={joinClassNames(
        scrollableFloatingPanelClassName,
        "grid gap-5 md:w-[30rem] lg:w-[32rem] xl:w-[34rem]",
      )}
    >
      <PcDetailsPanelHeader
        connectionLabel={connectionLabel}
        onClose={onClose}
        onSearchQueryChange={setDetailSearchQuery}
        searchQuery={detailSearchQuery}
        statusLabel={statusLabel}
        subtitle={buildPcSubtitle(marker)}
        title={markerDisplayName}
        visibleFieldCount={visibleFieldCount}
        zone={zone}
        zoneLabel={zoneLabel}
      />

      {catalogIssues.length > 0
        ? <PcCatalogIssues issues={catalogIssues} />
        : null}

      {visibleSummaryFields.length > 0
        ? (
          <section className="grid gap-3 rounded-[20px] border border-schneider-950/10 bg-schneider-50/72 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="m-0 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-schneider-700">
                Resume
              </h3>
              <span className="text-xs text-schneider-800/62">
                {visibleSummaryFields.length} champ(s)
              </span>
            </div>
            <div className="grid gap-2.5">
              {visibleSummaryFields.map((field) => (
                <PcDetailFieldCard
                  key={field.id}
                  copiedFieldId={copiedFieldId}
                  field={field}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </section>
        )
        : null}

      {visibleDetailSections.length > 0
        ? visibleDetailSections.map((section, index) => (
            <PcDetailsSection
              key={section.title}
              copiedFieldId={copiedFieldId}
              forceOpen={shouldForceOpenSections}
              items={section.items}
              onCopy={handleCopy}
              onSaveField={handleFieldSave}
              startOpen={index === 0}
              title={section.title}
            />
        ))
        : (
          <section className="rounded-[20px] border border-schneider-950/10 bg-schneider-50/72 px-4 py-5 text-sm leading-6 text-schneider-800/75">
            Aucun champ correspondant.
          </section>
        )}
    </aside>
  );
}

function getVisibleFieldCount(
  visibleSummaryFieldCount: number,
  visibleDetailSections: ReturnType<typeof filterVisiblePcDetailSections>,
): number {
  return visibleSummaryFieldCount +
    visibleDetailSections.reduce(
      function countVisibleSectionFields(total, section) {
        return total + section.items.length;
      },
      0,
    );
}
