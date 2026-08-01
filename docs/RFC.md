# RFC — Pilar Compass

| Field | Value |
|-------|--------|
| **Status** | Accepted · Implemented (workshop MVP) |
| **Date** | 2026-08-01 |
| **PRD** | [docs/PRD.md](./PRD.md) |
| **Product** | Pilar Compass — Sekolah Pilar Indonesia |
| **Live** | https://pilar-compass.vercel.app |
| **Repo** | https://github.com/JustHackr/pilar-compass |
| **Author** | SPI builder + Cursor agents |

---

## 1. Summary

Pilar Compass is a **client-heavy Next.js 16** web app that helps Sekolah Pilar Indonesia (SPI) students (1) find **first-entry competitions still open to register**, and (2) compute a **transparent university match %** from Kurikulum Merdeka scores with a short roadmap.

**Architectural stance:** no backend database, no live scrape, no OAuth. Session unlock, curated JSON, pure TypeScript scoring, browser OCR, and EN/ID locale all run in the client. Host on **Vercel** (Next.js-native).

This RFC maps every Must PRD story to a concrete module, records tradeoffs, and documents the as-built design judges can verify against the repo and live URL.

---

## 2. Goals of this RFC

1. Turn the locked PRD into an implementable system with clear module boundaries.
2. Lock stack, data shapes, scoring math, and deploy path so agents/humans build the same product.
3. Make honesty explicit: curated data, heuristic match %, soft email gate.
4. Capture post-grill expansions that shipped in-window: **OCR**, **EN/ID**, **onboarding tour**, **announcement-link competitions**.

---

## 3. System architecture

```mermaid
flowchart TB
  subgraph access [Access layer]
    Gate[EmailGate]
    Tour[OnboardingTour]
    Locale[LocaleProvider EN/ID]
    Session[localStorage session]
  end

  subgraph shell [App shell]
    Nav[AppShell nav + locale toggle]
    Home[Landing /]
    CompPage[/competitions]
    CalcPage[/calculator]
  end

  subgraph comps [Competitions domain]
    CJSON[data/competitions.json]
    CLib[lib/competitions.ts]
    Links[lib/links.ts]
    CView[CompetitionsView]
  end

  subgraph calc [Calculator domain]
    Form[CalculatorView form]
    OCR[Tesseract.js + parseReport]
    Score[lib/scoring.ts]
    Road[lib/roadmap.ts]
    UJSON[data/universities.json]
  end

  Gate --> Session
  Session --> Tour
  Locale --> Nav
  Nav --> Home
  Nav --> CompPage
  Nav --> CalcPage
  CJSON --> CLib --> CView
  Links --> CView
  CompPage --> CView
  CalcPage --> Form
  Form --> OCR
  Form --> Score --> Road
  UJSON --> Form
  Locale --> Road
```

### Module boundaries

| Module | Responsibility | Does not own |
|--------|----------------|--------------|
| `EmailGate` + `session.ts` | Soft unlock, persist email | Auth provider, server sessions |
| `LocaleProvider` + dictionaries | EN/ID strings, roadmap locale | Competition proper nouns |
| `competitions.ts` + JSON | Open/deadline logic, filter/sort | Scraping, CMS |
| `links.ts` | Normalize `url` + `links[]` for UI buttons | Social API calls |
| `scoring.ts` | Pure match math + weights | UI layout |
| `roadmap.ts` | Deterministic next steps from gaps | LLM generation |
| `ocr/parseReport.ts` + `runOcr.ts` | Photo → subject rows + confidence gate | Cloud Vision |
| `OnboardingTour` | First-visit context for demo/judges | Product analytics |

---

## 4. PRD → implementation map

