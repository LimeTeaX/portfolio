# Technical Architecture - Astro Version

## Stack Decision (Revisi)

**Static Site Generator**: Astro
- Why: Island architecture, zero JS by default, excellent Markdown/MDX support
- Alternative rejected: 11ty (kurang ekosistem modern)
- Alternative rejected: Next.js (overfetching untuk portfolio static)

**Hosting**: Netlify / Vercel / Cloudflare Pages (terserah kamu)

**Styling**: 
- Option A: Tailwind (Astro punya integrasi bawaan)
- Option B: Custom CSS (lebih sesuai design system kita)
- Keputusan: Custom CSS dengan PostCSS (kontrol penuh)

**Component Strategy**:
- Astro Islands untuk interaktivitas minimal
- .astro components untuk semua UI
- Vanilla JS hanya untuk margin notes + decision table sorting

## Astro-Specific Decisions

**Content Collections** (Astro 4.0+)
- Gunakan untuk case studies dan notes
- Schema validation dengan Zod

**File Structure untuk Content**: