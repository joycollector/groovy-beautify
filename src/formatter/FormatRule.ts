import { CodeBlock } from "../parser/Parser";
import { Formatter } from "./Formatter";

export default class FormatRule {
  matches(obj: CodeBlock): boolean {
    return true;
  }
  /* Modifies next sibling text before adding it */
  afterSelf(nextText: string, indent: number): string {
    return nextText;
  }
  /* Modifies previous sibling text before adding it */
  beforeSelf(prevText: string, indent: number): string {
    return prevText;
  }
  /* Modifies child text before adding it */
  beforeChild(childText: string, indent: number): string {
    return childText;
  }

  formatStart(obj: CodeBlock, indent: number): string {
    return obj.start ?? "";
  }

  formatEnd(obj: CodeBlock, indent: number): string {
    return obj.end ?? "";
  }

  formatChildren(parent: CodeBlock, indent: number, formatter: Formatter) {
    return (
      parent?.children?.reduce((res: string, child, i, children) => {
        const parentFormatRule = formatter.rules.find((r) => r.matches(parent));
        const prevFormatRule = formatter.rules.find((r) => r.matches(children[i - 1]));
        const nextFormatRule = formatter.rules.find((r) => r.matches(children[i + 1]));

        let childString = formatter.format(child, indent);

        if (prevFormatRule) {
          childString = prevFormatRule.afterSelf(childString, indent);
        }
        if (nextFormatRule) {
          childString = nextFormatRule.beforeSelf(childString, indent);
        }
        if (parentFormatRule) {
          childString = parentFormatRule.beforeChild(childString, indent);
        }

        res += childString;

        return res;
      }, "") || ""
    );
  }
}
