import { loadMarkdownFileSync } from '@/lib/markdown/loader';
import MarkdownRenderer from '@/components/hbs/viewers/MarkdownRenderer';
import EducationModuleViewer, { educationModules } from '@/components/hbs/viewers/EducationModuleViewer';

export default function EducationPage() {
  const doc = loadMarkdownFileSync('EDUCATION.md');

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">HBS Educational Model</h1>
        <p className="text-green-200">
          Comprehensive training curriculum and capacity development framework
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Learning Modules</h2>
        <p className="text-gray-400 mb-6">
          Click on any module to see details. Mark modules as complete to track your progress.
        </p>
        <EducationModuleViewer modules={educationModules} />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
          Complete Curriculum Documentation
        </h2>
        <MarkdownRenderer html={doc.html} />
      </div>
    </div>
  );
}