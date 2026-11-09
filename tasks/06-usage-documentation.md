# Document installation and usage

## Objective

Give contributors and users verified instructions for building, testing, and invoking the utility.

## Scope

Own the root README.md and update AGENTS.md to describe actual tooling. Do not change application behavior.

## Inputs and Dependencies

Draft independently from the agreed contracts. Final command verification requires task 05 and the completed tooling.

## Implementation Steps

1. Document the supported runtime, installation from this repository, build, test, and development commands.
2. Show single-file, multiple-file, quoted-filename, --help, and -- usage examples.
3. Explain supported extensions, output ordering, exit statuses, error behavior, color handling, and terminal rendering limitations.
4. Replace provisional tooling statements in AGENTS.md with verified commands and locations.

## Acceptance Criteria

- [x] Every documented command matches package.json and succeeds where applicable in a clean local setup.
- [x] Examples cover all required CLI inputs and help.
- [x] Documentation does not claim registry publication or unsupported features.
- [x] AGENTS.md reflects the implemented structure, framework, and executable name.

Validation: `npm ci --offline --cache /tmp/markdown-cli-npm-cache`, `npm run build`, `npm test` (24 passing), the documented `npm run dev --` command, and all usage examples succeeded. Reviewed README.md and AGENTS.md against the current CLI behavior; `git diff --check` passed.
