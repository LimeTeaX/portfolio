---
title: "Debugging a Memory Leak That Took 3 Days to Find"
date: 2024-01-10
description: "How a closure in an event listener caused a 2GB memory leak and how I finally tracked it down"
tags: ["debugging", "javascript", "performance"]
readingTime: 4
published: true
---

## The Symptom

The Node.js API server would start at 150MB memory. After 3 days of uptime, it would reach 2GB and crash. Restart fixed it temporarily. Rinse and repeat.

No one noticed for 2 weeks because the server auto-restarted on crash.

## The Wrong Suspects

**Day 1:** Checked for database connection leaks. Added connection pooling monitoring. Nothing.

**Day 2:** Suspected the Redis client. Upgraded to latest version. Still leaking.

**Day 3 morning:** Thought it was the logging library. Disabled all logs. Memory still climbing.

## The Real Culprit

On Day 3 afternoon, I used `process.memoryUsage()` and `--inspect` flag with Chrome DevTools.

```bash
node --inspect server.js

Then in Chrome: chrome://inspect → Take heap snapshot.

The snapshot showed 50,000+ event listeners attached to a global EventEmitter. Each listener held a reference to a large object.

Root cause: A request handler was adding event listeners but never removing them.

// WRONG
function handleRequest(userId) {
  analytics.on('userAction', (action) => {
    processAction(userId, action);
  });
}

// CORRECT
function handleRequest(userId) {
  const handler = (action) => processAction(userId, action);
  analytics.on('userAction', handler);
  
  // Clean up when request ends
  req.on('end', () => {
    analytics.off('userAction', handler);
  });
}

The Fix
1.Added maxListeners warning (default is 10, we had 50,000)
2.Created a RequestContext class that auto-cleaned up event listeners
3.Added memory monitoring in production with alert at 500MB

Lessons Learned
Always set require('events').EventEmitter.defaultMaxListeners = 100 in development to catch leaks early

Heap snapshots are your best friend for memory leaks

Don't guess. Profile first.