# Wire the executable and verify CLI behavior

## Objective

Deliver one command that renders supplied files and returns appropriate exit statuses.

## Scope

Own src/cli.ts and tests/cli.test.ts. Reuse parsing, loading, and rendering modules without duplicating their logic.

## Inputs and Dependencies

Tasks 01–04 must be complete for final validation. Develop orchestration with stubs against README.md contracts before those modules are available.

## Implementation Steps

1. Add the executable shebang and invoke parsing, file loading, and rendering.
2. Render files in argument order with a clear boundary between documents. Write content/help to stdout and diagnostics to stderr.
3. Use exit status 0 for help and successful rendering, and 1 for usage or input failures. Stop at the first failure; earlier output may remain.
4. Enable color only for a suitable interactive terminal, honor NO_COLOR, and use a stable fallback width when no terminal width exists.
5. Spawn the built executable in integration tests; verify the package executable through a temporary local installation.

## Acceptance Criteria

- [x] CLI tests cover multiple files, a quoted path, invalid extension, missing/unreadable files, no arguments, unknown options, and --help.
- [x] Tests assert stdout, stderr, argument order, and exit status; help does not read files.
- [x] Piped output is readable and free of ANSI styling.
- [x] npm run build, npm test, npm run dev -- tests/fixtures/example.md, and the locally installed markdown-cli command work. Include the example fixture in this task.

Validation: all 24 tests pass from a clean `dist/`; the dev command and a temporary local package installation render the example fixture. Review found and fixed the missing build prerequisite in `npm test`.
