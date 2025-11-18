import fs from "fs";
import DEFAULT_OPTIONS from "./default_options.json";
import path from "path";

const OPTIONS_PATH = path.resolve("./src/config/options.json");

export type Options = typeof DEFAULT_OPTIONS;

let options: Options;

export const initOptions = () => {
  if (!fs.existsSync(OPTIONS_PATH)) {
    fs.writeFileSync(OPTIONS_PATH, JSON.stringify(DEFAULT_OPTIONS, null, 2));
  }
  options = JSON.parse(fs.readFileSync(OPTIONS_PATH, "utf-8"));
};

export const getOptions = () => options;

export const saveOptionField = (field: string, value: any) => {
  (options as Record<string, any>)[field] = value;
  fs.writeFileSync(OPTIONS_PATH, JSON.stringify(options, null, 2));
};
