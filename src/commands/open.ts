import { spawn } from "child_process";
import { logger } from "../utils/logger";

export const openApp = (app: string) => {
  const child = spawn(app, { shell: true });
  child.on("error", (err) => logger(`App launch error: ${err}`));
};
