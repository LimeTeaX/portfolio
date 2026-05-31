---
title: "Building a Fullstack Task Tracker: From Auth to Dashboard"
date: 2025-01-28
description: "Building a production-ready task management app with React, Node.js, PostgreSQL, and JWT authentication"
techStack: ["React", "Node.js", "Express", "PostgreSQL", "TypeScript", "JWT"]
constraint: "Learning fullstack development while building a real product"
timeline: "1 week"
teamSize: "solo"
published: true
---

## Problem

I needed a complete fullstack project to demonstrate:
- Backend API design (REST, authentication, validation)
- Frontend development (React, routing, state management)
- Database design (relationships, migrations, queries)

Task management is a perfect domain — everyone understands it, but implementing it properly requires real engineering decisions.

## Constraints

- Must work locally (no cloud dependencies for development)
- JWT authentication with refresh token rotation
- Role-based access control (Owner, Manager, Member)
- Clean architecture (separation of concerns)
- Must be demo-ready for recruiters

## Architecture

<pre style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', background: 'var(--code-bg)', padding: '1rem', borderRadius: '4px' }}>
{`
Browser (React + Vite)
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  Nginx / Dev Server (Port 5173)                         │
│  - React Router for navigation                          │
│  - Axios interceptor for token refresh                  │
│  - AuthContext for global user state                    │
└─────────────────────────────────────────────────────────┘
     │ (HTTP + JWT)
     ▼
┌─────────────────────────────────────────────────────────┐
│  Express API Server (Port 3000)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Controllers │  │  Services   │  │ Repositories│     │
│  │ (HTTP layer)│  │(Business    │  │(Database    │     │
│  │             │  │  logic)     │  │  access)    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  Middleware: Auth, Validation, Error Handler, Rate Limit│
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  PostgreSQL Database                                    │
│  - users, refresh_tokens                                │
│  - projects, project_members                            │
│  - tasks                                                │
└─────────────────────────────────────────────────────────┘
`}
</pre>

## Decision Log

| Decision | Alternative | Why chosen | Consequence |
|----------|-------------|------------|-------------|
| Knex.js over Prisma | Prisma 7 | Prisma 7 broke before, Knex is stable | More manual SQL, but full control |
| JWT with refresh token rotation | Session-based | Stateless, scalable, works on multiple servers | Need to store refresh tokens in DB |
| React Context over Redux | Redux Toolkit | Simpler, less boilerplate for this scale | Might need Redux if app grows |
| Axios interceptor for token refresh | Manual refresh on each 401 | Automatic, seamless user experience | More complex setup |
| Soft delete over hard delete | Permanent deletion | Data retention, audit trail | Every query needs `deleted_at IS NULL` |

## What Broke

**Prisma 7 Breaking Changes (Again):**

I almost used Prisma again. But remembered the URL property error from previous project. Switched to Knex.js before starting.

**Lesson:** Experience pays off.

**Tailwind CSS v4 Incompatibility:**

Tailwind CSS v4 uses a different PostCSS plugin. Error message was confusing.

**Solution:** Downgraded to Tailwind v3, then eventually switched to inline CSS for simplicity.

**Time wasted:** 2 hours

**TypeScript Express Types:**

`req.params.id` can be `string | string[]`. TypeScript complained when passing to functions expecting `string`.

**Solution:** Helper function to ensure string type.

```typescript
function getParamId(params: any): string {
  const id = params.id;
  if (Array.isArray(id)) return id[0];
  return id;
}

Axios Interceptor Infinite Loop:

When refresh token also expired, the interceptor kept retrying.

Solution: Track retry count and redirect to login after 1 attempt.

Results
Backend:

12 API endpoints (auth, projects, tasks, members)

JWT with refresh token rotation

RBAC (Owner, Manager, Member)

Soft delete for data retention

Frontend:

Login, Register, Dashboard pages

Create project modal

Project detail with tasks

Logout functionality

Axios interceptor for auto token refresh

Time breakdown:

Backend: 4 days

Frontend: 2 days

Debugging: 1 day

Total: 7 days

Lessons Learned
Fullstack development is a different beast — Backend and frontend each have their own complexities

Stable libraries > newest libraries — Knex (stable) over Prisma 7 (bleeding edge)

Token refresh must be seamless — Users shouldn't notice token expiration

Context API is enough for small apps — No need for Redux yet

Documentation saves time — These docs helped me remember decisions when debugging frontend

Testing with PowerShell is reliable — Better than CMD for API testing on Windows

Future Improvements
Deploy to production (Render/Fly.io)

Real-time updates (WebSocket for task changes)

Activity logging (who changed what)

Analytics dashboard (overdue tasks, productivity metrics)

Dark mode toggle (ironic, after removing from portfolio)

The Honest Truth
This is the largest project I've built alone. It has bugs. Some CSS is inline (not ideal). But it works, it's demoable, and I can explain every decision.

From "how do I set up PostgreSQL?" to "here's my fullstack app with JWT refresh" in one week. Not bad.