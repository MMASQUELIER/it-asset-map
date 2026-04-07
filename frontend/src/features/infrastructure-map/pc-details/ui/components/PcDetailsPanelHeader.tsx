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
  connectionLabel?: string;
  markerId: string;
  onClose: () => void;
  onSearchQueryChange: (value: string) => void;
  searchQuery: string;
  statusLabel: string;
  subtitle: string;
  visibleFieldCount: number;
  zone: MapZone | null;
  zoneLabel: string;
}

export function PcDetailsPanelHeader({
  connectionLabel,
  markerId,
  onClose,
  onSearchQueryChange,
  searchQuery,
  statusLabel,
  subtitle,
  visibleFieldCount,
  zone,
  zoneLabel,
}: PcDetailsPanelHeaderProps) {
  const visibleInfoLabel = `${visibleFieldCount} champ${
    visibleFieldCount > 1 ? "s" : ""
  }`;
  const securityTone = getSecurityTone(statusLabel);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0 grid gap-2">
          <p className={eyebrowTextClassName}>Poste</p>
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
        {renderContextBadge(zone === null ? undefined : zone.sectorName)}
        {renderConnectionBadge(connectionLabel)}
        {renderSecurityBadge(statusLabel, securityTone)}
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-schneider-700/72">
            Filtrer
          </span>
          <span className="text-xs text-schneider-800/62">{visibleInfoLabel}</span>
        </div>
        <input
          className={textInputClassName}
          placeholder="Champ, valeur..."
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
    <span className="inline-flex max-w-full items-center rounded-full border border-schneider-950/10 bg-white px-3 py-1.5 text-[0.78rem] font-medium text-schneider-900">
      {label}
    </span>
  );
}

function renderConnectionBadge(label: string | undefined) {
  if (label === undefined) {
    return null;
  }

  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-schneider-950/10 bg-white px-3 py-1.5 text-[0.78rem] font-medium text-schneider-900">
      {label}
    </span>
  );
}

function renderSecurityBadge(
  label: string,
  tone: ReturnType<typeof getSecurityTone>,
) {
  return (
    <span
      className={joinClassNames(
        "inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-[0.78rem] font-medium",
        tone === "good" &&
          "border-emerald-300/60 bg-emerald-50/90 text-emerald-800",
        tone === "warning" &&
          "border-amber-300/60 bg-amber-50/90 text-amber-800",
        tone === "critical" &&
          "border-rose-300/60 bg-rose-50/90 text-rose-800",
        tone === "neutral" &&
          "border-schneider-950/10 bg-white/90 text-schneider-900",
      )}
    >
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
