import { CodeBlock } from "../parser/Parser";
import FormatRule from "./FormatRule";

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

  formatChildren(cb: CodeBlock, indent: number) {
    let blockText = super.formatChildren(cb, indent + 1);
    blockText = blockText.trim();
    return "\n" + padLeft(blockText, indent + 1) + "\n";
  }
}

class BlockFormatRule extends BaseBlockRule {
  matches(cb: CodeBlock) {
    return cb?.type === "block";
  }

  beforeSelf(prevText: string) {
    const trimmedText = trimSpacesAndTabsRight(prevText);
    if (trimmedText.endsWith("\n")) {
      return trimmedText;
    } else {
      return prevText.trimEnd() + " ";
    }
  }

  formatEnd(cb: CodeBlock, indent: number) {
    return cb.end ? padLeft(cb.end, indent) : "";
  }
}

class InlineBlockFormatRule extends BaseBlockRule {
  matches(cb: CodeBlock) {
    return cb?.type === "round" || cb?.type === "square";
  }

  beforeSelf(prevText: string) {
    const trimmedText = trimSpacesAndTabsRight(prevText);
    if (trimmedText.endsWith("\n")) {
      return trimmedText;
    } else {
      return prevText;
    }
  }

  formatChildren(obj: CodeBlock, indent: number) {
    let blockText = super.formatChildren(obj, indent);
    if (blockText.trim().includes("\n")) {
      return blockText;
    } else {
      return blockText.trim();
    }
  }
}

class DotSyntaxFormatRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "dot";
  }
  beforeSelf(prevText: string, indent: number): string {
    const trimmedText = trimSpacesAndTabsRight(prevText);
    if (trimmedText.endsWith("\n")) {
      return padRight(trimmedText, indent + 1);
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

  beforeSelf(prevText: string): string {
    const trimmedText = trimSpacesAndTabsRight(prevText);
    if (trimmedText.endsWith("\n")) {
      return trimmedText;
    } else {
      return trimmedText + " ";
    }
  }

  afterSelf(nextText: string): string {
    return " " + nextText.trimStart();
  }

  allowBreak(): boolean {
    return true;
  }
}

function padLeft(text: string, indent: number) {
  return "".padStart(indent * 4) + text;
}
function padRight(text: string, indent: number) {
  return text + "".padStart(indent * 4);
}

function trimSpacesAndTabsLeft(text: string) {
  return text.replace(/^( |\t)+/, "");
}
function trimSpacesAndTabsRight(text: string) {
  return text.replace(/( |\t)+$/, "");
}

export default [BlockFormatRule, InlineBlockFormatRule, DotSyntaxFormatRule, KeywordRule, OperatorsRule, DelimitersRule, FormatRule];
