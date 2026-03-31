export function getExcelIssueSummary(
  excelIssues: string[] | undefined,
): string | null {
  if (excelIssues === undefined || excelIssues.length === 0) {
    return null;
  }

  if (excelIssues.length === 1) {
    return excelIssues[0];
  }

  const firstIssue = excelIssues[0];
  const remainingIssuesCount = excelIssues.length - 1;

  return `${firstIssue} (+${remainingIssuesCount})`;
}

export function hasExcelIssues(excelIssues: string[] | undefined): boolean {
  return getExcelIssueSummary(excelIssues) !== null;
}
