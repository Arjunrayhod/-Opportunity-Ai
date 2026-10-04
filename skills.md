---
name: frontend-design
description: Create distinctive, production-grade frontend and mobile UI experiences that reject generic AI boilerplate through intentional design direction, high-contrast typography, domain-grounded color systems, tactile micro-interactions, and robust mobile ergonomics.
---

# Opportunity AI - Frontend Design & Mobile Craft Skill (skills.md)

This skill document defines the design and frontend engineering rules for Opportunity AI, inspired by Anthropic's `frontend-design` skill guidelines and modern mobile UX best practices.

## 1. Design Philosophy: "Break the Default"
Reject generic AI templates, repetitive cards, purple gradient cliches, and lazy filler aesthetics. Treat every product as a bespoke creation with its own distinct personality, domain vocabulary, and craft.

### Core Tenets:
1. **Domain Grounding**: The visual language must emerge directly from the subject matter (EdTech & Fintech trading needs high data clarity, confidence-inspiring deep teal & emerald accents, and clear numeric formatting).
2. **Intentional Hierarchy**: Hero elements must feature the most characteristic, high-impact tool or insight (e.g. AI Opportunity Radar, Live Course Streamer, Risk Engine), not just generic marketing fluff.
3. **Typography with Purpose**: Use high-grade fonts (`Plus Jakarta Sans`) with deliberate weights, tracking, and strictly controlled line lengths (< 80 characters for optimal readability).
4. **Purposeful Motion & Tactile Feedback**: Never apply gratuitous scroll animations. Reserve motion for direct user-triggered state changes (tab switches, drawer expansions, modal dismissals, payment confirmations) with snappy physics (`ease-out`, 150-250ms).
5. **No AI Tells**: Avoid lone italic words in headlines, overuse of uppercase labels without hierarchy, and fake progress badges.

---

## 2. Mobile-First & Android Ergonomics Rules
Strictly adhere to mobile usability guidelines:
- **Touch Target Size**: All interactive buttons, icon triggers, and navigation tabs must be at least **48x48px** with appropriate touch padding.
- **Input Types**: Always specify correct HTML input types (`type="tel"` or `inputmode="numeric"` for mobile numbers and OTPs; `inputmode="decimal"` for trading prices/quantities) to trigger the correct native virtual keyboard on Android/iOS.
- **Safe Area Insets**: Respect notch, status bar, and gesture navigation bars using `pb-[calc(env(safe-area-inset-bottom)+4.5rem)]` and `pt-[env(safe-area-inset-top)]`.
- **Single-Column Focus**: Keep cards and high-density information readable in a single column or cleanly scrollable horizontal rail on mobile screens (`< 640px`).
- **No Overlapping Modals**: Modal dialogues, bottom sheets, and slide-overs must manage z-index cleanly (`z-50`) with backdrop blur and trap focus properly.

---

## 3. UI Component Standards (Tailwind CSS & React)
- **Glassmorphic Cards**: Use subtle translucent backgrounds (`bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-xl`) with crisp interior borders.
- **Color Cohesion**: Enforce deliberate accent colors (Teal `#003539`, Mint `#b0edf4`, Warm Gold `#934b00`, Emerald Green `#a6f4b5`) rather than random pastel rainbows.
- **Micro-State Visuals**: Every interactive state must have distinct `:hover`, `:active`, `:focus-visible`, and `disabled:opacity-50` styles.
- **Error-Free Rendering**: Prevent null reference crashes by using optional chaining (`?.`), fallback states, and accessible SVG icons.

---

## 4. Verification Checklist
- [x] All touch targets $\ge 48\text{px}$ across Mobile Bottom Nav & Header triggers.
- [x] UI renders cleanly on both 360px mobile viewports and desktop wide screens.
- [x] Numeric inputs configured with `type="tel"` / `inputmode="numeric"`.
- [x] Animations are smooth (60fps) and non-distracting.
- [x] Contrast WCAG AA compliant across dark slate surfaces.
