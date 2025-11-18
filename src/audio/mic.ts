import { spawn } from "child_process";
import readline from "readline";
import { logger } from "../utils/logger";
import { saveOptionField } from "../config/options";
import path from "path";

const FFMPEG_BIN = path.resolve("./src/bin/ffmpeg.exe");

export const listMics = (): Promise<string[]> =>
  new Promise((resolve) => {
    const devices: string[] = [];
    const ffmpegList = spawn(FFMPEG_BIN, ["-list_devices", "true", "-f", "dshow", "-i", "dummy"]);

    ffmpegList.stderr.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        const match = line.match(/"(.+?)"/);
        if (match && !line.includes("Alternative name")) devices.push(match[1]);
      });
    });

    ffmpegList.on("close", () => resolve(devices));
  });

export const chooseMic = async (): Promise<string> => {
  const mics = await listMics();
  if (mics.length === 0) {
    logger("Microphone devices not found");
    process.exit(1);
  }

  logger("Choose a microphone device:");
  mics.forEach((mic, i) => console.log(`${i}: ${mic}`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("Enter the number of the device: ", (answer) => {
      const index = parseInt(answer);
      rl.close();
      if (isNaN(index) || index < 0 || index >= mics.length) {
        logger("Invalid selection");
        process.exit(1);
      }
      saveOptionField("mic", mics[index]);
      resolve(mics[index]);
    });
  });
};
