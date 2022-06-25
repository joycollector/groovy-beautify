import { Parser } from "../parser/Parser";
import GroovyParseRules from "../parser/GroovyParseRules";
import { Formatter } from "../formatter/Formatter";
import GroovyFormatRules from "../formatter/GroovyFormatRules";

const TEST_SCRIPT = `
  def bumpVersion(String target,    String version_type, Boolean reset =   false) {    def
	versionMap =
['major':0, 'minor' : 1, 'patch':   2]
def versionArray = target.findAll(/\d+\.\d+\.\d+/)[0].tokenize('.')
try
{        def   index =     versionMap.get(version_type);
	versionArray[index] =versionArray[index].toInteger() + 1
	if(   reset )
	{
		for(int i=2;i>index;     i--) {
			versionArray[i]    =    0            }        }
} catch(       Exception e) {        println("Unrecognized version type \\"version_type\\" (should be major, minor or patch)")    }
return             versionArray.join(                   '.'                       )
}

println(bumpVersion('1.2.3', 'minor', true))
`;

test("Parsing and formatting", () => {
  const parser = new Parser(TEST_SCRIPT, GroovyParseRules);
  const parsingResult = parser.parse();
  expect(parsingResult).toMatchSnapshot();

  const formatter = new Formatter(GroovyFormatRules);
  const formattingResult = formatter.format(parsingResult);
  expect(formattingResult).toMatchSnapshot();
});

export {};
