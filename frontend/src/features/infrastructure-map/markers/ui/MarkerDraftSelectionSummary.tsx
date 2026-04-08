import type { MarkerDraft, PlacementCandidate } from "@/features/infrastructure-map/model/types";
import { getCatalogIssueSummary } from "@/features/infrastructure-map/model/catalogIssues";
import { getResolvedPcDisplayName } from "@/features/infrastructure-map/model/pcValueResolvers";
import {
  detailLabelTextClassName,
  detailsGridClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface MarkerDraftSelectionSummaryProps {
  draft: MarkerDraft;
  selectedCandidate: PlacementCandidate | null;
}

export function MarkerDraftSelectionSummary({
  draft,
  selectedCandidate,
}: MarkerDraftSelectionSummaryProps) {
  const zoneLabel = draft.zoneId === null ? "Hors zone" : `Zone ${draft.zoneId}`;
  const catalogIssueSummary = getCatalogIssueSummary(
    selectedCandidate?.technicalDetails.catalogIssues,
  );
  const selectedCandidateDisplayName = selectedCandidate === null
    ? null
    : getResolvedPcDisplayName(
      selectedCandidate.technicalDetails,
      selectedCandidate.equipmentId,
    );

  return (
    <>
      <div className={detailsGridClassName}>
        <div>
          <span className={detailLabelTextClassName}>PC selectionne</span>
          <strong>{selectedCandidateDisplayName ?? "Aucun PC selectionne"}</strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Identifiant</span>
          <strong>
            {selectedCandidate?.equipmentId ?? "En attente de selection"}
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
              <strong>{selectedCandidate.zoneCode || "Non renseigne"}</strong>
            </div>

            <div>
              <span className={detailLabelTextClassName}>Station</span>
              <strong>{selectedCandidate.stationName || "Non renseignee"}</strong>
            </div>
          </div>
        )
        : null}

      {catalogIssueSummary !== null
        ? (
          <p className="rounded-[18px] border border-amber-300/60 bg-amber-50/90 px-3 py-2 text-sm leading-6 text-amber-950">
            {catalogIssueSummary}
          </p>
        )
        : null}
    </>
  );
}
