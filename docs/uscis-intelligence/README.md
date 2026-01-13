# USCIS Intelligence Module Documentation

> **U.S.-Developed Informational Assistant for Immigration Case Preparation**

## 📋 Overview

The USCIS Intelligence Module is an informational, AI-assisted tool designed to help users understand U.S. immigration processes, prepare documentation, and interpret common USCIS case status messages.

**⚖️ IMPORTANT:** This module is informational only. It does NOT provide legal advice, does NOT submit applications, and does NOT interact with USCIS systems.

---

## 📚 Documentation Structure

### Core Documentation
- **[Design System](./design/DESIGN-SYSTEM.md)** - Complete design tokens, components, and layouts
- **[Motion Guidelines](./motion/MOTION-GUIDELINES.md)** - Animation specifications and standards
- **[Legal Disclaimer](./LEGAL-DISCLAIMER.md)** - Official legal boundaries and disclaimers
- **[Module Architecture](./MODULE-ARCHITECTURE.md)** - Technical architecture and implementation

### Donor Resources
- **[Donor Presentations](./donors/DONOR-PRESENTATIONS.md)** - Pitch decks for USAID, DHS, World Bank
- **[USAID Version](./donors/USAID-PITCH.md)** - People-centered access messaging
- **[DHS Version](./donors/DHS-PITCH.md)** - Security and compliance messaging
- **[World Bank Version](./donors/WORLD-BANK-PITCH.md)** - Digital infrastructure messaging

---

## 🎯 Key Features

### Supported Case Categories
1. **Family-Based Immigration** - I-130, I-485, I-765, I-131
2. **Naturalization (N-400)** - U.S. citizenship process
3. **Employment-Based** - I-140, I-485, PERM
4. **Non-Immigrant Extensions** - I-539, I-129
5. **Humanitarian Programs** - TPS, asylum (high-level only)

### Core Capabilities
- ✅ High-level process explanations
- ✅ Non-binding document checklists
- ✅ Status message interpretation
- ✅ Structured information gathering
- ✅ Scenario-based assistance
- ✅ U.S.-developed AI prompts with strict guardrails

---

## 🛡️ Compliance & Safety

### What It Does
- Explains immigration processes in plain language
- Lists commonly required documents (general)
- Interprets USCIS status messages
- Provides high-level guidance

### What It Does NOT Do
- ❌ Provide legal advice
- ❌ Submit forms or applications
- ❌ Access USCIS systems
- ❌ Predict case outcomes
- ❌ Make eligibility determinations
- ❌ Replace immigration attorneys

**Users MUST consult qualified immigration attorneys for legal guidance.**

---

## 🏗️ Technical Architecture
```
┌─────────────────────────────────────────┐
│         IVYAR Portal (Frontend)         │
│    /uscis-intelligence page.tsx         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│        AutopilotWidget Component        │
│      Auto-detects USCIS module          │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Autopilot Worker (Cloudflare)       │
│   https://ivyar-autopilot-v8...         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      USCIS AI Scenarios (5 types)       │
│    - Family, N-400, Employment, etc.    │
│    - Strict legal guardrails            │
│    - Mandatory disclaimers              │
└─────────────────────────────────────────┘
```

---

## 🎨 Design Standards

**Color System:**
- Primary Navy: `#0A1A2F`
- Accent Blue: `#3B82F6`
- Dark Mode: `#0D1117` background

**Typography:**
- Font: Inter (all weights)
- Scale: 64px (Display) → 12px (Caption)

**Motion:**
- Duration: 150-500ms
- Easing: ease-out only
- No bounce, elastic, or overshoot

**See [Design System](./design/DESIGN-SYSTEM.md) for complete specifications.**

---

## 🌐 U.S. Origin & Governance

**Developed in the United States** using American standards of:
- ✅ Transparency
- ✅ Accountability
- ✅ Responsible AI use
- ✅ Institutional compliance

**Alignment:**
- USAID: Equity, access, digital inclusion
- DHS: Compliance, security, modernization
- World Bank: Digital public infrastructure, efficiency

---

## 📊 Module Status

- ✅ **Production-ready**
- ✅ **Integrated with IVYAR Autopilot**
- ✅ **5 AI scenarios with legal guardrails**
- ✅ **Complete UI/UX implementation**
- ✅ **Dark mode support**
- ✅ **Auto-detection from URL**

**Live URL:** `/uscis-intelligence`

---

## 👥 Target Users

1. **Individuals** navigating immigration processes
2. **Community organizations** supporting immigrants
3. **Legal service providers** (informational support)
4. **Case managers** preparing documentation
5. **NGOs** assisting vulnerable populations

---

## 📞 Contact & Feedback

**Platform:** IVYAR Governance Platform  
**Origin:** United States  
**Type:** Informational Assistant  
**Status:** Informational Only - Not Legal Advice

For questions about implementation or partnership opportunities, please contact the IVYAR team.

---

## ⚖️ Legal Notice

This module is an informational tool only. It does not provide legal advice, does not submit applications, and does not interact with USCIS systems. All information provided is general in nature and may not apply to your specific situation. Every immigration case is unique and complex. You should consult a qualified immigration attorney licensed in your state for guidance on your specific case. No attorney-client relationship is created by using this tool.

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Standard:** U.S. Federal Design (USWDS-aligned)
