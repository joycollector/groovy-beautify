import ParseRule from "./ParseRule";

export default [
  new ParseRule("blockcomment", { start: "/*", end: "*/", exclusive: true }),
  new ParseRule("linecomment", { start: "//", end: /.(?=\n)/g, exclusive: true }),
  new ParseRule("multilinestring", { start: "'''", end: "'''", exclusive: true }),
  new ParseRule("multilinestring", { start: '"""', end: '"""', exclusive: true }),
  new ParseRule("string", { start: '"', end: '"', skip: '\\"', exclusive: true }),
  new ParseRule("string", { start: "'", end: "'", skip: "\\'", exclusive: true }),
  new ParseRule("regexp", { start: /\//g, end: /\//g, skip: /\'/g, exclusive: true }),
  new ParseRule("block", { start: "{", end: "}" }),
  new ParseRule("square", { start: ["?[", "["], end: "]" }),
  new ParseRule("round", { start: "(", end: ")" }),
  new ParseRule("dot", { start: /((\?|\*|\&)+)?\.(?=[^\d])/g }), // Includes dot, spread dot, method reference, safe dot and safe chain dot
  new ParseRule("delimiters", { start: [",", ":", ";"] }),
  new ParseRule("incdec", { start: ["--", "++", "**"] }),
  // prettier-ignore
  new ParseRule("operators", { start: [ '>>>=', '<..<', '>>=', '==~', '===', '<=>', '<<=', '<..', '**=', '..<', '!==', '||', 
    '|=', '>=', '=~', '==', '<=', '+=', '++', '^=', '%=', '&=', '&&', '/=', '*=', '**', '..', '?=', '?:', '!=', '::', '->', 
    '-=', '--', '~', '|', '>', '=', '<', '+', '^', '%', '&', '/', '*', '?', '!', '-' ] }),
  // prettier-ignore
  new ParseRule("keywords", {
    start: ['assert', 'with', 'abstract', 'continue', 'for', 'new', 'switch', 'default', 'goto', 'package', 'synchronized', 
      'boolean', 'do', 'if', 'private', 'this', 'break', 'double', 'implements', 'protected', 'throw', 'byte', 'else', 'import', 
      'public', 'throws', 'case', 'enum', '!instanceof', 'instanceof', 'return', 'transient', 'catch', 'extends', 'int', 'short', 
      'try', 'char', 'final', 'interface', 'static', 'void', 'class', 'finally', 'long', 'strictfp', 'volatile', 'def', 'float', 
      'native', 'super', 'while'],
    wholeword: true,
  }),
  new ParseRule("identifiers", { start: /[a-zA-Z_$][a-zA-Z0-9_$]*\b/g, wholeword: true }),
];