| PRD | Implementation | Status |
|-----|----------------|--------|
| US-A1, A2 | `EmailGate` + `localStorage` keys `pilar_compass_email` / `unlockedAt`; any email with `@` + `.` | Shipped |
| US-A3 | Documented; future SPI domain check | Doc |
| US-C1–C5 | `/competitions`, curated JSON, filters, open-only default, Refresh = `new Date()` | Shipped |
| US-U1–U8 | `/calculator`, subjects 0–100, uni/country/region, tests, affordability, age, % + breakdown + roadmap + disclaimer | Shipped |
| US-X1 | Browser Tesseract (`ind`+`eng`) → confidence check → replace subjects or keep manual | Shipped (promoted from stretch) |
| Soft SPI positioning | Gate copy + demo email + first-visit tour | Shipped |
| Bilingual (later in original PRD) | Full UI EN/ID toggle, persisted | Shipped |

---

## 5. Stack (locked · as built)

| Layer | Choice | Version | Why this choice |
|-------|--------|---------|-----------------|
| Framework | Next.js App Router | **16.2.x** | File routes map 1:1 to modules; excellent Vercel DX |
| UI runtime | React | **19.x** | Client components for gate, OCR, locale |
| Language | TypeScript | **5.x** | Safer scoring types; better judge “code” score |
| Styling | Tailwind 4 + custom CSS tokens | **4.x** | Speed + SPI navy `#002147` / yellow `#fdc800` brand |
| Font | Roboto via `next/font` | — | Matches SPI website chrome |
| Data | Static JSON | app-local | Zero DB; deploy with no secrets |
| Scoring | Pure TS (`scoring.ts`, `roadmap.ts`) | — | Unit-testable; transparent weights |
| OCR | `tesseract.js` **5.x** in browser | — | No API key; photo never leaves device |
| i18n | Lightweight dictionaries + context | — | No next-intl weight for workshop MVP |
| Tests | Vitest | **4.x** | Fast pure-function tests for scoring + OCR parse |
| Hosting | **Vercel** | — | Native Next; production URL `pilar-compass.vercel.app` |
| Package manager | npm | — | Default, reproducible lockfile |

### Rejected alternatives (tradeoffs)

| Option | Rejected because | Cost if chosen |
|--------|------------------|----------------|
| Railway / custom API | Overkill for JSON + client math | Extra deploy surface, secrets, time |
| Live scrape / search APIs | Unreliable in a 3h window; PRD non-goal | Flaky demos, ToS risk |
| Auth.js / OAuth | Soft gate sufficient for SPI framing | Login friction for judges |
| Cloud Vision OCR | Needs keys + cost; hybrid browser path chosen | Blocked offline demos |
| next-intl / i18next | Heavy for ~200 UI strings | Bundle + config time |
| Netlify (original plan) | Switched to Vercel for Next 16 path already used by builder | N/A — `netlify.toml` kept as optional fallback |
| Real admissions datasets | No licensed data | Dishonest “AI predictor” vibe |

---

## 6. Information architecture & UX

### Routes

| Route | Purpose | Gate |
|-------|---------|------|
| `/` | Brand landing — SPI + Pilar Compass, two CTAs | Yes |
| `/competitions` | Finder with filters + announcement links | Yes |
| `/calculator` | Match form, OCR upload, results | Yes |

### Soft gate

1. If no stored email → full-screen gate (email + Unlock + demo email).
2. Validate: trim, contains `@` and `.`, length ≥ 5, no spaces.
3. Persist email; render `AppShell`.
4. Copy positions product for SPI; prototype accepts any email (judges/demo).
5. EN/ID toggle available **on the gate** so first-time visitors can switch before unlock.

### First-visit onboarding

- 3-step modal after unlock (`pilar_compass_tour_seen`).
- Explains product, competitions, calculator (+ EN/ID).
- Replay via footer **Show intro** for judges who skipped.

### Visual direction (as built)

- Brand tokens from SPI site: navy `#002147`, yellow `#fdc800`, white.
- Topbar + logo lockup + uppercase nav (school-site feel).
- Motion: rise animations, list stagger, urgency pills — intentional, not noisy.
- Competition cards use action buttons (★ announcement, → register, IG/FB) — not a dead text list.

---

## 7. Data shapes

### Competition (curated)

