import { useEffect, useState } from "react";
import type { CSSProperties, SVGProps } from "react";
import type { InteractiveMarker, MapZone } from "../../shared/types";
import {
  buildPcDetailSections,
  buildPcSubtitle,
  buildPcSummaryFields,
  type VisiblePcDetailField,
} from "./pcDetailsContent";

/** Delay used to keep the "copied" feedback visible. */
const COPIED_FEEDBACK_DELAY_MS = 1400;

/** Props used to render the detail sheet of one selected PC. */
interface PcDetailsPanelProps {
  marker: InteractiveMarker;
  onClose: () => void;
  zone: MapZone | null;
}

/** Props shared by every detail section. */
interface PcDetailsSectionProps {
  copiedFieldId: string | null;
  items: VisiblePcDetailField[];
  onCopy: (field: VisiblePcDetailField) => void;
  title: string;
}

/** Props used by one copyable field card. */
interface PcDetailCardProps {
  copiedFieldId: string | null;
  field: VisiblePcDetailField;
  onCopy: (field: VisiblePcDetailField) => void;
}

/**
 * Displays the full detail card for a selected marker.
 *
 * @param props Selected marker, parent zone and close callback.
 * @returns Detail panel UI.
 */
export default function PcDetailsPanel({
  marker,
  onClose,
  zone,
}: PcDetailsPanelProps) {
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);
  const details = marker.technicalDetails;
  const zoneLabel = zone === null ? "Hors zone" : `Zone ${zone.id}`;
  const zoneStyle = getZoneStyle(zone);
  const subtitle = buildPcSubtitle(marker);
  const stateLabel = details.etat ?? details.securityStatus;
  const connectionLabel =
    details.wifiOrWiredConnection ?? details.connectionType;
  const summaryFields = buildPcSummaryFields(marker);
  const detailSections = buildPcDetailSections(marker);
  const securityTone = getSecurityTone(stateLabel);

  useEffect(() => {
    if (copiedFieldId === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedFieldId(null);
    }, COPIED_FEEDBACK_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copiedFieldId]);

  async function handleCopy(field: VisiblePcDetailField): Promise<void> {
    const didCopy = await copyTextToClipboard(field.value);

    if (didCopy) {
      setCopiedFieldId(field.id);
    }
  }

  return (
    <aside className="marker-draft-card pc-details-card">
      <div className="marker-draft-card__header pc-details-card__header">
        <div>
          <p className="marker-draft-card__eyebrow">Fiche PC</p>
          <h2 className="marker-draft-card__title">{marker.id}</h2>
          {subtitle.length > 0 ? (
            <p className="pc-details-card__subtitle">{subtitle}</p>
          ) : null}
        </div>

        <button
          className="marker-draft-card__close pc-details-card__close"
          type="button"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>

      <div className="pc-details-card__meta">
        <span
          className="pc-details-card__badge pc-details-card__badge--zone"
          style={zoneStyle}
        >
          {zoneLabel}
        </span>
        <span
          className={`pc-details-card__badge pc-details-card__badge--status pc-details-card__badge--status-${securityTone}`}
        >
          {stateLabel}
        </span>
        {connectionLabel !== undefined ? (
          <span className="pc-details-card__badge pc-details-card__badge--neutral">
            {connectionLabel}
          </span>
        ) : null}
      </div>

      <section className="pc-details-card__panel pc-details-card__panel--summary">
        <div className="pc-details-card__summary-grid">
          {summaryFields.map((field) => (
            <PcDetailCard
              key={field.id}
              copiedFieldId={copiedFieldId}
              field={field}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </section>

      {detailSections.map((section) => (
        <PcDetailsSection
          key={section.title}
          copiedFieldId={copiedFieldId}
          items={section.items}
          onCopy={handleCopy}
          title={section.title}
        />
      ))}
    </aside>
  );
}

/**
 * Converts the selected zone color into CSS custom properties.
 *
 * @param zone Selected zone or `null`.
 * @returns Inline CSS variables used by the detail card.
 */
function getZoneStyle(zone: MapZone | null): CSSProperties | undefined {
  if (zone === null) {
    return undefined;
  }

  return {
    "--pc-details-zone-color": zone.color,
  } as CSSProperties;
}

/**
 * Renders one logical section of the detail card.
 *
 * @param props Section title, items and copy state.
 * @returns Section UI or `null` when empty.
 */
function PcDetailsSection({
  copiedFieldId,
  items,
  onCopy,
  title,
}: PcDetailsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="pc-details-card__panel pc-details-card__section">
      <h3 className="pc-details-card__section-title">{title}</h3>
      <div className="pc-details-card__section-grid">
        {items.map((field) => (
          <PcDetailCard
            key={field.id}
            copiedFieldId={copiedFieldId}
            field={field}
            onCopy={onCopy}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Renders one field card with a copy-to-clipboard action.
 *
 * @param props Field content and copy state.
 * @returns One field card.
 */
function PcDetailCard({
  copiedFieldId,
  field,
  onCopy,
}: PcDetailCardProps) {
  const isCopied = copiedFieldId === field.id;

  return (
    <div className="pc-details-card__field-card">
      <div className="pc-details-card__field-head">
        <span className="pc-details-card__field-label">{field.label}</span>
        <button
          aria-label={isCopied ? `${field.label} copie` : `Copier ${field.label}`}
          className={`pc-details-card__copy-button${isCopied ? " pc-details-card__copy-button--copied" : ""}`}
          title={isCopied ? "Copie" : "Copier"}
          type="button"
          onClick={() => onCopy(field)}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>

      <strong className="pc-details-card__field-value">{field.value}</strong>
    </div>
  );
}

/**
 * Maps a textual security status to a visual tone.
 *
 * @param status Raw status text.
 * @returns Badge tone matching the status wording.
 */
function getSecurityTone(
  status: string | undefined,
): "good" | "warning" | "critical" | "neutral" {
  if (!isVisibleText(status)) {
    return "neutral";
  }

  if (/conforme/i.test(status)) {
    return "good";
  }

  if (/requise/i.test(status)) {
    return "warning";
  }

  if (/renforce/i.test(status)) {
    return "critical";
  }

  return "neutral";
}

/**
 * Checks whether a value contains non-empty text.
 *
 * @param value Candidate text value.
 * @returns `true` when the text should be displayed.
 */
function isVisibleText(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

/**
 * Copies a value to the clipboard with a safe fallback for older browsers.
 *
 * @param value Text to copy.
 * @returns `true` when the copy succeeded.
 */
async function copyTextToClipboard(value: string): Promise<boolean> {
  if (
    "clipboard" in navigator &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall back to the legacy copy path below.
    }
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();

  const didCopy = document.execCommand("copy");

  textarea.remove();
  return didCopy;
}

/**
 * Copy icon shown before a value is copied.
 *
 * @param props SVG props.
 * @returns Copy icon SVG.
 */
function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M5.5 3.5h5a2 2 0 0 1 2 2v5M5 6.5h5a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 10 13.5H5A1.5 1.5 0 0 1 3.5 12V8A1.5 1.5 0 0 1 5 6.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/**
 * Confirmation icon shown after a successful copy.
 *
 * @param props SVG props.
 * @returns Check icon SVG.
 */
function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="m3.5 8.5 2.4 2.4 6.6-6.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
