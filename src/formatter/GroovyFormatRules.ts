import { CodeBlock } from "../parser/types";
import { padLeft, padRight, trimSpacesAndTabsLeft, trimSpacesAndTabsRight } from "../utils/text";
import FormatRule from "./FormatRule";

class RootFormatRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "root";
  }

  beforeChild(childText: string, indent: number): string {
    let text = childText;
    const trimmedRight = trimSpacesAndTabsRight(text);
    if (trimmedRight.endsWith("\n")) {
      text = trimmedRight;
    }
    return text;
  }
}

class BaseBlockRule extends FormatRule {
  beforeChild(childText: string, indent: number): string {
    let text = childText;
    const trimmedLeft = trimSpacesAndTabsLeft(text);
    if (trimmedLeft.startsWith("\n")) {
      text = "\n" + padLeft(trimmedLeft.trimStart(), indent);
    }
    const trimmedRight = trimSpacesAndTabsRight(text);
    if (trimmedRight.endsWith("\n")) {
      text = padRight(trimmedRight, indent);
    }
    return text;
  }
}

class BlockFormatRule extends BaseBlockRule {
  matches(cb: CodeBlock) {
    return cb?.type === "block";
  }

  beforeSelf(prevText: string, indent: number, newLine: boolean) {
    if (!newLine) {
      return prevText.trimEnd() + " ";
    } else {
      return prevText;
    }
  }

  formatEnd(cb: CodeBlock, indent: number) {
    return cb.end ? padLeft(cb.end, indent) : "";
  }

  formatChildren(cb: CodeBlock, indent: number) {
    let blockText = super.formatChildren(cb, indent + 1);
    blockText = blockText.trim();
    return "\n" + padLeft(blockText, indent + 1) + "\n";
  }
}

class KeywordBlockFormatRule extends BlockFormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "keywordblock";
  }

  formatStart(cb: CodeBlock, indent: number) {
    return "{";
  }

  formatEnd(cb: CodeBlock, indent: number) {
    return padLeft("}\n", indent);
  }
}

class InlineBlockFormatRule extends BaseBlockRule {
  matches(cb: CodeBlock) {
    return cb?.type === "round" || cb?.type === "square";
  }

  isMultiline(cb: CodeBlock) {
    return cb.children?.some((child) => child.start?.includes("\n"));
  }

  beforeSelf(prevText: string, indent: number, newLine: boolean) {
    if (newLine) {
      return trimSpacesAndTabsRight(prevText);
    } else {
      return prevText;
    }
  }

  formatEnd(cb: CodeBlock, indent: number) {
    if (this.isMultiline(cb)) {
      return cb.end ? padLeft(cb.end, indent) : "";
    } else {
      return cb.end ?? "";
    }
  }

  formatChildren(cb: CodeBlock, indent: number) {
    if (this.isMultiline(cb)) {
      let blockText = super.formatChildren(cb, indent + 1);
      blockText = blockText.trim();
      return "\n" + padLeft(blockText, indent + 1) + "\n";
    } else {
      let blockText = super.formatChildren(cb, indent);
      return blockText.trim();
    }
  }
}

class DotSyntaxFormatRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "dot";
  }
  beforeSelf(prevText: string, indent: number, newLine: boolean): string {
    if (newLine) {
      return padRight(trimSpacesAndTabsRight(prevText), indent + 1);
    } else {
      return prevText;
    }
  }
}

class OperatorsRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "operators";
  }

  beforeSelf(prevText: string): string {
    return trimSpacesAndTabsRight(prevText) + " ";
  }

  afterSelf(nextText: string): string {
    return " " + nextText.trimStart();
  }

  allowBreak(): boolean {
    return true;
  }
}

class DelimitersRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "delimiters";
  }

  beforeSelf(prevText: string): string {
    return trimSpacesAndTabsRight(prevText);
  }

  afterSelf(nextText: string): string {
    return " " + trimSpacesAndTabsLeft(nextText);
  }
}

class KeywordRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "keywords";
  }

  beforeSelf(prevText: string, indent: number, newLine: boolean): string {
    if (!newLine) {
      return prevText.trimEnd() + " ";
    } else {
      return prevText;
    }
  }

  afterSelf(nextText: string): string {
    return " " + nextText.trimStart();
  }

  allowBreak(): boolean {
    return true;
  }
}

export default [
  RootFormatRule,
  BlockFormatRule,
  KeywordBlockFormatRule,
  InlineBlockFormatRule,
  DotSyntaxFormatRule,
  KeywordRule,
  OperatorsRule,
  DelimitersRule,
  FormatRule,
];
