import type { PcTechnicalDetails } from "@/features/infrastructure-map/model/types/pc";

export function getResolvedPcDisplayName(
  technicalDetails: PcTechnicalDetails,
  fallbackId: string,
): string {
  return getFirstVisibleText(technicalDetails.hostname, fallbackId) ?? fallbackId;
}

export function isPcTechnicalDetails(
  technicalDetails: PcTechnicalDetails,
): boolean {
  return getVisibleText(technicalDetails.assetType)?.toUpperCase() === "PC";
}

export function getResolvedPcLocation(
  technicalDetails: PcTechnicalDetails,
): string | undefined {
  return getFirstVisibleText(
    technicalDetails.floorLocation,
    technicalDetails.sector,
  );
}

export function getResolvedPcConnectionType(
  technicalDetails: PcTechnicalDetails,
): string | undefined {
  return getFirstVisibleText(
    technicalDetails.wifiOrWiredConnection,
    technicalDetails.connectionType,
  );
}

export function getResolvedPcStatus(
  technicalDetails: PcTechnicalDetails,
): string | undefined {
  return getFirstVisibleText(
    technicalDetails.status,
    technicalDetails.securityStatus,
  );
}

export function getResolvedPcComment(
  technicalDetails: PcTechnicalDetails,
): string | undefined {
  return getFirstVisibleText(
    technicalDetails.secondaryComment,
    technicalDetails.comment,
  );
}

export function formatDirectoryAccountValue(
  directoryAccount: string | undefined,
): string | undefined {
  const visibleDirectoryAccount = getVisibleText(directoryAccount);

  if (visibleDirectoryAccount === undefined) {
    return undefined;
  }

  const [, account = visibleDirectoryAccount] = visibleDirectoryAccount.split("\\");
  const visibleAccount = getVisibleText(account);

  return visibleAccount ?? visibleDirectoryAccount;
}

function getFirstVisibleText(
  ...values: Array<string | undefined>
): string | undefined {
  for (const value of values) {
    const visibleText = getVisibleText(value);

    if (visibleText !== undefined) {
      return visibleText;
    }
  }

  return undefined;
}

function getVisibleText(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}
