import type { PlacementCandidate } from "@/features/infrastructure-map/model/types";
import { getCatalogIssueSummary } from "@/features/infrastructure-map/model/catalogIssues";
import { getResolvedPcDisplayName } from "@/features/infrastructure-map/model/pcValueResolvers";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

interface MarkerDraftCatalogProps {
  availableCandidates: PlacementCandidate[];
  isPcOnlyFilterActive: boolean;
  markerId: string;
  matchingCandidates: PlacementCandidate[];
  onMarkerIdChange: (value: string) => void;
}

export function MarkerDraftCatalog({
  availableCandidates,
  isPcOnlyFilterActive,
  markerId,
  matchingCandidates,
  onMarkerIdChange,
}: MarkerDraftCatalogProps) {
  const emptyStateMessage = getCatalogEmptyStateMessage(
    availableCandidates,
    isPcOnlyFilterActive,
    matchingCandidates,
  );

  return (
    <div
      className="grid gap-3 rounded-[24px] border border-schneider-950/10 bg-white/92 p-3.5"
      role="list"
    >
      {emptyStateMessage !== null
        ? <p className="text-sm text-schneider-800/70">{emptyStateMessage}</p>
        : null}
      {matchingCandidates.length > 0 ? (
        <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
          {matchingCandidates.map(function renderCatalogCandidate(candidate) {
            return (
              <CatalogCandidateButton
                key={candidate.id}
                candidate={candidate}
                isSelected={markerId === candidate.id}
                onSelect={onMarkerIdChange}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

interface CatalogCandidateButtonProps {
  candidate: PlacementCandidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
}

function CatalogCandidateButton({
  candidate,
  isSelected,
  onSelect,
}: CatalogCandidateButtonProps) {
  const candidateMeta = buildCatalogCandidateMetaLabel(candidate);
  const catalogIssueSummary = getCatalogIssueSummary(
    candidate.technicalDetails.catalogIssues,
  );
  const candidateDisplayName = getResolvedPcDisplayName(
    candidate.technicalDetails,
    candidate.id,
  );

  return (
    <button
      className={joinClassNames(
        "grid gap-1 rounded-[22px] border p-3 text-left transition",
        "border-schneider-950/10 bg-schneider-50/70 text-schneider-950 hover:-translate-y-0.5 hover:border-schneider-500/20 hover:bg-white",
        isSelected &&
          "border-schneider-500/24 bg-schneider-500 text-white shadow-[0_14px_28px_rgba(61,205,88,0.2)]",
      )}
      type="button"
      onClick={function handleCatalogCandidateSelection() {
        onSelect(candidate.id);
      }}
    >
      <strong>{candidateDisplayName}</strong>
      {candidateMeta.length > 0 ? (
        <span className="text-xs font-medium uppercase tracking-[0.08em] text-current/70">
          {candidateMeta}
        </span>
      ) : null}
      {catalogIssueSummary !== null ? (
        <span
          className={joinClassNames(
            "text-[0.72rem] font-bold uppercase tracking-[0.08em]",
            isSelected ? "text-white/85" : "text-amber-700",
          )}
        >
          {catalogIssueSummary}
        </span>
      ) : null}
    </button>
  );
}

function getCatalogEmptyStateMessage(
  availableCandidates: PlacementCandidate[],
  isPcOnlyFilterActive: boolean,
  matchingCandidates: PlacementCandidate[],
): string | null {
  if (availableCandidates.length === 0) {
    return isPcOnlyFilterActive
      ? "Aucun PC du catalogue n'est disponible pour cette position."
      : "Aucun equipement du catalogue n'est disponible pour cette position.";
  }

  if (matchingCandidates.length === 0) {
    return isPcOnlyFilterActive
      ? "Aucun PC du catalogue ne correspond a cette recherche."
      : "Aucun equipement du catalogue ne correspond a cette recherche.";
  }

  return null;
}

function buildCatalogCandidateMetaLabel(candidate: PlacementCandidate): string {
  return [
    candidate.prodsheet?.trim().length
      ? `Prodsheet ${candidate.prodsheet.trim()}`
      : null,
    candidate.sector.trim().length ? `Secteur ${candidate.sector.trim()}` : null,
    candidate.stationName.trim().length ? `Nom ${candidate.stationName.trim()}` : null,
    candidate.technicalDetails.serialNumber?.trim().length
      ? `S/N ${candidate.technicalDetails.serialNumber.trim()}`
      : null,
  ].filter((value): value is string => value !== null).join(" / ");
}
