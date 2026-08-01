# RFC — Pilar Compass

**Status:** Accepted for workshop MVP  
**Date:** 2026-08-01  
**PRD:** [docs/PRD.md](./PRD.md)  
**Product:** Pilar Compass for Sekolah Pilar Indonesia  
**Author:** SPI builder + Cursor agents

---

## 1. Summary

Build a client-heavy Next.js web app with (1) a soft email gate, (2) a curated competition finder, and (3) a transparent university match calculator. Deploy to Netlify within the workshop window. No backend database; no live scraping; OCR deferred to stretch.

---

## 2. Solution design (PRD → system)

```mermaid
flowchart TB
  subgraph access [Access]
    Gate[EmailGate]
    Session[localStorage session]
  end
  subgraph pages [App Router pages]
    Home[Landing]
    Comp[/competitions]
    Calc[/calculator]
  end
  subgraph data [Static / client logic]
    JSON[competitions.json]
    Filter[filterSortByDeadline]
    Scores[scoreEngine]
    Roadmap[roadmapBuilder]
  end
  Gate --> Session --> Home
  Home --> Comp
  Home --> Calc
  JSON --> Filter --> Comp
  Calc --> Scores --> Roadmap
```

| PRD stories | Implementation |
|-------------|----------------|
| US-A1, A2 | `/` wrapped by `EmailGate`; any email with `@` unlocks; persist `pilar_compass_email` in `localStorage` |
| US-A3 | Documented in PRD/RFC only for MVP |
| US-C1–C5 | `/competitions` + `data/competitions.json` + client filter/sort/refresh |
| US-U1–U8 | `/calculator` form + pure functions in `lib/scoring.ts` + `lib/roadmap.ts` |
| US-X1 | Stretch: optional later `lib/ocr.ts` + Tesseract.js — **not in critical path** |

---

## 3. Stack (locked versions)

| Layer | Choice | Version target | Why |
|-------|--------|----------------|-----|
| Framework | Next.js App Router | **15.x** (create-next-app latest stable) | Fast UI, easy Netlify, file routes map cleanly to modules |
| Language | TypeScript | **5.x** (bundled with Next) | Safer scoring math + data types for judges/code score |
| Styling | Tailwind CSS | **4.x** or **3.x** (whatever `create-next-app` scaffolds) | Speed; custom tokens for non-generic SPI look |
| Fonts | `next/font` (e.g. Fraunces + DM Sans) | via Google fonts in Next | Expressive brand without extra assets |
| Data | Static JSON | app-local | No DB; Netlify-friendly |
| Scoring | Pure TS modules | — | Unit-testable; transparent weights |
| OCR | Tesseract.js | stretch only | Explicitly out of must-ship |
| Hosting | Netlify | Next runtime or static export | Workshop constraint; simpler than Railway for this MVP |
| Package manager | npm | — | Default, fewest surprises on Netlify |

### Rejected alternatives

| Option | Rejected because |
|--------|------------------|
| Railway + custom API | Needless backend for curated JSON + client math |
| Live scrape / search APIs | Unreliable in 3h; PRD non-goal |
| Auth.js / OAuth | Soft gate is enough; PRD non-goal |
| Real admissions datasets | No licensed data; honesty via heuristic + disclaimer |

---

## 4. Information architecture & UI

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Brand landing (SPI + Pilar Compass), two CTAs; behind gate |
| `/competitions` | Finder |
| `/calculator` | Match calculator |

### Soft gate

1. If no `localStorage.pilar_compass_email`, show full-screen gate (email + Unlock).
2. Validate: non-empty, contains `@`, basic format.
3. On success, save email + `unlockedAt`, render app shell.
4. Copy: “For Sekolah Pilar Indonesia students” + note that school email restriction comes later.

### Visual direction (brief)

- Brand-first landing: **Pilar Compass** as hero signal; SPI as school context.
- Avoid generic purple/cream AI defaults; prefer deep teal + warm sand + sharp ink (SPI-adjacent, international-school calm).
- Atmosphere: subtle grain/gradient, not flat white.
- Motion: gate fade, list stagger, match % count-up (2–3 intentional motions).
- No card soup in hero; cards only where interaction needs grouping (competition row / form sections OK).

---

## 5. Data shapes

### Competition

```ts
type CompetitionScope = "indonesia" | "international";
type CompetitionField =
  | "stem"
  | "humanities"
  | "business"
  | "arts"
  | "language"
  | "multidisciplinary";

type Competition = {
  id: string;
  name: string;
  scope: CompetitionScope;
  field: CompetitionField;
  level: "junior" | "senior" | "both"; // maps to JH / SH
  registrationDeadline: string; // ISO date YYYY-MM-DD
  eventStart?: string;
  description: string;
  url?: string;
  tags?: string[];
};
```

**Open logic:** `registrationDeadline >= today` (date-only, local).  
**Refresh:** re-run filter/sort with `new Date()` (no fetch).  
**Default sort:** ascending deadline among open items.

### Calculator input / result

