import { promises as fs } from 'fs';
import path from 'path';

export async function loadMarkdownFileSync(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'docs', filename);
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Markdown load error:', error);
    return '';
  }
}
