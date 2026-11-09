import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { test } from 'node:test';

const executable = resolve('dist/cli.js');
const fixture = resolve('tests/fixtures/example.md');

function run(args: string[], nodeOptions: string[] = []) {
  const result = spawnSync(process.execPath, [...nodeOptions, executable, ...args], {
    encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' },
  });
  if (result.error) throw result.error;
  return result;
}

test('built CLI renders multiple files in order with document boundaries and no ANSI', async (t) => {
  const directory = await fs.mkdtemp(join(tmpdir(), 'markdown-cli-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const spaced = join(directory, 'project notes.md');
  await fs.writeFile(spaced, '# Second document\n');
  const result = run([fixture, spaced]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /── .*example\.md ──\n# Example/);
  assert.match(result.stdout, /── .*project notes\.md ──\n# Second document/);
  assert.ok(result.stdout.indexOf('First item') < result.stdout.indexOf('Second document'));
  assert.doesNotMatch(result.stdout, /\x1b\[/);
});

test('help succeeds without accessing missing files; usage errors go to stderr', () => {
  const help = run(['missing.md', '--help']);
  assert.equal(help.status, 0);
  assert.equal(help.stderr, '');
  assert.match(help.stdout, /Usage: markdown-cli/);
  for (const [args, expected] of [[[], /at least one Markdown filename/], [['--unknown'], /Unknown option/]] as const) {
    const result = run([...args]);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, expected);
  }
});

test('input errors stop at first failure and preserve earlier output', () => {
  for (const [path, expected] of [['notes.md.txt', /Unsupported file extension/], ['missing.md', /File not found/]] as const) {
    const result = run([fixture, path]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /# Example/);
    assert.ok(!result.stdout.includes(`── ${path} ──`));
    assert.match(result.stderr, expected);
    assert.ok(result.stderr.includes(path));
  }
});

test('simulated unreadable file reports permission failure portably', async (t) => {
  const directory = await fs.mkdtemp(join(tmpdir(), 'markdown-cli-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'private.md');
  const preload = join(directory, 'deny.mjs');
  await fs.writeFile(path, 'private');
  await fs.writeFile(preload, `import { promises as fs } from 'node:fs';
fs.readFile = async () => { throw Object.assign(new Error('denied'), { code: 'EACCES' }); };
`);
  const result = run([path], ['--import', preload]);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Permission denied/);
  assert.ok(result.stderr.includes(path));
});
