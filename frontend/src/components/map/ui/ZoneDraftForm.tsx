import type { FormEvent } from "react";
import type { ZoneDraft } from "../../../types/layout";

interface ZoneDraftFormProps {
  draft: ZoneDraft;
  errorMessage: string | null;
  onCancel: () => void;
  onColorChange: (value: string) => void;
  onIdChange: (value: string) => void;
  onSubmit: () => void;
  zoneId: string;
}

export default function ZoneDraftForm({
  draft,
  errorMessage,
  onCancel,
  onColorChange,
  onIdChange,
  onSubmit,
  zoneId,
}: ZoneDraftFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="marker-draft-card" onSubmit={handleSubmit}>
      <div className="marker-draft-card__header">
        <div>
          <p className="marker-draft-card__eyebrow">Nouvelle zone</p>
          <h2 className="marker-draft-card__title">Ajouter une zone</h2>
        </div>

        <button
          className="marker-draft-card__close"
          type="button"
          onClick={onCancel}
        >
          Fermer
        </button>
      </div>

      <div className="zone-draft-form__grid">
        <label className="marker-draft-card__field">
          <span>Identifiant</span>
          <input
            autoFocus
            className="marker-draft-card__input"
            type="number"
            value={zoneId}
            onChange={(event) => onIdChange(event.target.value)}
          />
        </label>

        <label className="marker-draft-card__field">
          <span>Couleur</span>
          <input
            className="marker-draft-card__input marker-draft-card__input--color"
            type="color"
            value={draft.color}
            onChange={(event) => onColorChange(event.target.value)}
          />
        </label>
      </div>

      <div className="marker-draft-card__details">
        <div>
          <span className="marker-draft-card__detail-label">Position</span>
          <strong>
            X {draft.bounds.x} / Y {draft.bounds.y}
          </strong>
        </div>

        <div>
          <span className="marker-draft-card__detail-label">Dimensions</span>
          <strong>
            {draft.bounds.width} x {draft.bounds.height}
          </strong>
        </div>
      </div>

      {errorMessage !== null ? (
        <p className="marker-draft-card__error">{errorMessage}</p>
      ) : null}

      <div className="marker-draft-card__actions">
        <button className="marker-draft-card__button marker-draft-card__button--zone" type="submit">
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
