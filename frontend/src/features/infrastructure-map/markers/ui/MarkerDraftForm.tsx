import { useDeferredValue, useState } from "react";
import type { FormEvent } from "react";
import type {
  MarkerDraft,
  PlacementCandidate,
} from "@/features/infrastructure-map/model/types";
import { isPcTechnicalDetails } from "@/features/infrastructure-map/model/pcValueResolvers";
import { searchPlacementCandidates } from "@/features/infrastructure-map/markers/services/placementCandidateSearch";
import {
  closeButtonClassName,
  eyebrowTextClassName,
  fieldGroupClassName,
  panelActionRowClassName,
  panelTitleTextClassName,
  primaryButtonClassName,
  scrollableFloatingPanelClassName,
  secondaryButtonClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { MarkerDraftCatalog } from "@/features/infrastructure-map/markers/ui/MarkerDraftCatalog";
import { MarkerDraftSelectionSummary } from "@/features/infrastructure-map/markers/ui/MarkerDraftSelectionSummary";

type CatalogFilterMode = "all" | "pc-only";

const DEFAULT_CATALOG_FILTER_MODE: CatalogFilterMode = "pc-only";
const CATALOG_SEARCH_LIMIT = 8;

interface MarkerDraftFormProps {
  availableCandidates: PlacementCandidate[];
  draft: MarkerDraft;
  markerId: string;
  onCancel: () => void;
  onMarkerIdChange: (value: string) => void;
  onSubmit: () => void;
}

export default function MarkerDraftForm({
  availableCandidates,
  draft,
  markerId,
  onCancel,
  onMarkerIdChange,
  onSubmit,
}: MarkerDraftFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogFilterMode, setCatalogFilterMode] = useState<CatalogFilterMode>(
    DEFAULT_CATALOG_FILTER_MODE,
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const isPcOnlyFilterActive = catalogFilterMode === "pc-only";
  const selectedCandidate = markerId.length === 0
    ? null
    : (availableCandidates.find((candidate) => candidate.id === markerId) ?? null);
  const visibleCandidates = isPcOnlyFilterActive
    ? availableCandidates.filter((candidate) =>
      isPcTechnicalDetails(candidate.technicalDetails)
    )
    : availableCandidates;
  const matchingCandidates = searchPlacementCandidates(
    visibleCandidates,
    deferredSearchQuery,
    CATALOG_SEARCH_LIMIT,
  );
  const searchLabel = isPcOnlyFilterActive
    ? "Rechercher un PC"
    : "Rechercher un equipement";

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  function toggleCatalogFilterMode(): void {
    setCatalogFilterMode((currentMode) =>
      currentMode === "pc-only" ? "all" : "pc-only"
    );
  }

  return (
    <form
      className={`${scrollableFloatingPanelClassName} grid gap-4`}
      onSubmit={handleSubmit}
    >
      <MarkerDraftHeader onClose={onCancel} />

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">{searchLabel}</span>
        <input
          autoFocus
          className={textInputClassName}
          placeholder="Ex. hostname, prodsheet, secteur, nom, S/N..."
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>

      <CatalogFilterCard
        isPcOnlyFilterActive={isPcOnlyFilterActive}
        onToggle={toggleCatalogFilterMode}
      />

      <MarkerDraftSelectionSummary
        draft={draft}
        selectedCandidate={selectedCandidate}
      />
      <MarkerDraftCatalog
        availableCandidates={visibleCandidates}
        isPcOnlyFilterActive={isPcOnlyFilterActive}
        markerId={markerId}
        matchingCandidates={matchingCandidates}
        onMarkerIdChange={onMarkerIdChange}
      />

      <div className={panelActionRowClassName}>
        <button className={primaryButtonClassName} type="submit">
          Ajouter
        </button>
        <button
          className={secondaryButtonClassName}
          type="button"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

interface CatalogFilterCardProps {
  isPcOnlyFilterActive: boolean;
  onToggle: () => void;
}

function CatalogFilterCard({
  isPcOnlyFilterActive,
  onToggle,
}: CatalogFilterCardProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-schneider-950/10 bg-schneider-50/72 px-3.5 py-3">
      <div className="grid gap-0.5">
        <span className="text-[0.76rem] font-bold uppercase tracking-[0.12em] text-schneider-800/70">
          Filtre catalogue
        </span>
        <span className="text-sm text-schneider-800/72">
          {isPcOnlyFilterActive ? "Seulement les PC" : "Tous les equipements"}
        </span>
      </div>
      <button
        aria-pressed={isPcOnlyFilterActive}
        className={
          isPcOnlyFilterActive ? primaryButtonClassName : secondaryButtonClassName
        }
        type="button"
        onClick={onToggle}
      >
        PC uniquement
      </button>
    </div>
  );
}

interface MarkerDraftHeaderProps {
  onClose: () => void;
}

function MarkerDraftHeader({ onClose }: MarkerDraftHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={eyebrowTextClassName}>Poste</p>
        <h2 className={panelTitleTextClassName}>Ajouter</h2>
      </div>

      <button className={closeButtonClassName} type="button" onClick={onClose}>
        Fermer
      </button>
    </div>
  );
}
