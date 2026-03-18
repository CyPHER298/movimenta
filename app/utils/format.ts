export function parseText(text: string | undefined) {
  if (!text) return text;

  if (text.length > 16) {
    return text.substring(0, 16) + "...";
  }
  return text;
}
