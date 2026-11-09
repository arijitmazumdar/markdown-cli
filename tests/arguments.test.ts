import assert from 'node:assert/strict';
import { test } from 'node:test';
import { helpText, parseArguments } from '../src/arguments.js';

test('accepts one file without accessing the filesystem', () => {
  assert.deepEqual(parseArguments(['missing.md']), {
    kind: 'render', files: ['missing.md'],
  });
});

test('preserves file order, duplicates, and spaces within arguments', () => {
  const args = ['README.md', 'project notes.md', 'README.md', ' spaced.md '];
  const original = [...args];
  const result = parseArguments(args);
  assert.deepEqual(result, { kind: 'render', files: original });
  assert.deepEqual(args, original);
  if (result.kind === 'render') {
    assert.notEqual(result.files, args);
  }
});

test('treats every argument after the first terminator as a filename', () => {
  assert.deepEqual(parseArguments(['README.md', '--', '-notes.md', '--help', '--']), {
    kind: 'render', files: ['README.md', '-notes.md', '--help', '--'],
  });
  assert.deepEqual(parseArguments(['--', '-notes.md']), {
    kind: 'render', files: ['-notes.md'],
  });
});

test('returns help intent wherever --help appears before the terminator', () => {
  for (const args of [
    ['--help'],
    ['missing.md', '--help'],
    ['--unknown', '--help'],
    ['--help', '--unknown'],
    ['', '--help', '--', '-notes.md'],
  ]) {
    assert.deepEqual(parseArguments(args), { kind: 'help' });
  }
});

test('help after the terminator does not override invalid options', () => {
  assert.throws(() => parseArguments(['--unknown', '--', '--help']), /Unknown option: --unknown/);
});

test('rejects empty filename lists with a usage hint', () => {
  for (const args of [[], ['--']]) {
    assert.throws(() => parseArguments(args), /at least one Markdown filename.*--help/);
  }
});

test('rejects unknown long and short options before the terminator', () => {
  for (const option of ['--unknown', '-h', '-', '--help=yes', '-notes.md']) {
    assert.throws(() => parseArguments(['README.md', option]), (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.ok(error.message.includes(`Unknown option: ${option}`));
      assert.match(error.message, /--help/);
      return true;
    });
  }
});

test('rejects empty filename arguments before and after the terminator', () => {
  for (const args of [[''], ['README.md', ''], ['--', '']]) {
    assert.throws(() => parseArguments(args), /Filename must not be empty.*--help/);
  }
});

test('leaves extension validation to file loading', () => {
  assert.deepEqual(parseArguments(['notes.txt']), { kind: 'render', files: ['notes.txt'] });
});

test('help describes purpose, arguments, flags, and runnable examples', () => {
  const help = helpText('markdown-cli');
  assert.match(help, /Display Markdown files.*terminal/);
  assert.match(help, /Usage: markdown-cli/);
  assert.match(help, /One or more Markdown filenames/);
  assert.match(help, /Quote paths containing spaces/);
  assert.match(help, /--help\s+Show this help/);
  assert.match(help, /--\s+End options/);
  for (const example of [
    'markdown-cli README.md',
    'markdown-cli README.md notes.md',
    'markdown-cli README.md "project notes.md"',
    'markdown-cli -- -notes.md',
    'markdown-cli --help',
  ]) {
    assert.ok(help.includes(example));
  }
});

test('help uses the supplied command name', () => {
  const help = helpText('md-view');
  assert.match(help, /Usage: md-view/);
  assert.match(help, /md-view README.md/);
  assert.ok(!help.includes('markdown-cli'));
});
