# 🏛️ IVYAR Governance Platform

**National-Scale Digital Infrastructure for Ministries, Donors, and International Partners**

---

---

## 🌍 New Multilingual Homepage

**Professional institutional homepage with 7-language support and mobile-responsive design**

### Features

#### 🗣️ Languages Supported
- 🇺🇦 **Ukrainian** - Платформа IVYAR
- 🇺🇸 **English** - IVYAR Governance Platform
- 🇩🇪 **German** - IVYAR Plattform
- 🇫🇷 **French** - Plateforme IVYAR
- 🇪🇸 **Spanish** - Plataforma IVYAR
- 🇮🇹 **Italian** - Piattaforma IVYAR
- 🇵🇱 **Polish** - Platforma IVYAR

#### ⚡ Key Features
- **📊 Stats Section**: 4 key metrics with gradient styling
- **🎯 CTA Section**: Request Demo + Schedule Call buttons
- **🔍 Search**: Cmd+K shortcut with live filtering and highlighting
- **🎨 Modals**: Module details with category-based gradients
- **📱 Mobile**: Hamburger menu, responsive grids, touch-friendly
- **🔗 Footer**: Navigation links and copyright information

#### 🌐 Live URLs
```
Ukrainian:  https://ivyar.org/ua
English:    https://ivyar.org/us
German:     https://ivyar.org/de
French:     https://ivyar.org/fr
Spanish:    https://ivyar.org/es
Italian:    https://ivyar.org/it
Polish:     https://ivyar.org/pl
```

#### 🎬 Keyboard Shortcuts
- `Cmd+K` / `Ctrl+K` - Open search
- `ESC` - Close modals/search
- Arrow keys - Navigate search results


## 📡 Operational Status

| Component | State | Notes |
|-----------|-------|-------|
| **Frontend** | 🟢 ACTIVE | Vercel global deployment, Next.js 16 |
| **Worker API** | 🟢 ACTIVE | Cloudflare Workers (D1 + KV), production version live |
| **CI/CD** | 🟢 ACTIVE | 5 automated workflows (index, markdown, PDF, rebuild, health-check) |
| **Database** | 🟢 ACTIVE | Neon PostgreSQL + Cloudflare D1 |
| **Zero Trust** | 🟢 ENABLED | Cloudflare Access configured |

---

## 🧩 CI/CD Dashboard

| Workflow | Status |
|----------|--------|
| **Master Index** | ![Master Index](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/generate-master-index.yml/badge.svg) |
| **Nightly Markdown** | ![Nightly Markdown](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-markdown.yml/badge.svg) |
| **Nightly PDF** | ![Nightly PDF](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-pdf.yml/badge.svg) |
| **Nightly Full Rebuild** | ![Nightly Full Rebuild](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-full-rebuild.yml/badge.svg) |
| **Nightly Health Check** | ![Nightly Health Check](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-health-check.yml/badge.svg) |

---

## 🌍 Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Production** | https://ivyar.org | Public portal |
| **API (Prod)** | https://ivyar-api.ivyar-gov.workers.dev | Autopilot, HBS, modules |
| **HBS Module** | https://ivyar.org/us/hbs | Core governance engine |
| **Autopilot** | https://ivyar.org/us/hbs/autopilot | Automated decisioning |
| **API Docs** | https://ivyar.org/us/hbs/api-docs | Developer documentation |

---

## 🗂️ Platform Overview

The **IVYAR Governance Platform** is a modular, audit-ready, sovereign digital infrastructure designed to support:

- National governance
- Donor coordination
- Reconstruction programs
- Multi-agency operations
- Cross-border digital cooperation

**It includes:**

- 20 governance domains (F–Z)
- 260 institutional documents
- Automated generation pipelines
- Secure API layer
- Multi-module operational ecosystem

---

## 🛡️ Security & Compliance

- ✅ Cloudflare Zero Trust (Access + JWT)
- ✅ No exposed secrets
- ✅ Rotated credentials
- ✅ KV-based audit logging
- ✅ D1 + Neon PostgreSQL isolation
- ✅ Production-only environment variables
- ✅ Hardened Worker API

---

## 🧭 Versioning

| Item | Version |
|------|---------|
| **Platform** | v1.0.0 |
| **Governance Corpus** | v1.0 (260 documents) |
| **API Worker** | Latest (Cloudflare Version ID) |
| **Frontend** | Next.js 16 |

---

## 📞 Institutional Contacts

| Role | Contact |
|------|---------|
| **Administrator** | admin@ivyar.org |
| **Emergency Access** | emergency@ivyar.org |
| **Technical Lead** | igor@ivyar.org |

---

## 📝 Last Updated

**2026-01-11** - Automated nightly rebuild + health check + CI/CD workflows deployed

---

**Institutional-grade governance infrastructure for national digital systems**

---

## 🎯 CI/CD Dashboard

Monitor all automated governance processes in real-time:

### 📋 Master Index Generation
![Master Index](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/generate-master-index.yml/badge.svg)

### 🌙 Nightly Workflows

