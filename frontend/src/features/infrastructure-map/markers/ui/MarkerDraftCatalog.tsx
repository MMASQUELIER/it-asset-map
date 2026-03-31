import type { PlacementPcCandidate } from "@/features/infrastructure-map/model/types";
import { getExcelIssueSummary } from "@/features/infrastructure-map/model/excelIssues";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

interface MarkerDraftCatalogProps {
  availableCandidates: PlacementPcCandidate[];
  markerId: string;
  matchingCandidates: PlacementPcCandidate[];
  onMarkerIdChange: (value: string) => void;
}

export function MarkerDraftCatalog({
  availableCandidates,
  markerId,
  matchingCandidates,
  onMarkerIdChange,
}: MarkerDraftCatalogProps) {
  const emptyMessage = getMarkerDraftCatalogMessage(
    availableCandidates,
    matchingCandidates,
  );

  return (
    <div
      className="grid gap-3 rounded-[24px] border border-schneider-950/10 bg-white/92 p-3.5"
      role="list"
    >
      {emptyMessage !== null
        ? <p className="text-sm text-schneider-800/70">{emptyMessage}</p>
        : null}
      {matchingCandidates.length > 0 ? (
        <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
          {matchingCandidates.map(function renderCatalogCandidate(candidate) {
            return (
              <CatalogCandidateButton
                key={candidate.id}
                candidate={candidate}
                isSelected={markerId === candidate.markerId}
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
  candidate: PlacementPcCandidate;
  isSelected: boolean;
  onSelect: (markerId: string) => void;
}

function CatalogCandidateButton({
  candidate,
  isSelected,
  onSelect,
}: CatalogCandidateButtonProps) {
  const candidateMeta = buildCatalogCandidateMeta(candidate);
  const excelIssueSummary = getExcelIssueSummary(candidate.technicalDetails.excelIssues);
  const candidateLabel = getCatalogCandidateLabel(candidate, excelIssueSummary);

  return (
    <button
      className={joinClassNames(
        "grid gap-1 rounded-[22px] border p-3 text-left transition",
        "border-schneider-950/10 bg-schneider-50/70 text-schneider-950 hover:-translate-y-0.5 hover:border-schneider-500/20 hover:bg-white",
        isSelected &&
          "border-schneider-500/24 bg-schneider-500 text-schneider-950 shadow-[0_14px_28px_rgba(61,205,88,0.2)]",
      )}
      type="button"
      onClick={function handleCatalogCandidateSelection() {
        onSelect(candidate.markerId);
      }}
    >
      <strong>{candidate.markerId}</strong>
      <span className="text-sm text-current/80">{candidateLabel}</span>
      {candidateMeta.length > 0 ? (
        <span className="text-xs font-medium uppercase tracking-[0.08em] text-current/70">
          {candidateMeta}
        </span>
      ) : null}
      {excelIssueSummary !== null ? (
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-amber-700">
          {excelIssueSummary}
        </span>
      ) : null}
    </button>
  );
}

function getMarkerDraftCatalogMessage(
  availableCandidates: PlacementPcCandidate[],
  matchingCandidates: PlacementPcCandidate[],
): string | null {
  if (availableCandidates.length === 0) {
    return "Aucun PC du catalogue n'est disponible pour cette position.";
  }

  if (matchingCandidates.length === 0) {
    return "Aucun PC du catalogue ne correspond a cette recherche.";
  }

  return null;
}

function buildCatalogCandidateMeta(candidate: PlacementPcCandidate): string {
  return [candidate.stationName, candidate.prodsched, candidate.sector]
    .filter((value) => value.length > 0)
    .join(" • ");
}

function getCatalogCandidateLabel(
  candidate: PlacementPcCandidate,
  excelIssueSummary: string | null,
): string {
  if (candidate.hostname !== undefined) {
    return candidate.hostname;
  }

  if (excelIssueSummary !== null) {
    return excelIssueSummary;
  }

  return "Hostname non renseigne";
}
