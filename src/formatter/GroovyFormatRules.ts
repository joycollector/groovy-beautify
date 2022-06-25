import { CodeBlock } from "../parser/Parser";
import FormatRule from "./FormatRule";
import { Formatter } from "./Formatter";

class BlockFormatRule extends FormatRule {
  matches(obj: CodeBlock) {
    return obj?.type === "block";
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

  formatStart(obj: CodeBlock) {
    return obj.start + "\n";
  }

  formatEnd(obj: CodeBlock, indent: number) {
    return "\n" + (obj.end ? padLeft(obj.end, indent) : "");
  }

  formatChildren(obj: CodeBlock, indent: number, formatter: Formatter) {
    const blockText = super.formatChildren(obj, indent + 1, formatter);
    return padLeft(blockText.trim(), indent + 1);
  }
}

class RoundFormatRule extends FormatRule {
  matches(obj: CodeBlock) {
    return obj?.type === "round";
  }

  formatChildren(obj: CodeBlock, indent: number, formatter: Formatter) {
    return super.formatChildren(obj, indent, formatter).trim();
  }
}

class DotSyntaxFormatRule extends FormatRule {
  matches(obj: CodeBlock) {
    return obj?.type === "dot";
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

class SingleSpacesBeforeAndAfterFormatRule extends FormatRule {
  matches(obj: CodeBlock) {
    return obj?.type === "operators";
  }

  beforeSelf(prevText: string): string {
    return trimSpacesAndTabsRight(prevText);
  }

  afterSelf(nextText: string): string {
    return trimSpacesAndTabsLeft(nextText);
  }

  formatStart(obj: CodeBlock) {
    return " " + obj.start.trim() + " ";
  }
}

class SingleSpaceAfterFormatRule extends FormatRule {
  matches(obj: CodeBlock) {
    return obj?.type === "keywords" || obj?.type === "delimiters";
  }

  beforeSelf(prevText: string): string {
    return trimSpacesAndTabsRight(prevText);
  }

  afterSelf(nextText: string): string {
    return trimSpacesAndTabsLeft(nextText);
  }

  formatStart(obj: CodeBlock) {
    return obj.start.trim() + " ";
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

export default [
  new BlockFormatRule(),
  new RoundFormatRule(),
  new DotSyntaxFormatRule(),
  new SingleSpacesBeforeAndAfterFormatRule(),
  new SingleSpaceAfterFormatRule(),
  new FormatRule(),
];
