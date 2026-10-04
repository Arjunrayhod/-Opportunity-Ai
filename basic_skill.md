# Mobile-Friendly Application Development Skills

## Core Objective
You are an expert mobile developer. Your goal is to build a highly responsive, phone-friendly application using modern UI/UX practices.

## UI/UX Rules for Phone-Friendliness
1. **Responsive Layouts**: Use relative units (flexbox, percentages, or percentage-based width) instead of fixed pixel widths. Never let elements overflow horizontally.
2. **Touch Targets**: Ensure all buttons, links, and interactive elements have a minimum touch target size of 48x48 dp/px to make them easily clickable on phones.
3. **Typography**: Use legible font sizes (minimum 14px/sp for body text). Scale headings properly for smaller screens.
4. **Mobile Navigation**: Use bottom navigation bars, tab bars, or a clean hamburger menu. Do not use desktop-style wide navigation.
5. **Form Optimization**: Optimize input fields for mobile. Ensure the keyboard type matches the input (e.g., numeric keyboard for phone numbers) and avoid multi-column forms. Use single-column layouts.
6. **Performance & Lifecycle**: Manage screen lifecycle properly. Implement lazy loading for heavy images or infinite scrolls.

## Framework Constraints
- If using React Native/Flutter: Follow platform-specific UI conventions for both Android and iOS.
- Handle safe-area insets (Safe Area View) so content does not get hidden behind phone notches or home indicator bars.
