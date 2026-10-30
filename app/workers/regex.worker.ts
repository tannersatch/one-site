import { evaluateRegex } from "../utils/regexTester";
import type { RegexRequest, RegexResponse } from "../utils/regexTester";

self.addEventListener("message", (event: MessageEvent<RegexRequest>) => {
  let response: RegexResponse;
  try {
    response = { result: evaluateRegex(event.data) };
  } catch (error) {
    response = { error: error instanceof Error ? error.message : "Unable to evaluate expression." };
  }
  self.postMessage(response);
});
