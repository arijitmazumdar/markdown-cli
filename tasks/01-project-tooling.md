# Initialize TypeScript tooling

## Objective

Establish a reproducible build and automated test environment.

## Scope

Own package.json, the lockfile, tsconfig.json, test configuration, and .gitignore. Do not implement CLI behavior.

## Inputs and Dependencies

No implementation prerequisite. Use src/, tests/, tests/fixtures/, and generated dist/. Coordinate the executable path with task 05.

## Implementation Steps

1. Configure strict TypeScript, two-space indentation, and one Node-compatible module format.
2. Select a maintained test framework and define build, test, and dev npm scripts. The dev script must forward CLI arguments.
3. Declare the package executable as markdown-cli pointing to dist/cli.js; configure publishing to include runtime output.
4. Ignore generated output and dependencies; add a minimal tooling smoke test.

## Acceptance Criteria

- [x] A clean install using the lockfile succeeds.
- [x] npm run build compiles source to dist/ with strict checking.
- [x] npm test discovers and runs *.test.ts files.
- [x] The selected runtime, framework, and commands are documented. The dev command becomes executable when task 05 supplies src/cli.ts.

## Verification

- `npm ci --offline --cache /tmp/markdown-cli-npm-cache` completed from the project lockfile using the downloaded package cache.
- `npm run build` and `npm test` passed on Node.js 22.17.0; the smoke test loads TypeScript and resolves an ESM source import.
- `npm pack --dry-run` ran the build and included `dist/index.js` and `package.json`.
- AGENTS.md documents Node.js 22+, npm, NodeNext ES modules, the built-in Node.js test runner, tsx, and the build/test/dev commands. Task 05 supplies the executable entry point.
