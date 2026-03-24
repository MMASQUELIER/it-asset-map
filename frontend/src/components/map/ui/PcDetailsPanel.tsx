import { useEffect, useState } from "react";
import type { CSSProperties, SVGProps } from "react";
import type { InteractiveMarker, MapZone } from "../../../types/layout";

interface PcDetailsPanelProps {
  marker: InteractiveMarker;
  onClose: () => void;
  zone: MapZone | null;
}

interface PcDetailField {
  id: string;
  label: string;
  value: string | undefined;
  variant?: "default" | "zone";
}

interface VisiblePcDetailField extends PcDetailField {
  value: string;
}

interface PcDetailsSectionProps {
  copiedFieldId: string | null;
  items: VisiblePcDetailField[];
  onCopy: (field: VisiblePcDetailField) => void;
  title: string;
}

export default function PcDetailsPanel({
  marker,
  onClose,
  zone,
}: PcDetailsPanelProps) {
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);
  const details = marker.technicalDetails;
  const zoneLabel = zone === null ? "Hors zone" : `Zone ${zone.id}`;
  const zoneStyle = getZoneStyle(zone);
  const subtitle = [details.manufacturer, details.model, details.operatingSystem]
    .filter(isVisibleText)
    .join(" • ");
  const securityTone = getSecurityTone(details.securityStatus);
  const summaryFields = getSummaryFields(marker, zoneLabel);
  const networkFields = getNetworkFields(details);
  const hardwareFields = getHardwareFields(details);

  useEffect(() => {
    if (copiedFieldId === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedFieldId(null);
    }, 1400);

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
          {details.securityStatus}
        </span>
        {details.connectionType !== undefined ? (
          <span className="pc-details-card__badge pc-details-card__badge--neutral">
            {details.connectionType}
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
              zoneStyle={field.variant === "zone" ? zoneStyle : undefined}
            />
          ))}
        </div>
      </section>

      <PcDetailsSection
        copiedFieldId={copiedFieldId}
        items={networkFields}
        onCopy={handleCopy}
        title="Reseau"
      />
      <PcDetailsSection
        copiedFieldId={copiedFieldId}
        items={hardwareFields}
        onCopy={handleCopy}
        title="Materiel"
      />
    </aside>
  );
}

function getZoneStyle(zone: MapZone | null): CSSProperties | undefined {
  if (zone === null) {
    return undefined;
  }

  return {
    "--pc-details-zone-color": zone.color,
  } as CSSProperties;
}

function getSummaryFields(
  marker: InteractiveMarker,
  zoneLabel: string,
): VisiblePcDetailField[] {
  return filterVisibleFields([
    { id: "zone", label: "Zone", value: zoneLabel, variant: "zone" },
    { id: "hostname", label: "Hostname", value: marker.technicalDetails.hostname },
    { id: "post-name", label: "Nom poste", value: marker.id },
    {
      id: "sesi",
      label: "SESI",
      value: formatSesiValue(marker.technicalDetails.directoryAccount),
    },
    { id: "ip", label: "Adresse IP", value: marker.technicalDetails.ipAddress },
    { id: "serial-number", label: "S/N", value: marker.technicalDetails.serialNumber },
  ]);
}

function getNetworkFields(
  details: InteractiveMarker["technicalDetails"],
): VisiblePcDetailField[] {
  return filterVisibleFields([
    { id: "network-ip", label: "Adresse IP", value: details.ipAddress },
    { id: "network-mac", label: "Adresse MAC", value: details.macAddress },
    { id: "network-mask", label: "Masque", value: details.subnetMask },
    { id: "network-vlan", label: "VLAN", value: details.vlan },
    { id: "network-scope", label: "Reseau", value: details.networkScope },
    { id: "network-gateway", label: "Passerelle", value: details.gateway },
    { id: "network-switch", label: "Switch", value: details.switchName },
    { id: "network-switch-ip", label: "IP switch", value: details.switchIpAddress },
    { id: "network-port", label: "Port switch", value: details.switchPort },
    { id: "network-connection", label: "Connexion", value: details.connectionType },
  ]);
}

function getHardwareFields(
  details: InteractiveMarker["technicalDetails"],
): VisiblePcDetailField[] {
  return filterVisibleFields([
    { id: "hardware-site", label: "Site", value: details.site },
    { id: "hardware-location", label: "Emplacement", value: details.location },
    { id: "hardware-contact", label: "Referent", value: details.contact },
    { id: "hardware-sector", label: "Secteur", value: details.sector },
    { id: "hardware-type", label: "Type", value: details.assetType },
    { id: "hardware-manufacturer", label: "Fabricant", value: details.manufacturer },
    { id: "hardware-model", label: "Modele", value: details.model },
    { id: "hardware-os", label: "Systeme", value: details.operatingSystem },
    { id: "hardware-processor", label: "Processeur", value: details.processor },
    { id: "hardware-memory", label: "Memoire", value: details.memory },
    { id: "hardware-storage", label: "Stockage", value: details.storage },
    {
      id: "hardware-last-scan",
      label: "Dernier inventaire",
      value: formatDateValue(details.lastInventoryDate),
    },
    { id: "hardware-comment", label: "Commentaire", value: details.comment },
  ]);
}

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

interface PcDetailCardProps {
  copiedFieldId: string | null;
  field: VisiblePcDetailField;
  onCopy: (field: VisiblePcDetailField) => void;
  zoneStyle?: CSSProperties;
}

function PcDetailCard({
  copiedFieldId,
  field,
  onCopy,
  zoneStyle,
}: PcDetailCardProps) {
  const isCopied = copiedFieldId === field.id;

  return (
    <div
      className={`pc-details-card__field-card${field.variant === "zone" ? " pc-details-card__field-card--zone" : ""}`}
      style={zoneStyle}
    >
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

function filterVisibleFields(fields: PcDetailField[]): VisiblePcDetailField[] {
  return fields.filter(
    (field): field is VisiblePcDetailField => isVisibleText(field.value),
  );
}

function isVisibleText(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

function formatSesiValue(directoryAccount: string | undefined): string | undefined {
  if (directoryAccount === undefined) {
    return undefined;
  }

  const [, account = directoryAccount] = directoryAccount.split("\\");

  return account.trim().length > 0 ? account : directoryAccount;
}

function formatDateValue(value: string | undefined): string | undefined {
  if (!isVisibleText(value)) {
    return undefined;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

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

async function copyTextToClipboard(value: string): Promise<boolean> {
  if (
    "clipboard" in navigator &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(value);
    return true;
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
