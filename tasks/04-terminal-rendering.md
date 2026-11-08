# Render Markdown for terminal output

## Objective

Transform Markdown text into readable terminal output.

## Scope

Own src/render.ts, tests/render.test.ts, and rendering fixtures. Do not read files or access process arguments.

## Inputs and Dependencies

Use renderMarkdown(source, options) from README.md. Use fixed width and color settings in tests; task 01 supplies the test runner.

## Implementation Steps

1. Choose a Markdown parser and terminal-rendering approach; document runtime dependencies.
2. Render headings, paragraphs, emphasis, lists, links, blockquotes, fenced code, horizontal rules, and tables.
3. Respect a supplied terminal width while preserving code-block whitespace; provide ANSI-free output when color is false.
4. Treat raw HTML as text or omit unsupported markup consistently; never execute embedded content or fetch remote assets.

## Acceptance Criteria

- [ ] Representative fixtures demonstrate hierarchy and readable formatting rather than merely echoing Markdown.
- [ ] Tests cover the listed Markdown elements, Unicode, empty input, and narrow widths.
- [ ] Color-disabled output contains no ANSI styling; color-enabled output preserves readable text.
- [ ] Rendering is deterministic for fixed options and performs no filesystem or network I/O.
