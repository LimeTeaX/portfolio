---
title: "Building a Rate Limiting System That Failed Gracefully"
date: 2024-01-15
description: "How I built a token bucket rate limiter that survived 10x traffic spikes and what broke along the way"
techStack: ["TypeScript", "Node.js", "Redis", "PostgreSQL"]
constraint: "Could not modify upstream service"
timeline: "3 weeks"
teamSize: "solo"
published: true
---

## Problem

Analytics team needed to query user data at 10,000 requests per minute, but the upstream analytics service would start rejecting requests at 2,000 requests per minute. The initial solution was retry with exponential backoff, which caused cascading failures during peak hours.

The data couldn't be dropped - every analytics event was critical for business reporting. The upstream service was maintained by a different team that had no capacity to increase their rate limits for at least six months.

## Constraints

- Cannot modify upstream service code or configuration
- Must preserve request ordering for specific user IDs (analytics queries for user X must process in sequence)
- Zero tolerance for dropped analytics events
- No budget for additional infrastructure
- Solo developer, three weeks timeline

## Architecture
Client Request
│
▼
┌─────────────┐
│ Token Bucket│ ← Per-user bucket (in-memory)
│ (Rate limiter)
└─────────────┘
│ (allowed)
▼
┌─────────────┐
│ Priority │ ← User ID-based partitioning
│ Queue │
└─────────────┘
│
▼
┌─────────────┐
│ Upstream │ ← Rate limited to 2k/min
│ Service │
└─────────────┘
│ (if failed)
▼
┌─────────────┐
│ Dead Letter │ ← S3 backup, never lose data
│ Queue │
└─────────────┘


## Decision Log

| Decision | Alternative | Why chosen | Consequence |
|----------|-------------|------------|-------------|
| Token bucket algorithm | Fixed window counter | Token bucket allows bursts up to bucket size, fixed window rejects at boundaries | More complex state management, need to track last refill time |
| In-memory token state | Redis | Lower latency, zero network calls for solo project scale (under 100 req/sec initially) | Not horizontally scalable. When traffic grew to 500 req/sec, became bottleneck |
| Per-user buckets | Global bucket | Preserves ordering requirements for user ID queries | 10x more state objects to track |
| S3 dead letter queue | Kafka / RabbitMQ | No additional infrastructure, just S3 API | 50-100ms latency penalty per failed request |

## What Broke

**Day 3 of production deployment:**

The token bucket refill calculation used local server time. One of our servers had a system clock configured with UTC+7, another with UTC+0. The refill rates were calculated at different absolute times, causing inconsistent rate limiting across instances.

**Root cause:**
```typescript
// WRONG
const timeSinceLastRefill = Date.now() - lastRefillTime;

// CORRECT
const timeSinceLastRefill = getCurrentUTC() - lastRefillTime;

Fix: All timestamps normalized to UTC. Added integration test that simulated servers in different timezones.

Day 30:

In-memory token state caused inconsistencies during deployment. When a server restarted, all token buckets were lost, allowing a sudden burst of requests that overwhelmed the upstream service.

Fix: Implemented graceful drain period during shutdown (30 seconds to process remaining queued requests) and persisted token state to disk every 5 seconds.

Results
Sustained 10,000 requests per minute for 99.7% of traffic over 90 days

Zero events lost (dead letter queue processed all 1,247 failed requests)

Upstream service error rate dropped from 15% to 0.3%

Response time: p95 remained under 150ms

Lessons Learned
Assume timezones will break everything - Normalize to UTC at system boundaries, not just where you think it matters

Stateful services need graceful shutdown - Deployment should be treated as a failure case, not a success case

Document your scale assumptions - "This works for under 100 req/sec" should be in a comment, not just in your head. When traffic grew 5x, we had the monitoring to know we were violating assumptions

Future Improvements
If I were to rebuild this today:

Use Redis from day 1 (the horizontal scaling pain wasn't worth the simplicity)

Add circuit breaker to upstream calls (when upstream starts failing fast, stop trying)

Implement request coalescing for identical queries (analytics team often asked for same user data repeatedly)