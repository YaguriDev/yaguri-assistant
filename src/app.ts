import { initOptions, getOptions } from "./config/options";
import { logger } from "./utils/logger";
import { chooseMic } from "./audio/mic";
import { startRecorder } from "./audio/recorder";
import { Model, Recognizer, setLogLevel } from "vosk";
import { generateGrammar } from "./utils/grammar";
import { analyzeCommand } from "./commands/analyzeCommand";
import path from "path";
import { clearTTSTempFiles } from "./tts/tts";

export const startApp = async () => {
  initOptions();
  const options = getOptions();
  logger("Options initialized");

  clearTTSTempFiles();
  logger("Temporary TTS files cleared");

  setLogLevel(options.debug ? 0 : -1);
  const model = new Model(path.resolve(`./src/models/${options.model}`));
  const rec = new Recognizer({ model, sampleRate: 16000, grammar: generateGrammar() });
  rec.setWords(true);
  logger("Model and recognizer loaded");

  const micName = options.mic || (await chooseMic());
  logger(`Using microphone: ${micName}`);

  const recorder = startRecorder(micName, async (chunk: Buffer) => {
    if (rec.acceptWaveform(chunk)) {
      const res = rec.result() as { text: string };
      if (res.text) {
        await analyzeCommand(res.text);
      }
    }
  });

  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, () => {
      logger("Shutting down...");
      recorder.stop();
      rec.free();
      model.free();
      process.exit();
    })
  );

  logger("Yaguri assistant started");
};
