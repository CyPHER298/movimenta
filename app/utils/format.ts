function parseText(text: string | undefined) {
  if (!text) return text;

  if (text.length > 42) {
    return text.substring(0, 42) + "...";
  }
  return text;
}
