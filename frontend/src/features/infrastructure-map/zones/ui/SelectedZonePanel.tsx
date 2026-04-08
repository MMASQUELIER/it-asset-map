import type { FormEvent } from "react";
import { useState } from "react";
import type {
  MapZone,
  SectorRecord,
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
  secondaryButtonClassName,
  scrollableFloatingPanelClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { ZonePanelHeader } from "@/features/infrastructure-map/zones/ui/ZonePanelHeader";
import { ZoneSectorBadge } from "@/features/infrastructure-map/zones/ui/ZoneSectorBadge";
import ZoneSectorSelector from "@/features/infrastructure-map/zones/ui/ZoneSectorSelector";

interface SelectedZonePanelProps {
  availableSectors: SectorRecord[];
  isSaving: boolean;
  onClose: () => void;
  onInputChange: () => void;
  onSubmit: (input: {
    code: string;
    name: string;
    sectorName: string;
  }) => void;
  zone: MapZone;
}

export default function SelectedZonePanel({
  availableSectors,
  isSaving,
  onClose,
  onInputChange,
  onSubmit,
  zone,
}: SelectedZonePanelProps) {
  const zoneSnapshotKey = `${zone.id}:${zone.sectorName}:${zone.code}:${zone.name ?? ""}`;

  return (
    <SelectedZonePanelForm
      key={zoneSnapshotKey}
      availableSectors={availableSectors}
      isSaving={isSaving}
      onClose={onClose}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
      zone={zone}
    />
  );
}

function SelectedZonePanelForm({
  availableSectors,
  isSaving,
  onClose,
  onInputChange,
  onSubmit,
  zone,
}: SelectedZonePanelProps) {
  const [draft, setDraft] = useState(() => ({
    code: zone.code,
    name: zone.name ?? "",
    sectorName: zone.sectorName,
  }));
  const isSubmitDisabled = draft.sectorName.trim().length === 0 ||
    draft.code.trim().length !== 3 ||
    isSaving;
  const sectorColor = getSectorColorByName(draft.sectorName, availableSectors);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(draft);
  }

  function updateDraft(field: "code" | "name" | "sectorName", value: string): void {
    onInputChange();
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  return (
    <form
      className={`${scrollableFloatingPanelClassName} grid gap-4`}
      onSubmit={handleSubmit}
    >
      <ZonePanelHeader
        description="Secteur, code et nom."
        onClose={onClose}
        title="Modifier"
      />

      <label className={fieldGroupClassName}>
        <span className={fieldLabelTextClassName}>Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={(value) => updateDraft("sectorName", value)}
          selectedSector={draft.sectorName}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className={fieldLabelTextClassName}>Code zone</span>
        <input
          autoFocus
          className={textInputClassName}
          inputMode="numeric"
          maxLength={3}
          placeholder="Ex. 250"
          type="text"
          value={draft.code}
          onChange={(event) => updateDraft("code", event.target.value)}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className={fieldLabelTextClassName}>Nom</span>
        <input
          className={textInputClassName}
          placeholder="Nom optionnel"
          type="text"
          value={draft.name}
          onChange={(event) => updateDraft("name", event.target.value)}
        />
      </label>

      <div className={detailsGridClassName}>
        <div>
          <span className={detailLabelTextClassName}>Position</span>
          <strong>
            X {zone.bounds.x} / Y {zone.bounds.y}
          </strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Dimensions</span>
          <strong>
            {zone.bounds.width} x {zone.bounds.height}
          </strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Couleur secteur</span>
          <ZoneSectorBadge
            sectorColor={sectorColor}
            sectorName={draft.sectorName}
          />
        </div>
      </div>

      <div className={panelActionRowClassName}>
        <button
          className={primaryButtonClassName}
          disabled={isSubmitDisabled}
          type="submit"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          className={secondaryButtonClassName}
          type="button"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </form>
  );
}
