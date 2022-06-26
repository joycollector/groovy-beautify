import ParseRule from "./ParseRule";

export default [
  new ParseRule("blockcomment", { start: "/*", end: "*/", exclusive: true }),
  new ParseRule("linecomment", { start: "//", end: /(?=\n)/, exclusive: true }),
  new ParseRule("multilinestring", { start: "'''", end: "'''", exclusive: true }),
  new ParseRule("multilinestring", { start: '"""', end: '"""', exclusive: true }),
  new ParseRule("string", { start: '"', end: '"', skip: '\\"', exclusive: true }),
  new ParseRule("string", { start: "'", end: "'", skip: "\\'", exclusive: true }),
  new ParseRule("regexp", { start: /\//g, end: /\//g, skip: /\'/g, exclusive: true }),
  new ParseRule("numeric", { start: /0[xX][0-9a-fA-F]+\b/g }),
  new ParseRule("numeric", { start: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/g }),
  new ParseRule("boolean", { start: /(?:true|false)\b/g }),
  new ParseRule("block", { start: "{", end: "}" }),
  new ParseRule("square", { start: ["?[", "["], end: "]" }),
  new ParseRule("round", { start: "(", end: ")" }),
  new ParseRule("dot", { start: /((\?|\*|\&)+)?\.(?=[^\d])(\*)?/g }), // Includes dot, spread dot, method reference, safe dot, safe chain dot and import all
  new ParseRule("delimiters", { start: [",", ":", ";"] }),
  new ParseRule("incdec", { start: ["--", "++", "**"] }),
  new ParseRule("negation", { start: "!" }),
  // prettier-ignore
  new ParseRule("operators", { start: ['--', '-=', '->', '-', '::', '!==', '!=', '?:', '?=', '?', '..<', '..', '**=', '**', 
      '*=', '*', '/=', '/', '&&', '&=', '&', '%=', '%', '^=', '^', '++', '+=', '+', '<..<', '<..', '<<=', '<<', '<=>', '<=', '<', 
      '===', '==~', '==', '=~', '=', '>=', '>>=', '>>>=', '>>', '>', '|=', '||', '|', '~'] }),
  // prettier-ignore
  new ParseRule("keywords", {
    start: ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'continue', 
        'default', 'def', 'double', 'do', 'else', 'enum', 'extends', 'finally', 'final', 'float', 'for', 'goto', 'if', 
        'implements', 'import', 'instanceof', 'interface', 'int', 'long', 'native', 'new', 'package', 'private', 'protected', 
        'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throws', 'throw', 
        'transient', 'try', 'void', 'volatile', 'while', 'with'],
    wholeword: true,
  }),
  new ParseRule("identifiers", { start: /[a-zA-Z_$][a-zA-Z0-9_$]*\b/g, wholeword: true }),
];
