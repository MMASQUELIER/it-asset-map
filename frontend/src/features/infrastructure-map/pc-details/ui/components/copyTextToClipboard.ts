export async function copyTextToClipboard(value: string): Promise<boolean> {
  if (
    "clipboard" in navigator &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Replie sur la methode historique ci-dessous si l'API moderne echoue.
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
