import { CodeBlock } from "./types";

export type MatchExpression = RegExp | string | ((currentBlock: CodeBlock, currentText: string) => string | undefined);

export default class ParseRule {
  name: string;
  exclusive = false;
  wholeword = false;
  start: MatchExpression | MatchExpression[];
  skip?: MatchExpression | MatchExpression[];
  end?: MatchExpression | MatchExpression[];

  constructor(
    name: string,
    options: {
      exclusive?: boolean;
      wholeword?: boolean;
      start: MatchExpression | MatchExpression[];
      end?: MatchExpression | MatchExpression[];
      skip?: MatchExpression | MatchExpression[];
    }
  ) {
    this.name = name;
    this.exclusive = !!options.exclusive;
    this.wholeword = !!options.wholeword;
    this.start = options.start;
    this.skip = options.skip;
    this.end = options.end;
  }
}
