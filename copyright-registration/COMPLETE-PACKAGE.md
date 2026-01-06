# IVYAR - Application for Copyright Registration

## 1. TITLE OF WORK
**IVYAR Governance Platform**
(Computer Program / Software Application)

## 2. AUTHOR / CLAIMANT
**Name:** Igor Yarmosyuk
**Citizenship:** USA
**Address:** State of Washington, USA
**Email:** info@ivyar.org

## 3. YEAR OF COMPLETION
**First Created:** 2024
**Last Updated:** 2026

## 4. DATE OF FIRST PUBLICATION
January 2025

## 5. NATURE OF AUTHORSHIP
- Computer program code (TypeScript, JavaScript, React)
- User interface design
- Database schema
- API architecture
- Documentation and text

## 6. RIGHTS CLAIMED
All rights reserved. Exclusive rights to reproduce, distribute, 
display, and create derivative works.
# IVYAR Governance Platform - Technical Description

## Overview
IVYAR is an institutional infrastructure platform for ethical, transparent, 
AI-aligned decision-making across governments and international partners.

## Platform Type
Web-based Software-as-a-Service (SaaS) Application

## Technology Stack
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, API Routes
- **Database:** PostgreSQL with Prisma ORM
- **AI Integration:** Custom AI Administrator module
- **Internationalization:** 28 languages supported

## Core Modules
1. **Procurement Engine** - Transparent tender management
2. **Logistics Engine** - Route optimization and supply chain
3. **Donor Dashboard** - Funding transparency and reporting
4. **Data Platform** - Unified data lake management
5. **HBS Module** - Humanitarian Budget Support
6. **AI Services** - Intelligent automation
7. **Trade Module** - B2B marketplace
8. **Insurance Module** - AI-powered insurance
9. **Payments Module** - Cross-border payments
10. **Reconstruction Module** - Post-war rebuilding
11. **Direct Freight** - Broker-free logistics

## Key Features
- Multi-language support (28 languages)
- RTL support for Arabic and Hebrew
- Real-time data synchronization
- AI-powered decision support
- Full audit trail
- Role-based access control
- API-first architecture

## Lines of Code
Approximately 50,000+ lines of original source code
# IVYAR - Source Code File Listing

## Main Application Files
```
app/
├── [locale]/page.tsx          - Localized landing page
├── hbs/                       - HBS Module (25+ files)
├── modules/                   - Module pages
├── procurement/               - Procurement engine
├── logistics/                 - Logistics engine
├── insurance/                 - Insurance module
├── payments/                  - Payments module
├── trade/                     - Trade module
├── freight/                   - Direct freight
├── reconstruction/            - Reconstruction module
├── demo/                      - Demo request page
├── contact/                   - Contact page
├── pricing/                   - Pricing page
├── roadmap/                   - Product roadmap
└── api/                       - API endpoints
```

## Components
```
components/
├── Header.tsx                 - Navigation header
├── LocaleSwitcher.tsx         - Language selector
├── GlobalSearch.tsx           - Search functionality
└── hbs/                       - HBS-specific components
```

## Internationalization
```
i18n/
├── config.ts                  - Locale configuration
├── translations.ts            - 28 language translations
├── useTranslation.ts          - Translation hook
└── index.ts                   - Exports
```

## Configuration
```
├── next.config.ts             - Next.js configuration
├── tailwind.config.ts         - Styling configuration
├── tsconfig.json              - TypeScript configuration
├── package.json               - Dependencies
└── LICENSE                    - Proprietary license
```

## Total Statistics
- **Total Files:** 150+
- **Source Code Lines:** 50,000+
- **Languages Supported:** 28
- **API Endpoints:** 100+
# IVYAR - Screenshot Documentation

## Required Screenshots for Registration

Please capture the following screenshots and save as PNG/JPG:

### 1. Landing Page
- URL: http://localhost:3000/us
- Show: Hero section with title and navigation

### 2. Modules Overview
- URL: http://localhost:3000/us\#modules
- Show: Grid of 11 platform modules

### 3. HBS Dashboard
- URL: http://localhost:3000/us/hbs
- Show: Main dashboard interface

### 4. Language Selector
- Show: Dropdown with 28 language options

