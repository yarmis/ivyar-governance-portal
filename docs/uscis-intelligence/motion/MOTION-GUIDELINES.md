# USCIS Intelligence - Motion Guidelines

**Official Animation & Interaction Specification**

---

## 📋 TABLE OF CONTENTS

1. [Purpose](#1-purpose)
2. [Motion Philosophy](#2-motion-philosophy)
3. [Timing & Easing](#3-timing--easing)
4. [Slide Transitions](#4-slide-transitions)
5. [Element Animations](#5-element-animations)
6. [Interaction Motion](#6-interaction-motion)
7. [Accessibility](#7-accessibility)
8. [Implementation](#8-implementation)

---

## 1. PURPOSE

### 1.1 Why Motion Matters

Motion in the USCIS Intelligence Module serves specific functional purposes:

- **Guides attention** to important information
- **Establishes hierarchy** through sequenced reveals
- **Reduces cognitive load** by progressive disclosure
- **Provides feedback** for user interactions
- **Reinforces trust** through professional, measured movement

### 1.2 Institutional Standards

Motion follows **U.S. government design standards:**
- USA.gov motion principles
- USWDS (U.S. Web Design System) guidelines
- DHS Digital Service standards
- Federal accessibility requirements

**Tone:** Restrained, purposeful, professional

---

## 2. MOTION PHILOSOPHY

### 2.1 Core Principles

#### Restraint
**Motion supports content, never distracts.**
- Animations are subtle
- No bouncing or elastic effects
- No attention-seeking flourishes

#### Linearity
**All movement is direct and predictable.**
- Straight paths only
- No curved trajectories
- No rotation or skewing

#### Brevity
**Animations complete quickly.**
- 150-500ms maximum
- Never block user interaction
- Feels instant, not slow

#### Purpose
**Every animation has a functional reason.**
- Establishes reading order
- Indicates state change
- Provides interaction feedback
- Nothing purely decorative

#### Institutional Clarity
**Motion reinforces professionalism.**
- Government-grade restraint
- Predictable behavior
- Accessible to all users

### 2.2 What We Don't Do

**Forbidden:**
- ❌ Bounce easing
- ❌ Elastic effects
- ❌ Overshoot
- ❌ Rotation (except icons)
- ❌ Parallax
- ❌ Zoom-in transitions
- ❌ Flashing or rapid repeats
- ❌ Anything "playful" or "fun"

---

## 3. TIMING & EASING

### 3.1 Duration Standards
```
Fast:    150-200ms    Buttons, micro-interactions
Medium:  250-350ms    Cards, text, standard elements
Slow:    400-500ms    Slides, major transitions

Minimum: 120ms        (accessibility requirement)
Maximum: 500ms        (feels sluggish beyond this)
```

**Usage Guidelines:**

**Fast (150-200ms):**
- Button hover states
- Icon changes
- Small badge animations
- Tooltip appearances

**Medium (250-350ms):**
- Card entrance/exit
- Text fade-in
- List stagger
- Alert appearances

**Slow (400-500ms):**
- Slide-to-slide transitions
- Section changes
- Modal open/close
- Major layout shifts

### 3.2 Easing Functions

**Approved:**
```css
ease-out     /* Standard for all motion */
linear       /* Opacity-only transitions */
```

**Ease-out Curve:**
```
Starts fast, ends slow
Creates natural deceleration
Feels professional and controlled
```

**When to use linear:**
- Pure opacity changes (fade in/out)
- Color transitions
- No spatial movement

**Forbidden:**
```css
ease-in-out-back    /* Overshoot */
cubic-bezier with bounce
spring animations
elastic easing
```

### 3.3 Delay Patterns

**Stagger Delays:**
```
Short:   80ms     List items, small grids
Medium:  120ms    Card grids, sections
Long:    150ms    Major sequential reveals
```

**Sequential Delays:**
```
Element 1: 0ms
Element 2: 100ms
Element 3: 200ms
Element 4: 300ms
```

**Maximum delay:** 400ms (anything longer feels broken)

---

## 4. SLIDE TRANSITIONS

### 4.1 Standard Slide Transition

**Used for:** All slide-to-slide movement in presentations

**Specification:**
```css
/* Entering slide */
opacity: 0 → 100%
transform: translateY(12px) → translateY(0)
duration: 350ms
easing: ease-out
```

**Visual Effect:**
- Slide fades in
- Slides up slightly (12px)
- Smooth, professional appearance

**Why this works:**
- Feels official and measured
- Doesn't distract from content
- Clear directional flow
- Accessible (no jarring movement)

### 4.2 Slide Transition Code

**CSS:**
```css
.slide-enter {
  opacity: 0;
  transform: translateY(12px);
}

.slide-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 350ms ease-out,
              transform 350ms ease-out;
}
```

**Figma Smart Animate:**
```
Frame 1 (before):
- Opacity: 0%
- Y: +12px

Frame 2 (after):
- Opacity: 100%
- Y: 0px

Connection:
- Type: Smart Animate
- Duration: 350ms
- Easing: Ease Out
```

---

## 5. ELEMENT ANIMATIONS

### 5.1 Fade-In

**Use for:** Headers, text blocks, icons
```css
opacity: 0 → 100%
duration: 250-350ms
easing: linear
```

**Code:**
```css
.fade-in {
  animation: fadeIn 300ms linear forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 5.2 Slide-Up

**Use for:** Cards, sections, containers
```css
opacity: 0 → 100%
transform: translateY(12px) → translateY(0)
duration: 300ms
easing: ease-out
```

**Code:**
```css
.slide-up {
  animation: slideUp 300ms ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5.3 Slide-In (Horizontal)

**Use for:** Two-column layouts, lists

**From Left:**
```css
opacity: 0 → 100%
transform: translateX(-16px) → translateX(0)
duration: 300ms
easing: ease-out
```

**From Right:**
```css
opacity: 0 → 100%
transform: translateX(16px) → translateX(0)
duration: 300ms
easing: ease-out
```

### 5.4 Stagger Animation

**Use for:** Lists, grids, multiple cards

**Pattern:**
```
Item 1: delay 0ms,    duration 250ms
Item 2: delay 100ms,  duration 250ms
Item 3: delay 200ms,  duration 250ms
Item 4: delay 300ms,  duration 250ms
```

**Code:**
```css
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 100ms; }
.stagger-item:nth-child(3) { animation-delay: 200ms; }
.stagger-item:nth-child(4) { animation-delay: 300ms; }

.stagger-item {
  animation: slideUp 250ms ease-out forwards;
  opacity: 0;
}
```

**Figma:**
- Duplicate elements
- Set opacity 0% → 100%
- Add delays: 0ms, 100ms, 200ms, 300ms
- Smart Animate between frames

### 5.5 Micro-Scale

**Use for:** Icons, badges (subtle emphasis)
```css
transform: scale(0.96) → scale(1.00)
opacity: 0 → 100%
duration: 120-150ms
easing: ease-out
```

**Code:**
```css
.micro-scale {
  animation: microScale 120ms ease-out forwards;
}

@keyframes microScale {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1.00);
  }
}
```

**⚠️ Use sparingly:** Only for key elements that need subtle emphasis

---

## 6. INTERACTION MOTION

### 6.1 Hover States

**Cards:**
```css
/* Default */
transform: translateY(0);
box-shadow: 0 1px 3px rgba(0,0,0,0.06);

/* Hover */
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(59,130,246,0.2);
transition: all 120ms ease-out;
```

**Buttons:**
```css
/* Default */
opacity: 1;

/* Hover */
opacity: 0.9;
transition: opacity 120ms ease-out;
```

**Links:**
```css
/* Default */
color: #3B82F6;

/* Hover */
color: #2563EB;
text-decoration: underline;
transition: color 120ms ease-out;
```

### 6.2 Press/Active States

**Buttons:**
```css
/* Pressed */
transform: scale(0.98);
transition: transform 80ms ease-out;
```

**Cards:**
```css
/* Clicked */
transform: translateY(-2px);
transition: transform 80ms ease-out;
```

### 6.3 Focus States

**All interactive elements:**
```css
/* Focus */
outline: 2px solid #3B82F6;
outline-offset: 2px;
transition: outline-color 120ms ease-out;
```

**Focus-visible only:**
```css
.element:focus-visible {
  outline: 2px solid #3B82F6;
}

.element:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 7. ACCESSIBILITY

### 7.1 Reduce Motion

**Required for WCAG 2.1 AA compliance:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Effect:**
- All animations essentially instant
- Opacity changes still occur (accessible)
- No motion that could cause vestibular issues

### 7.2 Motion Safety Rules

**Never:**
- Flashflashing content (3+ times per second)
- Rapid movement back and forth
- Large-scale zooming
- Spinning or rotation (except loading icons)
- Parallax scrolling

**Always:**
- Keep durations under 500ms
- Use ease-out for deceleration
- Limit simultaneous animations (max 3)
- Provide reduced motion option

### 7.3 Cognitive Load

**Maximum simultaneous animations:** 3 elements

**Example (Good):**
```
Header fades in (1)
  ↓ 150ms delay
Card 1 slides up (2)
  ↓ 100ms delay
Card 2 slides up (3)
```

**Example (Bad):**
```
10 cards animating at once ❌
Header, footer, sidebar all moving ❌
Multiple competing motion paths ❌
```

---

## 8. IMPLEMENTATION

### 8.1 Slide-by-Slide Specifications

#### Slide 1: Title
```
Title:
  - Fade-in
  - Duration: 400ms
  - Delay: 0ms

Subtitle:
  - Fade + translateY(12px → 0)
  - Duration: 350ms
  - Delay: 150ms

Badge:
  - Fade-in
  - Duration: 300ms
  - Delay: 250ms

Footer:
  - Fade-in
  - Duration: 300ms
  - Delay: 350ms
```

#### Slide 2: Purpose & Mission
```
Header:
  - Fade-in
  - Duration: 300ms
  - Delay: 0ms

Left Column Text:
  - Slide-in from left (X: -16px → 0)
  - Duration: 400ms
  - Delay: 0ms

Right Column Icons:
  - Staggered fade
  - Duration: 250ms each
  - Delay: 0ms, 100ms, 200ms
```

#### Slide 3: Key Capabilities
```
Header:
  - Fade-in
  - Duration: 300ms
  - Delay: 0ms

3 Cards:
  - Slide-up (Y: +12px → 0)
  - Duration: 300ms
  - Delay: 0ms, 100ms, 200ms (stagger)
```

#### Slide 4: Case Categories
```
Header:
  - Fade-in
  - Duration: 300ms
  - Delay: 0ms

5 Cards (Grid):
  Row 1 (3 cards):
    - Delay: 0ms, 100ms, 200ms
  Row 2 (2 cards):
    - Delay: 150ms, 250ms

Icons (within cards):
  - Micro-scale
  - Duration: 120ms
  - Delay: +50ms after card appears
```

#### Slide 5: Compliance & Safety
```
Header:
  - Fade-in
  - Duration: 300ms
  - Delay: 0ms

Alert Box:
  - Fade + scale(0.98 → 1.00)
  - Duration: 300ms
  - Delay: 150ms

Bullet List:
  - Stagger
  - Duration: 250ms each
  - Delay: 80ms between items
```

#### Slide 6: Architecture
```
Header:
  - Fade-in
  - Duration: 300ms
  - Delay: 0ms

5 Boxes (Flow):
  - Slide-up stagger
  - Duration: 300ms each
  - Delay: 0ms, 120ms, 240ms, 360ms, 480ms

Arrows:
  - Fade-in
  - Duration: 200ms
  - Delay: 200ms (after first box)
```

#### Slide 7: U.S. Origin
```
Header:
  - Fade-in
  - Duration: 300ms
  - Delay: 0ms

Body Text:
  - Fade + translateY(12px → 0)
  - Duration: 350ms
  - Delay: 150ms

Footer:
  - Fade-in
  - Duration: 300ms
  - Delay: 300ms
```

### 8.2 Figma Smart Animate Setup

**Step 1: Create Two Frames**
```
Frame A (Before):
- All elements opacity 0%
- Positioned +12px down

Frame B (After):
- All elements opacity 100%
- Positioned at 0px
```

**Step 2: Add Connection**
```
Prototype → Frame A → Frame B
Interaction: On Click
Animation: Smart Animate
Easing: Ease Out
Duration: 350ms
```

**Step 3: Add Delays**
```
For stagger effects:
- Duplicate elements
- Set individual delays in prototype
- Test in presentation mode
```

### 8.3 PowerPoint/Keynote

**Entrance Effects:**
```
Effect: Fade
Duration: 0.3s (medium)
Delay: Use "Animation Pane" to stagger

Do NOT use:
- Fly In
- Zoom
- Swivel
- Bounce
```

**Transition:**
```
Type: Fade
Duration: 0.35s
Sound: None
```

---

## 9. QUALITY CHECKLIST

### Before Publishing

**Motion:**
- [ ] All durations under 500ms
- [ ] Only ease-out easing used
- [ ] No bounce/elastic effects
- [ ] Stagger delays consistent (80-120ms)
- [ ] Maximum 3 simultaneous animations
- [ ] Reduced motion mode implemented

**Accessibility:**
- [ ] Focus states clearly visible
- [ ] No flashing content
- [ ] Motion can be disabled
- [ ] Works with keyboard only
- [ ] Screen reader friendly

**Performance:**
- [ ] Animations smooth (60fps)
- [ ] No layout shifts
- [ ] GPU-accelerated properties used
- [ ] Tested on low-end devices

**Consistency:**
- [ ] Matches design system
- [ ] Follows USA.gov standards
- [ ] Professional, institutional tone
- [ ] All variants tested (light/dark)

---

## 10. RESOURCES

### Design Systems Reference

- **USWDS:** https://designsystem.digital.gov
- **USA.gov:** https://www.usa.gov
- **Material Design (timing reference):** https://m3.material.io/styles/motion

### Accessibility

- **WCAG 2.1 Motion:** https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions
- **Vestibular Disorders:** https://vestibular.org/article/triggers/visual-triggers/

### Tools

- **Figma Smart Animate:** Built-in
- **CSS Easing Functions:** https://easings.net
- **Animation Testing:** Chrome DevTools (Performance tab)

---

**IVYAR Governance Platform**  
**Motion Guidelines Version:** 1.0  
**Standard:** U.S. Federal (USWDS-aligned)  
**Last Updated:** January 13, 2026  
**Status:** Production-ready
