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
  const subtitle = [
    details.prodsched,
    details.manufacturingStationNames,
    details.model,
  ]
    .filter(isVisibleText)
    .join(" • ");
  const stateLabel = details.etat ?? details.securityStatus;
  const connectionLabel =
    details.wifiOrWiredConnection ?? details.connectionType;
  const summaryFields = getSummaryFields(marker);
  const identificationFields = getIdentificationFields(marker);
  const equipmentFields = getEquipmentFields(details);
  const networkFields = getNetworkFields(details);
  const switchFields = getSwitchFields(details);
  const securityTone = getSecurityTone(stateLabel);

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
              zoneStyle={field.variant === "zone" ? zoneStyle : undefined}
            />
          ))}
        </div>
      </section>

      <PcDetailsSection
        copiedFieldId={copiedFieldId}
        items={identificationFields}
        onCopy={handleCopy}
        title="Identification"
      />
      <PcDetailsSection
        copiedFieldId={copiedFieldId}
        items={equipmentFields}
        onCopy={handleCopy}
        title="Equipment"
      />
      <PcDetailsSection
        copiedFieldId={copiedFieldId}
        items={networkFields}
        onCopy={handleCopy}
        title="Network"
      />
      <PcDetailsSection
        copiedFieldId={copiedFieldId}
        items={switchFields}
        onCopy={handleCopy}
        title="Switch / Access"
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
): VisiblePcDetailField[] {
  return buildVisibleFields([
    { id: "hostname", label: "Hostname", value: marker.technicalDetails.hostname },
    { id: "prodsched", label: "Prodsched", value: marker.technicalDetails.prodsched },
    {
      id: "manufacturing-station-names",
      label: "Manufacturing Station names",
      value: marker.technicalDetails.manufacturingStationNames,
    },
    { id: "model", label: "Model", value: marker.technicalDetails.model },
    {
      id: "sesi",
      label: "SESI",
      value: formatSesiValue(marker.technicalDetails.directoryAccount),
    },
  ]);
}

function getIdentificationFields(marker: InteractiveMarker): VisiblePcDetailField[] {
  return buildVisibleFields([
    {
      id: "collaborateur",
      label: "Collaborateur",
      value: marker.technicalDetails.contact,
    },
    { id: "pin", label: "Clé (PIN)", value: marker.technicalDetails.pinKey },
    {
      id: "floor-location",
      label: "Location physical location on floor",
      value:
        marker.technicalDetails.floorLocation ??
        marker.technicalDetails.sector ??
        marker.technicalDetails.location,
    },
    { id: "date", label: "Date", value: marker.technicalDetails.lastInventoryDate },
  ]);
}

function getEquipmentFields(
  details: InteractiveMarker["technicalDetails"],
): VisiblePcDetailField[] {
  return buildVisibleFields([
    {
      id: "equipment-type",
      label: "Type of equipment (PLC, Sensor, ComXbox)",
      value: details.assetType,
    },
    { id: "brand", label: "Brand", value: details.manufacturer },
    { id: "sap", label: "SAP", value: details.sap },
    { id: "serial-number", label: "Serial Number", value: details.serialNumber },
    { id: "hdd", label: "HDD", value: details.storage },
    { id: "os-type", label: "OS Type", value: details.operatingSystem },
  ]);
}

function getNetworkFields(
  details: InteractiveMarker["technicalDetails"],
): VisiblePcDetailField[] {
  return buildVisibleFields([
    { id: "mac-address", label: "MAC Address 1", value: details.macAddress },
    { id: "ip-address", label: "IP address 1", value: details.ipAddress },
    { id: "subnet", label: "Subnet 1", value: details.subnetMask },
    { id: "vlan-id-name", label: "VLAN id/name", value: details.vlan },
    { id: "vlan-name", label: "VLAN Name", value: details.networkScope },
    {
      id: "old-ip-address",
      label: "Old IP address",
      value: details.oldIpAddress ?? details.gateway,
    },
    {
      id: "new-ip-address",
      label: "New IP address",
      value: details.newIpAddress ?? details.ipAddress,
    },
    {
      id: "vlan-new",
      label: "VLAN New",
      value: details.vlanNew ?? details.vlan,
    },
  ]);
}

function getSwitchFields(
  details: InteractiveMarker["technicalDetails"],
): VisiblePcDetailField[] {
  return buildVisibleFields([
    { id: "id-port", label: "ID PORT", value: details.idPort ?? details.switchPort },
    {
      id: "new-port-auto",
      label: "New PORT AUTO",
      value: details.newPortAuto ?? details.switchPort,
    },
    { id: "switch-name", label: "NOM SWITCH", value: details.switchName },
    { id: "switch-ip", label: "IP SWITCH", value: details.switchIpAddress },
    {
      id: "ticket-brassage",
      label: "Ticket Brassage",
      value: details.ticketBrassage,
    },
    { id: "ip-filter", label: "Filtre IP", value: details.ipFilter },
    { id: "etat", label: "Etat", value: details.etat ?? details.securityStatus },
    {
      id: "connected-switch-name",
      label: "Connected to SWITCH Name",
      value: details.connectedToSwitchName ?? details.switchName,
    },
    {
      id: "connected-switch-port",
      label: "Connected to SWITCH Port",
      value: details.connectedToSwitchPort ?? details.switchPort,
    },
    {
      id: "wifi-wired-connection",
      label: "Wifi or Wired Connection",
      value: details.wifiOrWiredConnection ?? details.connectionType,
    },
    { id: "login", label: "Login", value: details.directoryAccount },
    {
      id: "commentaire2",
      label: "Commentaire2",
      value: details.commentaire2 ?? details.comment,
    },
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

function buildVisibleFields(fields: PcDetailField[]): VisiblePcDetailField[] {
  return fields.map((field) => ({
    ...field,
    value: getDisplayValue(field.value),
  }));
}

function isVisibleText(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

function getDisplayValue(value: string | undefined): string {
  return isVisibleText(value) ? value : "N/A";
}

function formatSesiValue(directoryAccount: string | undefined): string | undefined {
  if (directoryAccount === undefined) {
    return undefined;
  }

  const [, account = directoryAccount] = directoryAccount.split("\\");

  return account.trim().length > 0 ? account : directoryAccount;
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
