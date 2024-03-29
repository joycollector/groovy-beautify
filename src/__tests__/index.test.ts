import { Parser } from "../parser/Parser";
import GroovyParseRules from "../parser/GroovyParseRules";
import { Formatter } from "../formatter/Formatter";
import GroovyFormatRules from "../formatter/GroovyFormatRules";

const TEST_SCRIPT = `def bumpVersion(String target,    String version_type, Boolean reset =   false) {    def
versionMap =
['major':0, 'minor' : 1, 'patch':   2]
            def versionArray = target.findAll(/\\d+\\.\\d+\\.\\d+/)[0].tokenize('.')
        try
{        def   index =     versionMap.get(version_type);
versionArray[index] =versionArray[index]
.toInteger() + 1
if(   !reset )
{
    for(int i=2;i>index;     i--) {
        versionArray[i]    =    0            }        }
} catch(       Exception e) {        println("Unrecognized version type \\"version_type\\" (should be major, minor or patch)")    }
return             versionArray.join(                   '.'                       )
}
    println(bumpVersion('1.2.3', 'minor', true))`;

test("Parsing and formatting", () => {
  const parser = new Parser(TEST_SCRIPT, GroovyParseRules);
  const parsingResult = parser.parse();
  expect(parsingResult).toMatchSnapshot();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("Multiline Strings", () => {
  const code = `
if (true) {
def string1 = '''Some
multiline
String'''
def string2 = """Some
multiline
String"""
}`;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("Long string with operators", () => {
  const code =
    "if(true){def a = 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + " +
    "1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + " +
    "1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + " +
    "1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + " +
    "1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + " +
    "1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + " +
    "1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + " +
    "1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1;}";
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("Multiline in square", () => {
  const code = `{
  def matrix = [
    -0.998, -0.070, 127256.994, 
                    0.070, -0.998, 72627.371]
  }`;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("Nested round", () => {
  const code = `
    if (pathObject.hasChildren()) {
      newObject.addPathObjects(pathObject.getChildObjects().collect({transformObject(it, transform)}))
    }
   `;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("Line comment", () => {
  const code = `{
    def shape = PathROIToolsAwt.getShape(roi) // Comment
    shape2 = transform.createTransformedShape(shape)
}`;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("Chained invocation", () => {
  const code = `{if (!reset) 
  {
    def variable = test
    .test
     .test
  }}`;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("If without brackets", () => {
  const code = `{if (true) a = 1
    def b = 1}`;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  expect(parsingResult).toMatchSnapshot();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

test("Try/Catch", () => {
  const code = `try { a = 1; } catch (Exception e) { a = 2; }`;
  const parser = new Parser(code, GroovyParseRules);
  const parsingResult = parser.parse();
  expect(parsingResult).toMatchSnapshot();
  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

export {};
