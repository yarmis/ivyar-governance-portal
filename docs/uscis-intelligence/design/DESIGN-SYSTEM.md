# USCIS Intelligence - Design System

**Complete Design Specification for Figma, Presentations & Documentation**

---

## 📋 TABLE OF CONTENTS

1. [Design Tokens](#1-design-tokens)
2. [Typography](#2-typography)
3. [Color System](#3-color-system)
4. [Spacing & Layout](#4-spacing--layout)
5. [Components](#5-components)
6. [Dark Mode](#6-dark-mode)
7. [Accessibility](#7-accessibility)

---

## 1. DESIGN TOKENS

### 1.1 Foundation

Design tokens are the atomic values that power the entire design system. They ensure consistency across all platforms and make updates systematic.

**Token Structure:**
```
category.subcategory.property.variant
```

**Examples:**
- `color.text.primary.light` → `#0A1A2F`
- `spacing.section.large` → `80px`
- `radius.card.standard` → `16px`

---

## 2. TYPOGRAPHY

### 2.1 Font Family

**Primary Font:** Inter  
**Weights Available:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

**Source:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### 2.2 Type Scale

| Name | Size | Weight | Line Height | Use Case |
|------|------|--------|-------------|----------|
| **Display** | 64px | Bold (700) | 120% | Hero titles, major headings |
| **H1** | 48px | Bold (700) | 120% | Page titles |
| **H2** | 40px | Semibold (600) | 120% | Section headers |
| **H3** | 28px | Semibold (600) | 130% | Subsection headers |
| **H4** | 22px | Semibold (600) | 130% | Card titles |
| **Body** | 16px | Regular (400) | 150% | Main content |
| **Small** | 14px | Regular (400) | 150% | Secondary text |
| **Caption** | 12px | Medium (500) | 140% | Labels, metadata |

### 2.3 Typography Tokens
```typescript
// Figma Text Styles
Display/Light    → 64px Bold #0A1A2F
Display/Dark     → 64px Bold #E5E7EB

H1/Light         → 48px Bold #0A1A2F
H1/Dark          → 48px Bold #E5E7EB

Body/Primary     → 16px Regular #1A202C
Body/Secondary   → 16px Regular #4A5568
Body/Muted       → 16px Regular #718096

Caption/Primary  → 12px Medium #4A5568
Caption/Muted    → 12px Medium #9CA3AF
```

---

## 3. COLOR SYSTEM

### 3.1 Semantic Color Tokens

#### Light Mode

**Backgrounds:**
```
bg.default       #FFFFFF     Primary background
bg.surface       #F8FAFC     Cards, panels
bg.subtle        #F1F5F9     Secondary surfaces
```

**Text:**
```
text.primary     #0A1A2F     Main content
text.secondary   #4A5568     Supporting text
text.muted       #718096     Disabled, metadata
```

**Borders:**
```
border.default   #E2E8F0     Standard borders
border.subtle    #F1F5F9     Light dividers
```

**Accents:**
```
accent.blue      #3B82F6     Primary actions
accent.navy      #1E3A8A     Headers, emphasis
accent.green     #059669     Success states
accent.yellow    #F59E0B     Warnings
accent.red       #EF4444     Errors, critical
```

#### Dark Mode

**Backgrounds:**
```
bg.default       #0D1117     Primary background
bg.surface       #161B22     Cards, panels
bg.subtle        #1F2937     Secondary surfaces
```

**Text:**
```
text.primary     #E5E7EB     Main content
text.secondary   #9CA3AF     Supporting text
text.muted       #6B7280     Disabled, metadata
```

**Borders:**
```
border.default   #2D3748     Standard borders
border.subtle    #374151     Light dividers
```

**Accents:**
```
accent.blue      #60A5FA     Primary actions
accent.navy      #93C5FD     Headers, emphasis
accent.green     #34D399     Success states
accent.yellow    #FBBF24     Warnings
accent.red       #F87171     Errors, critical
```

### 3.2 Severity Colors

Used for category cards and alerts:
```
Standard (Blue):
- Light: border #3B82F6, bg rgba(59,130,246,0.05)
- Dark:  border #60A5FA, bg rgba(96,165,250,0.05)

Complex (Amber):
- Light: border #F59E0B, bg rgba(245,158,11,0.05)
- Dark:  border #FBBF24, bg rgba(251,191,36,0.05)

Critical (Red):
- Light: border #EF4444, bg rgba(239,68,68,0.05)
- Dark:  border #F87171, bg rgba(248,113,113,0.05)
```

### 3.3 USA.gov Compliance

Colors follow USWDS (U.S. Web Design System) accessibility standards:
- All text meets WCAG 2.1 AA contrast (4.5:1 minimum)
- Interactive elements meet 3:1 contrast
- Focus indicators are clearly visible

---

## 4. SPACING & LAYOUT

### 4.1 Spacing Scale

Based on **8px grid system**:
```
4px   - Tight spacing (icon gaps)
8px   - Component internal padding
12px  - Small gaps
16px  - Standard component padding
24px  - Medium gaps between elements
32px  - Large gaps, card padding
48px  - Section spacing
64px  - Large section spacing
80px  - Page margins, hero sections
```

### 4.2 Grid System

**Desktop (1440px):**
```
Columns:       12
Margins:       80px (left/right)
Gutters:       24px
Container:     1280px max-width
```

**Tablet (768px):**
```
Columns:       8
Margins:       40px
Gutters:       16px
```

**Mobile (375px):**
```
Columns:       4
Margins:       16px
Gutters:       12px
```

### 4.3 Border Radius
```
radius.sm        6px      Buttons, inputs
radius.md        12px     Small cards
radius.lg        16px     Module cards
radius.xl        24px     Hero sections
radius.full      999px    Badges, pills
```

### 4.4 Shadows

**Light Mode:**
```
shadow.sm    0 1px 3px rgba(0,0,0,0.06)        Subtle elevation
shadow.md    0 4px 12px rgba(0,0,0,0.08)       Cards
shadow.lg    0 8px 24px rgba(0,0,0,0.12)       Modals, dropdowns
```

**Dark Mode:**
```
shadow.sm    0 1px 3px rgba(0,0,0,0.3)
shadow.md    0 4px 12px rgba(0,0,0,0.4)
shadow.lg    0 8px 24px rgba(0,0,0,0.5)
```

---

## 5. COMPONENTS

### 5.1 USCIS Intelligence Badge

**Structure:**
```
┌─────────────────────────────────────┐
│ ● U.S.-Developed • Informational   │
└─────────────────────────────────────┘
```

**Specifications:**
- Auto Layout: Horizontal
- Padding: 8px 16px
- Gap: 8px
- Radius: 999px (full)

**Light Mode:**
- Background: `#EBF4FF`
- Border: `1px solid #BFDBFE`
- Text: `#1E3A8A` (Inter Medium 12px)
- Dot: `8×8px circle, #3B82F6`

**Dark Mode:**
- Background: `rgba(96,165,250,0.15)`
- Border: `1px solid rgba(96,165,250,0.4)`
- Text: `#60A5FA`
- Dot: `#60A5FA`

**Figma Component:**
```
Component: Badge/USCIS-Intelligence
Variants: Light, Dark
Auto Layout: Yes
```

### 5.2 Category Card

**Structure:**
```
┌──────────────────────────┐
│  [48px Icon]             │
│                          │
│  Title (20px)            │
│  Forms (12px mono)       │
│  Description (14px)      │
│                          │
│  Get Information →       │
└──────────────────────────┘
```

**Specifications:**
- Min size: 320×300px
- Padding: 24px
- Radius: 16px
- Gap (vertical): 12px

**States:**
- Default: Standard styling
- Hover: translateY(-4px), shadow increase
- Active: scale(0.98)

**Severity Variants:**
```
Standard:
- Border: accent.blue
- Background: bg.surface

Complex:
- Border: accent.yellow
- Background: bg.surface
- Optional badge: "COMPLEX"

Critical:
- Border: accent.red
- Background: bg.surface
- Required badge: "ATTORNEY REQUIRED"
```

**Figma Component:**
```
Component: Card/Category
Variants: Standard, Complex, Critical × Light, Dark
Auto Layout: Yes
```

### 5.3 Legal Disclaimer Block

**Structure:**
```
┌────────────────────────────────────┐
│ ⚖️ IMPORTANT LEGAL DISCLAIMER     │
│                                    │
│ This tool provides general info... │
└────────────────────────────────────┘
```

**Specifications:**
- Max-width: 800px
- Padding: 20px
- Radius: 12px
- Border: 2px solid

**Light Mode:**
- Background: `rgba(239,68,68,0.1)`
- Border: `#EF4444`
- Title: `#DC2626` (Semibold 16px)
- Body: `#1F2937` (Regular 14px)

**Dark Mode:**
- Background: `rgba(239,68,68,0.1)`
- Border: `#EF4444`
- Title: `#FCA5A5` (Semibold 16px)
- Body: `#E5E7EB` (Regular 14px)

### 5.4 Button Component

**Variants:**

**Primary:**
```
Background: accent.blue
Text: white
Padding: 12px 24px
Radius: 6px
Hover: opacity 90%
```

**Secondary:**
```
Background: transparent
Border: 1px solid border.default
Text: text.primary
Hover: bg.subtle
```

**Ghost:**
```
Background: transparent
Text: text.secondary
Hover: bg.subtle
```

### 5.5 Input Fields

**Text Input:**
```
Height: 44px
Padding: 12px 16px
Radius: 6px
Border: 1px solid border.default
Font: Inter Regular 16px

States:
- Default: border.default
- Focus: accent.blue border
- Error: accent.red border
- Disabled: opacity 50%
```

---

## 6. DARK MODE

### 6.1 Implementation Strategy

**Step 1: Semantic Variables**

Create color variables that automatically switch:
```css
/* Light Mode */
--bg-default: #FFFFFF;
--text-primary: #0A1A2F;

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  --bg-default: #0D1117;
  --text-primary: #E5E7EB;
}
```

**Step 2: Component Variants**

Every component has Light/Dark variants in Figma:
```
Button
├─ Light/Primary
├─ Light/Secondary
├─ Dark/Primary
└─ Dark/Secondary
```

**Step 3: Automatic Switching**

Use CSS variables or Figma's mode switching:
```typescript
const theme = useTheme(); // 'light' | 'dark'
```

### 6.2 Dark Mode Colors Reference

See [Section 3.1](#31-semantic-color-tokens) for complete token list.

**Key Principles:**
- Never pure black (#000000) - use #0D1117
- Reduce contrast slightly (easier on eyes)
- Maintain 4.5:1 contrast ratio
- Test all interactive states

---

## 7. ACCESSIBILITY

### 7.1 WCAG 2.1 AA Compliance

**Color Contrast:**
- Body text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum
- Interactive states clearly visible

**Focus Indicators:**
- All interactive elements have focus state
- Focus ring: 2px solid accent.blue
- Never remove outline without replacement

**Keyboard Navigation:**
- All features accessible via keyboard
- Logical tab order
- Skip links provided
- No keyboard traps

### 7.2 Screen Reader Support

**Semantic HTML:**
```html
<header>
<main>
<nav>
<section>
<article>
<aside>
<footer>
```

**ARIA Labels:**
```html
<button aria-label="Open AI Assistant">
<nav aria-label="Main navigation">
<div role="alert" aria-live="polite">
```

### 7.3 Motion & Animation

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**See [Motion Guidelines](../motion/MOTION-GUIDELINES.md) for full specifications.**

---

## 8. FIGMA IMPLEMENTATION

### 8.1 File Structure
```
USCIS Intelligence Design System
│
├── 📄 Cover (design system overview)
├── 🎨 Foundations
│   ├── Colors (all tokens)
│   ├── Typography (text styles)
│   ├── Spacing (layout grid)
│   └── Effects (shadows, borders)
│
├── 🧩 Components
│   ├── Badges
│   ├── Cards
│   ├── Buttons
│   ├── Inputs
│   ├── Alerts
│   └── Layout
│
├── 🌑 Dark Mode
│   └── All components in dark variant
│
└── 📱 Layouts
    ├── Main Page (1440px)
    ├── Presentation Slides (1920×1080)
    └── Mobile Views (375px)
```

### 8.2 Component Checklist

For every component:
- [ ] Create base component
- [ ] Add Auto Layout
- [ ] Create variants (size, state, theme)
- [ ] Apply semantic color variables
- [ ] Add documentation
- [ ] Test in light/dark mode
- [ ] Verify accessibility
- [ ] Create instance examples

### 8.3 Export Settings

**For Development:**
- SVG for icons
- PNG @2x for images
- CSS/JSON for tokens

**For Presentations:**
- PNG @2x (high resolution)
- PDF for print materials

---

## 9. DESIGN PRINCIPLES

### 9.1 Institutional Clarity

**Visual language reflects:**
- U.S. government design standards
- Professional, trustworthy tone
- Clear information hierarchy
- No decorative excess

### 9.2 Accessibility First

**Design decisions prioritize:**
- High contrast
- Clear typography
- Logical flow
- Screen reader compatibility
- Keyboard navigation

### 9.3 Responsive by Default

**Every component works on:**
- Desktop (1440px+)
- Tablet (768px - 1439px)
- Mobile (375px - 767px)

---

## 10. MAINTENANCE

### 10.1 Regular Updates

**Monthly:**
- Review color contrast
- Test new components
- Update documentation

**Quarterly:**
- Accessibility audit
- Design system health check
- Component library cleanup

**Annually:**
- Major version update
- WCAG compliance review
- Performance optimization

### 10.2 Version Control
```
Version Format: MAJOR.MINOR.PATCH

Example: 1.2.3
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes
```

**Current Version:** 1.0.0  
**Last Updated:** January 13, 2026

---

## APPENDIX

### A. Figma Plugins Recommended

- **A11y - Color Contrast Checker**
- **Stark** (accessibility toolkit)
- **Auto Layout** (built-in)
- **Component Inspector**

### B. Resources

- USWDS: https://designsystem.digital.gov
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Inter Font: https://rsms.me/inter/

### C. Contact

For design system questions:
- GitHub Issues
- IVYAR Design Team

---

**IVYAR Governance Platform**  
**Design System Version:** 1.0.0  
**Standard:** U.S. Federal Design (USWDS-aligned)  
**Status:** Production-ready
