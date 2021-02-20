export function replaceNoNumeric(text: string | undefined) {
  if (text) {
    return text.replace(/[^0-9]/g, "");
  }
  return undefined;
}

export function replaceNoNumericAndAlphabetic(text: string | undefined){
  if (text) {
    return text.replace(/[^a-zA-Z0-9]/g, "");
  }
  return undefined;
}