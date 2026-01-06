'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type CourseType = 'video' | 'text' | 'interactive' | 'scenario' | 'playbook';
type Audience = 'all' | 'ministry' | 'donor' | 'developer' | 'operator' | 'admin';

interface Course {
  id: string;
  title: string;
  description: string;
  type: CourseType;
  level: CourseLevel;
  audience: Audience[];
  duration: string;
  modules: number;
  lessons: number;
  enrolled: number;
  rating: number;
  certification?: string;
  tags: string[];
  isNew?: boolean;
  isRequired?: boolean;
}

interface CertificationPath {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  courses: string[];
  duration: string;
  badge: string;
  color: string;
}

// ============================================
// DATA
// ============================================
const COURSES: Course[] = [
  // Core Platform Courses
  {
    id: 'ivyar-101',
    title: 'IVYAR Platform Fundamentals',
    description: 'Introduction to IVYAR platform, core concepts, navigation, and basic operations.',
    type: 'video',
    level: 'beginner',
    audience: ['all'],
    duration: '2 hours',
    modules: 5,
    lessons: 18,
    enrolled: 4520,
    rating: 4.9,
    certification: 'Platform Fundamentals',
    tags: ['core', 'introduction', 'navigation'],
    isRequired: true,
  },
  {
    id: 'hbs-core-201',
    title: 'HBS Core Operations',
    description: 'Master humanitarian budget support workflows: programs, beneficiaries, and payments.',
    type: 'interactive',
    level: 'intermediate',
    audience: ['ministry', 'operator'],
    duration: '6 hours',
    modules: 8,
    lessons: 32,
    enrolled: 2840,
    rating: 4.8,
    certification: 'HBS Operator',
    tags: ['hbs', 'programs', 'payments', 'beneficiaries'],
    isRequired: true,
  },
  {
    id: 'prometheus-blockchain',
    title: 'Prometheus Blockchain Verification',
    description: 'Understand distributed ledger technology and transaction verification in IVYAR.',
    type: 'video',
    level: 'intermediate',
    audience: ['all'],
    duration: '3 hours',
    modules: 4,
    lessons: 16,
    enrolled: 1920,
    rating: 4.7,
    tags: ['blockchain', 'prometheus', 'verification', 'audit'],
  },
  {
    id: 'ethical-ai',
    title: 'Ethical AI & Human Oversight',
    description: 'Learn about Ethical Core v2.0, AI governance, and human-in-the-loop principles.',
    type: 'text',
    level: 'beginner',
    audience: ['all'],
    duration: '1.5 hours',
    modules: 3,
    lessons: 12,
    enrolled: 3100,
    rating: 4.9,
    tags: ['ethics', 'ai', 'governance', 'oversight'],
    isNew: true,
  },

  // Ministry Training
  {
    id: 'ministry-admin-301',
    title: 'Ministry Administration',
    description: 'Complete guide for ministry administrators: user management, policies, and compliance.',
    type: 'interactive',
    level: 'advanced',
    audience: ['ministry', 'admin'],
    duration: '8 hours',
    modules: 10,
    lessons: 45,
    enrolled: 890,
    rating: 4.8,
    certification: 'Ministry Administrator',
    tags: ['ministry', 'admin', 'policies', 'compliance'],
  },
  {
    id: 'procurement-mastery',
    title: 'Procurement Engine Mastery',
    description: 'End-to-end procurement: tenders, bids, contracts, and supplier management.',
    type: 'scenario',
    level: 'intermediate',
    audience: ['ministry', 'operator'],
    duration: '5 hours',
    modules: 6,
    lessons: 28,
    enrolled: 1450,
    rating: 4.7,
    certification: 'Procurement Specialist',
    tags: ['procurement', 'tenders', 'contracts'],
  },
  {
    id: 'social-protection',
    title: 'Social Protection Program Design',
    description: 'Design and implement social protection programs using IVYAR best practices.',
    type: 'scenario',
    level: 'advanced',
    audience: ['ministry'],
    duration: '10 hours',
    modules: 12,
    lessons: 52,
    enrolled: 620,
    rating: 4.9,
    certification: 'Program Designer',
    tags: ['social protection', 'program design', 'policy'],
    isNew: true,
  },
  {
    id: 'crisis-response',
    title: 'Crisis Anticipation & Response',
    description: 'Use Crisis Anticipation Engine for early warning and emergency response coordination.',
    type: 'scenario',
    level: 'advanced',
    audience: ['ministry', 'operator'],
    duration: '4 hours',
    modules: 5,
    lessons: 22,
    enrolled: 780,
    rating: 4.8,
    tags: ['crisis', 'emergency', 'response', 'early warning'],
  },

  // Donor Training
  {
    id: 'donor-dashboard-101',
    title: 'Donor Dashboard Essentials',
    description: 'Navigate donor dashboard: funding tracking, impact metrics, and IATI reporting.',
    type: 'video',
    level: 'beginner',
    audience: ['donor'],
    duration: '2 hours',
    modules: 4,
    lessons: 14,
    enrolled: 560,
    rating: 4.8,
    certification: 'Donor Portal User',
    tags: ['donor', 'funding', 'impact', 'iati'],
    isRequired: true,
  },
  {
    id: 'iati-compliance',
    title: 'IATI 2.03 Compliance',
    description: 'Master International Aid Transparency Initiative reporting and data standards.',
    type: 'text',
    level: 'intermediate',
    audience: ['donor', 'ministry'],
    duration: '3 hours',
    modules: 5,
    lessons: 20,
    enrolled: 420,
    rating: 4.6,
    tags: ['iati', 'compliance', 'reporting', 'transparency'],
  },
  {
    id: 'impact-measurement',
    title: 'Impact Measurement & Reporting',
    description: 'Design KPIs, collect data, and generate impact reports for stakeholders.',
    type: 'interactive',
    level: 'intermediate',
    audience: ['donor', 'ministry'],
    duration: '4 hours',
    modules: 6,
    lessons: 24,
    enrolled: 680,
    rating: 4.7,
    certification: 'Impact Analyst',
    tags: ['impact', 'kpi', 'reporting', 'analytics'],
  },

  // Developer Training
  {
    id: 'api-fundamentals',
    title: 'IVYAR API Fundamentals',
    description: 'REST API basics: authentication, endpoints, rate limits, and error handling.',
    type: 'interactive',
    level: 'beginner',
    audience: ['developer'],
    duration: '3 hours',
    modules: 5,
    lessons: 20,
    enrolled: 1240,
    rating: 4.8,
    certification: 'API Developer',
    tags: ['api', 'rest', 'authentication', 'developer'],
    isRequired: true,
  },
  {
    id: 'api-advanced',
    title: 'Advanced API Integration',
    description: 'Webhooks, batch operations, GraphQL, and real-time data streaming.',
    type: 'interactive',
    level: 'advanced',
    audience: ['developer'],
    duration: '6 hours',
    modules: 8,
    lessons: 36,
    enrolled: 680,
    rating: 4.7,
    certification: 'Senior API Developer',
    tags: ['api', 'webhooks', 'graphql', 'streaming'],
  },
  {
    id: 'prometheus-smart-contracts',
    title: 'Prometheus Smart Contracts',
    description: 'Develop and deploy smart contracts on IVYAR Prometheus blockchain.',
    type: 'interactive',
    level: 'expert',
    audience: ['developer'],
    duration: '8 hours',
    modules: 10,
    lessons: 42,
    enrolled: 320,
    rating: 4.9,
    certification: 'Blockchain Developer',
    tags: ['blockchain', 'solidity', 'smart contracts', 'ethereum'],
    isNew: true,
  },
  {
    id: 'sdk-integration',
    title: 'SDK Integration Guide',
    description: 'Integrate IVYAR SDKs: JavaScript, Python, Java, and mobile platforms.',
    type: 'text',
    level: 'intermediate',
    audience: ['developer'],
    duration: '4 hours',
    modules: 6,
    lessons: 24,
    enrolled: 890,
    rating: 4.6,
    tags: ['sdk', 'integration', 'javascript', 'python'],
  },

  // Deployment Playbooks
  {
    id: 'deployment-cloud',
    title: 'Cloud Deployment Playbook',
    description: 'Step-by-step guide for deploying IVYAR on AWS, GCP, or Azure.',
    type: 'playbook',
    level: 'advanced',
    audience: ['developer', 'admin'],
    duration: '4 hours',
    modules: 6,
    lessons: 28,
    enrolled: 340,
    rating: 4.8,
    tags: ['deployment', 'cloud', 'aws', 'azure', 'gcp'],
  },
  {
    id: 'deployment-onprem',
    title: 'On-Premise Deployment Playbook',
    description: 'Deploy IVYAR in air-gapped or on-premise environments.',
    type: 'playbook',
    level: 'expert',
    audience: ['developer', 'admin'],
    duration: '6 hours',
    modules: 8,
    lessons: 35,
    enrolled: 180,
    rating: 4.7,
    tags: ['deployment', 'on-premise', 'kubernetes', 'security'],
  },
  {
    id: 'data-migration',
    title: 'Data Migration Playbook',
    description: 'Migrate legacy data to IVYAR: extraction, transformation, and validation.',
    type: 'playbook',
    level: 'advanced',
    audience: ['developer', 'admin'],
    duration: '5 hours',
    modules: 7,
    lessons: 30,
    enrolled: 420,
    rating: 4.8,
    tags: ['migration', 'data', 'etl', 'validation'],
  },
  {
    id: 'security-hardening',
    title: 'Security Hardening Playbook',
    description: 'Secure your IVYAR deployment: encryption, access control, and monitoring.',
    type: 'playbook',
    level: 'expert',
    audience: ['developer', 'admin'],
    duration: '4 hours',
    modules: 6,
    lessons: 26,
    enrolled: 290,
    rating: 4.9,
    tags: ['security', 'hardening', 'encryption', 'compliance'],
  },

  // Operator Training
  {
    id: 'daily-operations',
    title: 'Daily Operations Guide',
    description: 'Day-to-day tasks: data entry, approvals, reporting, and troubleshooting.',
    type: 'video',
    level: 'beginner',
    audience: ['operator'],
    duration: '3 hours',
    modules: 5,
    lessons: 22,
    enrolled: 2100,
    rating: 4.7,
    tags: ['operations', 'daily', 'workflow', 'troubleshooting'],
    isRequired: true,
  },
  {
    id: 'analytics-reporting',
    title: 'Analytics & Reporting',
    description: 'Create dashboards, custom reports, and data exports.',
    type: 'interactive',
    level: 'intermediate',
    audience: ['operator', 'ministry', 'donor'],
    duration: '4 hours',
    modules: 6,
    lessons: 26,
    enrolled: 1560,
    rating: 4.8,
    certification: 'Analytics Specialist',
    tags: ['analytics', 'reporting', 'dashboards', 'exports'],
  },
];

