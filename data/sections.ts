// data/sections.ts

export interface SectionDefinition {
  id: string;
  title: string;
  subtitle: string;
}

export const sections: SectionDefinition[] = [
  {
    id: 'governance',
    title: 'Governance & Oversight',
    subtitle: 'Transparency, auditability, and AI-aligned decision control across ministries and donors.',
  },
  {
    id: 'identity',
    title: 'Identity, Access & Security',
    subtitle: 'Authority, authentication, and institutional risk management.',
  },
  {
    id: 'operations',
    title: 'Operations & Logistics',
    subtitle: 'Supply chains, emergency response, and national infrastructure coordination.',
  },
  {
    id: 'social',
    title: 'Social & Human Services',
    subtitle: 'Veterans, healthcare, education, and citizen-facing services.',
  },
  {
    id: 'finance',
    title: 'Finance & Procurement',
    subtitle: 'Transparent procurement, payments, donor visibility, and fiscal planning.',
  },
  {
    id: 'infrastructure',
    title: 'Cross-Government Infrastructure',
    subtitle: 'Inter-agency data exchange, multi-donor coordination, and national API gateways.',
  },
];
