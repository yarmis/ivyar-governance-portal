import fs from 'fs';
import path from 'path';
import { parseMarkdown, ParsedMarkdown } from './parser';

const DOCS_DIR = path.join(process.cwd(), 'docs', 'hbs');

export function loadMarkdownFileSync(filename: string): ParsedMarkdown {
  const filePath = path.join(DOCS_DIR, filename);
  const source = fs.readFileSync(filePath, 'utf-8');
  return parseMarkdown(source);
}