```ts
type Affordability =
  | "can_afford"
  | "middle_class"
  | "need_scholarship"
  | "low_budget";

type SubjectScore = { name: string; score: number }; // 0–100

type CalculatorInput = {
  subjects: SubjectScore[];
  university: string;
  country: string;
  region: "indonesia" | "abroad";
  toefl?: number;
  sat?: number;
  ielts?: number;
  affordability: Affordability;
  age: number;
  intendedMajor?: string;
  competitionAwards?: number;
};

type ScoreBreakdown = {
  academics: number;    // 0–100 contribution weight applied later
  tests: number;
  financeFit: number;
  timeline: number;
  extras: number;
};

type ScoreResult = {
  averageScore: number;
  matchPercent: number; // 0–100 clamped
  breakdown: ScoreBreakdown;
  weights: Record<keyof ScoreBreakdown, number>;
  roadmap: string[]; // 3–6 steps
};
```

### Seed universities (curated suggestions + free text)

Include SPI-familiar Indo options (e.g. UI, ITB, UGM, UPH, Unpad) and abroad examples (e.g. ANU, Melbourne, NUS) as datalist suggestions — user can always type any university.

---

## 6. Scoring heuristic (transparent, not official)

**Disclaimer (always shown):** illustrative planning tool for SPI students — not an admissions decision.

### Weights (MVP)

| Factor | Weight | Signal |
|--------|--------|--------|
| Academics | 0.45 | Average of subject scores 0–100 |
| Standardized tests | 0.20 | Best available of TOEFL/SAT/IELTS normalized; if none, neutral 55 |
| Finance fit | 0.15 | Mapping from affordability × region (abroad + low_budget lowers fit) |
| Timeline | 0.10 | Age vs typical application window (15–18 sweet spot) |
| Extras | 0.10 | Competition awards count (capped) + major filled bonus |

`matchPercent = clamp(0, 100, Σ weight_i * factorScore_i)`

### Roadmap rules (deterministic)

Generate 3–6 bullets from gaps, e.g.:

- Average &lt; 80 → raise specific weak subjects / study plan  
- Abroad + missing English test → recommend IELTS/TOEFL timeline  
- `need_scholarship` / `low_budget` → scholarship portals + competition medals  
- Age ≤ 15 → multi-year competition ladder  
- Age ≥ 17 → near-term application checklist  
- Always include 1 competition suggestion tied to intended major / field when possible  

---

## 7. Competitions module behavior

1. Load static JSON at build/runtime.
2. Controls: search, field, scope (Indo/International/All), open-only (default on), Refresh.
3. Compute `isOpen` from deadline vs today.
4. Sort open by nearest deadline; closed section optional (collapsed or filtered out when open-only).
5. Honest banner: “Curated list for SPI workshop demo — not a live feed.”

Target seed size: **25–40** entries, mix of Indo olympiads/science fairs and international contests SPI students could plausibly enter.

---

## 8. Deploy (Netlify)

1. GitHub repo for `student-compass`.
2. Netlify site connected to repo; build `npm run build`, publish Next output (Netlify Next plugin or `@netlify/plugin-nextjs`).
3. No required env secrets for MVP (email gate is client-only).
4. Verify: public URL loads gate → competitions → calculator.

**Fallback:** if Next runtime hiccups, switch to `output: 'export'` static hosting on Netlify — RFC allows this fallback without changing PRD stories.

---

## 9. Phased timeline (ship slices)

| Phase | Deliverable | PRD coverage | Verify |
|-------|-------------|--------------|--------|
| P0 | Next scaffold, design tokens, email gate, landing | US-A1, A2 | Gate unlock persists; brand visible |
| P1 | `competitions.json` + `/competitions` UI | US-C1–C5 | Filters + sort + refresh work |
| P2 | `/calculator` + scoring + roadmap + disclaimer | US-U1–U8 | Unit tests for average + match clamp; UI result |
| P3 | Polish, `llms.txt`, screenshots | Submit pack | Mobile layout OK |
| P4 | Netlify deploy + GitHub | Deploy stories | Public URL |
| P5 | OCR (stretch) | US-X1 | Only if P0–P4 green |

Equal module priority ⇒ finish **thin P1 and thin P2** before deep polish on either.

---

## 10. Testing & review

| Check | How |
|-------|-----|
| Scoring math | Vitest or Node test on `lib/scoring.ts` (average, weights, clamp) |
| Lint / types | `npm run lint`, `tsc --noEmit` |
| Stories | Manual browser pass against PRD checklist |
| Review | AI pass: KISS, DRY, no secrets, PRD alignment; then human taste pass |

---

## 11. Repo layout (target)

```
student-compass/
  docs/PRD.md
  docs/RFC.md
  llms.txt
  data/competitions.json
  data/universities.json
  src/app/layout.tsx
  src/app/page.tsx
  src/app/competitions/page.tsx
  src/app/calculator/page.tsx
  src/components/EmailGate.tsx
  src/components/...
  src/lib/scoring.ts
  src/lib/roadmap.ts
  src/lib/competitions.ts
  .cursor/skills/   # already installed
```

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Two equal modules overrun | Thin verticals first; OCR already stretch |
| Heuristic distrust | Breakdown + disclaimer + honest copy |
| Netlify/Next config time sink | Prefer default Netlify Next path; static export fallback |
| Soft gate with any email | Prototype honesty in PRD; SPI domain later |

---

## 13. Open items (none blocking)

- Exact Netlify adapter resolved at deploy time (runtime vs static export).
- Final teal/sand token values chosen during scaffold.
- OCR libraries not installed unless P5 starts.

---

## 14. Decision record

**We will build Pilar Compass as a Netlify-hosted Next.js + TypeScript + Tailwind client app with curated competition data and a transparent weighted match calculator, gated by any-email unlock for SPI positioning — matching the locked PRD without live data or real auth.**
