export const logger = (msg: string, withPrefix = true) => {
  console.log(`${withPrefix ? "[YH] " : ""}${msg}`);
};
