import { pasteText } from "./paste";
import { openApp } from "./open";

export const commandHandlers: Record<string, any> = {
  paste: pasteText,
  open: openApp,
  // Add more commands here
};
