---
title: "Building a URL Shortener: When Prisma 7 Broke My Plan"
date: 2026-05-30
description: "How I built a URL shortener with Next.js, SQLite, and QR codes — and why I abandoned Prisma for raw SQL"
techStack: ["Next.js 14", "TypeScript", "better-sqlite3", "QR Code"]
constraint: "Prisma 7 breaking changes + Vercel deployment limits"
timeline: "3 days"
teamSize: "solo"
published: true
---

## Problem

I needed a portfolio project that demonstrated:
- Full-stack capabilities (API + database + frontend)
- Real-world utility (URL shortener is actually useful)
- Attention to detail (unique hit counter, QR codes)

But I didn't expect the database setup to become the hardest part.

## Constraints

- Must work on Vercel (serverless environment)
- Need unique hit counter per user (no double-counting)
- QR code generation on-demand
- No budget for paid services

## Architecture

<pre style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', background: 'var(--code-bg)', padding: '1rem', borderRadius: '4px' }}>
{`
User Request
     │
     ▼
┌─────────────────────────────────────┐
│  Next.js App Router                 │
│  ┌─────────────┐  ┌─────────────┐  │
│  │ POST /api/  │  │ GET /[slug] │  │
│  │ shorten     │  │ redirect    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
     │                    │
     ▼                    ▼
┌─────────────────────────────────────┐
│  SQLite (better-sqlite3)            │
│  ┌───────────────────────────────┐  │
│  │ links: slug, url, created_at  │  │
│  │ clicks: slug, session_id      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  QR Code Generator (on-demand)      │
│  - SVG format                       │
│  - Cache 24 hours                   │
└─────────────────────────────────────┘
`}
</pre>

## Decision Log

| Decision | Alternative | Why chosen | Consequence |
|----------|-------------|------------|-------------|
| better-sqlite3 over Prisma | Prisma 7 | Prisma 7 broke, too complex for MVP | Lost type safety, manual SQL queries |
| Session cookie for hit counter | IP address | IP unreliable on Vercel (all requests from proxy) | Need to set cookie with 1 year expiry |
| SVG over PNG for QR | PNG | Smaller file, scalable, can be cached | Browser support is universal now |
| Custom CSS over Tailwind | Tailwind CSS | Dependency conflicts, overkill for small project | More manual styling, but full control |
| Native Next.js cookies | cookies-next library | Peer dependency conflicts | Works fine, less external deps |

## What Broke

**Prisma 7 Migration Hell:**

I started with Prisma because ORMs make schema management easy. But Prisma 7 changed everything.

Errors I faced:
- The datasource property url is no longer supported in schema files
- (0 , CSe.isError) is not a function
- Prisma schema validation - P1012

**Root cause:** Prisma 7 is too new. Documentation is limited, and breaking changes aren't well documented yet.

**Solution:** Abandoned Prisma entirely. Switched to better-sqlite3 with raw SQL queries.

**Time wasted:** 3 hours

**API 404 Error:**

POST `/api/shorten` kept returning 404.

**Root cause:** I didn't know Next.js App Router has strict conventions for API routes. File must be exactly `app/api/shorten/route.ts` with `export async function POST()`.

**Solution:** Read Next.js documentation properly.

**Vercel SQLite Ephemeral Storage:**

Deployed to Vercel, everything worked. Then redeployed. All data gone.

**Root cause:** Vercel's serverless environment doesn't persist SQLite files between deployments.

**Lesson:** For production, use Turso (hosted SQLite) or Neon (PostgreSQL).

## Results

- Functional URL shortener with unique hit counter
- QR code generator (SVG format, downloadable)
- Copy to clipboard with toast notification
- Responsive design (mobile friendly)
- Deployed on Vercel (data resets on redeploy — known limitation)

**Time breakdown:**
- Development: 6 hours
- Debugging: 4.5 hours
- Total: 10.5 hours

## Lessons Learned

1. **Read changelogs before upgrading** — Prisma 7 broke my plan. Could have saved 3 hours by checking breaking changes first.

2. **Abandoning technology is okay** — Switching from Prisma to raw SQL was the right call. Don't sink time into something that's not working.

3. **Know your platform limits** — Vercel + SQLite = ephemeral data. For persistent storage, use Turso or Neon from day 1.

4. **Cookies over localStorage for server data** — Session ID must be sent to server automatically. Cookie does that, localStorage doesn't.

5. **Read the full error message** — Stack traces are maps, not enemies. The answer is often there.

## Future Improvements (V2)

- Migrate to Turso (persistent SQLite on Vercel)
- Custom slug endpoint (user chooses short code)
- Stats page with click charts
- User authentication (NextAuth)
- Link expiration with cron job cleanup

## The Honest Truth

This project was supposed to take 2 days. It took 3 because of Prisma 7. But I learned more from the failures than I would have from a smooth build.

Sometimes the best decision is to delete the problematic dependency and go simpler. Raw SQL isn't scary.