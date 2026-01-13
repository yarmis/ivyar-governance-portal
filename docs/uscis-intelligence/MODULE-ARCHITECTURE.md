# USCIS Intelligence - Module Architecture

**Technical Architecture Documentation**

---

## 🏗️ System Overview

The USCIS Intelligence Module is built as a modular, AI-powered informational assistant integrated into the IVYAR Governance Platform. It follows a clean separation of concerns with strict compliance boundaries.

---

## 📊 Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                            │
│                                                              │
│  /uscis-intelligence page (Next.js)                         │
│  - Hero section with legal disclaimer                       │
│  - Category selection (5 case types)                        │
│  - Official resources links                                 │
│  - AutopilotWidget component                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Auto-detect module from URL
                     │
┌────────────────────▼────────────────────────────────────────┐
│              AUTOPILOT WIDGET (React)                        │
│                                                              │
│  - Detects module: 'uscis_family', 'uscis_n400', etc.      │
│  - Opens AI chat interface                                  │
│  - Streams responses from worker                            │
│  - Displays suggested questions                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS Request
                     │
┌────────────────────▼────────────────────────────────────────┐
│         AUTOPILOT WORKER (Cloudflare Worker)                │
│                                                              │
│  Endpoint: https://ivyar-autopilot-v8.ivyar-gov.workers.dev │
│                                                              │
│  1. Receives user query + module type                       │
│  2. Loads appropriate USCIS scenario                        │
│  3. Calls Claude Sonnet 4 API                               │
│  4. Streams response back to client                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Anthropic API
                     │
┌────────────────────▼────────────────────────────────────────┐
│              CLAUDE SONNET 4 (Anthropic)                    │
│                                                              │
│  - Processes query with USCIS scenario system prompt        │
│  - Applies strict legal guardrails                          │
│  - Generates informational response                         │
│  - Includes mandatory disclaimers                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Breakdown

### 1. Frontend Layer

**Location:** `app/uscis-intelligence/page.tsx`

**Responsibilities:**
- Display module UI
- Show legal disclaimers
- Present 5 category cards
- Integrate AutopilotWidget
- Link to official resources

**Key Features:**
- Dark mode support
- Responsive grid layout
- Severity-based card styling (Standard/Complex/Critical)
- Prominent legal disclaimer box

**Technologies:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Inline styles (no external CSS)

---

### 2. Routing Layer

**Location:** `components/AutopilotWidget.tsx`

**Auto-Detection Logic:**
```typescript
const moduleMap: Record<string, IvyarModule> = {
  'uscis-intelligence': 'uscis_family',     // Default
  'uscis-family': 'uscis_family',
  'uscis-n400': 'uscis_n400',
  'uscis-employment': 'uscis_employment',
  'uscis-nonimmigrant': 'uscis_nonimmigrant',
  'uscis-humanitarian': 'uscis_humanitarian',
};
```

**URL Mapping:**
- `/uscis-intelligence` → Family-Based scenario
- `/uscis-family` → Family-Based scenario
- `/uscis-n400` → Naturalization scenario
- `/uscis-employment` → Employment-Based scenario
- `/uscis-nonimmigrant` → Non-Immigrant scenario
- `/uscis-humanitarian` → Humanitarian scenario

---

### 3. AI Scenario Layer

**Location:** `lib/autopilot/ivyar-autopilot-scenarios.ts`

**5 USCIS Scenarios:**

#### 3.1 Family-Based (`uscis_family`)
```typescript
{
  module: 'uscis_family',
  name: 'USCIS Family-Based Information',
  systemPrompt: `
    - Explains I-130, I-485, I-765, I-131
    - Lists common documents
    - Interprets status messages
    - STRICT: No legal advice
    - MANDATORY: Disclaimer in every response
  `,
  suggestedQuestions: [
    'What is Form I-130 used for?',
    'What documents are commonly required?',
    'What does "Case Was Received" mean?',
    ...
  ]
}
```

#### 3.2 Naturalization (`uscis_n400`)
- N-400 process overview
- Interview preparation info
- General requirements
- Status explanations

#### 3.3 Employment-Based (`uscis_employment`)
- EB categories (EB-1, EB-2, EB-3)
- I-140 and I-485 purpose
- Labor certification overview
- Priority dates explanation

#### 3.4 Non-Immigrant (`uscis_nonimmigrant`)
- I-539 and I-129 forms
- Extension processes
- Status change procedures
- Critical overstay warnings

#### 3.5 Humanitarian (`uscis_humanitarian`)
- **Most restrictive scope**
- TPS and asylum (general only)
- Strong attorney referral
- Critical disclaimer emphasis

---

### 4. Compliance Guardrails

**Built into every scenario:**
```typescript
YOU CANNOT:
❌ Provide legal advice
❌ Give case-specific recommendations
❌ Predict case outcomes
❌ Interpret laws or regulations
❌ Determine eligibility
❌ Help fill out forms
❌ Check case status
❌ Recommend strategies

YOU CAN:
✅ Explain what forms exist (general)
✅ List common document types
✅ Explain status messages in plain language
✅ Provide high-level process overview
✅ Define immigration terms
```

**Refusal Patterns:**
```
"Should I apply?" → "I cannot advise on your situation. Consult an attorney."
"Am I eligible?" → "Eligibility depends on many factors. An attorney can review your case."
"Will my case be approved?" → "I cannot predict outcomes. Every case is unique."
```

**Mandatory Disclaimer:**
```
⚖️ This is general information only, not legal advice. 
Every immigration case is different. Consult a qualified 
immigration attorney licensed in your state for guidance 
on your specific situation.
```

---

## 🔒 Security & Data Privacy

### No Personal Data Storage

