import { CodeBlock } from "../parser/Parser";
import { Formatter } from "./Formatter";

export default class FormatRule {
  formatter: Formatter;

  constructor(formatter: Formatter) {
    this.formatter = formatter;
  }

  matches(cb: CodeBlock): boolean {
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

  formatStart(cb: CodeBlock, indent: number): string {
    return cb.start ?? "";
  }

  formatEnd(cb: CodeBlock, indent: number): string {
    return cb.end ?? "";
  }

  allowBreak(cb: CodeBlock) {
    return false;
  }

  formatChildren(parent: CodeBlock, indent: number) {
    return (
      parent?.children?.reduce((res: string, child, i, children) => {
        const childFormatRule = this.formatter.rules.find((r) => r.matches(child));
        const parentFormatRule = this.formatter.rules.find((r) => r.matches(parent));
        const prevFormatRule = this.formatter.rules.find((r) => r.matches(children[i - 1]));
        const nextFormatRule = this.formatter.rules.find((r) => r.matches(children[i + 1]));

        let childString = this.formatter.format(child, indent);

        if (prevFormatRule) {
          childString = prevFormatRule.afterSelf(childString, indent);
        }
        if (nextFormatRule) {
          childString = nextFormatRule.beforeSelf(childString, indent);
        }
        if (parentFormatRule) {
          childString = parentFormatRule.beforeChild(childString, indent);
        }

        const lastLineLength = res.split("\n").at(-1)?.length ?? 0;
        const childFisrtLineLength = childString.split("\n").at(0)?.length ?? 0;
        if (lastLineLength + childFisrtLineLength > this.formatter.options.width && childFormatRule?.allowBreak(child)) {
          childString = "\n" + childString.trimStart();
          if (parentFormatRule) {
            childString = parentFormatRule.beforeChild(childString, indent + 1);
          }
        }
        res += childString;

        return res;
      }, "") || ""
    );
  }
}
