import type { CSSProperties, FormEvent } from "react";
import type { ZoneDraft } from "@/features/infrastructure-map/model/types";
import {
  closeButtonClassName,
  detailLabelTextClassName,
  detailsGridClassName,
  eyebrowTextClassName,
  fieldGroupClassName,
  panelActionRowClassName,
  panelDescriptionTextClassName,
  panelTitleTextClassName,
  primaryButtonClassName,
  scrollableFloatingPanelClassName,
  secondaryButtonClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";
import ZoneSectorSelector from "@/features/infrastructure-map/zones/ui/ZoneSectorSelector";

/** Props du formulaire de creation de zone. */
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

/** Formulaire de confirmation pour la creation d'une nouvelle zone. */
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
  const isSubmitDisabled = zoneSector.trim().length === 0 ||
    zoneProdsched.trim().length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className={`${scrollableFloatingPanelClassName} grid gap-4`}
      onSubmit={handleSubmit}
    >
      {renderZoneDraftHeader(onCancel)}

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={onSectorChange}
          selectedSector={zoneSector}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Prodsched</span>
        <input
          autoFocus
          className={textInputClassName}
          inputMode="numeric"
          placeholder="Ex. 250"
          type="text"
          value={zoneProdsched}
          onChange={(event) => onProdschedChange(event.target.value)}
        />
      </label>

      <div className={detailsGridClassName}>
        <div>
          <span className={detailLabelTextClassName}>Position</span>
          <strong>
            X {draft.bounds.x} / Y {draft.bounds.y}
          </strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Dimensions</span>
          <strong>
            {draft.bounds.width} x {draft.bounds.height}
          </strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Couleur secteur</span>
          {renderZoneSectorBadge(zoneSector)}
        </div>
      </div>

      {renderZoneDraftError(errorMessage)}

      <div className={panelActionRowClassName}>
        <button
          className={primaryButtonClassName}
          disabled={isSubmitDisabled}
          type="submit"
        >
          Creer la zone
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

function renderZoneDraftHeader(onCancel: () => void) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={eyebrowTextClassName}>Nouvelle zone</p>
        <h2 className={panelTitleTextClassName}>Creer une zone</h2>
        <p className={panelDescriptionTextClassName}>
          Choisissez le secteur puis saisissez le prodsched pour creer la zone.
        </p>
      </div>

      <button className={closeButtonClassName} type="button" onClick={onCancel}>
        Fermer
      </button>
    </div>
  );
}

function renderZoneSectorBadge(zoneSector: string) {
  return (
    <strong
      className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-bold text-schneider-900"
      style={getZoneSectorBadgeStyle(zoneSector)}
    >
      {zoneSector.length > 0 ? zoneSector : "Selectionnez un secteur"}
    </strong>
  );
}

function renderZoneDraftError(errorMessage: string | null) {
  if (errorMessage === null) {
    return null;
  }

  return (
    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      {errorMessage}
    </p>
  );
}

function getZoneSectorBadgeStyle(zoneSector: string): CSSProperties {
  const sectorAccentColor = getSectorColor(zoneSector);

  return {
    borderColor: `color-mix(in srgb, ${sectorAccentColor} 40%, rgba(16,38,26,0.1))`,
    background: `color-mix(in srgb, ${sectorAccentColor} 18%, white)`,
  } as CSSProperties;
}
