import type { FormEvent } from "react";
import type {
  SectorRecord,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import {
  getSectorColorByName,
} from "@/features/infrastructure-map/zones/logic/zoneAppearance";
import {
  detailLabelTextClassName,
  detailsGridClassName,
  fieldLabelTextClassName,
  fieldGroupClassName,
  panelActionRowClassName,
  primaryButtonClassName,
  scrollableFloatingPanelClassName,
  secondaryButtonClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { ZonePanelHeader } from "@/features/infrastructure-map/zones/ui/ZonePanelHeader";
import ZoneSectorSelector from "@/features/infrastructure-map/zones/ui/ZoneSectorSelector";
import { ZoneSectorBadge } from "@/features/infrastructure-map/zones/ui/ZoneSectorBadge";

interface ZoneDraftFormProps {
  availableSectors: SectorRecord[];
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
  const sectorColor = getSectorColorByName(zoneSectorName, availableSectors);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className={`${scrollableFloatingPanelClassName} grid gap-4`}
      onSubmit={handleSubmit}
    >
      <ZonePanelHeader
        description="Secteur et code sur 3 chiffres."
        onClose={onCancel}
        title="Ajouter"
      />

      <label className={fieldGroupClassName}>
        <span className={fieldLabelTextClassName}>Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={onSectorChange}
          selectedSector={zoneSectorName}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className={fieldLabelTextClassName}>Code zone</span>
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
        <span className={fieldLabelTextClassName}>Nom</span>
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
          <ZoneSectorBadge
            emptyLabel="Saisissez un secteur"
            sectorColor={sectorColor}
            sectorName={zoneSectorName}
          />
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
