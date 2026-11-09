#!/usr/bin/env node
import { helpText, parseArguments } from './arguments.js';
import { loadMarkdown } from './files.js';
import { renderMarkdown } from './render.js';

async function main(): Promise<void> {
  try {
    const parsed = parseArguments(process.argv.slice(2));
    if (parsed.kind === 'help') {
      process.stdout.write(helpText('markdown-cli'));
      return;
    }

    const width = process.stdout.columns && process.stdout.columns > 0 ? process.stdout.columns : 80;
    const color = Boolean(process.stdout.isTTY && process.env.NO_COLOR === undefined && process.env.TERM !== 'dumb');
    for (const [index, path] of parsed.files.entries()) {
      const source = await loadMarkdown(path);
      const rendered = renderMarkdown(source, { width, color });
      if (parsed.files.length > 1) {
        process.stdout.write(`${index === 0 ? '' : '\n'}── ${path} ──\n`);
      }
      process.stdout.write(`${rendered}\n`);
    }
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

await main();
