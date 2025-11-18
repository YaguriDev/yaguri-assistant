import { keyboard, Key, clipboard } from "@nut-tree-fork/nut-js";

export const pasteText = async (text: string) => {
  await clipboard.setContent(text);

  await new Promise((res) => setTimeout(res, 100));

  await keyboard.pressKey(Key.LeftControl);
  await keyboard.pressKey(Key.V);

  await keyboard.releaseKey(Key.V);
  await keyboard.releaseKey(Key.LeftControl);

  await new Promise((res) => setTimeout(res, 20));
};
