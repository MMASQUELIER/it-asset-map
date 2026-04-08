import type { PcTechnicalDetails } from "@/features/infrastructure-map/model/types";

export function buildCatalogIssues(
  technicalDetails: Pick<
    PcTechnicalDetails,
    | "floorLocation"
    | "hostname"
    | "manufacturingStationNames"
    | "prodsheet"
    | "sector"
  >,
): string[] | undefined {
  const issues = [
    createMissingFieldIssue("nom machine", technicalDetails.hostname),
    createMissingFieldIssue("prodsheet", technicalDetails.prodsheet),
    createMissingFieldIssue(
      "poste de fabrication",
      technicalDetails.manufacturingStationNames,
    ),
    createMissingFieldIssue(
      "emplacement",
      technicalDetails.floorLocation ?? technicalDetails.sector,
    ),
  ].filter((issue): issue is string => issue !== null);

  return issues.length === 0 ? undefined : issues;
}

export function applyCatalogIssues(
  technicalDetails: PcTechnicalDetails,
): PcTechnicalDetails {
  return {
    ...technicalDetails,
    catalogIssues: buildCatalogIssues(technicalDetails),
  };
}

export function getCatalogIssueSummary(
  catalogIssues: string[] | undefined,
): string | null {
  if (catalogIssues === undefined || catalogIssues.length === 0) {
    return null;
  }

  if (catalogIssues.length === 1) {
    return catalogIssues[0];
  }

  const firstIssue = catalogIssues[0];
  const remainingIssuesCount = catalogIssues.length - 1;

  return `${firstIssue} (+${remainingIssuesCount})`;
}

function createMissingFieldIssue(
  label: string,
  value: string | undefined,
): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? null
    : `CMDB incomplete : ${label} non renseigne.`;
}