const CERTIFICATION_PATHS: CertificationPath[] = [
  {
    id: 'operator-path',
    title: 'Certified IVYAR Operator',
    description: 'Master daily operations, data management, and basic reporting.',
    level: 'intermediate',
    courses: ['ivyar-101', 'hbs-core-201', 'daily-operations', 'analytics-reporting'],
    duration: '15 hours',
    badge: '🎖️',
    color: '#3CCB7F',
  },
  {
    id: 'admin-path',
    title: 'Certified Platform Administrator',
    description: 'Full administrative capabilities including user management and security.',
    level: 'advanced',
    courses: ['ivyar-101', 'ministry-admin-301', 'security-hardening', 'deployment-cloud'],
    duration: '22 hours',
    badge: '🏅',
    color: '#00A3FF',
  },
  {
    id: 'developer-path',
    title: 'Certified IVYAR Developer',
    description: 'Build integrations, extensions, and custom solutions on IVYAR.',
    level: 'advanced',
    courses: ['api-fundamentals', 'api-advanced', 'sdk-integration', 'prometheus-smart-contracts'],
    duration: '21 hours',
    badge: '💎',
    color: '#A371F7',
  },
  {
    id: 'program-designer-path',
    title: 'Certified Program Designer',
    description: 'Design and implement social protection and humanitarian programs.',
    level: 'expert',
    courses: ['ivyar-101', 'hbs-core-201', 'social-protection', 'impact-measurement', 'crisis-response'],
    duration: '27 hours',
    badge: '🏆',
    color: '#F59E0B',
  },
  {
    id: 'donor-specialist-path',
    title: 'Certified Donor Relations Specialist',
    description: 'Master donor engagement, IATI compliance, and impact reporting.',
    level: 'intermediate',
    courses: ['ivyar-101', 'donor-dashboard-101', 'iati-compliance', 'impact-measurement'],
    duration: '12 hours',
    badge: '⭐',
    color: '#EC4899',
  },
];

