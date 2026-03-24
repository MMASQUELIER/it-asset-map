import type { FormEvent } from "react";
import type { MarkerDraft } from "../../../types/layout";

interface MarkerDraftFormProps {
  draft: MarkerDraft;
  errorMessage: string | null;
  markerId: string;
  onCancel: () => void;
  onMarkerIdChange: (value: string) => void;
  onSubmit: () => void;
}

export default function MarkerDraftForm({
  draft,
  errorMessage,
  markerId,
  onCancel,
  onMarkerIdChange,
  onSubmit,
}: MarkerDraftFormProps) {
  const zoneLabel = draft.zoneId === null ? "Hors zone" : `Zone ${draft.zoneId}`;

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
        <span>Identifiant</span>
        <input
          autoFocus
          className="marker-draft-card__input"
          type="text"
          value={markerId}
          onChange={(event) => onMarkerIdChange(event.target.value)}
        />
      </label>

      <div className="marker-draft-card__details">
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

      {errorMessage !== null ? (
        <p className="marker-draft-card__error">{errorMessage}</p>
      ) : null}

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