**The module does NOT:**
- Store user queries
- Save personal information
- Access USCIS systems
- Maintain user profiles
- Track case information

### No System Integration

**The module does NOT:**
- Connect to USCIS.gov
- Access government databases
- Submit forms electronically
- Check case statuses
- Interact with any immigration systems

### Client-Side Only

All interactions are:
- Processed in real-time
- Streamed to client
- Not logged on server
- Ephemeral (no persistence)

---

## 🎯 Type System

**Module Type Definition:**
```typescript
export type IvyarModule = 
  | 'materials'
  | 'zoning'
  | 'violations'
  | 'donors'
  | 'us_construction'
  | 'geo_utilities'
  | 'procurement'
  | 'aviation_tickets'
  | 'uscis_family'           // ← USCIS modules
  | 'uscis_n400'
  | 'uscis_employment'
  | 'uscis_nonimmigrant'
  | 'uscis_humanitarian'
  | 'general';
```

**Scenario Interface:**
```typescript
interface ModuleScenario {
  module: IvyarModule;
  name: string;
  description: string;
  systemPrompt: string;
  suggestedQuestions?: string[];
  capabilities?: string[];
}
```

---

## 🚀 Deployment Architecture

### Production Stack

**Frontend:**
- Vercel (Next.js hosting)
- Domain: `ivyar-governance-portal.vercel.app`
- Route: `/uscis-intelligence`

**Worker:**
- Cloudflare Workers
- Endpoint: `https://ivyar-autopilot-v8.ivyar-gov.workers.dev`
- Runtime: V8 JavaScript engine

**AI Provider:**
- Anthropic Claude API
- Model: Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Streaming: Server-Sent Events (SSE)

### Request Flow
```
User opens /uscis-intelligence
     ↓
Page loads with AutopilotWidget
     ↓
User clicks "Ask AI" button
     ↓
Widget detects module: uscis_family
     ↓
User types query: "What is Form I-130?"
     ↓
POST to Cloudflare Worker
     ↓
Worker loads uscis_family scenario
     ↓
Worker calls Anthropic API with system prompt
     ↓
Claude Sonnet 4 generates response
     ↓
Response streams back to widget
     ↓
User sees response with mandatory disclaimer
```

---

## 📦 File Structure
```
ivyar-governance-portal/
│
├── app/
│   └── uscis-intelligence/
│       └── page.tsx                    # Main module page
│
├── components/
│   └── AutopilotWidget.tsx             # AI chat component
│
├── lib/
│   └── autopilot/
│       └── ivyar-autopilot-scenarios.ts # 5 USCIS scenarios
│
└── docs/
    └── uscis-intelligence/
        ├── README.md                    # Overview
        ├── LEGAL-DISCLAIMER.md          # Legal notice
        ├── MODULE-ARCHITECTURE.md       # This file
        ├── design/
        │   └── DESIGN-SYSTEM.md
        └── motion/
            └── MOTION-GUIDELINES.md
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**UI Testing:**
- ✅ Page loads without errors
- ✅ All 5 category cards display
- ✅ Legal disclaimer is prominent
- ✅ Official resources links work
- ✅ Dark mode renders correctly
- ✅ Responsive on mobile

**AI Testing:**
- ✅ Click "Ask AI" opens widget
- ✅ Correct scenario auto-detected
- ✅ Suggested questions appear
- ✅ Responses include disclaimers
- ✅ Refusal patterns work
- ✅ No legal advice given

**Edge Cases:**
- ✅ Long queries handled
- ✅ Sensitive info warnings
- ✅ Overstay questions refused
- ✅ Eligibility questions refused
- ✅ Form-filling requests refused

---

## 🔄 Update Process

### Scenario Updates

**When to update:**
- USCIS policy changes
- New forms introduced
- Processing time changes
- Fee updates

**How to update:**
1. Edit `ivyar-autopilot-scenarios.ts`
2. Update `systemPrompt` for affected scenario
3. Test with sample queries
4. Git commit with clear message
5. Deploy to production

**Version control:**
- All changes tracked in Git
- Semantic versioning
- Changelog maintained

---

## 📊 Monitoring & Analytics

### Error Tracking

**Client-side errors:**
- Console errors logged
- Component render failures tracked
- Network failures monitored

**Worker errors:**
- Cloudflare Worker logs
- API failures tracked
- Timeout monitoring

### Usage Metrics (Privacy-Preserving)

**Tracked (anonymously):**
- Page views
- Widget opens
- Scenario selections
- Query counts (no query content)

**NOT Tracked:**
- User identity
- Query content
- Personal information
- Case details

---

## 🛠️ Maintenance

### Regular Maintenance Tasks

**Monthly:**
- Review USCIS.gov for policy changes
- Update processing times if changed
- Check for new forms
- Verify official resource links

**Quarterly:**
- Full scenario review
- Legal disclaimer review
- UI/UX assessment
- Performance optimization

**Annually:**
- Comprehensive security audit
- Accessibility compliance check
- Legal compliance review
- Documentation update

---

## 📞 Technical Support

**For technical issues:**
- Check GitHub Issues
- Review documentation
- Contact IVYAR team

**For legal questions:**
- Consult immigration attorney
- Do NOT contact technical team

---

## 🎯 Future Enhancements

**Potential improvements:**
- Multi-language support (Spanish, Ukrainian)
- Form checklist generator
- Processing time estimator (based on public data)
- Attorney finder integration
- Mobile app version

**NOT planned (legal boundaries):**
- Form submission
- USCIS system integration
- Case status checking
- Eligibility calculators
- Legal advice features

---

**IVYAR Governance Platform**  
**Architecture Version:** 1.0  
**Last Updated:** January 13, 2026  
**Status:** Production-ready
