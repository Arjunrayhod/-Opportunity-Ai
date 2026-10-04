---
name: security-audit
description: Rigorous security assessment, OWASP Top 10 auditing, auth verification, anti-tampering, and vulnerability prevention for web and mobile applications.
---

# Security Audit & Hardening Skill

## Core Principles
1. **Zero Trust Architecture**: Never trust client-side inputs. Validate, sanitize, and strictly type all payloads at boundaries.
2. **OWASP Top 10 Mitigation**:
   - Prevent Broken Access Control (enforce server-side role checks for admin routes).
   - Prevent Injection (parameterized SQL, sanitized NoSQL, escaped output against XSS).
   - Cryptographic Failures (use standard AES-256-GCM / SHA-256; never roll custom cryptography).
3. **Mobile & Android Hardening**:
   - Apply `FLAG_SECURE` to block screenshots and screen recording on sensitive views.
   - Obfuscate release builds using R8 / ProGuard.
   - Verify APK signatures to prevent repackaging / MT Manager cracking.
   - Store sensitive keys and tokens only in encrypted secure storage / keystore, never hardcoded in plaintext.
4. **Rate Limiting & Anti-Abuse**: Protect auth endpoints, OTP requests, and payment callbacks against brute force and replay attacks.
