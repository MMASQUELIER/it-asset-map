import { useState } from "react";
import type {
  InteractiveMarker,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import { PcDetailFieldCard } from "@/features/infrastructure-map/pc-details/ui/components/PcDetailFieldCard";
import { PcExcelIssues } from "@/features/infrastructure-map/pc-details/ui/components/PcExcelIssues";
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
    sourceRowNumber: number,
    fieldId: NonNullable<VisiblePcDetailField["editableFieldId"]>,
    value: string,
  ) => Promise<void>;
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
  const visibleFieldCount = visibleSummaryFields.length +
    visibleDetailSections.reduce(
      function countVisibleSectionFields(total, section) {
        return total + section.items.length;
      },
      0,
    );

  async function handleFieldSave(
    field: VisiblePcDetailField,
    nextValue: string,
  ): Promise<void> {
    if (field.editableFieldId === undefined) {
      return;
    }

    await onUpdatePcField(
      marker.id,
      marker.sourceRowNumber,
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
        connectionTypeLabel={formatPcDetailValue(
          "wifi-wired-connection",
          marker.technicalDetails.wifiOrWiredConnection ??
            marker.technicalDetails.connectionType,
        )}
        markerId={marker.id}
        onClose={onClose}
        onSearchQueryChange={setDetailSearchQuery}
        searchQuery={detailSearchQuery}
        securityStateLabel={formatPcDetailValue(
          "etat",
          marker.technicalDetails.etat ?? marker.technicalDetails.securityStatus,
        ) ?? "Non renseigne"}
        subtitle={buildPcSubtitle(marker)}
        visibleFieldCount={visibleFieldCount}
        zone={zone}
        zoneLabel={zone === null
          ? "Hors zone"
          : `Prodsched ${getZoneDisplayLabel(zone)}`}
      />

      {(marker.technicalDetails.excelIssues ?? []).length > 0
        ? <PcExcelIssues issues={marker.technicalDetails.excelIssues ?? []} />
        : null}

      {visibleSummaryFields.length > 0
        ? (
          <section className="grid gap-3 rounded-[26px] border border-schneider-950/10 bg-schneider-50/65 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="m-0 text-[0.82rem] font-black uppercase tracking-[0.14em] text-schneider-700">
                Vue rapide
              </h3>
              <span className="text-xs font-medium text-schneider-800/65">
                Essentiel
              </span>
            </div>
            <div className="grid gap-2.5">
              {visibleSummaryFields.map((field) => (
                <PcDetailFieldCard
                  key={field.id}
                  copiedFieldId={copiedFieldId}
                  field={field}
                  onCopy={handleCopy}
                  onSaveField={handleFieldSave}
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
              forceOpen={detailSearchQuery.trim().length > 0}
              items={section.items}
              onCopy={handleCopy}
              onSaveField={handleFieldSave}
              startOpen={index === 0}
              title={section.title}
            />
        ))
        : (
          <section className="rounded-[26px] border border-schneider-950/10 bg-schneider-50/65 px-4 py-5 text-sm leading-6 text-schneider-800/75">
            Aucun champ ne correspond a cette recherche.
          </section>
        )}
    </aside>
  );
}
