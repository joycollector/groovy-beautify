import { Formatter } from "../Formatter";
import GroovyFormatRules from "../GroovyFormatRules";

test("Basic formatting", () => {
  const object = {
    type: "block",
    start: "{",
    end: "}",
    children: [
      { start: "if", type: "keywords" },
      { start: "(", end: ")", type: "round", children: [{ start: "text", type: "true" }] },
      { start: "{", end: "}", type: "block", children: [{ start: "test", type: "true" }] },
    ],
  };
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(object);
  expect(formattingResult).toMatchSnapshot();
});

test("New line and tabs format", () => {
  const object = {
    type: "block",
    start: "{",
    end: "}",
    children: [
      { start: "    ", type: "text" },
      { start: "def", type: "keywords" },
      { start: "\n\t", type: "text" },
      { start: "variable", type: "identifiers" },
      { start: " ", type: "text" },
      { start: "=", type: "operators" },
      { start: "true", type: "text" },
    ],
  };
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(object);
  expect(formattingResult).toMatchSnapshot();
});

export {};
