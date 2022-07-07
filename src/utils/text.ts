export function padLeft(text: string, indent: number) {
  return "".padStart(indent * 4) + text;
}
export function padRight(text: string, indent: number) {
  return text + "".padStart(indent * 4);
}
export function trimSpacesAndTabsLeft(text: string) {
  return text.replace(/^( |\t)+/, "");
}
export function trimSpacesAndTabsRight(text: string) {
  return text.replace(/( |\t)+$/, "");
}
