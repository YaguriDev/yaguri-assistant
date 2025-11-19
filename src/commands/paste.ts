import { clipboard } from "@nut-tree-fork/nut-js";
import { exec } from "child_process";

export const pasteText = async (text: string) => {
  await clipboard.setContent(text);
  await new Promise((res) => setTimeout(res, 100));
  pasteTextFunc();
};

export const pasteTextFunc = async () => {
  return new Promise<void>((resolve, reject) => {
    const cmd = `powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('^v')"`;
    exec(cmd, (err) => (err ? reject(err) : resolve()));
  });
};
