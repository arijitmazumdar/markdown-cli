export type ParsedArguments =
  | { kind: 'help' }
  | { kind: 'render'; files: string[] };

export function parseArguments(args: string[]): ParsedArguments {
  const terminator = args.indexOf('--');
  const options = terminator === -1 ? args : args.slice(0, terminator);

  if (options.includes('--help')) {
    return { kind: 'help' };
  }

  const files: string[] = [];
  let optionsEnded = false;

  for (const arg of args) {
    if (!optionsEnded && arg === '--') {
      optionsEnded = true;
      continue;
    }
    if (!optionsEnded && arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}. Use --help for usage or -- before filenames beginning with a dash.`);
    }
    if (arg.length === 0) {
      throw new Error('Filename must not be empty. Use --help for usage.');
    }
    files.push(arg);
  }

  if (files.length === 0) {
    throw new Error('Provide at least one Markdown filename. Use --help for usage.');
  }

  return { kind: 'render', files };
}

export function helpText(commandName: string): string {
  return `Display Markdown files in a readable terminal format.

Usage: ${commandName} [--] <file> [files...]
       ${commandName} --help

Arguments:
  file       One or more Markdown filenames, processed in the given order.
             Quote paths containing spaces; the shell handles quoting.

Options:
  --help     Show this help. Takes precedence over other arguments before --.
  --         End options; all following arguments are filenames.

Examples:
  ${commandName} README.md
  ${commandName} README.md notes.md
  ${commandName} README.md "project notes.md"
  ${commandName} -- -notes.md
  ${commandName} --help
`;
}
