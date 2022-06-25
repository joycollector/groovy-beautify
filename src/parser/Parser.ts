import ParseRule, { MatchExpression } from "./ParseRule";

export type CodeBlock = {
  type: string;
  start: string;
  end?: string;
  children?: Array<CodeBlock>;
};

export class Parser {
  text: string;
  textLength: number;
  textPosition: number;
  rules: ParseRule[];

  /**
   * @param text - Text to parse
   * @param rules - Array of parsing rules. If none of specified rules match default rule with type text will be used.
   */
  constructor(text: string, rules?: ParseRule[]) {
    this.text = text;
    this.textLength = text ? text.length : 0;
    this.textPosition = 0;
    this.rules = rules || [];
  }

  scan() {
    if (this.textPosition >= this.textLength) return null;

    return this.text[this.textPosition++];
  }

  isDone() {
    return this.textPosition >= this.textLength;
  }

  move(length: number) {
    this.textPosition += length;
  }

  match(expression?: MatchExpression | MatchExpression[], wholeword?: boolean): string | undefined {
    let result;
    if (expression instanceof RegExp) {
      const modifiedExpression = new RegExp("^(" + expression.source + ")", expression.flags);
      const text = this.text.substring(this.textPosition).match(modifiedExpression)?.[0];
      if (text?.length) {
        result = text;
      }
    } else if (expression instanceof Array) {
      for (const exp of expression) {
        let match = this.match(exp);
        if (match) {
          result = match;
          break;
        }
      }
    } else if (typeof expression === "string") {
      if (this.text.substring(this.textPosition).startsWith(expression)) {
        result = expression;
      }
    }
    if (result && wholeword) {
      const prevSymbol = this.text.charAt(this.textPosition - 1);
      const nextSymbol = this.text.charAt(this.textPosition + result.length);
      if (prevSymbol.match(/[A-Za-z0-9_]/) || nextSymbol.match(/[A-Za-z0-9_]/)) {
        return undefined;
      }
    }
    return result;
  }

  matchStart(rule: ParseRule) {
    return this.match(rule.start, rule.wholeword);
  }
  matchEnd(rule: ParseRule) {
    return this.match(rule.end, rule.wholeword);
  }
  matchSkip(rule: ParseRule) {
    return this.match(rule.skip, rule.wholeword);
  }

  createDefaultTextObject(text: string) {
    return {
      type: "text",
      start: text,
    };
  }

  parse() {
    const root: CodeBlock = { type: "root", start: "" };
    const ruleStack = [] as Array<ParseRule>;
    const objStack = [root];

    while (!this.isDone()) {
      const activeRule = ruleStack[ruleStack.length - 1];
      const activeObj = objStack[objStack.length - 1];
      const activeObjLastChild = activeObj.children?.[activeObj.children.length - 1];

      if (activeRule) {
        // Check skip first
        if (activeRule.skip) {
          const activeRuleSkipText = this.matchSkip(activeRule);
          if (activeRuleSkipText) {
            // Append to existing text block or create a new one
            if (activeObjLastChild && activeObjLastChild.type === "text") {
              activeObjLastChild.start += activeRuleSkipText;
            } else {
              if (!activeObj.children) {
                activeObj.children = [];
              }
              activeObj.children.push(this.createDefaultTextObject(activeRuleSkipText));
            }
            this.move(activeRuleSkipText.length);
            continue;
          }
        }
        if (activeRule.end) {
          // Check rule end
          const activeRuleText = this.matchEnd(activeRule);
          if (activeRuleText) {
            activeObj.end = activeRuleText;
            ruleStack.pop();
            objStack.pop();
            this.move(activeRuleText.length);
            continue;
          }
        }
      }
      // Check rule start
      if (!activeRule?.exclusive) {
        const matchedRule = this.rules.find((r) => this.matchStart(r));
        if (matchedRule) {
          const matchedRuleText = this.matchStart(matchedRule);
          if (matchedRuleText) {
            const newObj = {
              type: matchedRule.name,
              start: matchedRuleText,
            };
            if (!activeObj.children) {
              activeObj.children = [];
            }
            activeObj.children.push(newObj);
            // If we need to find matched rule
            if (matchedRule.end) {
              ruleStack.push(matchedRule);
              objStack.push(newObj);
            }
            this.move(matchedRuleText.length);
            continue;
          }
        }
      }

      // Read char by char
      const ch = this.scan();
      if (ch) {
        if (activeObjLastChild && activeObjLastChild.type === "text") {
          activeObjLastChild.start += ch;
        } else {
          if (!activeObj.children) {
            activeObj.children = [];
          }
          activeObj.children.push(this.createDefaultTextObject(ch));
        }
      }
    }

    return root;
  }
}
