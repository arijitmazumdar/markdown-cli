import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderMarkdown } from '../src/render.js';

const plain = { width: 40, color: false };

test('renders document hierarchy and common Markdown elements', () => {
  const source = `# Guide

A **strong** and *gentle* line with [docs](https://example.com).

- first
- second

1. one
2. two

> Quoted wisdom

\`\`\`ts
  const x = 1;
    x++;
\`\`\`

---

| Name | Value |
| --- | --- |
| Alpha | Beta |
`;
  const result = renderMarkdown(source, plain);
  for (const expected of ['# Guide', 'strong', 'gentle', 'docs\n(https://example.com)', '• first', '1. one', '│ Quoted wisdom', '[ts]', '    x++;', 'Alpha']) {
    assert.ok(result.includes(expected), `${expected} missing from:\n${result}`);
  }
  assert.match(result, /Alpha +│ Beta/);
  assert.ok(!result.includes('**strong**'));
  assert.ok(!result.includes('| --- |'));
  assert.match(result, /─{10}/);
});

test('renders Unicode and empty input deterministically without ANSI when color is off', () => {
  const source = '## 你好 🌍\n\n**café** and `π`';
  const result = renderMarkdown(source, plain);
  assert.equal(result, renderMarkdown(source, plain));
  assert.match(result, /你好 🌍/);
  assert.match(result, /café/);
  assert.match(result, /π/);
  assert.doesNotMatch(result, /\x1b\[/);
  assert.equal(renderMarkdown('', plain), '');
});

test('wraps prose at narrow widths and preserves fenced code whitespace', () => {
  const result = renderMarkdown('A long sequence of simple words here.\n\n```\n  x\n    y\n```', { width: 12, color: false });
  assert.match(result, /A long\nsequence of\nsimple words\nhere\./);
  assert.match(result, /    x\n      y/);
});

test('color output retains readable text and raw HTML is omitted', () => {
  const result = renderMarkdown('# Title\n\nA **bold** word.\n\n<script>alert(1)</script>', { width: 40, color: true });
  assert.match(result, /\x1b\[/);
  assert.match(result.replace(/\x1b\[[0-9;]*m/g, ''), /# Title\n\nA bold word/);
  assert.ok(!result.includes('alert(1)'));
});
