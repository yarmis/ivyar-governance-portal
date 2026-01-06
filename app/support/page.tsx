'use client';

import Link from 'next/link';
import { useState } from 'react';

const SUPPORT_CATEGORIES = [
  {
    icon: '🚀',
    title: 'Getting Started',
    desc: 'New to IVYAR? Start here',
    links: [
      { name: 'Platform Overview', href: '/docs' },
      { name: 'Quick Start Guide', href: '/docs' },
      { name: 'First Steps Tutorial', href: '/docs' },
      { name: 'System Requirements', href: '/docs' },
    ],
  },
  {
    icon: '🧩',
    title: 'Modules & Features',
    desc: 'Learn about platform capabilities',
    links: [
      { name: 'HBS Module Guide', href: '/docs' },
      { name: 'Analytics Dashboard', href: '/docs' },
      { name: 'Crisis Anticipation', href: '/docs' },
      { name: 'AI Operations', href: '/docs' },
    ],
  },
  {
    icon: '🔧',
    title: 'Technical Support',
    desc: 'API, integrations, troubleshooting',
    links: [
      { name: 'API Documentation', href: '/docs' },
      { name: 'Integration Guides', href: '/docs' },
      { name: 'Troubleshooting', href: '/docs' },
      { name: 'Error Codes', href: '/docs' },
    ],
  },
  {
    icon: '🛡️',
    title: 'Security & Compliance',
    desc: 'Data protection and standards',
    links: [
      { name: 'Security Overview', href: '/docs' },
      { name: 'Compliance Certifications', href: '/docs' },
      { name: 'Data Privacy', href: '/docs' },
      { name: 'Audit Logs', href: '/docs' },
    ],
  },
  {
    icon: '💳',
    title: 'Billing & Account',
    desc: 'Licensing, payments, account settings',
    links: [
      { name: 'Pricing Plans', href: '/pricing' },
      { name: 'License Management', href: '/docs' },
      { name: 'Payment Methods', href: '/docs' },
      { name: 'Account Settings', href: '/docs' },
    ],
  },
  {
    icon: '🎓',
    title: 'Training & Certification',
    desc: 'HBS Academy and learning resources',
    links: [
      { name: 'HBS Academy', href: '/docs' },
      { name: 'Certification Programs', href: '/docs' },
      { name: 'Video Tutorials', href: '/docs' },
      { name: 'Webinars', href: '/docs' },
    ],
  },
];

const CONTACT_OPTIONS = [
  {
    icon: '📧',
    title: 'Email Support',
    desc: 'Get help via email',
    contact: 'support@ivyar.org',
    response: 'Response within 24 hours',
    href: 'mailto:support@ivyar.org',
  },
  {
    icon: '💬',
    title: 'Live Chat',
    desc: 'Chat with our team',
    contact: 'Available 9am-6pm CET',
    response: 'Instant response',
    href: '#chat',
  },
  {
    icon: '📞',
    title: 'Phone Support',
    desc: 'For urgent issues',
    contact: '+1 (555) 123-4567',
    response: 'Government tier only',
    href: 'tel:+15551234567',
  },
  {
    icon: '🎫',
    title: 'Submit Ticket',
    desc: 'Create a support ticket',
    contact: 'Track your requests',
    response: 'Priority handling',
    href: '#ticket',
  },
];

const SYSTEM_STATUS = [
  { name: 'Platform Core', status: 'operational', uptime: '99.99%' },
  { name: 'API Services', status: 'operational', uptime: '99.98%' },
  { name: 'Analytics Engine', status: 'operational', uptime: '99.97%' },
  { name: 'Crisis Anticipation', status: 'operational', uptime: '99.95%' },
  { name: 'AI Operations', status: 'operational', uptime: '99.94%' },
];

