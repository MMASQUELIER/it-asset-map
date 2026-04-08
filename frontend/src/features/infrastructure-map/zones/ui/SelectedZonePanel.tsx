import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import type { MapZone } from "@/features/infrastructure-map/model/types";
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
  secondaryButtonClassName,
  scrollableFloatingPanelClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";
import ZoneSectorSelector from "@/features/infrastructure-map/zones/ui/ZoneSectorSelector";

interface SelectedZonePanelProps {
  availableSectors: string[];
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
  const [sectorName, setSectorName] = useState(() => zone.sectorName);
  const [code, setCode] = useState(() => zone.code);
  const [name, setName] = useState(() => zone.name ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({
      code,
      name,
      sectorName,
    });
  }

  return (
    <form
      className={`${scrollableFloatingPanelClassName} grid gap-4`}
      onSubmit={handleSubmit}
    >
      <SelectedZoneHeader onClose={onClose} />

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={(value) => {
            onInputChange();
            setSectorName(value);
          }}
          selectedSector={sectorName}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Code zone</span>
        <input
          autoFocus
          className={textInputClassName}
          inputMode="numeric"
          maxLength={3}
          placeholder="Ex. 250"
          type="text"
          value={code}
          onChange={(event) => {
            onInputChange();
            setCode(event.target.value);
          }}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Nom</span>
        <input
          className={textInputClassName}
          placeholder="Nom optionnel"
          type="text"
          value={name}
          onChange={(event) => {
            onInputChange();
            setName(event.target.value);
          }}
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
          <SelectedZoneBadge sectorName={sectorName} />
        </div>
      </div>

      <div className={panelActionRowClassName}>
        <button
          className={primaryButtonClassName}
          disabled={sectorName.trim().length === 0 || code.trim().length !== 3 || isSaving}
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

interface SelectedZoneHeaderProps {
  onClose: () => void;
}

function SelectedZoneHeader({ onClose }: SelectedZoneHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={eyebrowTextClassName}>Zone</p>
        <h2 className={panelTitleTextClassName}>Modifier</h2>
        <p className={panelDescriptionTextClassName}>Secteur, code et nom.</p>
      </div>

      <button className={closeButtonClassName} type="button" onClick={onClose}>
        Fermer
      </button>
    </div>
  );
}

interface SelectedZoneBadgeProps {
  sectorName: string;
}

function SelectedZoneBadge({ sectorName }: SelectedZoneBadgeProps) {
  return (
    <strong
      className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-bold text-schneider-900"
      style={getZoneBadgeStyle(sectorName)}
    >
      {sectorName}
    </strong>
  );
}

function getZoneBadgeStyle(sectorName: string): CSSProperties {
  const sectorAccentColor = getSectorColor(sectorName);

  return {
    borderColor: `color-mix(in srgb, ${sectorAccentColor} 40%, rgba(16,38,26,0.1))`,
    background: `color-mix(in srgb, ${sectorAccentColor} 18%, white)`,
  } as CSSProperties;
}
