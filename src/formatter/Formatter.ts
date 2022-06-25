import { CodeBlock } from "../parser/Parser";
import FormatRule from "./FormatRule";

export class Formatter {
  rules: FormatRule[];

  constructor(rules?: FormatRule[]) {
    this.rules = rules || [];
  }

  format(obj: CodeBlock, indent = 0): string {
    let text = "";

    if (obj) {
      const formatRule = this.rules.find((r) => r.matches(obj));
      if (obj.start) {
        if (formatRule) {
          text += formatRule.formatStart(obj, indent);
        }
      }

      if (formatRule) {
        text += formatRule.formatChildren(obj, indent, this);
      }

      if (obj.end) {
        if (formatRule) {
          text += formatRule.formatEnd(obj, indent);
        }
      }
    }
    return text;
  }
}
