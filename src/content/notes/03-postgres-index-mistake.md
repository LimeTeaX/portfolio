---
title: "A Single Index Cost Us $500 in Database Bills"
date: 2023-12-20
description: "How a missing index turned 10ms queries into 30-second scans"
tags: ["database", "postgres", "performance"]
readingTime: 3
published: true
---

## The Problem

The users table had 5 million rows. A simple query was taking 30+ seconds:

```sql
SELECT * FROM users WHERE last_login > NOW() - INTERVAL '7 days';

This query ran every hour as part of a newsletter job.

Why Was It Slow?
last_login had no index. The database was doing a full table scan every time.

When the table had 100k rows, scans were fine. At 5 million rows, it was reading 5 million rows each time.

The Fix
One line of SQL:
CREATE INDEX idx_users_last_login ON users(last_login);

Query time dropped from 30 seconds to 15 milliseconds. 2,000x faster.

The Cost
RDS instances were scaled to handle the CPU load. The missing index forced:

Larger instance size (r5.xlarge instead of r5.large)

$250/month extra for 2 months before discovery

Total wasted: $500

Lessons
Monitor slow queries - This query was in the logs for 2 months before anyone noticed

Set up alerting - Alert when a query exceeds 1 second

Index columns used in WHERE clauses - Seems obvious, but easy to forget

What I Use Now
-pg_stat_statements to track slow queries
-Alert on execution time > 500ms
-Monthly index review for tables > 1 million rows