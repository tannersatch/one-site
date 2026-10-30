import { formatJson } from "./jsonFormatter.ts";

export class TypeNameError extends Error {
  constructor() {
    super("Use a type name starting with an uppercase letter, followed by letters, numbers, or underscores.");
    this.name = "TypeNameError";
  }
}

export async function jsonToTypeScript(source: string, rootName = "Root"): Promise<string> {
  if (!source.trim()) return "";
  const name = rootName.trim();
  if (!/^[A-Z][A-Za-z0-9_]*$/.test(name)) {
    throw new TypeNameError();
  }

  const json = formatJson(source, { minify: true });
  const { InputData, jsonInputForTargetLanguage, quicktype } = await import("quicktype-core");
  const input = jsonInputForTargetLanguage("typescript");
  await input.addSource({ name: "Sample", samples: [`{"value":${json}}`] });
  const inputData = new InputData();
  inputData.addInput(input);

  const result = await quicktype({
    inputData,
    lang: "typescript",
    inferEnums: false,
    inferDateTimes: false,
    inferIntegerStrings: false,
    inferBooleanStrings: false,
    indentation: "  ",
    rendererOptions: {
      "just-types": "true",
      "prefer-unions": "true",
      "explicit-unions": "true",
      "prefer-unknown": "true",
    },
  });

  const definitions = result.lines.map(line => line ? `  ${line}` : "").join("\n").trimEnd();
  return `export type ${name} = ${name}Types.Sample["value"];\n\nexport namespace ${name}Types {\n${definitions}\n}\n`;
}
