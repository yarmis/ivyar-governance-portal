// lib/uscis-intelligence/safety-layer.ts

/**
 * Safety layer for USCIS Intelligence
 * Blocks queries that could be interpreted as requests for legal advice
 */

const BLOCKED_PATTERNS = [
  /should i apply/i,
  /what should i do/i,
  /will (i|my case) (be approved|get denied)/i,
  /am i eligible/i,
  /can i (apply|file)/i,
  /is my case strong/i,
  /will they approve/i,
  /what are my chances/i,
  /help me fill out/i,
  /complete (this|my) form/i,
];

const REFUSAL_RESPONSE = `⚖️ I cannot provide legal advice or case-specific guidance.

For questions about YOUR specific situation, eligibility, or what YOU should do, please consult a qualified immigration attorney.

I can only provide general, publicly available information about USCIS processes.

Would you like me to explain:
- What a specific form is generally used for?
- What documents are commonly required?
- What a USCIS status message means?`;

export function shouldBlockQuery(query: string): boolean {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(query));
}

export function getRefusalResponse(): string {
  return REFUSAL_RESPONSE;
}

export function sanitizeQuery(query: string): string {
  // Remove personally identifiable information patterns
  return query
    .replace(/\b[A-Z]{3}\d{10}\b/g, '[CASE_NUMBER]') // A-numbers
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSNs
    .replace(/\b[A-Z]\d{9}\b/g, '[RECEIPT_NUMBER]'); // Receipt numbers
}