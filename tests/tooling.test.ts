import assert from 'node:assert/strict';
import { test } from 'node:test';
import '../src/index.js';

test('runs TypeScript tests and resolves ESM source imports', () => {
  const message: string = 'Markdown CLI tooling';
  assert.equal(message.toUpperCase(), 'MARKDOWN CLI TOOLING');
});
