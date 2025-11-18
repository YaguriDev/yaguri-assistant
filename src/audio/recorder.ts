import { spawn } from "child_process";
import { logger } from "../utils/logger";
import path from "path";

const FFMPEG_BIN = path.resolve("./src/bin/ffmpeg.exe");

export const startRecorder = (micName: string, onData: (chunk: Buffer) => void) => {
  const ffmpeg = spawn(FFMPEG_BIN, ["-f", "dshow", "-i", `audio=${micName}`, "-ar", "16000", "-ac", "1", "-f", "s16le", "-"]);

  ffmpeg.stdout.on("data", onData);

  ffmpeg.on("close", (code) => {
    logger(`Recorder (ffmpeg) closed with code ${code}`);
  });

  ffmpeg.on("error", (err) => {
    logger(`Recorder error: ${err}`);
  });

  const stop = () => {
    ffmpeg.kill("SIGINT");
    logger("Recorder stopped");
  };

  return { stop };
};
