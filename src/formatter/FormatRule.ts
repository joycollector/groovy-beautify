import { CodeBlock } from "../parser/types";
import { trimSpacesAndTabsRight } from "../utils/text";
import { Formatter } from "./Formatter";

export default class FormatRule {
  formatter: Formatter;

  constructor(formatter: Formatter) {
    this.formatter = formatter;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  matches(cb: CodeBlock, siblings?: CodeBlock[]): boolean {
    return true;
  }

  /* Modifies next sibling text before adding it */

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  afterSelf(nextText: string, indent: number): string {
    return nextText;
  }

  /* Modifies previous sibling text before adding it */

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  beforeSelf(prevText: string, indent: number, newLine: boolean): string {
    return prevText;
  }

  /* Modifies child text before adding it */

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  beforeChild(childText: string, indent: number): string {
    return childText;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  formatStart(cb: CodeBlock, indent: number): string {
    return cb.start ?? "";
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  formatEnd(cb: CodeBlock, indent: number): string {
    return cb.end ?? "";
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
        if (parentFormatRule) {
          childString = parentFormatRule.beforeChild(childString, indent);
        }
        if (nextFormatRule) {
          const trimmed = trimSpacesAndTabsRight(res + childString);
          const newLine = !trimmed.length || trimSpacesAndTabsRight(res + childString).endsWith("\n");
          childString = nextFormatRule.beforeSelf(childString, indent, newLine);
        }

        const lastLineLength = res.split("\n").at(-1)?.length ?? 0;
        const childFirstLineLength = childString.split("\n").at(0)?.length ?? 0;
        if (lastLineLength + childFirstLineLength > this.formatter.options.width && childFormatRule?.allowBreak(child)) {
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
