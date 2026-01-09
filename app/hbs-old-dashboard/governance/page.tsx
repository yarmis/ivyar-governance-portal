import { loadMarkdownFileSync } from '@/lib/markdown/loader';
import MarkdownRenderer from '@/components/hbs/viewers/MarkdownRenderer';
import GovernanceTree, { governanceStructure } from '@/components/hbs/viewers/GovernanceTree';

export default function GovernancePage() {
  const doc = loadMarkdownFileSync('GOVERNANCE.md');

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">HBS Governance Integration</h1>
        <p className="text-blue-100">Ethical governance framework</p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-blue-600 text-white px-3 py-1 rounded mr-3">🏛️</span>
          Governance Architecture
        </h2>
        <GovernanceTree nodes={governanceStructure} />
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-sm">
        <MarkdownRenderer html={doc.html} />
      </div>
    </div>
  );
}