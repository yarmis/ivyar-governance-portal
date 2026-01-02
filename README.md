# 🛡️ IVYAR Protection from Delays

**Institutional Transparency & Legal Integrity Module**

## Overview

IVYAR Protection from Delays eliminates harmful delays in claims processing through:
- ⏱️ Automated SLA Monitoring
- 🚨 Instant Delay Detection
- 📜 Immutable Legal Timeline
- 🔐 Cryptographic Hash Chain
- 📊 Automated Reports

## Quick Start
```bash
npm install
npm run dev
```

Open: http://localhost:3000

## URLs

| Page | URL |
|------|-----|
| 🏠 Home | http://localhost:3000 |
| 👤 Client Portal | http://localhost:3000/client |
| ⚙️ Admin Dashboard | http://localhost:3000/admin |
| 🔗 API Claims | http://localhost:3000/api/protection/claims |
| 🔗 API Rules | http://localhost:3000/api/protection/sla/rules |
| 🔗 API Delays | http://localhost:3000/api/protection/delays |

## Test Claim

Enter `SDG-2026-00142` in Client Portal to see demo data.

## Documentation

See `docs/IVYAR_Protection_from_Delays.pdf` for full institutional brief.

## Tech Stack

- **Frontend:** Next.js 16, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (planned)
- **Deployment:** Vercel

## Contact

IVYAR Platform  
Lake Stevens, Washington, USA  
www.ivyar.org

---

© 2026 IVYAR Platform. All rights reserved.
```

---

## ✅ Структура проєкту:
```
ivyar-portal/
├── app/
│   ├── page.tsx              # Головна
│   ├── client/page.tsx       # Client Portal
│   ├── admin/page.tsx        # Admin Dashboard
│   └── api/protection/       # API Routes
├── docs/
│   └── IVYAR_Protection_from_Delays.pdf
└── README.md