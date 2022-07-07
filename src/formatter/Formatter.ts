import { CodeBlock } from "../parser/types";
import FormatRule from "./FormatRule";

export type FormatterOptions = {
  width: number;
};

export class Formatter {
  rules: FormatRule[];
  options: FormatterOptions;

  constructor(rules?: Array<typeof FormatRule>, options?: FormatterOptions) {
    this.rules = rules?.map((r) => new r(this)) || [];
    this.options = options || { width: 80 };
  }

  format(obj: CodeBlock, indent = 0): string {
    let text = "";

    if (obj) {
      const formatRule = this.rules.find((r) => r.matches(obj));
      if (obj.start !== undefined) {
        if (formatRule) {
          text += formatRule.formatStart(obj, indent);
        }
      }

      if (formatRule) {
        text += formatRule.formatChildren(obj, indent);
      }

      if (obj.end !== undefined) {
        if (formatRule) {
          text += formatRule.formatEnd(obj, indent);
        }
      }
    }
    return text;
  }
}
