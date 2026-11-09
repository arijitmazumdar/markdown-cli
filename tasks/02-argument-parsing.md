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

- [x] Tests cover one file, multiple files, a single argument containing spaces, and filenames beginning with a dash after --.
- [x] --help returns help intent without requiring filenames or filesystem access.
- [x] Unknown options and no arguments produce clear usage errors.
- [x] Help examples use markdown-cli and explain accepted arguments.

## Verification and Review

- `npm test`: 12 tests passed, including 11 argument/help tests and the tooling smoke test.
- `npm run build`: strict TypeScript compilation passed.
- Code review checked the shared contract, help precedence before the first `--`, literal arguments after it, input preservation, usage diagnostics, and absence of filesystem access. Clarified standalone help usage; no remaining findings.
