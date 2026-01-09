'use client';

import { useState } from 'react';

export default function TutorPage() {
  const [mode, setMode] = useState<'lesson' | 'quiz' | 'case'>('lesson');
  const [topic, setTopic] = useState('human-dignity');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);

  const topics = [
    { id: 'human-dignity', name: 'Human Dignity' },
    { id: 'transparency', name: 'Transparency' },
    { id: 'accountability', name: 'Accountability' },
    { id: 'do-no-harm', name: 'Do No Harm' },
    { id: 'governance', name: 'Governance' },
    { id: 'risk-management', name: 'Risk Management' },
  ];

  const loadContent = async () => {
    setLoading(true);
    setShowResults(false);
    setAnswers({});
    try {
      const res = await fetch('/api/hbs/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, topic, level: 'beginner' })
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const submitQuiz = () => {
    if (!result?.questions) return;
    let correct = 0;
    result.questions.forEach((q: any) => {
      if (answers[q.id] === q.correct) correct++;
    });
    setShowResults(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">🎓 AI Governance Tutor</h1>
          <p className="text-blue-100">Interactive learning with lessons, quizzes, and case studies</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 mb-6">
            {(['lesson', 'quiz', 'case'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setResult(null); }}
                className={'px-4 py-2 rounded-lg font-medium ' + (mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
              >
                {m === 'lesson' ? '📚 Lesson' : m === 'quiz' ? '❓ Quiz' : '📋 Case Study'}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-900"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button
              onClick={loadContent}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? '...' : 'Load'}
            </button>
          </div>
        </div>

        {result && mode === 'lesson' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.title}</h2>
            <p className="text-sm text-gray-500 mb-6">⏱ {result.estimatedTime}</p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Learning Objectives</h3>
              <ul className="space-y-1">
                {result.objectives?.map((o: string, i: number) => (
                  <li key={i} className="text-gray-700">✓ {o}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 mb-6">
              {result.content?.map((c: any, i: number) => (
                <div
                  key={i}
                  className={'p-4 rounded-lg ' + (c.type === 'concept' ? 'bg-blue-50 border-l-4 border-blue-500' : c.type === 'example' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-orange-50 border-l-4 border-orange-500')}
                >
                  <p className="text-xs font-medium text-gray-500 mb-1">{c.type.toUpperCase()}</p>
                  <p className="text-gray-800">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📌 Key Points</h3>
              <ul className="space-y-1">
                {result.keyPoints?.map((k: string, i: number) => (
                  <li key={i} className="text-gray-700">• {k}</li>
                ))}
              </ul>
            </div>

            {result.nextTopic && (
              <div className="mt-6 text-right">
                <button
                  onClick={() => { setTopic(result.nextTopic); loadContent(); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Next: {topics.find(t => t.id === result.nextTopic)?.name} →
                </button>
              </div>
            )}
          </div>
        )}

        {result && mode === 'quiz' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.title}</h2>
            <p className="text-sm text-gray-500 mb-6">Pass: {result.passingScore}% | Time: {result.timeLimit}s</p>

            <div className="space-y-6">
              {result.questions?.map((q: any, idx: number) => (
                <div key={q.id} className={'p-4 rounded-lg border ' + (showResults ? (answers[q.id] === q.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-200')}>
                  <p className="font-medium text-gray-900 mb-3">{idx + 1}. {q.question}</p>
                  {q.type === 'truefalse' ? (
                    <div className="flex gap-4">
                      {[true, false].map((v) => (
                        <button
                          key={String(v)}
                          onClick={() => !showResults && setAnswers({ ...answers, [q.id]: v })}
                          className={'px-4 py-2 rounded-lg border ' + (answers[q.id] === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300')}
                        >
                          {v ? 'True' : 'False'}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {q.options?.map((opt: string, oi: number) => (
                        <button
                          key={oi}
                          onClick={() => !showResults && setAnswers({ ...answers, [q.id]: oi })}
                          className={'w-full text-left px-4 py-2 rounded-lg border ' + (answers[q.id] === oi ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:bg-gray-50')}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {showResults && (
                    <p className={'mt-2 text-sm ' + (answers[q.id] === q.correct ? 'text-green-700' : 'text-red-700')}>
                      {answers[q.id] === q.correct ? '✓ Correct!' : `✗ Correct answer: ${q.type === 'truefalse' ? (q.correct ? 'True' : 'False') : q.options[q.correct]}`}
                      {q.explanation && <span className="block text-gray-600 mt-1">{q.explanation}</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!showResults && (
              <button onClick={submitQuiz} className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                Submit Quiz
              </button>
            )}

            {showResults && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">
                  Score: {result.questions.filter((q: any) => answers[q.id] === q.correct).length} / {result.questions.length}
                </p>
                <p className="text-gray-600">
                  {(result.questions.filter((q: any) => answers[q.id] === q.correct).length / result.questions.length * 100) >= result.passingScore ? '🎉 Passed!' : '📚 Keep studying!'}
                </p>
              </div>
            )}
          </div>
        )}

        {result && mode === 'case' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{result.title}</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-800">{result.scenario}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">👥 Stakeholders</h3>
              <div className="flex flex-wrap gap-2">
                {result.stakeholders?.map((s: string) => (
                  <span key={s} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">❓ Discussion Questions</h3>
              <ul className="space-y-2">
                {result.questions?.map((q: string, i: number) => (
                  <li key={i} className="text-gray-700">{i + 1}. {q}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">📊 Decision Options</h3>
              <div className="space-y-3">
                {result.options?.map((opt: any) => (
                  <div key={opt.id} className={'p-4 rounded-lg border ' + (opt.id === result.bestAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200')}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">Option {opt.id}: {opt.text}</span>
                      {opt.id === result.bestAnswer && <span className="text-xs px-2 py-1 bg-green-500 text-white rounded">Recommended</span>}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className={'px-2 py-1 rounded ' + (opt.dignity === 'high' ? 'bg-green-100 text-green-700' : opt.dignity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
                        Dignity: {opt.dignity}
                      </span>
                      <span className={'px-2 py-1 rounded ' + (opt.risk === 'low' ? 'bg-green-100 text-green-700' : opt.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
                        Risk: {opt.risk}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{opt.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Learning Points</h3>
              <ul className="space-y-1">
                {result.learningPoints?.map((p: string, i: number) => (
                  <li key={i} className="text-gray-700">• {p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}