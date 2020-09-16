export function replaceNoNumeric(text: string | undefined) {
  if (text) {
    return text.replace(/[^0-9]/g, "");
  }
  return undefined;
}