const LEARNING_TRACKS = [
  {
    id: 'ministry',
    title: 'Ministry Officials',
    icon: '🏛️',
    description: 'Training path for government ministry staff and administrators.',
    courses: 8,
    certifications: 2,
    color: '#00A3FF',
  },
  {
    id: 'donor',
    title: 'Donor Organizations',
    icon: '🤝',
    description: 'Training for international donors and funding partners.',
    courses: 5,
    certifications: 1,
    color: '#EC4899',
  },
  {
    id: 'developer',
    title: 'Developers & Engineers',
    icon: '💻',
    description: 'Technical training for API integration and platform extension.',
    courses: 6,
    certifications: 1,
    color: '#A371F7',
  },
  {
    id: 'operator',
    title: 'Operations Staff',
    icon: '⚙️',
    description: 'Daily operations, data entry, and reporting training.',
    courses: 6,
    certifications: 1,
    color: '#3CCB7F',
  },
];

const SCENARIOS = [
  {
    id: 'cash-transfer',
    title: 'Emergency Cash Transfer Program',
    description: 'Launch a cash transfer program for 50,000 flood-affected families in 72 hours.',
    duration: '45 min',
    difficulty: 'Advanced',
    skills: ['Program Setup', 'Beneficiary Import', 'Payment Processing', 'Crisis Response'],
  },
  {
    id: 'procurement-tender',
    title: 'Public Procurement Tender',
    description: 'Manage a $5M medical supplies tender from publication to contract award.',
    duration: '30 min',
    difficulty: 'Intermediate',
    skills: ['Tender Creation', 'Bid Evaluation', 'Contract Management', 'Compliance'],
  },
  {
    id: 'donor-report',
    title: 'Quarterly Donor Report',
    description: 'Generate comprehensive impact report for multiple donors with IATI compliance.',
    duration: '25 min',
    difficulty: 'Intermediate',
    skills: ['Analytics', 'IATI Export', 'Impact Metrics', 'Report Generation'],
  },
  {
    id: 'api-integration',
    title: 'External System Integration',
    description: 'Integrate national ID registry with IVYAR for beneficiary verification.',
    duration: '60 min',
    difficulty: 'Expert',
    skills: ['API Authentication', 'Data Mapping', 'Error Handling', 'Testing'],
  },
  {
    id: 'crisis-simulation',
    title: 'Crisis Early Warning Response',
    description: 'Respond to AI-generated early warning: resource pre-positioning and coordination.',
    duration: '40 min',
    difficulty: 'Advanced',
    skills: ['Crisis Dashboard', 'Resource Allocation', 'Partner Coordination', 'Reporting'],
  },
];

