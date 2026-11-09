# Validate and load Markdown files

## Objective

Read a Markdown file as UTF-8 and report actionable input errors.

## Scope

Own src/files.ts, tests/files.test.ts, and file-loading fixtures. Do not parse CLI options or render content.

## Inputs and Dependencies

Use loadMarkdown(path) from README.md. Work independently with temporary files; task 01 is needed only to execute tests.

## Implementation Steps

1. Accept .md and .markdown extensions case-insensitively, based on the final extension.
2. Reject unsupported extensions before reading; preserve the original path in diagnostics.
3. Read UTF-8 text and translate missing, unreadable, and directory input failures into clear errors.
4. Test filenames containing spaces and empty Markdown files. Inject or mock read failures for portable permission-error tests.

## Acceptance Criteria

- [x] Valid Markdown files return their exact text, including Unicode and empty content.
- [x] Non-Markdown inputs fail clearly; paths such as notes.md.txt are rejected.
- [x] Missing files, directories, and unreadable files produce errors identifying the path.
- [x] Tests do not depend on host permissions or files outside temporary fixtures.

Validation: `npm test` and `npm run build` pass. Reviewed the loader and tests against the acceptance criteria; no outstanding findings.
