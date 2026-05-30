---
title: "Why I Stopped Using Redux (And What I Use Instead)"
date: 2024-01-05
description: "After 4 years of Redux, I switched to Zustand + React Query. Here's why."
tags: ["react", "state-management", "frontend"]
readingTime: 3
published: true
---

## The Problem

Redux worked great for global state. But as the app grew, the boilerplate became a maintenance burden.

For a medium-sized app (50+ screens, 100+ API endpoints), we had:

- 30+ action types
- 20+ reducers
- 15+ sagas for side effects
- 8,000+ lines of Redux code

Every new feature required touching 5-6 files.

## What I Tried

**Redux Toolkit** helped. But it didn't solve the mental overhead. Developers still needed to understand actions, reducers, selectors, and thunks.

**Context API** was too slow for frequently updating state.

## The New Stack

**React Query for server state:**
- Caching, background refetching, pagination built-in
- No manual loading/error states

**Zustand for client state:**
- 2 lines to create a store
- No providers
- Works outside React components

```typescript
// Zustand store
const useAppStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

// In component
const { theme, toggleTheme } = useAppStore();

The Result
-4,200 
-New features take 1-2 files instead of 5-6
-Developers learn Zustand in 10 minutes

Same performance as Redux

When I'd Still Use Redux
-Very large apps (100+ devs, 500+ screens)
-Complex undo/redo requirements
-Team already deeply familiar with Redux patterns

For 95% of apps, Zustand + React Query is simpler.