### 5. Mobile View
- Show: Responsive design with burger menu

### 6. AI Administrator Section
- URL: http://localhost:3000/us\#ai
- Show: AI governance features

### 7. Module Detail Page
- URL: http://localhost:3000/modules/procurement
- Show: Individual module page

## Screenshot Naming Convention
- 01-landing-page.png
- 02-modules-overview.png
- 03-hbs-dashboard.png
- 04-language-selector.png
- 05-mobile-view.png
- 06-ai-administrator.png
- 07-module-detail.png
# Certificate of Authorship

## Declaration

I, **Igor Yarmosyuk**, hereby declare and certify that:

1. I am the original author and creator of the computer program 
   known as **IVYAR Governance Platform**.

2. This work was created through my own independent efforts and 
   is not copied from any other source.

3. The work was first created in **2024** and has been continuously 
   developed through **2026**.

4. I am the sole owner of all intellectual property rights in this work.

5. I have not assigned, transferred, or licensed the copyright in 
   this work to any other party, except as may be stated in writing.

6. The information provided in this application is true and correct 
   to the best of my knowledge.

## Work Details
- **Title:** IVYAR Governance Platform
- **Type:** Computer Program / Web Application
- **First Publication:** January 2025
- **Country of Origin:** United States of America

## Author Information
- **Full Name:** Igor Yarmosyuk
- **Contact:** info@ivyar.org
- **Location:** State of Washington, USA

---

**Signature:** _________________________

**Date:** _________________________

**Place:** Washington, USA
# U.S. Copyright Office Registration Instructions

## Step 1: Prepare Materials
- [ ] Complete application form (this folder)
- [ ] Source code deposit (first 25 and last 25 pages)
- [ ] Screenshots of user interface
- [ ] Payment ($65 for online, $125 for paper)

## Step 2: Online Registration (Recommended)
1. Go to: https://www.copyright.gov/registration/
2. Create account at eCO (Electronic Copyright Office)
3. Select "Register a Work"
4. Choose "Literary Work" → "Computer Program"
5. Fill in application details from 01-APPLICATION.md
6. Upload deposit materials
7. Pay filing fee

## Step 3: Deposit Requirements for Software
**Option A - Identifying Material (Recommended for proprietary code):**
- First 25 pages of source code
- Last 25 pages of source code
- With or without trade secret redaction

**Option B - Object Code:**
- First 25 and last 25 pages of object code
- Plus any 10 consecutive pages of source code

## Step 4: After Submission
- Processing time: 3-10 months
- You'll receive a registration certificate
- Registration number format: TXu-XXX-XXX

## Important Notes
- Registration is effective on the date received
- You can register before or after publication
- Registration is required before filing infringement lawsuit
- Early registration allows statutory damages

## Contact
U.S. Copyright Office
101 Independence Ave. S.E.
Washington, D.C. 20559-6000
Phone: (202) 707-3000
Website: www.copyright.gov
# Source Code Deposit

## Instructions
The U.S. Copyright Office requires a deposit of source code.
For proprietary software, you may submit:
- First 25 pages + Last 25 pages of source code
- You may redact trade secrets (block out up to 50%)

## Generating Code Deposit

Run these commands to create the deposit files:
```bash
# Create deposit folder
mkdir -p copyright-registration/code-deposit

# First 25 pages (approximately 1250 lines)
head -1250 app/[locale]/page.tsx > copyright-registration/code-deposit/first-pages.txt
head -500 i18n/translations.ts >> copyright-registration/code-deposit/first-pages.txt
head -500 components/LocaleSwitcher.tsx >> copyright-registration/code-deposit/first-pages.txt

# Last 25 pages
tail -500 app/hbs/page.tsx > copyright-registration/code-deposit/last-pages.txt
tail -500 app/hbs/prometheus/page.tsx >> copyright-registration/code-deposit/last-pages.txt
tail -250 components/Header.tsx >> copyright-registration/code-deposit/last-pages.txt
```

## File Header (Add to each page)
```
IVYAR Governance Platform
Copyright (c) 2024-2026 IVYAR. All rights reserved.
Author: Igor Yarmosyuk
Page X of 50
```