```ts
type CompetitionLinkKind =
  | "website" | "register" | "post"
  | "instagram" | "facebook" | "youtube" | "info";

type Competition = {
  id: string;
  name: string;
  scope: "indonesia" | "international";
  field:
    | "stem" | "humanities" | "business"
    | "arts" | "language" | "multidisciplinary";
  level: "junior" | "senior" | "both";
  registrationDeadline: string; // YYYY-MM-DD
  eventStart?: string;
  description: string;
  url?: string;                 // fallback website
  links?: CompetitionLink[];    // preferred: exact posts + register
  tags?: string[];
};
```

**Open logic:** `registrationDeadline >= todayISO` (local date, no timezone scrape).  
**Refresh:** recompute with `new Date()` — no network.  
**Default sort:** ascending deadline among open items.  
**Curation policy (as shipped):**

- First-entry only (exclude OSN→OSP, IMO, IOI-style prerequisite pathways).
- Prefer **announcement post URLs** over bare social profiles.
- Drop past deadlines relative to workshop day (2026-08-01).

### Calculator

```ts
type Affordability =
  | "can_afford" | "middle_class"
  | "need_scholarship" | "low_budget";

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

type ScoreResult = {
  averageScore: number;
  matchPercent: number; // clamped 0–100
  breakdown: ScoreBreakdown;
  weights: Record<keyof ScoreBreakdown, number>;
  roadmap: string[]; // 3–6 locale-aware steps
};
```

Universities: curated datalist (`universities.json`) + free text.

---

## 8. Scoring heuristic (transparent)

**Disclaimer (always on result):** planning heuristic for SPI students — **not** an official admissions decision.

### Weights

| Factor | Weight | Signal |
|--------|--------|--------|
| Academics | **0.45** | Mean of subject scores 0–100 |
| Standardized tests | **0.20** | Normalized TOEFL/SAT/IELTS average; if none → neutral **55** |
| Finance fit | **0.15** | Affordability base; abroad + tight budget lowers score |
| Timeline | **0.10** | Age vs application window (15–18 sweet spot) |
| Extras | **0.10** | Awards count (capped) + intended-major bonus |

```
matchPercent = round(clamp(0, 100, Σ weight_i × factorScore_i))
```

### Roadmap (deterministic)

Built in `roadmap.ts` from the same input + locale:

| Condition | Action |
|-----------|--------|
| Average &lt; 80 | Raise weakest subjects |
| Abroad + no English test | Book IELTS/TOEFL in 8–12 weeks |
| Need scholarship / low budget | Scholarship + competition evidence |
| Age ≤ 15 | Multi-year competition ladder |
| Age ≥ 17 | Near-term application checklist |
| Major filled | Align competitions/reading to major × university |
| Match &lt; 55 | Add parallel Indonesia university option |

Cap at 6 steps. Switching EN/ID re-renders roadmap copy for the same inputs.

---

## 9. OCR design (hybrid, no cloud)

| Step | Behavior |
|------|----------|
| Input | JPG / PNG / WEBP; preview via object URL |
| Engine | Tesseract.js worker, languages `ind` + `eng` |
| Parse | Line patterns → `{ name, score }`; skip headers/totals |
| Confidence | Mean word confidence; success if ≥2 subjects and confidence gate passes |
| Success | **Replace** subject list (still editable) |
| Failure | **Do not** replace; prompt manual entry |
| Privacy | File processed in-browser only; never uploaded to our servers |

This satisfies US-X1 without API keys — critical for workshop demos on shared Wi‑Fi.

---

## 10. Internationalization

| Decision | Detail |
|----------|--------|
| Approach | Flat `en` / `id` dictionaries + `translate(locale, key, vars)` |
| Persistence | `localStorage` key `pilar-locale` |
| Coverage | Gate, shell, home, competitions chrome, calculator, OCR status, roadmap, tour |
| Untranslated | Competition titles, university names, external link labels (proper nouns / URLs) |
| Descriptions | Competition blurbs keyed as `comp.{id}` in both locales |

---

## 11. Competitions module behavior

1. Load `data/competitions.json` at build/import time.
2. Controls: search, field, scope, open-only (default **on**), Refresh.
3. Each card: deadline urgency pill, meta, localized description, link buttons via `getCompetitionLinks`.
4. Empty state with Reset filters.
5. Stat pills: open count + due-in-7-days count.

