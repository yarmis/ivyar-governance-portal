# Changelog

All notable changes to IVYAR Governance Platform will be documented in this file.

## [Unreleased] - 2026-01-25

### 🎉 New Multilingual Homepage

#### Added
- **🌍 Multilingual Support (7 Languages)**
  - 🇺🇦 Ukrainian (UA)
  - 🇺🇸 English (US, GB, EU)
  - 🇩🇪 German (DE)
  - 🇫🇷 French (FR)
  - 🇪🇸 Spanish (ES)
  - 🇮🇹 Italian (IT)
  - 🇵🇱 Polish (PL)

- **📊 Stats Section**
  - 99.97% Platform Uptime (NATO-grade reliability)
  - $115.8M Total Project Value (6 active reconstruction projects)
  - 1,247 Jobs Created (Including 121 veterans employed)
  - 450K People Served (By restored facilities)

- **🎯 Call-to-Action Section**
  - Request Demo button
  - Schedule Call button
  - Professional gradient design

- **🔍 Advanced Search**
  - Keyboard shortcut (Cmd+K / Ctrl+K)
  - Live filtering with text highlighting
  - Module search across all categories
  - ESC to close

- **📱 Mobile Responsive Design**
  - Hamburger menu for mobile navigation
  - Responsive grid layouts (4→2→1 columns)
  - Touch-friendly buttons with active states
  - Adaptive typography across breakpoints

- **🎨 UI/UX Enhancements**
  - Palantir-style dark theme
  - Module detail modals with category badges
  - Language switcher dropdown with country flags
  - Professional footer with navigation links

#### Technical
- Locale-based routing with Next.js 15
- Dynamic locale detection from URL pathname
- Client-side navigation with useParams/usePathname
- Responsive breakpoints (sm: 640px, md: 768px, lg: 1024px)
- Tailwind CSS gradients and animations
- TypeScript strict mode

#### Fixed
- Language switching now works correctly across all locales
- Removed old root page.tsx (using [locale] routing)
- Fixed locale detection issues with useState
- Mobile menu state management

---

## [v10.0.0] - 2026-01-23

### Initial Platform Release
- HBS Module v10.0 "Sovereign Intelligence"
- Multi-agency coordination infrastructure
- Cloudflare Workers API deployment
- Neon PostgreSQL database integration
- 5 automated CI/CD workflows
