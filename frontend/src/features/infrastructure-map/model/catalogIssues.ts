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
