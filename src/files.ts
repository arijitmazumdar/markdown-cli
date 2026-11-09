import { promises as fs } from 'node:fs';
import { extname } from 'node:path';

/** Load a Markdown document without changing its text. */
export async function loadMarkdown(path: string): Promise<string> {
  const extension = extname(path).toLowerCase();
  if (extension !== '.md' && extension !== '.markdown') {
    throw new Error(`Unsupported file extension for "${path}". Expected .md or .markdown.`);
  }

  try {
    // Some platforms allow readFile on directories, so check explicitly.
    const stats = await fs.stat(path);
    if (stats.isDirectory()) {
      throw Object.assign(new Error('Directory input'), { code: 'EISDIR' });
    }
    return await fs.readFile(path, 'utf8');
  } catch (cause) {
    const code = (cause as NodeJS.ErrnoException | null)?.code;
    let reason: string;
    switch (code) {
      case 'ENOENT':
      case 'ENOTDIR':
        reason = 'File not found';
        break;
      case 'EACCES':
      case 'EPERM':
        reason = 'Permission denied';
        break;
      case 'EISDIR':
        reason = 'Path is a directory; expected a Markdown file';
        break;
      default:
        reason = `Unable to read file${cause instanceof Error ? `: ${cause.message}` : ''}`;
    }
    throw new Error(`${reason}: "${path}".`, { cause });
  }
}
