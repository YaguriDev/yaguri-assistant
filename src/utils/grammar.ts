import { getOptions } from "../config/options";

export const generateGrammar = (): string[] => {
  const options = getOptions();
  const words: string[] = [options.triggerWord];
  for (const cmd of Object.values(options.commands)) {
    words.push(...(cmd as any).aliases);
    if ((cmd as any).args) {
      for (const arg of Object.values((cmd as any).args)) {
        words.push(...(arg as any).aliases);
      }
    }
  }

  return words;
};
