import GroovyParseRules from "../GroovyParseRules";
import { Parser } from "../Parser";

test("Keywords", () => {
  const parser = new Parser(`def defaultVariable = true`, GroovyParseRules);
  const result = parser.parse();
  expect(result).toMatchSnapshot();
});

export {};
