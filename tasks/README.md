# Implementation Tasks

## Goal

Implement the TypeScript terminal Markdown CLI described in the root AGENTS.md. Tasks 01 (tooling) and 02 (argument parsing and help) are complete; remaining CLI behavior is planned in the following tasks.

## Task Index

1. [Project tooling](01-project-tooling.md)
2. [Argument parsing and help](02-argument-parsing.md)
3. [File validation and loading](03-file-loading.md)
4. [Terminal rendering](04-terminal-rendering.md)
5. [Executable integration](05-cli-integration.md)
6. [Usage documentation](06-usage-documentation.md)

## Boundaries and Execution

Each task owns one deliverable and its verification. Parsing, loading, and rendering are independent modules with no imports from each other; their unit tests use local fixtures or mocks. Tooling enables test execution. Integration necessarily depends on the component contracts being implemented; final documentation verification depends on the working executable. These dependencies do not require combining tasks or editing another task's modules. This plan does not claim all tasks can be completed in arbitrary order.

Start tooling first. Component tasks can be authored independently against the contracts below. Integrate when components pass their tests, then verify documentation. Each task includes its own tests rather than deferring testing to a separate work item.

## Shared Contracts

- `parseArguments(args: string[]): { kind: "help" } | { kind: "render"; files: string[] }` throws a readable usage error for invalid input. `--help` before `--` takes precedence; values after `--` are filenames.
- `helpText(commandName: string): string` returns usage text without I/O.
- `loadMarkdown(path: string): Promise<string>` returns UTF-8 content or throws a readable path-specific error.
- `renderMarkdown(source: string, options: { width: number; color: boolean }): string` returns terminal text without I/O.
- `src/cli.ts` composes these interfaces and compiles to the package executable `dist/cli.js`, named `markdown-cli`.

## Planning Assumptions

The requested section list was omitted, so tasks use Objective, Scope, Inputs and Dependencies, Implementation Steps, and Acceptance Criteria. Defaults chosen for planning are `.md`/`.markdown` extensions, help precedence, fail-fast processing, exit status 1 for failures, and no network access during rendering. These clarify unspecified behavior and may be revised before implementation.

## Completion Gate

All task acceptance checkboxes must be verified before implementation is considered complete. Evidence must include a clean build, passing unit and CLI integration tests, a locally installed executable, and verified usage examples. No numerical coverage threshold is imposed by AGENTS.md.
