import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";

const TTS_BIN = path.resolve("./src/tts/piper.exe");
const FFPLAY_BIN = path.resolve("./src/bin/ffplay.exe");

let isSpeaking = false;
const queue: { text: string; voice: string; debug: boolean }[] = [];

export const clearTTSTempFiles = () => {
  const dir = path.resolve("./src/tts");

  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.startsWith("tmp_") && file.endsWith(".wav")) {
      try {
        fs.unlinkSync(path.join(dir, file));
      } catch {}
    }
  }
};

export const speak = (text: string, voice: string, debug: boolean) => {
  queue.push({ text, voice, debug });
  processQueue();
};

const processQueue = () => {
  if (isSpeaking || queue.length === 0) return;

  const item = queue.shift();
  if (!item) return;

  const { text, voice, debug } = item;
  const modelPath = path.resolve(`./src/tts/${voice}.onnx`);

  if (!fs.existsSync(modelPath)) {
    console.error("[TTS] Model not found:", modelPath);
    return processQueue();
  }

  if (debug) logger(text);
  isSpeaking = true;

  const tmpFile = path.resolve("./src/tts", `tmp_${Date.now()}.wav`);

  const tts = spawn(TTS_BIN, ["-m", modelPath, "-f", tmpFile], {
    stdio: ["pipe", "ignore", "pipe"],
  });

  tts.stdin.write(text);
  tts.stdin.end();

  tts.on("error", (e) => {
    console.error("[TTS ERROR]", e);
    isSpeaking = false;
    processQueue();
  });

  tts.on("close", () => {
    if (fs.existsSync(tmpFile) && fs.statSync(tmpFile).size > 0) {
      const player = spawn(FFPLAY_BIN, ["-nodisp", "-autoexit", tmpFile]);
      player.on("close", () => {
        fs.unlinkSync(tmpFile);
        isSpeaking = false;
        processQueue();
      });
    } else {
      console.error("[TTS] WAV not created!");
      isSpeaking = false;
      processQueue();
    }
  });
};
