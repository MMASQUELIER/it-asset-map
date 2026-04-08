import { useId } from "react";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

interface ZoneSectorSelectorProps {
  availableSectors: string[];
  selectedSector: string;
  onSelectSector: (sector: string) => void;
}

export default function ZoneSectorSelector({
  availableSectors,
  selectedSector,
  onSelectSector,
}: ZoneSectorSelectorProps) {
  const suggestionsId = useId();

  return (
    <div className="grid gap-2">
      <input
        className={joinClassNames(
          "rounded-2xl border px-4 py-3 text-sm font-medium text-schneider-950 outline-none transition",
          "border-schneider-950/10 bg-white focus:border-schneider-500/30 focus:bg-schneider-50",
        )}
        list={suggestionsId}
        placeholder="Ex. Secteur manuel"
        type="text"
        value={selectedSector}
        onChange={(event) => onSelectSector(event.target.value)}
      />
      <datalist id={suggestionsId}>
        {availableSectors.map((sector) => <option key={sector} value={sector} />)}
      </datalist>
      <p className="text-xs text-schneider-800/70">
        {availableSectors.length > 0
          ? "Choisissez un secteur existant ou saisissez-en un nouveau."
          : "Saisissez le premier secteur pour initialiser la carte."}
      </p>
    </div>
  );
}
