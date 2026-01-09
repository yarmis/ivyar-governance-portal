'use client';

import { useState } from 'react';

export default function CertificationPage() {
  const [level, setLevel] = useState('practitioner');
  const [stage, setStage] = useState<'intro' | 'exam' | 'result' | 'certificate'>('intro');
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const levels = [
    { id: 'practitioner', name: 'Practitioner', icon: '🎓', duration: '60 min', questions: 25, passing: '75%', desc: 'Core HBS principles and basic governance' },
    { id: 'specialist', name: 'Specialist', icon: '⭐', duration: '90 min', questions: 40, passing: '80%', desc: 'Advanced governance and complex scenarios' },
    { id: 'trainer', name: 'Trainer', icon: '👨‍🏫', duration: '120 min', questions: 50, passing: '85%', desc: 'Training methodology and curriculum delivery' },
  ];

  const startExam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/certification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start-exam', level })
      });
      const data = await res.json();
      setExam(data);
      setAnswers({});
      setTimeLeft(data.duration * 60);
      setStage('exam');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const submitExam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/certification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit-exam', level, answers })
      });
      const data = await res.json();
      setResult(data);
      setStage('result');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getCertificate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/certification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-certificate', userId: 'user-' + Date.now(), level })
      });
      const data = await res.json();
      setResult({ ...result, certificate: data });
      setStage('certificate');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const allQuestions = exam?.sections?.flatMap((s: any) => s.questions) || [];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">🏆 HBS Certification</h1>
          <p className="text-green-100">Professional certification with exams, badges, and verification</p>
        </div>

        {stage === 'intro' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Select Certification Level</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={'p-4 rounded-xl border-2 text-left transition-all ' + (level === l.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300')}
                  >
                    <span className="text-3xl">{l.icon}</span>
                    <h4 className="font-bold text-gray-900 mt-2">{l.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{l.desc}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>⏱ {l.duration}</p>
                      <p>📝 {l.questions} questions</p>
                      <p>✓ Pass: {l.passing}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">📋 Exam Guidelines</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Complete all questions within the time limit</li>
                <li>• Each question has only one correct answer</li>
                <li>• You cannot go back after submitting</li>
                <li>• Passing score varies by level (75-85%)</li>
                <li>• Certificate valid for 2 years</li>
              </ul>
            </div>

            <button
              onClick={startExam}
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-300"
            >
              {loading ? 'Loading...' : '🚀 Start Certification Exam'}
            </button>
          </>
        )}

        {stage === 'exam' && exam && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
                <p className="text-sm text-gray-500">Level: {exam.level} | Pass: {exam.passingScore}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="font-bold text-green-600">{answeredCount} / {allQuestions.length}</p>
              </div>
            </div>

            <div className="space-y-6">
              {exam.sections?.map((section: any, si: number) => (
                <div key={si}>
                  <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Section {si + 1}: {section.name}</h3>
                  <div className="space-y-4">
                    {section.questions.map((q: any, qi: number) => (
                      <div key={q.id} className={'p-4 rounded-lg border ' + (answers[q.id] !== undefined ? 'border-green-300 bg-green-50' : 'border-gray-200')}>
                        <p className="font-medium text-gray-900 mb-3">{qi + 1}. {q.question}</p>
                        {q.type === 'truefalse' ? (
                          <div className="flex gap-4">
                            {[true, false].map((v) => (
                              <button
                                key={String(v)}
                                onClick={() => setAnswers({...answers, [q.id]: v})}
                                className={'px-6 py-2 rounded-lg border font-medium ' + (answers[q.id] === v ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-300 hover:bg-gray-50')}
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
                                onClick={() => setAnswers({...answers, [q.id]: oi})}
                                className={'w-full text-left px-4 py-2 rounded-lg border ' + (answers[q.id] === oi ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-300 hover:bg-gray-50')}
                              >
                                {String.fromCharCode(65 + oi)}. {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t flex justify-between items-center">
              <p className="text-gray-600">Answered: {answeredCount} of {allQuestions.length}</p>
              <button
                onClick={submitExam}
                disabled={loading || answeredCount < allQuestions.length}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300"
              >
                {loading ? 'Submitting...' : '✅ Submit Exam'}
              </button>
            </div>
          </div>
        )}

        {stage === 'result' && result && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className={'text-center p-8 rounded-xl mb-6 ' + (result.passed ? 'bg-green-50' : 'bg-red-50')}>
              <span className="text-6xl">{result.passed ? '🎉' : '📚'}</span>
              <h2 className={'text-3xl font-bold mt-4 ' + (result.passed ? 'text-green-700' : 'text-red-700')}>
                {result.passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-gray-600 mt-2">{result.feedback}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-4xl font-bold text-gray-900">{result.score}%</p>
                <p className="text-sm text-gray-500">Your Score</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-4xl font-bold text-gray-900">{result.passingScore}%</p>
                <p className="text-sm text-gray-500">Passing Score</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-4xl font-bold text-gray-900">{result.correct}/{result.total}</p>
                <p className="text-sm text-gray-500">Correct Answers</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">📋 Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations?.map((r: string, i: number) => (
                  <li key={i} className="text-gray-700">• {r}</li>
                ))}
              </ul>
            </div>

            {result.passed ? (
              <button
                onClick={getCertificate}
                disabled={loading}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                {loading ? 'Generating...' : '🏆 Get Your Certificate'}
              </button>
            ) : (
              <button
                onClick={() => { setStage('intro'); setExam(null); setAnswers({}); setResult(null); }}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700"
              >
                🔄 Try Again
              </button>
            )}
          </div>
        )}

        {stage === 'certificate' && result?.certificate && (
          <div className="bg-white rounded-xl border-4 border-green-500 p-8">
            <div className="text-center border-b-2 border-green-200 pb-6 mb-6">
              <span className="text-6xl">🏆</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">Certificate of Completion</h1>
              <p className="text-green-600 font-medium">{result.certificate.title}</p>
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-600">This certifies that</p>
              <p className="text-2xl font-bold text-gray-900 my-2">HBS Professional</p>
              <p className="text-gray-600">has successfully completed the</p>
              <p className="text-xl font-bold text-green-600 my-2">{result.certificate.level} Certification</p>
              <p className="text-gray-600">issued by {result.certificate.issuedBy}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Certificate ID</p>
                <p className="font-mono text-sm font-bold text-gray-900">{result.certificate.certificateId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Valid Until</p>
                <p className="font-bold text-gray-900">{result.certificate.expiryDate}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2">🎯 Certified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.certificate.skills?.map((s: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Verify at</p>
              <p className="font-mono text-green-700">{result.certificate.verificationUrl}</p>
            </div>

            <button
              onClick={() => { setStage('intro'); setExam(null); setAnswers({}); setResult(null); }}
              className="w-full mt-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              ← Back to Certifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}