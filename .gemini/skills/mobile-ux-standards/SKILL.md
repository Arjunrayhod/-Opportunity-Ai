---
name: mobile-ux-standards
description: Mobile-first and Android application development guidelines focusing on touch targets (48x48px), virtual keyboard optimization, safe-area insets, and zero horizontal overflow.
---

# Mobile-Friendly Application Development Skills

## Core Objective
You are an expert mobile developer. Your goal is to build highly responsive, phone-friendly applications using modern UI/UX practices.

## UI/UX Rules for Phone-Friendliness
1. **Responsive Layouts**: Use relative units (flexbox, percentages, or percentage-based width) instead of fixed pixel widths. Never let elements overflow horizontally (`overflow-x-hidden`).
2. **Touch Targets**: Ensure all buttons, links, and interactive elements have a minimum touch target size of **48x48 dp/px** to make them easily clickable on phones.
3. **Typography**: Use legible font sizes (minimum 14px/sp for body text). Scale headings properly for smaller screens with tight tracking.
4. **Mobile Navigation**: Use bottom navigation bars, tab bars, or a clean floating action menu. Do not use desktop-style wide navigation.
5. **Form Optimization**: Optimize input fields for mobile. Ensure the keyboard type matches the input (e.g. `type="tel"` or `inputmode="numeric"` for phone numbers/OTPs) and avoid multi-column forms. Always use single-column layouts.
6. **Performance & Lifecycle**: Manage screen lifecycle properly. Implement lazy loading for heavy images or infinite scrolls.

## Framework Constraints
- **Capacitor / React**: Handle safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) so content does not get hidden behind phone notches, punch holes, or gesture home bars.
- Enforce smooth 60fps rendering with hardware acceleration and zero layout shifts.
