import { useDeferredValue, useState } from "react";
import type { FormEvent } from "react";
import type { MarkerDraft, PlacementPcCandidate } from "../../shared/types";
import { searchPlacementPcCandidates } from "../logic/backendPlacementCandidates";

/** Props used to edit a marker draft before insertion. */
interface MarkerDraftFormProps {
  availableCandidates: PlacementPcCandidate[];
  draft: MarkerDraft;
  errorMessage: string | null;
  markerId: string;
  placementCatalogError: string | null;
  placementCatalogLoading: boolean;
  onCancel: () => void;
  onMarkerIdChange: (value: string) => void;
  onSubmit: () => void;
}

/**
 * Form used to confirm the creation of a new marker.
 *
 * @param props Draft values and save callbacks.
 * @returns Marker draft editor UI.
 */
export default function MarkerDraftForm({
  availableCandidates,
  draft,
  errorMessage,
  markerId,
  placementCatalogError,
  placementCatalogLoading,
  onCancel,
  onMarkerIdChange,
  onSubmit,
}: MarkerDraftFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const zoneLabel = draft.zoneId === null
    ? "Hors zone"
    : `Zone ${draft.zoneId}`;
  const selectedCandidate = markerId.length === 0
    ? null
    : (availableCandidates.find((candidate) =>
      candidate.markerId === markerId
    ) ?? null);
  const matchingCandidates = searchPlacementPcCandidates(
    availableCandidates,
    deferredSearchQuery,
    8,
  );
  const hasSelection = selectedCandidate !== null;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="marker-draft-card" onSubmit={handleSubmit}>
      <div className="marker-draft-card__header">
        <div>
          <p className="marker-draft-card__eyebrow">Nouveau point</p>
          <h2 className="marker-draft-card__title">Ajouter un marqueur</h2>
        </div>

        <button
          className="marker-draft-card__close"
          type="button"
          onClick={onCancel}
        >
          Fermer
        </button>
      </div>

      <label className="marker-draft-card__field">
        <span>Rechercher un PC</span>
        <input
          autoFocus
          className="marker-draft-card__input"
          placeholder="Ex. hostname, prodsched, station, secteur..."
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>

      <div className="marker-draft-card__details">
        <div>
          <span className="marker-draft-card__detail-label">
            PC selectionne
          </span>
          <strong>
            {selectedCandidate?.markerId ?? "Aucun PC selectionne"}
          </strong>
        </div>

        <div>
          <span className="marker-draft-card__detail-label">Hostname</span>
          <strong>
            {selectedCandidate?.hostname ?? "En attente de selection"}
          </strong>
        </div>

        <div>
          <span className="marker-draft-card__detail-label">Zone</span>
          <strong>{zoneLabel}</strong>
        </div>

        <div>
          <span className="marker-draft-card__detail-label">Coordonnees</span>
          <strong>
            X {draft.x} / Y {draft.y}
          </strong>
        </div>
      </div>

      {hasSelection
        ? (
          <div className="marker-draft-card__details">
            <div>
              <span className="marker-draft-card__detail-label">Secteur</span>
              <strong>{selectedCandidate.sector || "Non renseigne"}</strong>
            </div>

            <div>
              <span className="marker-draft-card__detail-label">Prodsched</span>
              <strong>{selectedCandidate.prodsched || "Non renseigne"}</strong>
            </div>

            <div>
              <span className="marker-draft-card__detail-label">Station</span>
              <strong>
                {selectedCandidate.stationName || "Non renseignee"}
              </strong>
            </div>
          </div>
        )
        : null}

      <div className="marker-draft-card__catalog" role="list">
        {placementCatalogLoading
          ? (
            <p className="marker-draft-card__hint">
              Chargement du catalogue Excel...
            </p>
          )
          : null}
        {placementCatalogError !== null
          ? <p className="marker-draft-card__error">{placementCatalogError}</p>
          : null}
        {!placementCatalogLoading &&
            placementCatalogError === null &&
            availableCandidates.length === 0
          ? (
            <p className="marker-draft-card__hint">
              Aucun PC du catalogue n&apos;est disponible pour cette position.
            </p>
          )
          : null}
        {!placementCatalogLoading &&
            placementCatalogError === null &&
            availableCandidates.length > 0 &&
            matchingCandidates.length === 0
          ? (
            <p className="marker-draft-card__hint">
              Aucun PC du catalogue ne correspond a cette recherche.
            </p>
          )
          : null}
        {!placementCatalogLoading &&
            placementCatalogError === null &&
            matchingCandidates.length > 0
          ? (
            <div className="marker-draft-card__catalog-list">
              {matchingCandidates.map((candidate) => (
                <button
                  key={candidate.id}
                  className={`marker-draft-card__catalog-item${
                    markerId === candidate.markerId
                      ? " marker-draft-card__catalog-item--selected"
                      : ""
                  }`}
                  type="button"
                  onClick={() => onMarkerIdChange(candidate.markerId)}
                >
                  <strong>{candidate.markerId}</strong>
                  <span className="marker-draft-card__catalog-meta">
                    {candidate.hostname}
                  </span>
                  <span className="marker-draft-card__catalog-meta">
                    {candidate.stationName} • {candidate.prodsched} •{" "}
                    {candidate.sector}
                  </span>
                </button>
              ))}
            </div>
          )
          : null}
      </div>

      {errorMessage !== null
        ? <p className="marker-draft-card__error">{errorMessage}</p>
        : null}

      <div className="marker-draft-card__actions">
        <button className="marker-draft-card__button" type="submit">
          Ajouter
        </button>
        <button
          className="marker-draft-card__button marker-draft-card__button--secondary"
          type="button"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
