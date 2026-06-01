---
title: "Music Dashboard: Surviving API Rate Limits and Spotify's 403"
date: 2026-06-01
description: "Building a personal music intelligence platform with Last.fm + YouTube APIs, handling rate limits, quota constraints, and a last-minute migration from Spotify"
techStack: ["React", "TypeScript", "Last.fm API", "YouTube Data API", "Tailwind CSS v4"]
constraint: "Spotify 403 error + YouTube 100 searches/day quota + Last.fm rate limiting"
timeline: "2 weeks"
teamSize: "solo"
published: true
---

## Problem

I wanted a personal music dashboard to track listening habits, discover new artists, and play music — without paying for Spotify Premium or any API subscription.

Three problems emerged:

1. **Spotify API blocked me** — 403 error. No Premium account, no access.
2. **YouTube Data API has quota** — Only 100 searches/day (10,000 units, each search = 100 units)
3. **Last.fm has rate limits** — 5 requests/second, sometimes stricter for certain endpoints

The challenge: Build a fully functional music app within these constraints.

## Constraints

- No Spotify Premium → cannot use Spotify Web Playback SDK or API
- YouTube quota: ~100 searches/day (enough for personal use, but need caching)
- Last.fm rate limit: 5 req/sec, TopGenres previously failed with 30 artist calls
- No backend server — all client-side (to avoid additional costs)
- Must work with just a Last.fm username (no OAuth complexity)

## Architecture

<pre style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', background: 'var(--code-bg)', padding: '1rem', borderRadius: '4px' }}>
{`
┌─────────────────────────────────────────────────────────────┐
│                      Browser (React + Vite)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Last.fm API  │  │ YouTube Data │  │  YouTube     │      │
│  │ (13 methods) │  │ API (search) │  │ IFrame Player│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                  │              │
│         ▼                 ▼                  ▼              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Caching Layer                     │   │
│  │  - YouTube search: 10 min TTL (in-memory Map)        │   │
│  │  - Last.fm data: no cache (real-time stats)          │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                  │
│         ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              localStorage (Liked Songs)              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
`}
</pre>

## Decision Log

| Decision | Alternative | Why chosen | Consequence |
|----------|-------------|------------|-------------|
| YouTube IFrame + Data API | Invidious (public instances) | Invidious instances disabled API access | Quota limited to 100 searches/day |
| 10-min cache for YouTube search | No cache, query every time | Stay within 100 search quota | Results slightly stale (acceptable for music) |
| Last.fm only (no Spotify) | Dual-mode (Spotify + Last.fm) | Spotify 403 error, no Premium | Less music sources, but simpler code |
| 8 artists for TopGenres | 30 artists (caused rate limits) | Avoid Last.fm rate limiting | Less accurate genre analysis |
| region=ID for YouTube | Default (global) | Prefer Indonesian music results | May miss global content |
| 500ms progress polling | Real-time events from IFrame | IFrame API doesn't emit progress events | Slight CPU overhead |

## What Broke (The Hard Parts)

**Spotify 403 Error:**

I originally built dual-mode (Spotify + Last.fm). Then Spotify API started returning 403. 

**Root cause:** Spotify requires Premium account for Web Playback SDK. Without it, no playback.

**Solution:** Removed Spotify entirely. YouTube became the only playback source.

**Time wasted:** 2 days (refactoring + removing Spotify code)

**Invidious Attempt:**

To avoid YouTube quota, I tried switching to Invidious (public YouTube proxy). All public instances had API disabled.

**Solution:** Reverted to YouTube Data API with aggressive caching (10 min TTL).

**Time wasted:** 1 day

**TopGenres Rate Limiting:**

Original code called `getArtistInfo()` for 30 artists → 30 API calls → frequently hit rate limit.

**Solution:** Reduced to 8 artists. Added error handling with fallback UI.

**YouTube Search Cache Implementation:**

```typescript
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function searchVideos(query: string) {
  const cached = searchCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  // Fetch from API...
  searchCache.set(query, { data: result, timestamp: Date.now() });
  return result;
}

Results
Working features:

Listening stats (top artists/tracks, recent tracks, now playing)

Period selector (7d, 1m, 3m, 6m, 12m, all time)

Listening heatmap + weekly activity chart

YouTube search with 10-min cache

Play music via YouTube IFrame (hidden player)

Liked songs (localStorage)

Export CSV (top artists/tracks)

12 pages (Home, Discover, Search, Stats, Artist, Album, Library hub + 3 sub-pages, Settings, Login)

Quota usage: ~70-80 searches/day (within 100 limit) for personal use

Rate limits: No longer hit Last.fm limits after optimization

Time breakdown:

Initial build (Spotify + Last.fm): 5 days

Spotify removal + YouTube migration: 2 days

Invidious attempt & revert: 1 day

Optimization (cache, rate limits): 2 days

Total: ~10 days (2 weeks with breaks)

Lessons Learned
Never depend on a single API — Spotify's 403 could have killed the project. Having YouTube as backup saved it.

Caching is not optional with quotas — YouTube's 100 search/day limit forced me to implement caching. Now the app works well within quota.

Public proxies are unreliable — Invidious instances die frequently. Don't build on free community infrastructure.

Reduce API calls aggressively — TopGenres went from 30 → 8 calls. Same user value, less rate limit errors.

Know your platform limits before coding — Spotify Premium requirement was documented. I missed it.

Documentation saves time — These docs helped me remember why I removed Spotify and switched to YouTube.

Future Improvements
PWA support (offline mode)

Real recommendations (based on listening history)

Export all data (JSON, CSV)

Weekly/monthly listening reports

Light mode toggle

The Honest Truth
This project survived two major API crises (Spotify 403, Invidious shutdown) and multiple rate limit issues. It's not perfect — YouTube quota could run out if I search too much, and some pages are still placeholders.

But it works for personal use, and every decision has a documented reason. Sometimes that's what engineering is: working within constraints, not removing them.