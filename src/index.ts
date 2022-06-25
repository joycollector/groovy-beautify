import { Parser } from "./parser/Parser";
import GroovyParseRules from "./parser/GroovyParseRules";
import { Formatter } from "./formatter/Formatter";
import GroovyFormatRules from "./formatter/GroovyFormatRules";

export default function (groovyCode: string) {
  const parser = new Parser(groovyCode, GroovyParseRules);
  const parsingResult = parser.parse();

  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);

  return formattingResult;
}
