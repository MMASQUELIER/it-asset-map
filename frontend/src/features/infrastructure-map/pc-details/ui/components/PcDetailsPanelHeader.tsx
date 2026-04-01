import type { CSSProperties } from "react";
import type { MapZone } from "@/features/infrastructure-map/model/types";
import { getSecurityTone } from "@/features/infrastructure-map/pc-details/ui/components/pcDetailsTone";
import {
  closeButtonClassName,
  eyebrowTextClassName,
  joinClassNames,
  panelTitleTextClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface PcDetailsPanelHeaderProps {
  markerId: string;
  onClose: () => void;
  onSearchQueryChange: (value: string) => void;
  searchQuery: string;
  subtitle: string;
  visibleFieldCount: number;
  zone: MapZone | null;
  zoneLabel: string;
}

export function PcDetailsPanelHeader({
  markerId,
  onClose,
  onSearchQueryChange,
  searchQuery,
  subtitle,
  visibleFieldCount,
  zone,
  zoneLabel,
}: PcDetailsPanelHeaderProps) {
  const visibleInfoLabel = `${visibleFieldCount} info${
    visibleFieldCount > 1 ? "s" : ""
  } visible`;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0 grid gap-2">
          <p className={eyebrowTextClassName}>Fiche PC</p>
          <h2
            className={joinClassNames(
              panelTitleTextClassName,
              "text-[1.45rem] leading-tight tracking-[-0.03em] break-words",
            )}
          >
            {markerId}
          </h2>
          {renderSubtitle(subtitle)}
        </div>

        <button className={closeButtonClassName} type="button" onClick={onClose}>
          Fermer
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <span
          className="inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-[0.78rem] font-black uppercase tracking-[0.1em] text-schneider-900"
          style={buildZoneBadgeStyle(zone)}
        >
          {zoneLabel}
        </span>
        {renderContextBadge(zone === null ? undefined : zone.sector)}
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-schneider-700">
            Recherche rapide
          </span>
          <span className="text-xs font-medium text-schneider-800/65">{visibleInfoLabel}</span>
        </div>
        <input
          className={textInputClassName}
          placeholder="Filtrer par champ ou par valeur..."
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
        />
      </div>
    </>
  );
}

function renderSubtitle(subtitle: string) {
  if (subtitle.length === 0) {
    return null;
  }

  return (
    <p className="m-0 break-words text-sm leading-6 text-schneider-800/75">
      {subtitle}
    </p>
  );
}

function renderContextBadge(label: string | undefined) {
  if (label === undefined) {
    return null;
  }

  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-schneider-950/10 bg-white/90 px-3 py-1.5 text-[0.78rem] font-bold text-schneider-900">
      {label}
    </span>
  );
}

function buildZoneBadgeStyle(zone: MapZone | null): CSSProperties | undefined {
  if (zone === null) {
    return undefined;
  }

  return {
    borderColor: `color-mix(in srgb, ${zone.color} 40%, rgba(16,38,26,0.1))`,
    background: `color-mix(in srgb, ${zone.color} 18%, white)`,
  } as CSSProperties;
}

