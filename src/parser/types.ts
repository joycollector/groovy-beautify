export type CodeBlock = {
  type: string;
  start: string;
  end?: string;
  children?: Array<CodeBlock>;
};
