'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  organization: string;
  role: string;
  country: string;
  interest: string;
  message: string;
}

const INTERESTS = [
  { value: 'government', label: 'Government Implementation' },
  { value: 'donor', label: 'Donor Partnership' },
  { value: 'international', label: 'International Organization' },
  { value: 'technical', label: 'Technical Integration' },
  { value: 'pilot', label: 'Pilot Program' },
  { value: 'other', label: 'Other' },
];

const ROLES = [
  { value: 'minister', label: 'Minister / Deputy Minister' },
  { value: 'director', label: 'Director / Head of Department' },
  { value: 'program-manager', label: 'Program Manager' },
  { value: 'technical-lead', label: 'Technical Lead' },
  { value: 'donor-representative', label: 'Donor Representative' },
  { value: 'consultant', label: 'Consultant / Advisor' },
  { value: 'other', label: 'Other' },
];

export default function RequestDemoPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organization: '',
    role: '',
    country: '',
    interest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, send to API
    console.log('Demo request:', formData);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Request Received</h1>
          <p className="text-slate-400 mb-8">
            Thank you for your interest in HBS v10.0. Our team will contact you within 24-48 hours to schedule your demo.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Request a Demo
            </h1>
            <p className="text-lg text-slate-400">
              See HBS v10.0 in action. Our team will provide a personalized demonstration 
              tailored to your organization&apos;s needs.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Tell us about yourself</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    placeholder="John Smith"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    placeholder="john@organization.org"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    placeholder="Ministry of Digital Transformation"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                  >
                    <option value="">Select your role</option>
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    placeholder="Ukraine"
                  />
                </div>

                {/* Interest */}
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-slate-300 mb-2">
                    Primary Interest *
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    required
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                  >
                    <option value="">Select your interest</option>
                    {INTERESTS.map(interest => (
                      <option key={interest.value} value={interest.value}>{interest.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 resize-none"
                    placeholder="Tell us about your specific needs or questions..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full flex items-center justify-center gap-2
                    px-6 py-4 text-base font-semibold
                    bg-gradient-to-r from-primary-600 to-primary-500
                    hover:from-primary-500 hover:to-primary-400
                    disabled:from-slate-600 disabled:to-slate-600
                    text-white rounded-lg
                    transition-all duration-200
                    disabled:cursor-not-allowed
                  "
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Demo</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
              {/* What to Expect */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">What to Expect</h3>
                <div className="space-y-4">
                  {[
                    { icon: '📅', title: 'Schedule a Call', desc: 'We\'ll reach out within 24-48 hours to schedule your demo' },
                    { icon: '🎯', title: 'Personalized Demo', desc: 'See features relevant to your organization\'s needs' },
                    { icon: '💬', title: 'Q&A Session', desc: 'Get answers to your technical and implementation questions' },
                    { icon: '📋', title: 'Next Steps', desc: 'Receive a tailored proposal and implementation roadmap' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-slate-200 font-medium">{item.title}</h4>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Includes */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Demo Includes</h3>
                <ul className="space-y-3">
                  {[
                    'HBS Prometheus v9.0 walkthrough',
                    'Sovereign Intelligence Layer overview',
                    'Ethical Core v2.0 demonstration',
                    'Crisis Anticipation Engine',
                    'Integration capabilities',
                    'Deployment roadmap discussion',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="p-6 bg-primary-600/10 border border-primary-500/30 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">Need Immediate Assistance?</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Contact our team directly for urgent inquiries.
                </p>
                <a
                  href="mailto:demo@ivyar.org"
                  className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  demo@ivyar.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
