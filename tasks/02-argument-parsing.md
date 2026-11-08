# Parse arguments and provide help

## Objective

Convert process arguments into validated CLI intent without filesystem access.

## Scope

Own src/arguments.ts and tests/arguments.test.ts. Keep parsing pure; do not render or read files.

## Inputs and Dependencies

Use the parsing contract in README.md. Tests need task 01 tooling to run, but implementation requires no other feature module.

## Implementation Steps

1. Implement parseArguments(args) and helpText(commandName).
2. Preserve positional argument order and spaces inside each argument; let the shell perform quoting.
3. Support --help and -- as an option terminator. Reject unknown options and empty filename lists.
4. Describe purpose, multiple-file usage, quoted paths, and the help flag in help output.

## Acceptance Criteria

- [ ] Tests cover one file, multiple files, a single argument containing spaces, and filenames beginning with a dash after --.
- [ ] --help returns help intent without requiring filenames or filesystem access.
- [ ] Unknown options and no arguments produce clear usage errors.
- [ ] Help examples use markdown-cli and explain accepted arguments.
