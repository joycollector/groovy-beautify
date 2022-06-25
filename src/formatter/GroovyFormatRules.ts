import { CodeBlock } from "../parser/Parser";
import FormatRule from "./FormatRule";

class BlockFormatRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "block";
  }

  beforeChild(childText: string, indent: number): string {
    const trimmedText = trimSpacesAndTabsRight(childText);
    if (trimmedText.endsWith("\n")) {
      return padRight(trimmedText, indent);
    } else {
      return childText;
    }
  }

  beforeSelf(prevText: string) {
    const trimmedText = trimSpacesAndTabsRight(prevText);
    if (trimmedText.endsWith("\n")) {
      return trimmedText;
    } else {
      return prevText.trimEnd() + " ";
    }
  }

  formatStart(cb: CodeBlock) {
    return cb.start + "\n";
  }

  formatEnd(cb: CodeBlock, indent: number) {
    return "\n" + (cb.end ? padLeft(cb.end, indent) : "");
  }

  formatChildren(cb: CodeBlock, indent: number) {
    const blockText = super.formatChildren(cb, indent + 1);
    return padLeft(blockText.trim(), indent + 1);
  }
}

class RoundFormatRule extends FormatRule {
  matches(cb: CodeBlock) {
    return cb?.type === "round";
  }

  formatChildren(obj: CodeBlock, indent: number) {
    return super.formatChildren(obj, indent).trim();
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

export default [BlockFormatRule, RoundFormatRule, DotSyntaxFormatRule, KeywordRule, OperatorsRule, DelimitersRule, FormatRule];
