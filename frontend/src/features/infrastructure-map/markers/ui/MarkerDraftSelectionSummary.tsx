import type { MarkerDraft, PlacementPcCandidate } from "@/features/infrastructure-map/model/types";
import { getExcelIssueSummary } from "@/features/infrastructure-map/model/excelIssues";
import {
  detailLabelTextClassName,
  detailsGridClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface MarkerDraftSelectionSummaryProps {
  draft: MarkerDraft;
  selectedCandidate: PlacementPcCandidate | null;
}

export function MarkerDraftSelectionSummary({
  draft,
  selectedCandidate,
}: MarkerDraftSelectionSummaryProps) {
  const zoneLabel = draft.zoneId === null ? "Hors zone" : `Zone ${draft.zoneId}`;
  const excelIssueSummary = getExcelIssueSummary(
    selectedCandidate?.technicalDetails.excelIssues,
  );

  return (
    <>
      <div className={detailsGridClassName}>
        <div>
          <span className={detailLabelTextClassName}>PC selectionne</span>
          <strong>{selectedCandidate?.markerId ?? "Aucun PC selectionne"}</strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Hostname</span>
          <strong>
            {selectedCandidate?.hostname ??
              excelIssueSummary ??
              "En attente de selection"}
          </strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Zone</span>
          <strong>{zoneLabel}</strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Coordonnees</span>
          <strong>X {draft.x} / Y {draft.y}</strong>
        </div>
      </div>

      {selectedCandidate !== null
        ? (
          <div className={detailsGridClassName}>
            <div>
              <span className={detailLabelTextClassName}>Secteur</span>
              <strong>{selectedCandidate.sector || "Non renseigne"}</strong>
            </div>

            <div>
              <span className={detailLabelTextClassName}>Prodsched</span>
              <strong>{selectedCandidate.prodsched || "Non renseigne"}</strong>
            </div>

            <div>
              <span className={detailLabelTextClassName}>Station</span>
              <strong>{selectedCandidate.stationName || "Non renseignee"}</strong>
            </div>
          </div>
        )
        : null}

      {excelIssueSummary !== null
        ? (
          <p className="rounded-[18px] border border-amber-300/60 bg-amber-50/90 px-3 py-2 text-sm leading-6 text-amber-950">
            {excelIssueSummary}
          </p>
        )
        : null}
    </>
  );
}
