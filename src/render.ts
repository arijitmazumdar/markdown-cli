import { marked, type MarkedToken, type Token } from 'marked';

export type RenderOptions = { width: number; color: boolean };

function paint(text: string, code: string, color: boolean): string {
  return color ? `\x1b[${code}m${text}\x1b[0m` : text;
}

function inline(tokens: Token[], color: boolean): string {
  return tokens.map((rawToken) => {
    const token = rawToken as MarkedToken;
    switch (token.type) {
      case 'text': return token.tokens ? inline(token.tokens, color) : token.text;
      case 'escape': return token.text;
      case 'strong': return paint(inline(token.tokens, color), '1', color);
      case 'em': return paint(inline(token.tokens, color), '3', color);
      case 'del': return `~${inline(token.tokens, color)}~`;
      case 'codespan': return paint(`\`${token.text}\``, '36', color);
      case 'link': return `${inline(token.tokens, color)} (${token.href})`;
      case 'image': return `[Image: ${token.text}] (${token.href})`;
      case 'br': return '\n';
      case 'html': return '';
      default: return '';
    }
  }).join('');
}

function visibleLength(text: string): number {
  return [...text.replace(/\x1b\[[0-9;]*m/g, '')].length;
}

function wrap(text: string, width: number, prefix = '', continuation = prefix): string {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = prefix;
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const length = visibleLength(line);
      if (length > (line === prefix ? visibleLength(prefix) : 0) && length + 1 + visibleLength(word) > width) {
        lines.push(line);
        line = continuation + word;
      } else {
        line += (line === prefix ? '' : ' ') + word;
      }
    }
    lines.push(line);
  }
  return lines.join('\n');
}

function blocks(tokens: Token[], width: number, color: boolean): string {
  const output: string[] = [];
  for (const rawToken of tokens) {
    const token = rawToken as MarkedToken;
    switch (token.type) {
      case 'heading': {
        const label = `${'#'.repeat(token.depth)} ${inline(token.tokens, color)}`;
        output.push(paint(label, token.depth === 1 ? '1;34' : '1', color));
        break;
      }
      case 'paragraph':
      case 'text': output.push(wrap(token.tokens ? inline(token.tokens, color) : token.text, width)); break;
      case 'blockquote': {
        const body = blocks(token.tokens, Math.max(1, width - 2), color);
        output.push(body.split('\n').map((line) => `│ ${line}`).join('\n'));
        break;
      }
      case 'list': {
        const rows = token.items.map((item, index) => {
          const marker = token.ordered ? `${Number(token.start || 1) + index}. ` : '• ';
          const content = blocks(item.tokens, Math.max(1, width - marker.length), color).replace(/\n\n/g, '\n');
          return wrap(content, width, marker, ' '.repeat(marker.length));
        });
        output.push(rows.join('\n'));
        break;
      }
      case 'code': {
        const label = token.lang ? `[${token.lang}]\n` : '';
        output.push(label + token.text.split('\n').map((line) => `  ${line}`).join('\n'));
        break;
      }
      case 'hr': output.push('─'.repeat(Math.max(1, width))); break;
      case 'table': {
        const rows = [token.header, ...token.rows].map((row) => row.map((cell) => inline(cell.tokens, color)));
        const columns = token.header.length;
        const columnWidth = Math.max(1, Math.floor((width - 3 * (columns - 1)) / Math.max(1, columns)));
        const format = (row: string[]) => {
          const cells = row.map((cell) => wrap(cell, columnWidth).split('\n'));
          const height = Math.max(...cells.map((cell) => cell.length));
          return Array.from({ length: height }, (_, line) =>
            cells.map((cell) => (cell[line] ?? '').padEnd(columnWidth)).join(' │ ').trimEnd(),
          ).join('\n');
        };
        output.push([format(rows[0]), '─'.repeat(Math.max(1, width)), ...rows.slice(1).map(format)].join('\n'));
        break;
      }
      case 'html': break;
      case 'space': break;
      default: break;
    }
  }
  return output.join('\n\n');
}

/** Render Markdown using only the supplied text and options. Raw HTML is omitted. */
export function renderMarkdown(source: string, options: RenderOptions): string {
  const width = Math.max(1, Math.floor(Number.isFinite(options.width) ? options.width : 80));
  return blocks(marked.lexer(source), width, options.color);
}
