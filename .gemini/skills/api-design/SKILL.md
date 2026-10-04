---
name: api-design
description: Design clean, resilient, standardized RESTful and RPC APIs with strict input validation, idempotency, consistent error schemas, and pagination.
---

# API Design & Contract Standards Skill

## Core Principles
1. **Predictable JSON Schemas**: Every response must follow a unified structure:
   - Success: `{ "success": true, "data": { ... }, "meta": { "timestamp": "...", "page": 1 } }`
   - Error: `{ "success": false, "error": { "code": "INVALID_PARAM", "message": "Human readable detail", "details": [] } }`
2. **HTTP Verbs & Status Codes**:
   - `200 OK` / `201 Created` for successful state mutations.
   - `400 Bad Request` for invalid input parameters.
   - `401 Unauthorized` for unauthenticated requests; `403 Forbidden` for missing permissions.
   - `404 Not Found` for missing resources.
   - `429 Too Many Requests` with `Retry-After` header.
3. **Idempotency**: Use Idempotency Keys (`Idempotency-Key` header) for financial transactions, orders, and payment webhooks to prevent duplicate charges.
4. **Pagination**: Implement cursor-based or limit/offset pagination with standard query parameters (`?limit=20&cursor=...`).
