interface MarkdownRendererProps {
  html: string;
  light?: boolean;
}

export default function MarkdownRenderer({ html, light = false }: MarkdownRendererProps) {
  return (
    <div
      className={`prose max-w-none ${light 
        ? "prose-slate prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-600" 
        : "prose-invert prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-a:text-blue-400"
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
