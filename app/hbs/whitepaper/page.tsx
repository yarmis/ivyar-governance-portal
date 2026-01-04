import { loadMarkdownFileSync } from '@/lib/markdown/loader';
import MarkdownRenderer from '@/components/hbs/viewers/MarkdownRenderer';
import WhitepaperNav from '@/components/hbs/navigation/WhitepaperNav';

export default function WhitepaperPage() {
  const doc = loadMarkdownFileSync('WHITEPAPER_v1.0.md');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HBS Whitepaper v1.0
          </h1>
          <p className="text-gray-600">Humanitarian Budget Support Framework</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <MarkdownRenderer html={doc.html} />
        </div>
      </div>

      <div className="lg:col-span-1">
        <WhitepaperNav headings={doc.headings} />
      </div>
    </div>
  );
}