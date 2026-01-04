'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SmartSuitePage() {
  const modules = [
    {
      id: 'tutor',
      name: 'AI Governance Tutor',
      icon: '🎓',
      description: 'Interactive learning with lessons, quizzes, and case studies',
      href: '/hbs/smart/tutor',
      color: 'from-blue-500 to-cyan-500',
      features: ['Adaptive lessons', 'Interactive quizzes', 'Real case studies', 'Progress tracking']
    },
    {
      id: 'simulator',
      name: 'Governance Simulator',
      icon: '🎮',
      description: 'Decision simulations with consequences and outcomes',
      href: '/hbs/smart/simulator',
      color: 'from-purple-500 to-pink-500',
      features: ['Real scenarios', 'Multiple decisions', 'Impact analysis', 'Learning outcomes']
    },
    {
      id: 'risk-engine',
      name: 'Ethical Risk Engine',
      icon: '⚡',
      description: 'Real-time multi-factor risk analysis',
      href: '/hbs/smart/risk',
      color: 'from-orange-500 to-red-500',
      features: ['5 risk categories', 'Real-time analysis', 'Boundary monitoring', 'Mitigation strategies']
    },
    {
      id: 'certification',
      name: 'HBS Certification',
      icon: '🏆',
      description: 'Professional certification with exams and badges',
      href: '/hbs/smart/certification',
      color: 'from-green-500 to-emerald-500',
      features: ['3 levels', 'Timed exams', 'Digital certificates', 'Skill verification']
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🔥</span>
            <div>
              <h1 className="text-4xl font-bold">HBS Smart Suite v1.5</h1>
              <p className="text-purple-200 text-lg">AI-Powered Governance Intelligence Platform</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-purple-200">Smart Modules</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm text-purple-200">Scenarios</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-purple-200">Cert Levels</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-purple-200">Languages</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`bg-gradient-to-r ${m.color} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{m.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{m.name}</h2>
                    <p className="text-white/80">{m.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {m.features.map((f) => (
                    <span key={f} className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{f}</span>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <span className="text-indigo-600 font-medium group-hover:underline">Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-xl mb-4">🔌 API Endpoints</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <code className="text-blue-700 text-sm">POST /api/hbs/tutor</code>
              <p className="text-xs text-gray-500 mt-1">AI Tutor</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <code className="text-purple-700 text-sm">POST /api/hbs/simulator</code>
              <p className="text-xs text-gray-500 mt-1">Simulator</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <code className="text-orange-700 text-sm">POST /api/hbs/risk-engine</code>
              <p className="text-xs text-gray-500 mt-1">Risk Engine</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <code className="text-green-700 text-sm">POST /api/hbs/certification</code>
              <p className="text-xs text-gray-500 mt-1">Certification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}