import fs from "fs";
import path from "path";
import { getRequestConfig } from "next-intl/server";
import { getLocale } from "./locale";
import type { MessageTree, SupportedLocale } from "@/types/i18n.types";

const MESSAGES_DIRECTORY = path.join(process.cwd(), "src/i18n/messages");

const isPlainObject = (value: unknown): value is MessageTree =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const kebabToCamelCase = (text: string): string =>
  text.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

const deepMerge = (target: MessageTree, source: MessageTree): MessageTree => {
  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];
    target[key] =
      isPlainObject(sourceValue) && isPlainObject(targetValue)
        ? deepMerge(targetValue, sourceValue)
        : sourceValue;
  }
  return target;
};

const loadAllMessages = (locale: SupportedLocale): MessageTree => {
  const messageTree: MessageTree = {};
  const allFiles = fs.readdirSync(MESSAGES_DIRECTORY, {
    recursive: true,
    encoding: "utf-8",
  });

  for (const relativePath of allFiles) {
    if (!relativePath.endsWith(`${locale}.json`)) continue;

    let fileContent: MessageTree;
    try {
      const absolutePath = path.join(MESSAGES_DIRECTORY, relativePath);
      fileContent = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
    } catch {
      continue;
    }

    const directorySegments = relativePath.split(path.sep).slice(0, -1);
    const segmentsWithoutMain =
      directorySegments[0] === "main"
        ? directorySegments.slice(1)
        : directorySegments;
    const namespacePath = segmentsWithoutMain.map(kebabToCamelCase);

    let currentNode = messageTree;
    for (const parentKey of namespacePath.slice(0, -1)) {
      if (!isPlainObject(currentNode[parentKey])) currentNode[parentKey] = {};
      currentNode = currentNode[parentKey] as MessageTree;
    }

    const finalKey = namespacePath.at(-1);
    if (finalKey === undefined) {
      deepMerge(currentNode, fileContent);
    } else {
      const existingNode = currentNode[finalKey];
      currentNode[finalKey] = isPlainObject(existingNode)
        ? deepMerge(existingNode, fileContent)
        : fileContent;
    }
  }

  return messageTree;
};

export default getRequestConfig(async () => {
  const locale = await getLocale();
  return { locale, messages: loadAllMessages(locale) };
});