---

## 12. Security & privacy

| Topic | Decision |
|-------|----------|
| Auth | Soft gate only — not a security boundary |
| Secrets | None required for MVP runtime |
| PII | Email stored in `localStorage` on device only |
| OCR images | Stay on device; no upload endpoint |
| XSS | React escaping; no `dangerouslySetInnerHTML` for user scores |
| External links | `rel="noopener noreferrer"` on competition URLs |

---

## 13. Deploy

| Item | Value |
|------|--------|
| Host | Vercel project `pilar-compass` |
| Production URL | https://pilar-compass.vercel.app |
| Build | `npm run build` (Next default) |
| Env secrets | None for core MVP |
| GitHub | https://github.com/JustHackr/pilar-compass |
| Verify path | Gate → tour → competitions → calculator → OCR optional → match % |

**Fallback:** static `output: 'export'` remains viable if edge runtime ever blocks; not required today.

---

## 14. Testing strategy

| Layer | What | Tool |
|-------|------|------|
| Unit | `averageScores`, clamp, finance abroad penalty, match bounds | Vitest → `scoring.test.ts` |
| Unit | OCR line parse (ID/EN), header rejection, confidence gate | Vitest → `parseReport.test.ts` |
| Typecheck | `next build` / tsc | CI-equivalent local |
| Manual | PRD checklist + mobile layout + EN/ID flip + tour replay | Browser |

---

## 15. Repo layout (as built)

```
pilar-compass/
  docs/PRD.md
  docs/RFC.md
  llms.txt
  data/competitions.json
  data/universities.json
  src/app/{page,layout,globals.css,competitions,calculator}/
  src/components/
    EmailGate.tsx
    AppShell.tsx
    OnboardingTour.tsx
    CompetitionsView.tsx
    CalculatorView.tsx
    ClientApp.tsx
  src/lib/
    session.ts
    tour.ts
    competitions.ts
    links.ts
    scoring.ts
    roadmap.ts
    i18n/{dictionaries.ts,LocaleContext.tsx,LocaleToggle.tsx}
    ocr/{parseReport.ts,runOcr.ts}
  src/types/index.ts
```

---

## 16. Phased delivery (what we actually ran)

| Phase | Deliverable | Verify |
|-------|-------------|--------|
| P0 | Scaffold, SPI tokens, email gate, landing | Unlock persists; brand visible |
| P1 | Competitions JSON + filters + announcement links | Open-only sort + Refresh |
| P2 | Calculator + scoring + roadmap + disclaimer | Vitest green; % + breakdown |
| P3 | OCR + EN/ID + onboarding tour | Hybrid OCR + locale flip |
| P4 | Vercel prod + GitHub `JustHackr/pilar-compass` | Public URL |

Equal module priority was honored by shipping thin P1 and P2 before OCR/i18n polish.

---

## 17. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Two modules overrun clock | Thin verticals first; OCR after core calculator |
| Match % looks like fake admissions AI | Visible weights + strong disclaimer |
| Curated list distrust | Exact announcement posts; first-entry policy; open deadlines only |
| OCR misreads rapor | Confidence gate; never overwrite on fail; manual edit always wins |
| Soft gate with any email | Prototype honesty in copy + demo path for judges |
| Locale drift | Single dictionary source; roadmap regenerated on locale change |

---

## 18. Open items (non-blocking follow-ups)

- Restrict unlock to SPI school email format.
- Optional cloud OCR fallback behind a feature flag (not needed for MVP).
- Teacher-facing competition admin.
- Deeper competition dataset growth beyond workshop seed.

---

## 19. Decision record

**We build Pilar Compass as a Vercel-hosted Next.js 16 + TypeScript + Tailwind client app:** curated first-entry competition data with announcement links, a transparent weighted university match calculator, browser OCR with confidence gating, EN/ID locale, and a soft any-email gate for SPI positioning — matching the locked PRD without a backend, live scrape, or real auth.