// ============================================
// HELPER COMPONENTS
// ============================================
const LEVEL_CONFIG = {
  beginner: { label: 'Beginner', color: '#3CCB7F', bg: 'bg-[#3CCB7F]/10' },
  intermediate: { label: 'Intermediate', color: '#00A3FF', bg: 'bg-[#00A3FF]/10' },
  advanced: { label: 'Advanced', color: '#F59E0B', bg: 'bg-[#F59E0B]/10' },
  expert: { label: 'Expert', color: '#A371F7', bg: 'bg-[#A371F7]/10' },
};

const TYPE_ICONS: Record<CourseType, string> = {
  video: '🎬',
  text: '📄',
  interactive: '🖥️',
  scenario: '🎯',
  playbook: '📋',
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'certifications' | 'scenarios' | 'playbooks'>('courses');
  const [audienceFilter, setAudienceFilter] = useState<Audience>('all');
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = COURSES.filter(course => {
    if (audienceFilter !== 'all' && !course.audience.includes(audienceFilter) && !course.audience.includes('all')) {
      return false;
    }
    if (levelFilter !== 'all' && course.level !== levelFilter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const playbooks = COURSES.filter(c => c.type === 'playbook');
  const scenarios = SCENARIOS;

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">HBS Academy</span>
              <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded">Beta</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-[#8B949E] hover:text-white">Documentation</Link>
            <Link href="/support" className="text-sm text-[#8B949E] hover:text-white">Support</Link>
            <div className="h-8 w-px bg-[#1F242C]"></div>
            <button className="text-sm bg-[#1F242C] text-[#E6EDF3] px-4 py-2 rounded hover:bg-[#2D333B]">
              My Learning
            </button>
            <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF]">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#161B22] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎓</span>
                <span className="text-sm bg-[#00A3FF]/10 text-[#00A3FF] px-3 py-1 rounded-full font-medium">
                  Training & Certification Center
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">HBS Academy</h1>
              <p className="text-lg text-[#8B949E] max-w-xl">
                Comprehensive training programs for government officials, development partners, 
                and technical teams. Master the IVYAR platform and earn professional certifications.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">{COURSES.length} Courses</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">{CERTIFICATION_PATHS.length} Certifications</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">{SCENARIOS.length} Interactive Scenarios</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">{playbooks.length} Deployment Playbooks</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:w-80">
              {[
                { value: '15K+', label: 'Learners Enrolled' },
                { value: '4.8', label: 'Average Rating' },
                { value: '92%', label: 'Completion Rate' },
                { value: '3.2K', label: 'Certifications Issued' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#00A3FF]">{stat.value}</div>
                  <div className="text-xs text-[#8B949E]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="py-12 border-b border-[#1F242C]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-semibold mb-6">Choose Your Learning Track</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LEARNING_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => setAudienceFilter(track.id as Audience)}
                className={`bg-[#161B22] border rounded-xl p-5 text-left hover:border-[${track.color}] transition-all ${
                  audienceFilter === track.id ? `border-[${track.color}] ring-1 ring-[${track.color}]` : 'border-[#1F242C]'
                }`}
              >
                <div className="text-3xl mb-3">{track.icon}</div>
                <h3 className="font-semibold mb-1" style={{ color: track.color }}>{track.title}</h3>
                <p className="text-sm text-[#8B949E] mb-3">{track.description}</p>
                <div className="flex gap-4 text-xs text-[#6E7681]">
                  <span>{track.courses} courses</span>
                  <span>{track.certifications} cert{track.certifications > 1 ? 's' : ''}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              {[
                { id: 'courses', label: 'All Courses', count: COURSES.length },
                { id: 'certifications', label: 'Certifications', count: CERTIFICATION_PATHS.length },
                { id: 'scenarios', label: 'Scenarios', count: SCENARIOS.length },
                { id: 'playbooks', label: 'Playbooks', count: playbooks.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#00A3FF] text-[#0D1117]'
                      : 'bg-[#161B22] text-[#8B949E] hover:text-white'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            
            {activeTab === 'courses' && (
              <div className="flex gap-3">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as any)}
                  className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#161B22] border border-[#1F242C] rounded-lg pl-10 pr-4 py-2 text-sm w-64"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Courses Grid */}
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#3D444D] transition-all group"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{TYPE_ICONS[course.type]}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${LEVEL_CONFIG[course.level].bg}`} style={{ color: LEVEL_CONFIG[course.level].color }}>
                          {LEVEL_CONFIG[course.level].label}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {course.isNew && (
                          <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded">New</span>
                        )}
                        {course.isRequired && (
                          <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded">Required</span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-[#00A3FF] transition-colors">{course.title}</h3>
                    <p className="text-sm text-[#8B949E] mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#6E7681] mb-4">
                      <span>⏱️ {course.duration}</span>
                      <span>📚 {course.lessons} lessons</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                    {course.certification && (
                      <div className="flex items-center gap-2 text-sm text-[#00A3FF] mb-4">
                        <span>🏅</span>
                        <span>Earns: {course.certification}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {course.tags.slice(0, 3).map((tag, j) => (
                        <span key={j} className="text-xs bg-[#1F242C] text-[#6E7681] px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[#1F242C] px-5 py-3 flex items-center justify-between bg-[#0D1117]">
                    <span className="text-xs text-[#6E7681]">{course.enrolled.toLocaleString()} enrolled</span>
                    <button className="text-sm text-[#00A3FF] font-medium hover:underline">
                      Start Course →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <p className="text-[#8B949E] mb-8">
                Earn professional certifications by completing course pathways. Certificates are blockchain-verified and shareable.
              </p>
              {CERTIFICATION_PATHS.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 hover:border-[#3D444D] transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl" style={{ backgroundColor: `${cert.color}20` }}>
                      {cert.badge}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{cert.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${LEVEL_CONFIG[cert.level].bg}`} style={{ color: LEVEL_CONFIG[cert.level].color }}>
                          {LEVEL_CONFIG[cert.level].label}
                        </span>
                      </div>
                      <p className="text-[#8B949E] mb-4">{cert.description}</p>
                      <div className="flex flex-wrap gap-6 text-sm">
                        <span className="text-[#6E7681]">⏱️ {cert.duration}</span>
                        <span className="text-[#6E7681]">📚 {cert.courses.length} courses required</span>
                      </div>
                    </div>
                    <button className="px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: cert.color, color: '#0D1117' }}>
                      Start Path
                    </button>
                  </div>
                  <div className="mt-6 pt-6 border-t border-[#1F242C]">
                    <h4 className="text-sm font-medium mb-3 text-[#8B949E]">Required Courses:</h4>
                    <div className="flex flex-wrap gap-2">
                      {cert.courses.map((courseId) => {
                        const course = COURSES.find(c => c.id === courseId);
                        return course ? (
                          <span key={courseId} className="text-sm bg-[#1F242C] px-3 py-1 rounded">
                            {TYPE_ICONS[course.type]} {course.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scenarios */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <p className="text-[#8B949E] mb-8">
                Practice real-world situations in safe sandbox environments. Scenarios simulate actual IVYAR operations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 hover:border-[#00A3FF] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎯</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        scenario.difficulty === 'Expert' ? 'bg-[#A371F7]/10 text-[#A371F7]' :
                        scenario.difficulty === 'Advanced' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        'bg-[#00A3FF]/10 text-[#00A3FF]'
                      }`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
                    <p className="text-sm text-[#8B949E] mb-4">{scenario.description}</p>
                    <div className="flex items-center gap-4 text-sm text-[#6E7681] mb-4">
                      <span>⏱️ {scenario.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scenario.skills.map((skill, j) => (
                        <span key={j} className="text-xs bg-[#1F242C] text-[#8B949E] px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="w-full py-2 bg-[#00A3FF]/10 text-[#00A3FF] rounded-lg font-medium hover:bg-[#00A3FF]/20 transition-colors">
                      Launch Scenario
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playbooks */}
          {activeTab === 'playbooks' && (
            <div className="space-y-6">
              <p className="text-[#8B949E] mb-8">
                Step-by-step deployment and configuration guides for technical teams.
              </p>
              {playbooks.map((playbook) => (
                <div
                  key={playbook.id}
                  className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 hover:border-[#3D444D] transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 bg-[#1F242C] rounded-xl flex items-center justify-center text-2xl">
                      📋
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{playbook.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${LEVEL_CONFIG[playbook.level].bg}`} style={{ color: LEVEL_CONFIG[playbook.level].color }}>
                          {LEVEL_CONFIG[playbook.level].label}
                        </span>
                      </div>
                      <p className="text-sm text-[#8B949E] mb-3">{playbook.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-[#6E7681]">
                        <span>⏱️ {playbook.duration}</span>
                        <span>📚 {playbook.lessons} steps</span>
                        <span>👥 {playbook.enrolled} completed</span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-[#1F242C] text-[#E6EDF3] rounded-lg font-medium hover:bg-[#2D333B] transition-colors">
                      Open Playbook
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {playbook.tags.map((tag, j) => (
                      <span key={j} className="text-xs bg-[#0D1117] text-[#6E7681] px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-16 bg-[#161B22] border-t border-[#1F242C]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Specialized Training Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ministry Training */}
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="bg-[#00A3FF]/10 p-6 border-b border-[#1F242C]">
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="text-xl font-semibold text-[#00A3FF]">Training for Ministries</h3>
                <p className="text-sm text-[#8B949E] mt-2">Comprehensive program for government institutions</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-sm">
                  {[
                    'Platform fundamentals (2 days)',
                    'HBS operations & workflows (3 days)',
                    'Procurement management (2 days)',
                    'Analytics & reporting (1 day)',
                    'Security & compliance (1 day)',
                    'Administrator certification (1 day)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#8B949E]">
                      <span className="text-[#3CCB7F]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-[#1F242C]">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#6E7681]">Duration</span>
                    <span>10 days (80 hours)</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#6E7681]">Format</span>
                    <span>On-site or Virtual</span>
                  </div>
                  <button className="w-full py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF]">
                    Request Training
                  </button>
                </div>
              </div>
            </div>

            {/* Donor Training */}
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="bg-[#EC4899]/10 p-6 border-b border-[#1F242C]">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-xl font-semibold text-[#EC4899]">Training for Donors</h3>
                <p className="text-sm text-[#8B949E] mt-2">For international development partners</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-sm">
                  {[
                    'Donor dashboard overview (0.5 day)',
                    'Funding tracking & allocation (1 day)',
                    'IATI compliance & reporting (1 day)',
                    'Impact measurement (1 day)',
                    'Blockchain verification (0.5 day)',
                    'Custom report building (1 day)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#8B949E]">
                      <span className="text-[#3CCB7F]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-[#1F242C]">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#6E7681]">Duration</span>
                    <span>5 days (40 hours)</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#6E7681]">Format</span>
                    <span>Virtual or Hybrid</span>
                  </div>
                  <button className="w-full py-3 bg-[#EC4899] text-[#0D1117] rounded-lg font-medium hover:bg-[#F472B6]">
                    Request Training
                  </button>
                </div>
              </div>
            </div>

            {/* Developer Training */}
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="bg-[#A371F7]/10 p-6 border-b border-[#1F242C]">
                <div className="text-3xl mb-3">💻</div>
                <h3 className="text-xl font-semibold text-[#A371F7]">Training for Developers</h3>
                <p className="text-sm text-[#8B949E] mt-2">Technical integration and extension training</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-sm">
                  {[
                    'API fundamentals & auth (1 day)',
                    'Advanced API integration (2 days)',
                    'Webhook implementation (1 day)',
                    'SDK deep dive (1 day)',
                    'Prometheus blockchain dev (2 days)',
                    'Security best practices (1 day)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#8B949E]">
                      <span className="text-[#3CCB7F]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-[#1F242C]">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#6E7681]">Duration</span>
                    <span>8 days (64 hours)</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#6E7681]">Format</span>
                    <span>Virtual + Hands-on Labs</span>
                  </div>
                  <button className="w-full py-3 bg-[#A371F7] text-[#0D1117] rounded-lg font-medium hover:bg-[#B794F6]">
                    Request Training
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Badges */}
      <section className="py-16 border-t border-[#1F242C]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Certification Path</h2>
            <p className="text-[#8B949E] max-w-2xl mx-auto">
              Progress through certification levels to demonstrate your IVYAR expertise. 
              All certificates are blockchain-verified and internationally recognized.
            </p>
          </div>
          
          <div className="relative">
            {/* Path Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#1F242C] -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {[
                { level: 'Fundamentals', icon: '🎓', hours: '10', color: '#3CCB7F', desc: 'Platform basics and navigation' },
                { level: 'Practitioner', icon: '📋', hours: '25', color: '#00A3FF', desc: 'Daily operations proficiency' },
                { level: 'Specialist', icon: '🎖️', hours: '50', color: '#F59E0B', desc: 'Advanced domain expertise' },
                { level: 'Expert', icon: '🏅', hours: '80', color: '#A371F7', desc: 'Strategic implementation' },
                { level: 'Master', icon: '🏆', hours: '120+', color: '#EC4899', desc: 'Platform mastery & training' },
              ].map((cert, i) => (
                <div key={i} className="flex flex-col items-center relative">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4 relative z-10"
                    style={{ backgroundColor: `${cert.color}20`, border: `3px solid ${cert.color}` }}
                  >
                    {cert.icon}
                  </div>
                  <h3 className="font-semibold text-center" style={{ color: cert.color }}>{cert.level}</h3>
                  <p className="text-xs text-[#6E7681] text-center mt-1">{cert.hours} hours</p>
                  <p className="text-xs text-[#8B949E] text-center mt-2">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#00A3FF]/10 to-[#A371F7]/10 border-t border-[#1F242C]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey</h2>
          <p className="text-[#8B949E] mb-8">
            Join thousands of professionals mastering the IVYAR platform. 
            Begin with our free fundamentals course.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF]">
              Create Free Account
            </button>
            <button className="px-8 py-3 bg-[#1F242C] text-[#E6EDF3] rounded-lg font-medium hover:bg-[#2D333B]">
              Request Enterprise Training
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-xs">
                IV
              </div>
              <span className="text-sm text-[#8B949E]">HBS Academy — IVYAR Training & Certification</span>
            </div>
            <div className="flex gap-6 text-sm text-[#6E7681]">
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
