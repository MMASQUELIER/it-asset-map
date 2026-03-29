import type { CSSProperties, FormEvent } from "react";
import type { ZoneDraft } from "../../shared/types";
import { getSectorColor } from "../logic/zoneAppearance";
import ZoneSectorSelector from "./ZoneSectorSelector";

/** Props used to edit a zone draft before insertion. */
interface ZoneDraftFormProps {
  availableSectors: string[];
  draft: ZoneDraft;
  errorMessage: string | null;
  onCancel: () => void;
  onProdschedChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onSubmit: () => void;
  zoneProdsched: string;
  zoneSector: string;
}

/**
 * Form used to confirm the creation of a new zone.
 *
 * @param props Draft values and save callbacks.
 * @returns Zone draft editor UI.
 */
export default function ZoneDraftForm({
  availableSectors,
  draft,
  errorMessage,
  onCancel,
  onProdschedChange,
  onSectorChange,
  onSubmit,
  zoneProdsched,
  zoneSector,
}: ZoneDraftFormProps) {
  const sectorColor = getSectorColor(zoneSector);
  const isSubmitDisabled = zoneSector.trim().length === 0 ||
    zoneProdsched.trim().length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="marker-draft-card zone-form" onSubmit={handleSubmit}>
      <div className="marker-draft-card__header">
        <div>
          <p className="marker-draft-card__eyebrow">Nouvelle zone</p>
          <h2 className="marker-draft-card__title">Creer une zone</h2>
          <p className="zone-form__intro">
            Choisissez le secteur puis saisissez le prodsched pour creer la
            zone.
          </p>
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
        <span>Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={onSectorChange}
          selectedSector={zoneSector}
        />
      </label>

      <label className="marker-draft-card__field">
        <span>Prodsched</span>
        <input
          autoFocus
          className="marker-draft-card__input"
          inputMode="numeric"
          placeholder="Ex. 250"
          type="text"
          value={zoneProdsched}
          onChange={(event) => onProdschedChange(event.target.value)}
        />
      </label>

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

        <div>
          <span className="marker-draft-card__detail-label">
            Couleur secteur
          </span>
          <strong
            className="zone-draft-form__sector-color"
            style={{ "--zone-sector-color": sectorColor } as CSSProperties}
          >
            {zoneSector.length > 0 ? zoneSector : "Selectionnez un secteur"}
          </strong>
        </div>
      </div>

      {errorMessage !== null
        ? <p className="marker-draft-card__error">{errorMessage}</p>
        : null}

      <div className="marker-draft-card__actions">
        <button
          className="marker-draft-card__button marker-draft-card__button--zone"
          disabled={isSubmitDisabled}
          type="submit"
        >
          Creer la zone
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
