import GroovyParseRules from "../GroovyParseRules";
import { Parser } from "../Parser";

test("Keywords", () => {
  const parser = new Parser(`def defaultVariable = true`, GroovyParseRules);
  const result = parser.parse();
  expect(result).toMatchSnapshot();
});

test("String escaping", () => {
  const code = `"Hello \\"World\\"!"`;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  expect(parsingResult).toMatchSnapshot();
});

export {};
