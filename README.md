# markdown-cli

`markdown-cli` displays Markdown files as readable terminal text. It renders headings, paragraphs, emphasis, lists, links, blockquotes, fenced code, horizontal rules, and tables. It does not provide a browser layout or fetch linked content. Raw HTML is omitted.

## Requirements and setup

Use Node.js 22 or newer and npm. From this repository:

```sh
npm ci
npm run build
npm test
```

The build creates `dist/cli.js`. Run it directly with `node dist/cli.js`, or use `npm run dev --` to run the TypeScript source during development. The package declares the executable name `markdown-cli`; a local package installation makes that command available.

## Usage

```sh
printf '# Notes\n' > "project notes.md"
printf '# Dash\n' > ./-notes.md

node dist/cli.js tests/fixtures/example.md
node dist/cli.js tests/fixtures/example.md README.md
node dist/cli.js "project notes.md"
node dist/cli.js --help
node dist/cli.js -- -notes.md

rm -- "project notes.md" ./-notes.md
```

The first two commands create sample files for the quoted and `--` examples; the last command removes them. The quoted example passes one filename containing a space. The final example uses `--` to treat a filename beginning with `-` as a file instead of an option. Only `.md` and `.markdown` extensions are accepted, regardless of letter case; `notes.md.txt` is rejected.

For development, the same arguments can be passed through npm:

```sh
npm run dev -- tests/fixtures/example.md
```

Files render in argument order. With multiple files, each document starts with a boundary containing its path. Content and help go to stdout; diagnostics go to stderr. Processing stops at the first error, so output from earlier files may remain. Success and `--help` exit with status 0; invalid arguments and input failures exit with status 1. `--help` before `--` takes precedence and does not read files.

The renderer uses the terminal's reported width, or 80 columns when none is available. Color is enabled only for an interactive terminal when `NO_COLOR` is unset and `TERM` is not `dumb`; piped output is plain text. Long words and code lines may exceed the width. Fenced code keeps its whitespace. Tables are rendered as text columns, so complex browser table layouts are outside the terminal format.

## Example output

```text
# Example

A readable Markdown document.

• First item
• Second item
```

## Project layout

`src/arguments.ts` parses arguments and produces help, `src/files.ts` validates and loads UTF-8 Markdown, `src/render.ts` formats Markdown, and `src/cli.ts` connects them. Tests live in `tests/`, sample inputs in `tests/fixtures/`, and generated JavaScript in `dist/`.
