---
name: performance-optimizer
description: Fullstack performance optimization, Core Web Vitals (LCP, FID, CLS), asset compression, caching strategies, and bundle splitting.
---

# Performance Optimizer Skill

## Web & Frontend Optimization
1. **Core Web Vitals**:
   - **LCP (Largest Contentful Paint)**: Preload critical hero fonts and images. Use modern WebP/AVIF formats.
   - **CLS (Cumulative Layout Shift)**: Always set explicit `width` and `height` attributes on images and video embeds.
   - **INP (Interaction to Next Paint)**: Keep JS execution chunks under 50ms using `requestIdleCallback` or web workers.
2. **Code Splitting**: Dynamically import (`React.lazy()`) non-critical routes and heavy modals to keep the initial JS bundle under 200KB gzipped.
3. **Caching**: Utilize stale-while-revalidate caching headers (`Cache-Control: public, max-age=31536000, immutable` for static hashed assets).
4. **DOM Efficiency**: Virtualize long lists (> 100 items) to prevent DOM bloat and memory leaks.
