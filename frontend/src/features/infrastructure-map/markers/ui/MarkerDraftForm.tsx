import { useDeferredValue, useState } from "react";
import type { FormEvent } from "react";
import type {
  MarkerDraft,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";
import { searchPlacementPcCandidates } from "@/features/infrastructure-map/markers/services/placementCandidateSearch";
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

/** Props du formulaire de creation de marqueur. */
interface MarkerDraftFormProps {
  availableCandidates: PlacementPcCandidate[];
  draft: MarkerDraft;
  errorMessage: string | null;
  markerId: string;
  onCancel: () => void;
  onMarkerIdChange: (value: string) => void;
  onSubmit: () => void;
}

/** Formulaire de confirmation pour l'ajout d'un nouveau marqueur. */
export default function MarkerDraftForm({
  availableCandidates,
  draft,
  errorMessage,
  markerId,
  onCancel,
  onMarkerIdChange,
  onSubmit,
}: MarkerDraftFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const selectedCandidate = getSelectedCandidate(availableCandidates, markerId);
  const matchingCandidates = searchPlacementPcCandidates(
    availableCandidates,
    deferredSearchQuery,
    8,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className={`${scrollableFloatingPanelClassName} grid gap-4`}
      onSubmit={handleSubmit}
    >
      {renderMarkerDraftHeader(onCancel)}

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Rechercher un PC</span>
        <input
          autoFocus
          className={textInputClassName}
          placeholder="Ex. hostname, prodsched, station, secteur..."
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>

      <MarkerDraftSelectionSummary
        draft={draft}
        selectedCandidate={selectedCandidate}
      />
      <MarkerDraftCatalog
        availableCandidates={availableCandidates}
        markerId={markerId}
        matchingCandidates={matchingCandidates}
        onMarkerIdChange={onMarkerIdChange}
      />

      {renderMarkerDraftError(errorMessage)}

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

function getSelectedCandidate(
  availableCandidates: PlacementPcCandidate[],
  markerId: string,
): PlacementPcCandidate | null {
  if (markerId.length === 0) {
    return null;
  }

  return availableCandidates.find((candidate) => candidate.markerId === markerId) ??
    null;
}

function renderMarkerDraftHeader(onCancel: () => void) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={eyebrowTextClassName}>Nouveau point</p>
        <h2 className={panelTitleTextClassName}>Ajouter un marqueur</h2>
      </div>

      <button className={closeButtonClassName} type="button" onClick={onCancel}>
        Fermer
      </button>
    </div>
  );
}

function renderMarkerDraftError(errorMessage: string | null) {
  if (errorMessage === null) {
    return null;
  }

  return (
    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      {errorMessage}
    </p>
  );
}
