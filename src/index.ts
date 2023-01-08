import { Parser } from "./parser/Parser";
import GroovyParseRules from "./parser/GroovyParseRules";
import { Formatter, FormatterOptions } from "./formatter/Formatter";
import GroovyFormatRules from "./formatter/GroovyFormatRules";

export default function (groovyCode: string, options?: FormatterOptions): string {
  const parser = new Parser(groovyCode, GroovyParseRules);
  const parsingResult = parser.parse();
  const formatter = new Formatter(GroovyFormatRules, options);
  return formatter.format(parsingResult);
}
