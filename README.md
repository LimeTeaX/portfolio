# Portfolio Website

> A personal engineering portfolio built with Astro, focused on case studies and technical writing.

## 🎯 Overview

This is my personal portfolio website showcasing my engineering projects, case studies, and technical notes. Built from scratch with a focus on:

- **Content-first design** - No generic template sections
- **Engineering thinking** - Every decision documented with tradeoffs
- **Accessibility** - WCAG compliant, keyboard navigable
- **Performance** - Static site, minimal JavaScript

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Astro](https://astro.build) v6 | Static site generator |
| TypeScript | Type safety |
| CSS (Custom) | Styling with design tokens |
| MDX | Content with React components |
| Lucide React | Icons |

## 📁 Project Structure

```bash
src/
├── components/                 # Reusable Astro components
│   ├── icons/                  # Lucide icon wrappers
│   │   ├── NoteIcon.astro
│   │   ├── WarningIcon.astro
│   │   └── InsightIcon.astro
│   ├── MarginNote.astro        # Sidebar note component
│   ├── DecisionTable.astro     # Tradeoff table
│   └── CaseStudyLayout.astro   # Case study wrapper
│
├── content/                    # Content collections
│   ├── case-studies/           # MDX files
│   │   ├── 01-rate-limiting-system.md
│   │   └── 02-ai-pair-programming-portfolio.mdx
│   └── notes/                  # MDX files
│       ├── 01-debugging-memory-leak.md
│       ├── 02-why-i-stopped-using-redux.md
│       └── 03-postgres-index-mistake.md
│
├── layouts/
│   └── BaseLayout.astro
│
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── case-studies/
│   │   ├── index.astro
│   │   └── [...slug].astro
│   └── notes/
│       ├── index.astro
│       └── [...slug].astro
│
├── styles/
│   ├── global.css
│   ├── grid.css
│   ├── themes.css
│   ├── navigation.css
│   ├── footer.css
│   ├── home.css
│   └── about.css
│
├── content.config.ts
└── env.d.ts


## Key Features

- **MarginNote** - Sidebar notes for case studies (3 types: note, warning, insight)
- **DecisionTable** - Table format for documenting technical tradeoffs
- **Asymmetrical grid** - 12-column system with offset layouts
- **Dark mode** - Bold theme with cyan accent
- **Content collections** - Zod-validated MDX files

## Getting Started

```bash
npm install
npm run dev

License
MIT