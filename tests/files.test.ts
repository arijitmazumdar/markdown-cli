import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { loadMarkdown } from '../src/files.js';

test('loads exact UTF-8 text for supported extensions and paths containing spaces', async (t) => {
  const directory = await fs.mkdtemp(join(tmpdir(), 'markdown-files-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  for (const name of ['notes.md', 'project notes.MD', 'notes.markdown', 'notes.MaRkDoWn']) {
    const path = join(directory, name);
    const content = '# Hello 世界 👋\r\n\nText with trailing spaces  \n';
    await fs.writeFile(path, content, 'utf8');
    assert.equal(await loadMarkdown(path), content);
  }
  const empty = join(directory, 'empty.md');
  await fs.writeFile(empty, '');
  assert.equal(await loadMarkdown(empty), '');
});

test('rejects unsupported final extensions before filesystem access', async (t) => {
  const stat = t.mock.method(fs, 'stat', () => { throw new Error('Unexpected stat'); });
  const read = t.mock.method(fs, 'readFile', () => { throw new Error('Unexpected read'); });
  for (const path of ['notes.md.txt', 'notes.txt', 'notes', '.md', 'notes.md/child', 'notes.md.']) {
    await assert.rejects(loadMarkdown(path), (error: Error) => {
      assert.match(error.message, /Unsupported file extension/);
      assert.ok(error.message.includes(path));
      return true;
    });
  }
  assert.equal(stat.mock.callCount(), 0);
  assert.equal(read.mock.callCount(), 0);
});

test('identifies missing files and directory inputs', async (t) => {
  const directory = await fs.mkdtemp(join(tmpdir(), 'markdown-files-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const missing = join(directory, 'missing.md');
  const folder = join(directory, 'folder.md');
  await fs.mkdir(folder);
  for (const [path, reason] of [[missing, /File not found/], [folder, /directory/]] as const) {
    await assert.rejects(loadMarkdown(path), (error: Error) => {
      assert.match(error.message, reason);
      assert.ok(error.message.includes(path));
      return true;
    });
  }
});

test('reports portable permission and other read failures with the original path', async (t) => {
  const directory = await fs.mkdtemp(join(tmpdir(), 'markdown-files-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'private notes.md');
  await fs.writeFile(path, 'content');
  for (const code of ['EACCES', 'EPERM', 'EIO']) {
    const cause = Object.assign(new Error('simulated read failure'), { code });
    const read = t.mock.method(fs, 'readFile', async () => { throw cause; });
    await assert.rejects(loadMarkdown(path), (error: Error) => {
      assert.match(error.message, code === 'EIO' ? /Unable to read file/ : /Permission denied/);
      assert.ok(error.message.includes(path));
      assert.equal(error.cause, cause);
      return true;
    });
    read.mock.restore();
  }
});
