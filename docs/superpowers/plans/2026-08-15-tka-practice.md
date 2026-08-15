# TKA Practice Tab Implementation Plan

> **For agentic workers:** Execute task-by-task. Spec: `docs/superpowers/specs/2026-08-15-tka-practice-design.md`.

**Goal:** Ship a TKA tab in Pilar Compass with Grade 12 Matematika playable, Coming soon for other tracks/subjects, Duolingo lessons, tryout, verified-email streaks, and monthly leaderboards.

**Architecture:** Client lesson player + Next.js Route Handlers. Persist with a `TkaStore` (JSON file locally; Postgres when `DATABASE_URL` is set). OTP cookie session keyed by email. Content in git JSON.

**Tech Stack:** Next.js 16 App Router, React 19, Vitest, existing EN/ID dictionaries, SPI navy/yellow CSS.

## Global Constraints

- Only `grade 12 / matematika` is `playable: true`.
- Questions in Indonesian; UI EN/ID.
- Streak timezone `Asia/Jakarta`.
- Do not invent PDF keys; skip incomplete OCR items; add original latihan items for a usable 6-question set.
- No school-email domain lock.
- Follow existing AppShell / dictionary / CSS patterns.

---

### Task 1: Core engine (tests first)

**Files:**
- Create: `src/lib/tka/wib.ts`
- Create: `src/lib/tka/streak.ts`
- Create: `src/lib/tka/lessonEngine.ts`
- Create: `src/lib/tka/grade.ts`
- Create: `src/lib/tka/scoring.ts`
- Create: `src/lib/tka/wib.test.ts`, `streak.test.ts`, `lessonEngine.test.ts`, `grade.test.ts`, `scoring.test.ts`

Cover: WIB date, streak increment/reset, redemption not immediately next, XP rules, age→track, PG/PGK scoring, monthly leaderboard score.

### Task 2: Catalog + questions + tryout pack

**Files:** `src/data/tka/catalog.ts`, `skills.ts`, `questions.json`, `tryouts.ts`

### Task 3: Store + session + API routes

JSON file store + optional Postgres. OTP + signed cookie. Routes under `src/app/api/tka/`.

### Task 4: UI pages + CSS + i18n + nav

`/tka` hub, onboarding, grade catalog, matematika skills, lesson player, tryout, leaderboard. Coming soon states.

### Task 5: Verify locally, then deploy Vercel