const POPULAR_ARTICLES = [
  { title: 'How to set up your first dashboard', category: 'Getting Started', href: '/docs' },
  { title: 'Understanding Ethical Core v2.0', category: 'Features', href: '/docs' },
  { title: 'API authentication guide', category: 'Technical', href: '/docs' },
  { title: 'IATI/HXL compliance setup', category: 'Compliance', href: '/docs' },
  { title: 'Crisis Anticipation Engine overview', category: 'Features', href: '/docs' },
  { title: 'User roles and permissions', category: 'Administration', href: '/docs' },
];

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">
              IV
            </div>
            <span className="text-lg font-semibold">IVYAR</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[#8B949E] hover:text-white transition-colors">
              ← Back to Home
            </Link>
            <Link
              href="/demo"
              className="h-11 px-6 bg-[#00A3FF] text-[#0D1117] font-medium text-sm flex items-center hover:bg-[#33B5FF] transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-[140px] pb-[60px]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">Help Center</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4 mb-6">
            How Can We Help You?
          </h1>
          <p className="text-lg text-[#8B949E] max-w-2xl mx-auto mb-8">
            Find answers, access documentation, and get support from our team.
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full h-14 pl-12 pr-4 bg-[#161B22] border border-[#1F242C] rounded-lg text-[#E6EDF3] placeholder-[#6E7681] focus:outline-none focus:border-[#00A3FF] transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* System Status Banner */}
      <section className="py-4 bg-[#3CCB7F]/10 border-y border-[#3CCB7F]/30">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-center gap-3">
            <span className="w-2 h-2 bg-[#3CCB7F] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#3CCB7F]">All Systems Operational</span>
            <Link href="#status" className="text-sm text-[#8B949E] hover:text-white ml-4">
              View Status →
            </Link>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-xl font-semibold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUPPORT_CATEGORIES.map((category, i) => (
              <div
                key={i}
                className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6 hover:border-[#3D444D] transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#00A3FF]/10 flex items-center justify-center text-2xl rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#E6EDF3]">{category.title}</h3>
                    <p className="text-sm text-[#6E7681]">{category.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#8B949E] hover:text-[#00A3FF] transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-[60px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-xl font-semibold mb-8 text-center">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_OPTIONS.map((option, i) => (
              <a
                key={i}
                href={option.href}
                className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 hover:border-[#00A3FF] transition-colors text-center group"
              >
                <div className="w-14 h-14 bg-[#00A3FF]/10 flex items-center justify-center text-3xl rounded-full mx-auto mb-4 group-hover:bg-[#00A3FF]/20 transition-colors">
                  {option.icon}
                </div>
                <h3 className="font-semibold text-[#E6EDF3] mb-1">{option.title}</h3>
                <p className="text-sm text-[#6E7681] mb-3">{option.desc}</p>
                <p className="text-sm text-[#00A3FF] font-medium">{option.contact}</p>
                <p className="text-xs text-[#6E7681] mt-1">{option.response}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-xl font-semibold mb-8 text-center">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_ARTICLES.map((article, i) => (
              <Link
                key={i}
                href={article.href}
                className="flex items-start gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded-lg hover:border-[#3D444D] transition-colors group"
              >
                <div className="w-10 h-10 bg-[#00A3FF]/10 flex items-center justify-center rounded-lg shrink-0">
                  <svg className="w-5 h-5 text-[#00A3FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#E6EDF3] group-hover:text-[#00A3FF] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#6E7681] mt-1">{article.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* System Status */}
      <section id="status" className="py-[60px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-xl font-semibold mb-8 text-center">System Status</h2>
          <div className="space-y-3">
            {SYSTEM_STATUS.map((service, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#3CCB7F] rounded-full" />
                  <span className="font-medium text-[#E6EDF3]">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#6E7681]">Uptime: {service.uptime}</span>
                  <span className="text-xs font-medium text-[#3CCB7F] bg-[#3CCB7F]/10 px-2 py-1 rounded">
                    Operational
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#6E7681] mt-6">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </section>

      {/* Submit Ticket Form */}
      <section id="ticket" className="py-[60px]">
        <div className="max-w-[600px] mx-auto px-6">
          <h2 className="text-xl font-semibold mb-8 text-center">Submit a Support Ticket</h2>
          
          {isSubmitted ? (
            <div className="text-center py-12 bg-[#161B22] border border-[#1F242C] rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3CCB7F]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#3CCB7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Ticket Submitted</h3>
              <p className="text-[#8B949E]">We'll respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#E6EDF3] mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                    className="w-full h-12 px-4 bg-[#161B22] border border-[#1F242C] rounded-lg text-[#E6EDF3] focus:outline-none focus:border-[#00A3FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#E6EDF3] mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    className="w-full h-12 px-4 bg-[#161B22] border border-[#1F242C] rounded-lg text-[#E6EDF3] focus:outline-none focus:border-[#00A3FF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6EDF3] mb-2">Category</label>
                <select
                  required
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full h-12 px-4 bg-[#161B22] border border-[#1F242C] rounded-lg text-[#E6EDF3] focus:outline-none focus:border-[#00A3FF]"
                >
                  <option value="">Select category</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Account</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6EDF3] mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full h-12 px-4 bg-[#161B22] border border-[#1F242C] rounded-lg text-[#E6EDF3] focus:outline-none focus:border-[#00A3FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E6EDF3] mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#161B22] border border-[#1F242C] rounded-lg text-[#E6EDF3] focus:outline-none focus:border-[#00A3FF] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#00A3FF] text-[#0D1117] font-medium rounded-lg hover:bg-[#33B5FF] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0D1117]/30 border-t-[#0D1117] rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-[60px] bg-[#161B22] border-t border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Link href="/faq" className="group">
              <div className="w-14 h-14 bg-[#00A3FF]/10 flex items-center justify-center text-2xl rounded-full mx-auto mb-4 group-hover:bg-[#00A3FF]/20 transition-colors">
                ❓
              </div>
              <h3 className="font-semibold text-[#E6EDF3] group-hover:text-[#00A3FF] transition-colors">FAQ</h3>
              <p className="text-sm text-[#6E7681] mt-1">Frequently asked questions</p>
            </Link>
            <Link href="/docs" className="group">
              <div className="w-14 h-14 bg-[#00A3FF]/10 flex items-center justify-center text-2xl rounded-full mx-auto mb-4 group-hover:bg-[#00A3FF]/20 transition-colors">
                📚
              </div>
              <h3 className="font-semibold text-[#E6EDF3] group-hover:text-[#00A3FF] transition-colors">Documentation</h3>
              <p className="text-sm text-[#6E7681] mt-1">Technical guides and API reference</p>
            </Link>
            <Link href="/demo" className="group">
              <div className="w-14 h-14 bg-[#00A3FF]/10 flex items-center justify-center text-2xl rounded-full mx-auto mb-4 group-hover:bg-[#00A3FF]/20 transition-colors">
                🚀
              </div>
              <h3 className="font-semibold text-[#E6EDF3] group-hover:text-[#00A3FF] transition-colors">Request Demo</h3>
              <p className="text-sm text-[#6E7681] mt-1">See IVYAR in action</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-[#1F242C] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-[#6E7681]">© 2024-2026 IVYAR. All rights reserved.</span>
          <span className="text-sm text-[#6E7681]">NATO-Aligned • Multi-Region Infrastructure</span>
        </div>
      </footer>
    </div>
  );
}
