---
name: code-reviewer
description: High-rigor code review, detecting edge-case regressions, anti-patterns, race conditions, memory leaks, and enforcing maintainability standards.
---

# Code Reviewer & Quality Engineering Skill

## Review Checklist & Guidelines
1. **Correctness & Edge Cases**:
   - Handle null/undefined values gracefully using optional chaining and default fallbacks.
   - Guard against off-by-one errors in arrays, pagination, and slicing.
   - Ensure async error handling (always use try/catch or `.catch()` handlers).
2. **State & Lifecycle Management**:
   - Avoid infinite re-render loops in React `useEffect` / `useMemo` by specifying exhaustive dependency arrays.
   - Clean up event listeners, timers (`setInterval`/`setTimeout`), and subscriptions in unmount cleanup functions.
3. **Type Safety (TypeScript)**:
   - Eliminate `any` types wherever possible. Use discriminated unions, strict interfaces, and generics.
4. **Performance**:
   - Avoid creating new object/function references inside render loops for large lists.
   - Memoize expensive calculations.
