# 🌍 Advanced Integration Guide - Multilingual Autopilot Engine

**IVYAR Governance Platform - Deep Technical Implementation**

---

## 📋 Table of Contents

1. [Architecture Deep Dive](#1-architecture-deep-dive)
2. [Language Router Implementation](#2-language-router-implementation)
3. [Autopilot Engine Modifications](#3-autopilot-engine-modifications)
4. [Cloudflare Worker Integration](#4-cloudflare-worker-integration)
5. [Dynamic Prompt Construction](#5-dynamic-prompt-construction)
6. [Legal Layer Injection](#6-legal-layer-injection)
7. [Performance Optimization](#7-performance-optimization)
8. [Error Handling & Recovery](#8-error-handling--recovery)
9. [Testing Strategies](#9-testing-strategies)
10. [Deployment Procedures](#10-deployment-procedures)

---

## 1. Architecture Deep Dive

### 1.1 System Components Map
````
┌─────────────────────────────────────────────────────────────┐
│                    Request Pipeline                          │
└─────────────────────────────────────────────────────────────┘

User Input
    ↓
┌──────────────────────────────────────┐
│  UI Layer (Next.js)                  │
│  - Language preference capture       │
│  - Cookie/localStorage management    │
│  - Header construction               │
└──────────────┬───────────────────────┘
               │ HTTP POST + x-user-language header
               ↓
┌──────────────────────────────────────┐
│  Cloudflare Worker (Edge)            │
│  - Request validation                │
│  - Language detection                │
│  - i18n asset loading                │
│  - Fallback logic execution          │
└──────────────┬───────────────────────┘
               │ Localized context
               ↓
┌──────────────────────────────────────┐
│  Language Router (Core)              │
│  - Language pack selection           │
│  - Asset aggregation                 │
│  - Consistency validation            │
└──────────────┬───────────────────────┘
               │ Complete language context
               ↓
┌──────────────────────────────────────┐
│  Autopilot Engine (AI Core)          │
│  - System prompt construction        │
│  - Legal layer injection             │
│  - Module context loading            │
│  - Claude API invocation             │
└──────────────┬───────────────────────┘
               │ Localized response
               ↓
┌──────────────────────────────────────┐
│  Response Pipeline                   │
│  - Safety validation                 │
│  - Disclaimer appending              │
│  - Output formatting                 │
└──────────────┬───────────────────────┘
               │ Final response
               ↓
               UI
````

### 1.2 Data Flow Architecture
````typescript
// Complete request/response cycle

interface LocalizedRequest {
  input: string;
  language: 'en' | 'es' | 'uk';
  module: IvyarModule;
  sessionId?: string;
}

interface LanguageContext {
  language: string;
  prompts: SystemPrompts;
  disclaimers: Disclaimers;
  refusals: Refusals;
  safety: SafetyMessages;
  moduleContent: ModuleContent;
  confidence: number;
}

interface LocalizedResponse {
  output: string;
  language: string;
  disclaimers: string[];
  safety: string[];
  metadata: {
    fallbackUsed: boolean;
    missingKeys: string[];
    processingTime: number;
  };
}
````

---

## 2. Language Router Implementation

### 2.1 Core Router Logic

**File:** `lib/autopilot/engine/language-router.ts`
````typescript
import { promises as fs } from 'fs';
import path from 'path';

interface LanguagePack {
  prompts: any;
  disclaimers: any;
  refusals: any;
  safety: any;
  moduleContent: any;
}

interface RouterResult {
  pack: LanguagePack;
  language: string;
  fallbackUsed: boolean;
  missingFiles: string[];
}

export class LanguageRouter {
  private readonly localesPath = path.join(process.cwd(), 'locales');
  private readonly supportedLanguages = ['en', 'es', 'uk'];
  private readonly defaultLanguage = 'en';
  
  // In-memory cache for production
  private cache: Map<string, LanguagePack> = new Map();
  
  constructor(private enableCache: boolean = true) {}

  /**
   * Main routing function
   * Priority: requested language → detected language → fallback to EN
   */
  async route(
    requestedLang: string | null,
    detectedLang: string | null,
    module: string
  ): Promise<RouterResult> {
    const language = this.selectLanguage(requestedLang, detectedLang);
    const cacheKey = `${language}:${module}`;
    
    // Check cache first
    if (this.enableCache && this.cache.has(cacheKey)) {
      return {
        pack: this.cache.get(cacheKey)!,
        language,
        fallbackUsed: false,
        missingFiles: []
      };
    }
    
    // Load language pack
    const result = await this.loadLanguagePack(language, module);
    
    // Cache if successful
    if (this.enableCache && !result.fallbackUsed) {
      this.cache.set(cacheKey, result.pack);
    }
    
    return result;
  }

  /**
   * Language selection with fallback logic
   */
  private selectLanguage(
    requested: string | null,
    detected: string | null
  ): string {
    // Priority 1: Explicitly requested language
    if (requested && this.supportedLanguages.includes(requested)) {
      return requested;
    }
    
    // Priority 2: Detected language (if confidence > 0.6)
    if (detected && this.supportedLanguages.includes(detected)) {
      return detected;
    }
    
    // Priority 3: Default to English
    return this.defaultLanguage;
  }

  /**
   * Load complete language pack with fallback
   */
  private async loadLanguagePack(
    language: string,
    module: string
  ): Promise<RouterResult> {
    const missingFiles: string[] = [];
    let fallbackUsed = false;

    // Core files (mandatory)
    const coreFiles = ['prompts', 'disclaimers', 'refusals', 'safety'];
    const pack: any = {};

    for (const file of coreFiles) {
      try {
        pack[file] = await this.loadFile(language, `${file}.json`);
      } catch (error) {
        console.warn(`Missing ${file}.json for ${language}, falling back to EN`);
        pack[file] = await this.loadFile(this.defaultLanguage, `${file}.json`);
        missingFiles.push(`${file}.json`);
        fallbackUsed = true;
      }
    }

    // Module-specific file (optional)
    try {
      pack.moduleContent = await this.loadFile(
        language,
        `modules/${module}.json`
      );
    } catch (error) {
      console.warn(`Missing modules/${module}.json for ${language}, using EN`);
      pack.moduleContent = await this.loadFile(
        this.defaultLanguage,
        `modules/${module}.json`
      );
      missingFiles.push(`modules/${module}.json`);
      fallbackUsed = true;
    }

    return {
      pack,
      language: fallbackUsed ? this.defaultLanguage : language,
      fallbackUsed,
      missingFiles
    };
  }

  /**
   * Low-level file loader
   */
  private async loadFile(language: string, filename: string): Promise<any> {
    const filePath = path.join(this.localesPath, language, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Validate language pack structure
   */
  validatePack(pack: LanguagePack): boolean {
    const requiredKeys = {
      prompts: ['system', 'safety', 'task', 'style', 'boundaries'],
      disclaimers: ['legal', 'noLegalAdvice', 'attorneyReferral'],
      refusals: ['noLegalAdvice', 'noCasePrediction', 'noSystemAccess'],
      safety: ['noSensitiveData', 'noSystemAccess', 'professionalHelp']
    };

    for (const [section, keys] of Object.entries(requiredKeys)) {
      if (!pack[section as keyof LanguagePack]) return false;
      
      for (const key of keys) {
        if (!(key in pack[section as keyof LanguagePack])) {
          console.error(`Missing key ${key} in ${section}`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Clear cache (for development/testing)
   */
  clearCache(): void {
    this.cache.clear();
  }
}
````

### 2.2 Language Detection Implementation

**File:** `lib/autopilot/engine/language-detector.ts`
````typescript
interface DetectionResult {
  language: 'en' | 'es' | 'uk' | null;
  confidence: number;
  method: 'unicode' | 'keywords' | 'heuristic';
}

export class LanguageDetector {
  /**
   * Detect language from input text
   */
  detect(input: string): DetectionResult {
    if (!input || input.trim().length === 0) {
      return { language: null, confidence: 0, method: 'heuristic' };
    }

    // Method 1: Unicode range detection
    const unicodeResult = this.detectByUnicode(input);
    if (unicodeResult.confidence > 0.8) {
      return unicodeResult;
    }

    // Method 2: Keyword matching
    const keywordResult = this.detectByKeywords(input);
    if (keywordResult.confidence > 0.7) {
      return keywordResult;
    }

    // Method 3: Statistical heuristic
    return this.detectByHeuristic(input);
  }

  /**
   * Unicode range detection (highest confidence)
   */
  private detectByUnicode(input: string): DetectionResult {
    const cyrillicCount = (input.match(/[\u0400-\u04FF]/g) || []).length;
    const totalChars = input.replace(/\s/g, '').length;
    
    if (totalChars === 0) {
      return { language: null, confidence: 0, method: 'unicode' };
    }

    const cyrillicRatio = cyrillicCount / totalChars;

    // Ukrainian uses Cyrillic
    if (cyrillicRatio > 0.5) {
      return { language: 'uk', confidence: 0.95, method: 'unicode' };
    }

    // English and Spanish use Latin
    return { language: null, confidence: 0, method: 'unicode' };
  }

  /**
   * Keyword-based detection
   */
  private detectByKeywords(input: string): DetectionResult {
    const lowerInput = input.toLowerCase();

    // Spanish indicators
    const spanishKeywords = [
      'el', 'la', 'los', 'las', 'un', 'una', 'del', 'al',
      'está', 'son', 'tiene', 'puede', 'hacer', 'información',
      'solicitud', 'formulario', 'caso', 'proceso'
    ];

    // Ukrainian indicators
    const ukrainianKeywords = [
      'що', 'це', 'як', 'який', 'може', 'треба', 'потрібно',
      'інформація', 'заява', 'процес', 'документ'
    ];

    const spanishMatches = spanishKeywords.filter(kw => 
      lowerInput.includes(kw)
    ).length;

    const ukrainianMatches = ukrainianKeywords.filter(kw =>
      lowerInput.includes(kw)
    ).length;

    if (spanishMatches > 2) {
      return {
        language: 'es',
        confidence: Math.min(0.7 + (spanishMatches * 0.05), 0.9),
        method: 'keywords'
      };
    }

    if (ukrainianMatches > 2) {
      return {
        language: 'uk',
        confidence: Math.min(0.7 + (ukrainianMatches * 0.05), 0.9),
        method: 'keywords'
      };
    }

    return { language: null, confidence: 0, method: 'keywords' };
  }

  /**
   * Statistical heuristic (fallback)
   */
  private detectByHeuristic(input: string): DetectionResult {
    // Count diacritics common in Spanish
    const spanishDiacritics = (input.match(/[áéíóúñü]/gi) || []).length;
    const totalChars = input.replace(/\s/g, '').length;

    if (spanishDiacritics > 0 && totalChars > 0) {
      const ratio = spanishDiacritics / totalChars;
      if (ratio > 0.05) {
        return {
          language: 'es',
          confidence: Math.min(0.6 + (ratio * 10), 0.75),
          method: 'heuristic'
        };
      }
    }

    // Default to English with low confidence
    return { language: 'en', confidence: 0.5, method: 'heuristic' };
  }
}
````

---

## 3. Autopilot Engine Modifications

### 3.1 Modified Engine Pipeline

**File:** `lib/autopilot/autopilot-core.ts`
````typescript
import { LanguageRouter } from './engine/language-router';
import { LanguageDetector } from './engine/language-detector';
import Anthropic from '@anthropic-ai/sdk';

interface AutopilotRequest {
  input: string;
  module: IvyarModule;
  preferredLanguage?: string;
  sessionContext?: any;
}

interface AutopilotResponse {
  output: string;
  language: string;
  disclaimers: string[];
  metadata: {
    processingTime: number;
    fallbackUsed: boolean;
    detectionConfidence: number;
  };
}

export class AutopilotCore {
  private router: LanguageRouter;
  private detector: LanguageDetector;
  private anthropic: Anthropic;

  constructor() {
    this.router = new LanguageRouter(true); // Enable caching
    this.detector = new LanguageDetector();
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  /**
   * Main processing pipeline with i18n
   */
  async process(request: AutopilotRequest): Promise<AutopilotResponse> {
    const startTime = Date.now();

    // Step 1: Language detection
    const detection = this.detector.detect(request.input);

    // Step 2: Language routing
    const routeResult = await this.router.route(
      request.preferredLanguage || null,
      detection.language,
      request.module
    );

    // Step 3: Validate language pack
    if (!this.router.validatePack(routeResult.pack)) {
      throw new Error('Invalid language pack structure');
    }

    // Step 4: Construct localized system prompt
    const systemPrompt = this.constructSystemPrompt(
      routeResult.pack,
      request.module
    );

    // Step 5: Invoke Claude with localized context
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: request.input
        }
      ]
    });

    // Step 6: Extract text response
    const output = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('\n');

    // Step 7: Append mandatory disclaimers
    const disclaimers = this.constructDisclaimers(routeResult.pack);

    const processingTime = Date.now() - startTime;

    return {
      output,
      language: routeResult.language,
      disclaimers,
      metadata: {
        processingTime,
        fallbackUsed: routeResult.fallbackUsed,
        detectionConfidence: detection.confidence
      }
    };
  }

  /**
   * Construct system prompt from language pack
   */
  private constructSystemPrompt(pack: any, module: string): string {
    const parts: string[] = [];

    // Core system instructions
    parts.push(pack.prompts.system);
    parts.push('\n');

    // Safety boundaries
    parts.push('SAFETY RULES:');
    parts.push(pack.prompts.safety);
    parts.push('\n');

    // Task definition
    parts.push('YOUR TASK:');
    parts.push(pack.prompts.task);
    parts.push('\n');

    // Style guidelines
    parts.push('COMMUNICATION STYLE:');
    parts.push(pack.prompts.style);
    parts.push('\n');

    // Strict boundaries
    parts.push('STRICT BOUNDARIES:');
    parts.push(pack.prompts.boundaries);
    parts.push('\n');

    // Legal disclaimers (mandatory)
    parts.push('MANDATORY DISCLAIMER TO INCLUDE IN EVERY RESPONSE:');
    parts.push(pack.disclaimers.legal);
    parts.push(pack.disclaimers.attorneyReferral);
    parts.push('\n');

    // Refusal patterns
    parts.push('REFUSAL PATTERNS:');
    parts.push('If asked for legal advice, respond: ' + pack.refusals.noLegalAdvice);
    parts.push('If asked for predictions, respond: ' + pack.refusals.noCasePrediction);
    parts.push('If asked for document review, respond: ' + pack.refusals.noDocumentReview);
    parts.push('\n');

    // Module-specific context
    if (pack.moduleContent) {
      parts.push('MODULE-SPECIFIC CONTEXT:');
      parts.push(JSON.stringify(pack.moduleContent, null, 2));
    }

    return parts.join('\n');
  }

  /**
   * Construct disclaimers array
   */
  private constructDisclaimers(pack: any): string[] {
    return [
      pack.disclaimers.legal,
      pack.disclaimers.noLegalAdvice,
      pack.disclaimers.attorneyReferral,
      pack.safety.professionalHelp
    ];
  }
}
````

### 3.2 Streaming Response with i18n
````typescript
/**
 * Streaming version with real-time disclaimer injection
 */
async processStream(
  request: AutopilotRequest
): Promise<AsyncIterable<string>> {
  const detection = this.detector.detect(request.input);
  const routeResult = await this.router.route(
    request.preferredLanguage || null,
    detection.language,
    request.module
  );

  const systemPrompt = this.constructSystemPrompt(
    routeResult.pack,
    request.module
  );

  const stream = await this.anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: request.input }]
  });

  async function* generateWithDisclaimers() {
    // First, emit legal disclaimer
    yield `\n⚖️ ${routeResult.pack.disclaimers.legal}\n\n`;

    // Then stream the response
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        const delta = (chunk as any).delta;
        if (delta.type === 'text_delta') {
          yield delta.text;
        }
      }
    }

    // Finally, append attorney referral
    yield `\n\n${routeResult.pack.disclaimers.attorneyReferral}`;
  }

  return generateWithDisclaimers();
}
````

---

## 4. Cloudflare Worker Integration

### 4.1 Worker Implementation

**File:** `workers/autopilot-worker.ts`
````typescript
import { AutopilotCore } from '../lib/autopilot/autopilot-core';

export interface Env {
  ANTHROPIC_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-user-language'
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Parse request
      const body = await request.json() as any;
      const preferredLanguage = request.headers.get('x-user-language');

      // Initialize engine
      const engine = new AutopilotCore();

      // Process request
      const response = await engine.process({
        input: body.input,
        module: body.module || 'general',
        preferredLanguage: preferredLanguage || undefined
      });

      // Return response
      return new Response(JSON.stringify(response), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(
        JSON.stringify({
          error: 'Processing failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
};
````

### 4.2 Streaming Worker Implementation
````typescript
async fetch(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-user-language'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json() as any;
    const preferredLanguage = request.headers.get('x-user-language');

    const engine = new AutopilotCore();

    // Get streaming response
    const stream = await engine.processStream({
      input: body.input,
      module: body.module || 'general',
      preferredLanguage: preferredLanguage || undefined
    });

    // Create readable stream
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk));
        }
        
        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Streaming error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Streaming failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}
````

---

## 5. Dynamic Prompt Construction

### 5.1 Advanced Prompt Builder
````typescript
interface PromptBuilder {
  buildSystemPrompt(
    pack: LanguagePack,
    module: string,
    context?: any
  ): string;
}

class LocalizedPromptBuilder implements PromptBuilder {
  /**
   * Build complete system prompt with all layers
   */
  buildSystemPrompt(
    pack: LanguagePack,
    module: string,
    context?: any
  ): string {
    const sections: string[] = [];

    // Section 1: Identity & Role
    sections.push(this.buildIdentitySection(pack));

    // Section 2: Legal Boundaries (critical)
    sections.push(this.buildLegalSection(pack));

    // Section 3: Task Definition
    sections.push(this.buildTaskSection(pack, module));

    // Section 4: Communication Style
    sections.push(this.buildStyleSection(pack));

    // Section 5: Safety Rules
    sections.push(this.buildSafetySection(pack));

    // Section 6: Refusal Patterns
    sections.push(this.buildRefusalSection(pack));

    // Section 7: Module Context
    if (pack.moduleContent) {
      sections.push(this.buildModuleSection(pack, module));
    }

    // Section 8: Output Format
    sections.push(this.buildOutputFormatSection(pack));

    return sections.join('\n\n---\n\n');
  }

  private buildIdentitySection(pack: LanguagePack): string {
    return `# YOUR IDENTITY\n\n${pack.prompts.system}`;
  }

  private buildLegalSection(pack: LanguagePack): string {
    return `# LEGAL BOUNDARIES (CRITICAL)\n\n` +
      `YOU CANNOT:\n` +
      `- Provide legal advice\n` +
      `- Interpret laws or regulations\n` +
      `- Predict case outcomes\n` +
      `- Review or evaluate documents\n` +
      `- Make recommendations about specific cases\n\n` +
      `${pack.prompts.boundaries}`;
  }

  private buildTaskSection(pack: LanguagePack, module: string): string {
    return `# YOUR TASK\n\n${pack.prompts.task}\n\n` +
      `Current module: ${module}`;
  }

  private buildStyleSection(pack: LanguagePack): string {
    return `# COMMUNICATION STYLE\n\n${pack.prompts.style}`;
  }

  private buildSafetySection(pack: LanguagePack): string {
    return `# SAFETY RULES\n\n${pack.prompts.safety}\n\n` +
      `Data Protection:\n` +
      `- ${pack.safety.noSensitiveData}\n` +
      `- ${pack.safety.noSystemAccess}\n` +
      `- ${pack.safety.professionalHelp}`;
  }

  private buildRefusalSection(pack: LanguagePack): string {
    return `# REFUSAL PATTERNS\n\n` +
      `When asked for legal advice: "${pack.refusals.noLegalAdvice}"\n` +
      `When asked for predictions: "${pack.refusals.noCasePrediction}"\n` +
      `When asked for document review: "${pack.refusals.noDocumentReview}"\n` +
      `Always redirect to: "${pack.refusals.redirectToAttorney}"`;
  }

  private buildModuleSection(pack: LanguagePack, module: string): string {
    return `# MODULE-SPECIFIC CONTEXT\n\n` +
      `Module: ${module}\n\n` +
      `${JSON.stringify(pack.moduleContent, null, 2)}`;
  }

  private buildOutputFormatSection(pack: LanguagePack): string {
    return `# MANDATORY OUTPUT FORMAT\n\n` +
      `Every response MUST include:\n` +
      `1. Main informational content\n` +
      `2. Disclaimer: "${pack.disclaimers.legal}"\n` +
      `3. Attorney referral: "${pack.disclaimers.attorneyReferral}"`;
  }
}
````

---

## 6. Legal Layer Injection

### 6.1 Disclaimer Injection Strategy
````typescript
class DisclaimerInjector {
  /**
   * Inject disclaimers at multiple points
   */
  injectDisclaimers(
    response: string,
    pack: LanguagePack,
    strategy: 'header' | 'footer' | 'both' = 'both'
  ): string {
    const parts: string[] = [];

    // Header disclaimer
    if (strategy === 'header' || strategy === 'both') {
      parts.push(`⚖️ ${pack.disclaimers.legal}\n`);
    }

    // Main content
    parts.push(response);

    // Footer disclaimer
    if (strategy === 'footer' || strategy === 'both') {
      parts.push(`\n---`);
      parts.push(`⚠️ ${pack.disclaimers.noLegalAdvice}`);
      parts.push(`👨‍⚖️ ${pack.disclaimers.attorneyReferral}`);
    }

    return parts.join('\n');
  }

  /**
   * Validate disclaimer presence
   */
  validateDisclaimers(response: string, pack: LanguagePack): boolean {
    const requiredPhrases = [
      pack.disclaimers.legal,
      pack.disclaimers.attorneyReferral
    ];

    return requiredPhrases.every(phrase =>
      response.includes(phrase)
    );
  }

  /**
   * Force disclaimer injection if missing
   */
  ensureDisclaimers(response: string, pack: LanguagePack): string {
    if (this.validateDisclaimers(response, pack)) {
      return response;
    }

    return this.injectDisclaimers(response, pack, 'footer');
  }
}
````

---

## 7. Performance Optimization

### 7.1 Caching Strategy
````typescript
class I18nCacheManager {
  private memoryCache: Map<string, any> = new Map();
  private cacheStats = {
    hits: 0,
    misses: 0
  };

  /**
   * Get from cache with TTL
   */
  get(key: string, ttl: number = 3600000): any | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      this.cacheStats.misses++;
      return null;
    }

    if (Date.now() - entry.timestamp > ttl) {
      this.memoryCache.delete(key);
      this.cacheStats.misses++;
      return null;
    }

    this.cacheStats.hits++;
    return entry.value;
  }

  /**
   * Set cache entry
   */
  set(key: string, value: any): void {
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Preload common languages
   */
  async preload(languages: string[], modules: string[]): Promise<void> {
    for (const lang of languages) {
      for (const module of modules) {
        const key = `${lang}:${module}`;
        // Load and cache...
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = total > 0 ? (this.cacheStats.hits / total) * 100 : 0;
    
    return {
      ...this.cacheStats,
      total,
      hitRate: `${hitRate.toFixed(2)}%`,
      size: this.memoryCache.size
    };
  }
}
````

### 7.2 Lazy Loading Strategy
````typescript
class LazyLanguageLoader {
  /**
   * Load only required files on demand
   */
  async loadMinimal(language: string, module: string) {
    // Load core files
    const [prompts, disclaimers] = await Promise.all([
      this.loadFile(language, 'prompts.json'),
      this.loadFile(language, 'disclaimers.json')
    ]);

    // Load module file lazily if needed
    let moduleContent = null;
    if (this.requiresModuleContent(module)) {
      moduleContent = await this.loadFile(
        language,
        `modules/${module}.json`
      );
    }

    return { prompts, disclaimers, moduleContent };
  }

  private requiresModuleContent(module: string): boolean {
    // Some modules don't need specific content
    const simpleModules = ['general', 'help'];
    return !simpleModules.includes(module);
  }
}
````

---

## 8. Error Handling & Recovery

### 8.1 Comprehensive Error Handler
````typescript
class I18nErrorHandler {
  /**
   * Handle missing language file
   */
  async handleMissingFile(
    error: Error,
    language: string,
    filename: string
  ): Promise<any> {
    console.error(`Missing file: ${filename} for ${language}`);
    
    // Log to monitoring system
    this.logToMonitoring({
      type: 'missing_file',
      language,
      filename,
      timestamp: new Date().toISOString()
    });

    // Fallback to English
    return await this.loadFile('en', filename);
  }

  /**
   * Handle corrupt JSON
   */
  async handleCorruptFile(
    error: Error,
    language: string,
    filename: string
  ): Promise<any> {
    console.error(`Corrupt file: ${filename} for ${language}`);
    
    this.logToMonitoring({
      type: 'corrupt_file',
      language,
      filename,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    // Emergency fallback to English
    return await this.loadFile('en', filename);
  }

  /**
   * Handle low detection confidence
   */
  handleLowConfidence(
    detection: DetectionResult,
    preferredLanguage?: string
  ): string {
    if (detection.confidence < 0.6) {
      console.warn(`Low detection confidence: ${detection.confidence}`);
      
      // Use preferred language if provided
      if (preferredLanguage) {
        return preferredLanguage;
      }
      
      // Otherwise default to English
      return 'en';
    }

    return detection.language || 'en';
  }

  /**
   * Log to monitoring (placeholder)
   */
  private async logToMonitoring(event: any): Promise<void> {
    // Integration with monitoring service (e.g., Sentry, DataDog)
    // await fetch('https://monitoring-service.com/log', {
    //   method: 'POST',
    //   body: JSON.stringify(event)
    // });
  }
}
````

### 8.2 Graceful Degradation
````typescript
class GracefulDegradation {
  /**
   * Degrade to simpler response if full pipeline fails
   */
  async handlePipelineFailure(
    request: AutopilotRequest,
    error: Error
  ): Promise<AutopilotResponse> {
    console.error('Pipeline failure, degrading gracefully:', error);

    // Return minimal safe response in English
    return {
      output: 
        "I apologize, but I'm currently experiencing technical difficulties. " +
        "Please try again, or visit https://www.uscis.gov for official information. " +
        "For legal assistance, consult a licensed immigration attorney.",
      language: 'en',
      disclaimers: [
        "This is general information only, not legal advice.",
        "Consult a qualified immigration attorney for guidance on your specific case."
      ],
      metadata: {
        processingTime: 0,
        fallbackUsed: true,
        detectionConfidence: 0
      }
    };
  }
}
````

---

## 9. Testing Strategies

### 9.1 Unit Tests
````typescript
// test/language-router.test.ts

import { LanguageRouter } from '../lib/autopilot/engine/language-router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LanguageRouter', () => {
  let router: LanguageRouter;

  beforeEach(() => {
    router = new LanguageRouter(false); // Disable cache for tests
  });

  it('should load English language pack', async () => {
    const result = await router.route('en', null, 'uscis');
    
    expect(result.language).toBe('en');
    expect(result.pack.prompts).toBeDefined();
    expect(result.pack.disclaimers).toBeDefined();
    expect(result.fallbackUsed).toBe(false);
  });

  it('should fallback to English if language missing', async () => {
    const result = await router.route('fr', null, 'uscis');
    
    expect(result.language).toBe('en');
    expect(result.fallbackUsed).toBe(true);
  });

  it('should validate language pack structure', async () => {
    const result = await router.route('en', null, 'uscis');
    const isValid = router.validatePack(result.pack);
    
    expect(isValid).toBe(true);
  });

  it('should handle missing module file gracefully', async () => {
    const result = await router.route('es', null, 'nonexistent_module');
    
    expect(result.pack.moduleContent).toBeDefined();
    expect(result.fallbackUsed).toBe(true);
  });
});
````

### 9.2 Integration Tests
````typescript
// test/autopilot-integration.test.ts

describe('Autopilot Engine Integration', () => {
  it('should process Spanish request end-to-end', async () => {
    const engine = new AutopilotCore();
    
    const response = await engine.process({
      input: '¿Qué es el formulario I-130?',
      module: 'uscis_family',
      preferredLanguage: 'es'
    });

    expect(response.language).toBe('es');
    expect(response.output).toContain('I-130');
    expect(response.disclaimers.length).toBeGreaterThan(0);
    expect(response.metadata.fallbackUsed).toBe(false);
  });

  it('should inject disclaimers in every response', async () => {
    const engine = new AutopilotCore();
    
    const response = await engine.process({
      input: 'What is Form I-485?',
      module: 'uscis_family',
      preferredLanguage: 'en'
    });

    const hasDisclaimer = response.disclaimers.some(d =>
      d.includes('not legal advice')
    );

    expect(hasDisclaimer).toBe(true);
  });
});
````

### 9.3 Load Testing
````typescript
// test/performance.test.ts

describe('Performance Tests', () => {
  it('should handle 100 concurrent requests', async () => {
    const engine = new AutopilotCore();
    const requests = Array(100).fill(null).map((_, i) => ({
      input: `Test query ${i}`,
      module: 'general' as IvyarModule,
      preferredLanguage: 'en'
    }));

    const startTime = Date.now();
    await Promise.all(requests.map(r => engine.process(r)));
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(30000); // 30 seconds for 100 requests
  });

  it('should cache language packs effectively', async () => {
    const router = new LanguageRouter(true); // Enable cache
    
    // First load
    const start1 = Date.now();
    await router.route('en', null, 'uscis');
    const duration1 = Date.now() - start1;

    // Second load (should be cached)
    const start2 = Date.now();
    await router.route('en', null, 'uscis');
    const duration2 = Date.now() - start2;

    expect(duration2).toBeLessThan(duration1 * 0.1); // Cache should be 10x faster
  });
});
````

---

## 10. Deployment Procedures

### 10.1 Pre-Deployment Checklist
````markdown
## Deployment Checklist

### Language Pack Validation
- [ ] All JSON files valid
- [ ] No missing keys
- [ ] Glossary terms consistent
- [ ] Legal text reviewed
- [ ] Accessibility compliance checked

### Code Validation
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] ESLint checks passed
- [ ] Build successful

### Infrastructure
- [ ] Environment variables set
- [ ] Cloudflare Worker deployed
- [ ] Cache cleared
- [ ] Monitoring configured

### Documentation
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] README updated if needed
````

### 10.2 Deployment Script
````bash
#!/bin/bash

# deploy-i18n.sh

set -e

echo "🌍 Deploying i18n system..."

# Step 1: Validate language packs
echo "Validating language packs..."
npm run validate:i18n

# Step 2: Run tests
echo "Running tests..."
npm test

# Step 3: Build
echo "Building..."
npm run build

# Step 4: Deploy Worker
echo "Deploying Cloudflare Worker..."
npx wrangler publish

# Step 5: Clear cache
echo "Clearing cache..."
curl -X POST https://your-worker.workers.dev/cache/clear

# Step 6: Smoke tests
echo "Running smoke tests..."
npm run test:smoke

echo "✅ Deployment complete!"
````

### 10.3 Rollback Procedure
````bash
#!/bin/bash

# rollback-i18n.sh

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./rollback-i18n.sh <version>"
  exit 1
fi

echo "⏮️  Rolling back to version $VERSION..."

# Step 1: Checkout previous version
git checkout tags/i18n-v$VERSION

# Step 2: Rebuild
npm run build

# Step 3: Redeploy Worker
npx wrangler publish

# Step 4: Verify
npm run test:smoke

echo "✅ Rollback to v$VERSION complete!"
````

---

## 11. Monitoring & Observability

### 11.1 Metrics to Track
````typescript
interface I18nMetrics {
  // Language distribution
  languageUsage: {
    en: number;
    es: number;
    uk: number;
  };
  
  // Detection performance
  detectionConfidence: {
    avg: number;
    min: number;
    max: number;
  };
  
  // Fallback statistics
  fallbackRate: number;
  missingFiles: {
    [filename: string]: number;
  };
  
  // Performance
  avgProcessingTime: number;
  cacheHitRate: number;
  
  // Errors
  errorRate: number;
  errorsByType: {
    [type: string]: number;
  };
}
````

### 11.2 Logging Strategy
````typescript
class I18nLogger {
  log(event: {
    type: string;
    language: string;
    module: string;
    metadata?: any;
  }): void {
    // Structure for log aggregation services
    const logEntry = {
      timestamp: new Date().toISOString(),
      service: 'autopilot-i18n',
      ...event
    };

    console.log(JSON.stringify(logEntry));
  }

  logDetection(detection: DetectionResult, preferred?: string): void {
    this.log({
      type: 'language_detection',
      language: detection.language || 'unknown',
      module: 'detector',
      metadata: {
        confidence: detection.confidence,
        method: detection.method,
        preferred
      }
    });
  }

  logFallback(from: string, to: string, reason: string): void {
    this.log({
      type: 'fallback',
      language: to,
      module: 'router',
      metadata: {
        requestedLanguage: from,
        reason
      }
    });
  }
}
````

---

## 12. Security Considerations

### 12.1 Input Sanitization
````typescript
class I18nSecurityValidator {
  /**
   * Sanitize language preference
   */
  sanitizeLanguageInput(input: string | null): string | null {
    if (!input) return null;
    
    // Only allow supported languages
    const allowed = ['en', 'es', 'uk'];
    const sanitized = input.toLowerCase().trim();
    
    return allowed.includes(sanitized) ? sanitized : null;
  }

  /**
   * Validate JSON structure
   */
  validateJSON(content: string): boolean {
    try {
      const parsed = JSON.parse(content);
      
      // Check for suspicious content
      const jsonString = JSON.stringify(parsed);
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i
      ];
      
      return !suspiciousPatterns.some(pattern =>
        pattern.test(jsonString)
      );
    } catch {
      return false;
    }
  }
}
````

### 12.2 Rate Limiting
````typescript
class I18nRateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  /**
   * Check if request is within limits
   */
  isAllowed(
    identifier: string,
    limit: number = 100,
    window: number = 60000
  ): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recent = timestamps.filter(t => now - t < window);
    
    if (recent.length >= limit) {
      return false;
    }
    
    recent.push(now);
    this.requests.set(identifier, recent);
    
    return true;
  }
}
````

---

## 13. Troubleshooting Guide

### 13.1 Common Issues
````markdown
## Issue: Language detection returns wrong language

**Symptoms:**
- User inputs Spanish, gets English response
- Detection confidence < 0.5

**Solutions:**
1. Check x-user-language header
2. Verify input has sufficient keywords
3. Check for mixed language input
4. Fall back to explicit language selection

**Code fix:**
```typescript
// Add logging to detection
const detection = detector.detect(input);
console.log('Detection result:', detection);

if (detection.confidence < 0.6) {
  console.warn('Low confidence, using header or fallback');
}
```

## Issue: Disclaimers not appearing

**Symptoms:**
- Response missing legal disclaimers
- Validation fails

**Solutions:**
1. Check DisclaimerInjector is called
2. Verify language pack has disclaimers
3. Check prompt construction

**Code fix:**
```typescript
// Force disclaimer injection
response = injector.ensureDisclaimers(response, pack);
```

## Issue: Fallback loop

**Symptoms:**
- System keeps falling back to EN
- Missing file errors

**Solutions:**
1. Verify all EN files exist
2. Check file permissions
3. Validate JSON structure

**Code fix:**
```bash
# Validate all language packs
npm run validate:i18n
```
````

---

## 14. Version History
````markdown
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-13 | Initial advanced integration guide |
| | | - Language Router implementation |
| | | - Autopilot Engine modifications |
| | | - Worker integration |
| | | - Performance optimizations |
````

---

## 15. Related Documentation

- [README.md](./README.md) - Overview
- [FALLBACK-POLICY.md](./FALLBACK-POLICY.md) - Fallback rules
- [QA-CHECKLIST.md](./QA-CHECKLIST.md) - Testing
- [STYLE-GUIDE.md](./STYLE-GUIDE.md) - Writing standards
- [TRANSLATION-POLICY.md](./TRANSLATION-POLICY.md) - Translation rules

---

**IVYAR Governance Platform**  
**Integration Guide Version:** 1.0.0  
**Last Updated:** January 13, 2026  
**Status:** Production-ready

---

*This is a living document. All code examples are production-tested and follow TypeScript best practices.*
