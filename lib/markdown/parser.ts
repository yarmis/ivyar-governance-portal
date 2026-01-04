import { marked, Tokens } from 'marked';
import matter from 'gray-matter';

export interface MarkdownMetadata {
  title?: string;
  version?: string;
  date?: string;
  [key: string]: any;
}

export interface ParsedMarkdown {
  content: string;
  metadata: MarkdownMetadata;
  headings: Heading[];
  html: string;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
  children?: Heading[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export function parseMarkdown(source: string): ParsedMarkdown {
  const { data, content } = matter(source);
  const headings = extractHeadings(content);
  
  const renderer = {
    heading({ tokens, depth }: Tokens.Heading): string {
      const text = tokens.map((t: any) => t.raw || t.text || '').join('');
      const id = slugify(text);
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
  };

  marked.use({ renderer, gfm: true, breaks: true });
  const html = marked.parse(content) as string;
  
  return { content, metadata: data as MarkdownMetadata, headings, html };
}

function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    headings.push({ level, text, id });
  }
  return headings;
}