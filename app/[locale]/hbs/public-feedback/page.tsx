'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function PublicFeedbackPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'us';
  const [activeView, setActiveView] = useState('overview');
  const [formData, setFormData] = useState({ category: '', subject: '', message: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const stats = [
    { label: 'Total Submissions', value: '24,891', icon: '📊', trend: '+12%' },
    { label: 'Avg Response Time', value: '1.8 days', icon: '⏱️', trend: '-15%' },
    { label: 'Resolved Issues', value: '21,456', icon: '✅', trend: '+8%' },
    { label: 'Active Cases', value: '3,435', icon: '🔄', trend: '+5%' },
  ];

  const categories = [
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', count: 5243 },
    { id: 'education', name: 'Education', icon: '🎓', count: 4876 },
    { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️', count: 3992 },
    { id: 'safety', name: 'Public Safety', icon: '🚔', count: 3421 },
    { id: 'environment', name: 'Environment', icon: '🌳', count: 2876 },
    { id: 'other', name: 'Other Services', icon: '📋', count: 4483 },
  ];

  const recentActions = [
    { issue: 'Long wait times at healthcare centers', action: 'Hired 67 new medical staff and extended operating hours', status: 'Completed', date: 'Jan 15, 2026', impact: '2,340 patients served faster' },
    { issue: 'Poor road conditions in District 5', action: 'Allocated $2.3M for road repairs, construction begins Feb 1', status: 'In Progress', date: 'Jan 12, 2026', impact: '15km of roads to be repaired' },
    { issue: 'Need more streetlights in Park District', action: 'Installed 45 new LED streetlights with motion sensors', status: 'Completed', date: 'Jan 8, 2026', impact: '78% reduction in incidents' },
    { issue: 'Insufficient public transportation', action: 'Ordered 12 new buses, delivery expected March 2026', status: 'Planned', date: 'Dec 20, 2025', impact: '3,000+ daily commuters' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ category: '', subject: '', message: '', email: '' });
    }, 3000);
  };

  const handleExport = () => {
    const report = { exportDate: new Date().toISOString(), stats, categories, recentActions, platform: 'IVYAR Public Feedback v2.8' };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `public-feedback-report-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <header className="sticky top-0 z-40 bg-[rgba(11,14,17,0.9)] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href={`/${locale}/hbs`} className="text-white/70 hover:text-white text-sm transition no-underline">← Back to HBS Portal</Link>
          <div className="flex items-center gap-3">
            <div className="text-3xl">💬</div>
            <h1 className="text-xl font-bold">Public Feedback System</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">● LIVE</div>
            <div className="px-3 py-1 bg-white/5 text-white/65 text-xs rounded-full border border-white/10">v2.8</div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10B9B9]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-[#10B9B9]/50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{stat.icon}</div>
                  <span className="text-xs text-green-400">{stat.trend}</span>
                </div>
                <div className="text-3xl font-bold text-[#10B9B9] mb-1">{stat.value}</div>
                <div className="text-sm text-white/65">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8">
        <div className="flex gap-2 border-b border-white/10">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'submit', label: '📝 Submit Feedback' },
            { id: 'analytics', label: '📈 Analytics' },
            { id: 'yousaid', label: '🔄 You Said, We Did' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`px-6 py-3 font-medium transition relative ${activeView === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
              {tab.label}
              {activeView === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B9B9]" />}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-12">
        {activeView === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Feedback by Category</h2>
            <div className="grid grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white/[0.03] border border-white/10 rounded-lg p-6 hover:border-[#10B9B9]/40 hover:bg-white/[0.05] hover:scale-105 transition-all cursor-pointer">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <div className="font-semibold text-lg mb-1">{cat.name}</div>
                  <div className="text-2xl font-bold text-[#10B9B9]">{cat.count.toLocaleString()}</div>
                  <div className="text-xs text-white/50 mt-1">submissions</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'submit' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-white/65">Your feedback has been submitted successfully.</p>
                  <p className="text-sm text-white/40 mt-2">Reference: FB-{Math.floor(Math.random() * 100000)}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold">Submit Your Feedback</h2>
                  <div>
                    <label className="block text-sm font-medium mb-3">Select Category</label>
                    <div className="grid grid-cols-3 gap-3">
                      {categories.map(cat => (
                        <button key={cat.id} type="button" onClick={() => setFormData({...formData, category: cat.id})} className={`p-4 rounded-lg border transition ${formData.category === cat.id ? 'border-[#10B9B9] bg-[#10B9B9]/10' : 'border-white/10 hover:border-white/20'}`}>
                          <div className="text-2xl mb-1">{cat.icon}</div>
                          <div className="text-xs">{cat.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 outline-none focus:border-[#10B9B9] transition" placeholder="Brief description..." required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Feedback</label>
                    <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 outline-none focus:border-[#10B9B9] transition resize-none" placeholder="Share your feedback..." required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email (optional)</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 outline-none focus:border-[#10B9B9] transition" placeholder="your@email.com" />
                  </div>
                  <button type="submit" className="w-full px-6 py-4 bg-[#10B9B9] hover:bg-[#0EA3A3] text-white font-semibold rounded-lg transition">Submit Feedback →</button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Feedback Trends</h2>
              <button onClick={handleExport} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">📥 Export Report</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {categories.map((cat, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{cat.icon}</div>
                      <div>
                        <div className="font-semibold">{cat.name}</div>
                        <div className="text-sm text-white/50">{cat.count.toLocaleString()} submissions</div>
                      </div>
                    </div>
                    <div className="text-green-400 text-sm">+{Math.floor(Math.random() * 20)}%</div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B9B9] rounded-full" style={{width: `${(cat.count / 5243) * 100}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'yousaid' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You Said, We Did — Recent Actions</h2>
            <div className="space-y-4">
              {recentActions.map((action, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-6 hover:border-[#10B9B9]/30 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-2">"{action.issue}"</div>
                      <div className="text-white/70 mb-2">{action.action}</div>
                      <div className="text-sm text-[#10B9B9]">Impact: {action.impact}</div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ml-4 ${action.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : action.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                      {action.status}
                    </span>
                  </div>
                  <div className="text-xs text-white/40">{action.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 mt-16 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-white/50">
          <p>🇺🇸 Built in the United States • 💙💛 Inspired by Ukraine • 🌍 Designed for the world</p>
        </div>
      </footer>
    </div>
  );
}
