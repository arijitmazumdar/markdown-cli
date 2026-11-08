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

- [ ] A clean install using the lockfile succeeds.
- [ ] npm run build compiles source to dist/ with strict checking.
- [ ] npm test discovers and runs *.test.ts files.
- [ ] The selected runtime, framework, and commands are documented. The dev command becomes executable when task 05 supplies src/cli.ts.