| Workflow | Status | Schedule |
|----------|--------|----------|
| **Markdown Generation** | ![Markdown](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-markdown.yml/badge.svg) | 02:00 UTC Daily |
| **PDF Generation** | ![PDF](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-pdf.yml/badge.svg) | 04:00 UTC Daily |
| **Full Rebuild** | ![Rebuild](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-full-rebuild.yml/badge.svg) | 01:00 UTC Daily |
| **Health Check** | ![Health](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/nightly-health-check.yml/badge.svg) | 05:00 UTC Daily |

---

## 📚 Governance Structure (F → Z)

The governance corpus is organized into **20 institutional domains**:
```
F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
```

Each domain contains **10 standardized documents**:
```
1. Start       - Initial framework and context
2. Overview    - Domain summary and scope
3. Structure   - Organizational hierarchy
4. Roles       - Responsibilities and authorities
5. Processes   - Operational workflows
6. Guidelines  - Best practices and standards
7. Standards   - Technical specifications
8. Models      - Reference architectures
9. Review      - Evaluation and audit procedures
10. Final      - Completion and certification
```

**Total: 260 documents** forming a complete institutional matrix.

---

## 🔄 Automated Generation

The portal includes a full suite of automated tools:

### 🔧 Generation Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `generate_master_index.ts` | Creates unified document index | `data/governance-master-index.ts` |
| `generate_markdown.ts` | Generates markdown documentation | `content/governance/` |
| `generate_pdf.ts` | Creates PDF archive | `public/pdf/` |

### ⚙️ Automation Features

- ✅ **Synchronized** - All documents stay in sync
- ✅ **Consistent** - Standardized formatting
- ✅ **Self-maintaining** - Automated nightly updates
- ✅ **Audit-ready** - Full generation history in Git

---

## 📁 Repository Structure
```
ivyar-governance-portal/
├── app/                          # Next.js application
│   ├── governance/               # Governance document routes
│   └── api/                      # API endpoints
├── data/                         # Auto-generated data
│   └── governance-master-index.ts
├── content/governance/           # Markdown documentation (F-Z)
├── public/pdf/                   # Auto-generated PDFs
├── deployment-kit/               # Generation scripts
│   ├── generate_master_index.ts
│   ├── generate_markdown.ts
│   └── generate_pdf.ts
├── .github/workflows/            # CI/CD pipelines
│   ├── generate-master-index.yml
│   ├── nightly-markdown.yml
│   ├── nightly-pdf.yml
│   ├── nightly-full-rebuild.yml
│   └── nightly-health-check.yml
└── README.md                     # This file
```

---

## 🛡️ Institutional Principles

The portal follows core institutional standards:

- **🎯 Clarity** - Every document has a clear purpose
- **🧩 Modularity** - Every domain is independent and reusable
- **📊 Auditability** - Every change is traceable in Git
- **♾️ Continuity** - The system survives team changes
- **👁️ Transparency** - Structure is visible and verifiable
- **📈 Scalability** - Ready for multi-country deployments

---

## 🔐 Security & Compliance

The platform aligns with:

- ✅ Government-grade security practices
- ✅ Zero-trust principles
- ✅ Audit-ready documentation standards
- ✅ Donor transparency requirements
- ✅ ISO/IEC standards compatibility

---

## 🌍 International Readiness

The portal is designed for:

- 🌐 Multi-country deployments
- 🤝 Donor-aligned governance
- 🏛️ Cross-institutional collaboration
- 🗣️ Multilingual content layers
- 🏴 Sovereign digital infrastructure

---

## 🧪 Testing & Quality

Continuous validation ensures reliability:

- ✅ **Linting** - Code quality checks
- ✅ **Type checking** - TypeScript validation
- ✅ **Nightly health checks** - Automated monitoring
- ✅ **Git history** - Full audit trail

---

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Generate master index
npx ts-node deployment-kit/generate_master_index.ts

# Run development server
npm run dev
```

### Generate Documentation
```bash
# Generate markdown files
npx ts-node deployment-kit/generate_markdown.ts

# Generate PDFs (requires Playwright)
npx playwright install chromium
npx ts-node deployment-kit/generate_pdf.ts
```

---

## 📊 Current Status

- ✅ **Master Index**: Auto-generated (1642 lines)
- ✅ **CI/CD Workflows**: Active on GitHub Actions
- ✅ **Document Structure**: F-Z domains (260 documents)
- ✅ **Automated Builds**: Nightly at 01:00 UTC
- 🔄 **Active Development**: Continuous improvements

---

## 🤝 Contributing

All contributions must follow:

- 📋 Institutional naming conventions
- 🏛️ Governance domain structure (F-Z)
- 📝 Documentation standards
- ✅ CI/CD validation

---

## 📄 License

This project is part of IVYAR's institutional infrastructure.

---

## 🏁 Project Status

**IVYAR Governance Portal** is an active, evolving institutional platform supporting:

- National governance systems
- International coordination
- Donor-aligned transparency
- Cross-border collaboration

---

**Built with institutional rigor. Designed for sovereign digital infrastructure.**

🏛️ **IVYAR** - Ukraine Digital Governance Infrastructure
