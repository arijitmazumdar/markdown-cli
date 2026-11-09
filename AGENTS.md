# Repository Guidelines

## Purpose & CLI Requirements

Build a TypeScript command-line utility that displays Markdown files in a readable terminal format, approximating browser-rendered Markdown within terminal capabilities.

- Accept one or more filenames as positional arguments, separated by spaces.
- Support filenames containing spaces through shell quoting, for example: `<cli> README.md "project notes.md"`.
- Reject non-Markdown files with a clear error and a nonzero exit status.
- Provide `--help` describing the utility's purpose, arguments, and usage examples.

## Project Structure & Module Organization

The implemented modules are `src/arguments.ts` (arguments and help), `src/files.ts` (UTF-8 loading), `src/render.ts` (terminal formatting), and `src/cli.ts` (executable orchestration). Automated tests are in `tests/`, sample inputs are in `tests/fixtures/`, and `dist/` holds generated build output. The renderer uses `marked` at runtime.

## Build, Test, and Development Commands

Use Node.js 22 or newer and npm. Run `npm ci` for a reproducible install from package-lock.json. The project uses TypeScript with NodeNext ES modules, the built-in Node.js test runner, and tsx for development and TypeScript test loading. Available npm scripts:

- `npm run build`: compile TypeScript into `dist/`.
- `npm test`: build, type-check tests, then discover and run `tests/**/*.test.ts` with Node's test runner.
- `npm run dev -- README.md`: forward arguments to `src/cli.ts` through tsx. This runs the CLI entry point with forwarded arguments.

The package declares `markdown-cli` at `dist/cli.js`. `src/cli.ts` contains the executable shebang. Publishing includes `dist/`; `npm pack` runs the build through `prepack`. The empty `src/index.ts` module exists only to verify the initial compiler pipeline.

## Coding Style & Naming Conventions

Use TypeScript with strict type checking, two-space indentation, `camelCase` for functions and variables, and `PascalCase` for types and classes. Prefer small modules and explicit error handling. .editorconfig defines two-space indentation and LF line endings. No formatter or linter is configured.

## Testing Guidelines

Use `node:test` with `node:assert/strict` and name test files `*.test.ts`. `tsconfig.test.json` checks tests without emitting them; the production config emits only source files into `dist/`. Cover multiple files, quoted filenames, non-Markdown inputs, missing or unreadable files, help output, and representative Markdown rendering. Include CLI integration tests that assert output and exit status. No numerical coverage threshold is currently defined.

## Commit & Pull Request Guidelines

No Git history is available to establish commit conventions. Use concise, imperative commit subjects. Pull requests should describe the behavior changed, link relevant issues, and list validation commands and results. Include terminal output examples for visible rendering changes.
