export function getSecurityTone(
  status: string | undefined,
): "good" | "warning" | "critical" | "neutral" {
  if (status === undefined || status.trim().length === 0) {
    return "neutral";
  }

  if (/conforme|oui|yes|installed|ok|actif/i.test(status)) {
    return "good";
  }

  if (/requise|required|warning/i.test(status)) {
    return "warning";
  }

  if (/renforce|critical|non|no|absent/i.test(status)) {
    return "critical";
  }

  return "neutral";
}
