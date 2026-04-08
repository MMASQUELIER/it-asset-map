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

interface ZoneDraftFormProps {
  availableSectors: string[];
  draft: ZoneDraft;
  onCancel: () => void;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onSubmit: () => void;
  zoneCode: string;
  zoneName: string;
  zoneSectorName: string;
}

export default function ZoneDraftForm({
  availableSectors,
  draft,
  onCancel,
  onCodeChange,
  onNameChange,
  onSectorChange,
  onSubmit,
  zoneCode,
  zoneName,
  zoneSectorName,
}: ZoneDraftFormProps) {
  const isSubmitDisabled = zoneSectorName.trim().length === 0 ||
    zoneCode.trim().length !== 3;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className={`${scrollableFloatingPanelClassName} grid gap-4`}
      onSubmit={handleSubmit}
    >
      <ZoneDraftHeader onClose={onCancel} />

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={onSectorChange}
          selectedSector={zoneSectorName}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Code zone</span>
        <input
          autoFocus
          className={textInputClassName}
          inputMode="numeric"
          placeholder="Ex. 250"
          maxLength={3}
          type="text"
          value={zoneCode}
          onChange={(event) => onCodeChange(event.target.value)}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Nom</span>
        <input
          className={textInputClassName}
          placeholder="Nom optionnel"
          type="text"
          value={zoneName}
          onChange={(event) => onNameChange(event.target.value)}
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
          <ZoneSectorBadge sectorName={zoneSectorName} />
        </div>
      </div>

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

interface ZoneDraftHeaderProps {
  onClose: () => void;
}

function ZoneDraftHeader({ onClose }: ZoneDraftHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={eyebrowTextClassName}>Zone</p>
        <h2 className={panelTitleTextClassName}>Ajouter</h2>
        <p className={panelDescriptionTextClassName}>Secteur et code sur 3 chiffres.</p>
      </div>

      <button className={closeButtonClassName} type="button" onClick={onClose}>
        Fermer
      </button>
    </div>
  );
}

interface ZoneSectorBadgeProps {
  sectorName: string;
}

function ZoneSectorBadge({ sectorName }: ZoneSectorBadgeProps) {
  return (
    <strong
      className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-bold text-schneider-900"
      style={getZoneSectorBadgeStyle(sectorName)}
    >
      {sectorName.length > 0 ? sectorName : "Saisissez un secteur"}
    </strong>
  );
}

function getZoneSectorBadgeStyle(sectorName: string): CSSProperties {
  const sectorAccentColor = getSectorColor(sectorName);

  return {
    borderColor: `color-mix(in srgb, ${sectorAccentColor} 40%, rgba(16,38,26,0.1))`,
    background: `color-mix(in srgb, ${sectorAccentColor} 18%, white)`,
  } as CSSProperties;
}
