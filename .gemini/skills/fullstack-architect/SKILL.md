---
name: fullstack-architect
description: Architectural patterns for scalable, resilient fullstack systems, data modeling, offline-first sync, and modular state management.
---

# Fullstack System Architect Skill

## Architecture Patterns
1. **Modular Monolith & Layered Design**:
   - Clear separation between Presentation Layer (React components), Domain Services (state/business logic), and Infrastructure/Data Layer (APIs, LocalStorage, IndexedDB, Firebase).
2. **Offline-First & Optimistic UI**:
   - Save local state immediately to IndexedDB/LocalStorage.
   - Sync mutations asynchronously when network is restored.
3. **Resilient Error Boundaries**: Wrap critical views in React Error Boundaries with graceful recovery triggers.
