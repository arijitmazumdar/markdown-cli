# Repository Guidelines

## Purpose & CLI Requirements

Build a TypeScript command-line utility that displays Markdown files in a readable terminal format, approximating browser-rendered Markdown within terminal capabilities.

- Accept one or more filenames as positional arguments, separated by spaces.
- Support filenames containing spaces through shell quoting, for example: `<cli> README.md "project notes.md"`.
- Reject non-Markdown files with a clear error and a nonzero exit status.
- Provide `--help` describing the utility's purpose, arguments, and usage examples.

## Project Structure & Module Organization

Project tooling is initialized. CLI behavior is planned in tasks/02 through tasks/05. When implementing the application, use `src/` for TypeScript modules, `tests/` for automated tests, and `tests/fixtures/` for sample Markdown and invalid inputs. Keep argument parsing, file handling, and Markdown rendering separate so each can be tested independently. Reserve `dist/` for generated build output.

## Build, Test, and Development Commands

Use Node.js 22 or newer and npm. Run `npm ci` for a reproducible install from package-lock.json. The project uses TypeScript with NodeNext ES modules, the built-in Node.js test runner, and tsx for development and TypeScript test loading. Available npm scripts:

- `npm run build`: compile TypeScript into `dist/`.
- `npm test`: type-check source and tests, then discover and run `tests/**/*.test.ts` with Node's test runner.
- `npm run dev -- README.md`: forward arguments to `src/cli.ts` through tsx. This command becomes runnable when task 05 supplies the CLI entry point.

The package declares `markdown-cli` at `dist/cli.js`. Task 05 supplies `src/cli.ts` and its executable shebang. Publishing includes `dist/`; `npm pack` runs the build through `prepack`. The empty `src/index.ts` module exists only to verify the initial compiler pipeline.

## Coding Style & Naming Conventions

Use TypeScript with strict type checking, two-space indentation, `camelCase` for functions and variables, and `PascalCase` for types and classes. Prefer small modules and explicit error handling. .editorconfig defines two-space indentation and LF line endings. No formatter or linter is configured.

## Testing Guidelines

Use `node:test` with `node:assert/strict` and name test files `*.test.ts`. `tsconfig.test.json` checks tests without emitting them; the production config emits only source files into `dist/`. Cover multiple files, quoted filenames, non-Markdown inputs, missing or unreadable files, help output, and representative Markdown rendering. Include CLI integration tests that assert output and exit status. No numerical coverage threshold is currently defined.

## Commit & Pull Request Guidelines

No Git history is available to establish commit conventions. Use concise, imperative commit subjects. Pull requests should describe the behavior changed, link relevant issues, and list validation commands and results. Include terminal output examples for visible rendering changes.
