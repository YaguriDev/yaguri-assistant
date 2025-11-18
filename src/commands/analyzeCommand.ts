import { getOptions } from "../config/options";
import { commandHandlers } from "./index";
import { speak } from "../tts/tts";
import { logger } from "../utils/logger";

export const analyzeCommand = async (text: string) => {
  const options = getOptions();
  if (!text.toLowerCase().startsWith(options.triggerWord.toLowerCase())) return;

  if (options.debug) logger(`\n> ${text}`, false);

  const rest = text.slice(options.triggerWord.length).trim().toLowerCase();
  const [cmdWord, ...argsWords] = rest.split(" ");
  const argsText = argsWords.join(" ");

  let commandEntry: any;
  for (const cmd of Object.values(options.commands)) {
    if ((cmd as any).aliases.map((a: string) => a.toLowerCase()).includes(cmdWord)) {
      commandEntry = cmd;
      break;
    }
  }

  if (!commandEntry) {
    logger(`> Command not recognized: ${cmdWord}`, false);
    return;
  }

  if (commandEntry.args) {
    let argEntry: any;
    for (const arg of Object.values(commandEntry.args) as any[]) {
      if ((arg.aliases || []).some((a: string) => argsText.includes(a.toLowerCase()))) {
        argEntry = arg;
        break;
      }
    }

    if (!argEntry) {
      logger(`  Argument not recognized: ${argsText}`, false);
      return;
    }

    if (options.voice && argEntry.tts) speak(argEntry.tts, options.voice, options.debug);

    if (argEntry.action === "text" && argEntry.value) {
      await commandHandlers.paste(argEntry.value);
    } else if (argEntry.action) {
      await commandHandlers.open(argEntry.action);
    }
  } else {
    if (commandEntry.action) {
      await commandEntry.action();
    }
  }
};
