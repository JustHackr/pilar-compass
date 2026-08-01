# PRD — Pilar Compass

**Product:** Pilar Compass  
**School:** Sekolah Pilar Indonesia ([sekolah-pilar-indonesia.sch.id](https://sekolah-pilar-indonesia.sch.id/))  
**Workshop:** Cursor Jakarta × Hacktiv8 — From PRD to Deployment  
**Status:** Locked after grill-me session (2026-08-01)  
**Owner:** SPI student builder (solo + Cursor agents)

---

## Problem (one sentence)

Sekolah Pilar Indonesia Junior and Senior High students miss open academic competition deadlines and lack a clear, honest path from Kurikulum Merdeka scores to a target university plan.

---

## Goals

1. Help SPI students (Grades 7–12) discover **Indonesian and international** academic competitions that are still open to register, sorted by nearest deadline.
2. Help SPI Senior High students (Grades 10–12, ambitious 9 OK) estimate a **transparent match %** for a chosen university and leave with a short **roadmap**.
3. Ship a **deployed MVP today** (Netlify) with PRD, RFC, `llms.txt`, and screenshots for workshop judging.

## Success metrics (workshop day)

- Both modules usable end-to-end in a 3-minute demo.
- Judges can read a tight PRD/RFC without clicking the app.
- Soft gate collects an email before use; prototype accepts any email.

---

## Personas

| Persona | Who | Needs |
|---------|-----|--------|
| **Primary — SPI Senior High (10–12)** | Preparing for uni + competitions | Match %, roadmap, competitions by field |
| **Secondary — SPI Junior High (7–9)** | Building portfolio early | Competition finder (calculator optional / ambitious) |
| **Non-user for MVP** | Primary, ECC, parents-as-accounts, public internet at large | Out of scope as target users |

**Audience rule:** Product is **for SPI school members only** (positioning + soft gate). Features stay **broad** (Indo + international competitions and universities).

---

## User stories

### Access

| ID | Story | Priority |
|----|--------|----------|
| US-A1 | As an SPI student, I want to enter my email to unlock the app, so that access is framed for school members. | Must |
| US-A2 | As a builder, I want the prototype to accept **any email** for now, so that demos are not blocked by domain checks. | Must |
| US-A3 | As a future maintainer, I want the PRD to note that SPI school email format will be enforced later. | Doc |

### Competition finder

| ID | Story | Priority |
|----|--------|----------|
| US-C1 | As an SPI Grades 7–12 student, I want to browse curated Indonesian and international academic competitions, so that I can find opportunities beyond word-of-mouth. | Must |
| US-C2 | As a student, I want to filter by field of study and Indo vs International, so that I see relevant options quickly. | Must |
| US-C3 | As a student, I want to see competitions that are still open to register, sorted by nearest deadline, so that I act before windows close. | Must |
| US-C4 | As a student, I want a Refresh action that re-checks openness against today’s date, so that the list stays current during the session. | Must |
| US-C5 | As a student, I want a short description and link (when available), so that I can open the official page. | Must |

### Acceptance calculator

| ID | Story | Priority |
|----|--------|----------|
| US-U1 | As an SPI Senior High student, I want to enter subject scores (0–100, Kurikulum Merdeka style) and see my average, so that my academic baseline is clear. | Must |
| US-U2 | As a student, I want to pick or type a target university and country (Indonesia or abroad), so that advice is goal-specific. | Must |
| US-U3 | As a student, I want optional TOEFL / SAT / IELTS fields, so that international readiness can adjust the match. | Must |
| US-U4 | As a student, I want to choose affordability (can afford / middle class / need scholarship / low budget), so that finance reality shapes the plan. | Must |
| US-U5 | As a student, I want to enter my age (and light extras such as intended major / competition awards count), so that the roadmap fits my timeline. | Must |
| US-U6 | As a student, I want a match **percentage** with a short **score breakdown**, so that I understand why I got that number. | Must |
| US-U7 | As a student, I want a short future roadmap (what to study / do next), so that I know concrete next steps. | Must |
| US-U8 | As a student, I want a clear disclaimer that this is not an official admissions prediction. | Must |

### Stretch

| ID | Story | Priority |
|----|--------|----------|
| US-X1 | As a student, I want to upload a photo of my score sheet so OCR pre-fills scores I can edit. | Stretch |

---

## Non-goals

- Live scraping or real-time search of competition websites
- Official university acceptance rates or admissions API integration
- Full authentication (passwords, OAuth, accounts, roles)
- Enforcing SPI email domain in this prototype (documented as follow-up)
- Guaranteed OCR accuracy
- Parent/teacher dashboards, payments, notifications, chat
- Primary / ECC features
- Full bilingual EN+ID UI (MVP: English; Indonesian subject labels OK where natural)

---

## Acceptance criteria

### Soft gate
- [ ] First visit shows an email gate before main app content.
- [ ] Any non-empty email unlocks the session (persisted for the browser session or `localStorage`).
- [ ] UI copy states the product is for Sekolah Pilar Indonesia students.
- [ ] PRD/RFC note future SPI email-format restriction.

### Competitions
- [ ] Curated dataset (~20–40) includes Indonesian and international entries with field, deadline, open flag, scope (Indo/International), description, optional URL.
- [ ] Default view: open registrations only, sorted by nearest upcoming deadline.
- [ ] Filters: search text, field, Indo/International, open-only toggle.
- [ ] Refresh recomputes openness / sort from current date (no network scrape).
- [ ] UI labels data as curated for SPI / workshop (honest).

### Calculator
- [ ] User can add multiple subject scores 0–100; average displays correctly.
- [ ] Target university + country (Indonesia or abroad) required before result.
- [ ] Optional TOEFL, SAT, IELTS accepted when provided.
- [ ] Affordability is one of four options.
- [ ] Age required; optional major / awards count.
- [ ] Result shows match %, factor breakdown, and 3–6 roadmap steps.
- [ ] Disclaimer visible on result.

### Deploy / submit
- [ ] Public Netlify URL works.
- [ ] Repo includes `docs/PRD.md`, `docs/RFC.md`, `llms.txt`, screenshots.

---

## Constraints

| Constraint | Detail |
|------------|--------|
| Time | ~2.5–3 hours build window |
| Deploy | Netlify (preferred over Railway for this static/client MVP) |
| Audience | SPI members only (soft gate + copy) |
| Grades | Competitions: 7–12; Calculator: 10–12 (ambitious 9 OK) |
| Scoring input | 0–100 Kurikulum Merdeka style |
| Competition data | Curated JSON; refresh = date logic only |
| Modules | Both competition finder and calculator are equal priority |
| OCR | Stretch only — manual entry is the must-ship path |
| Language | English UI for MVP |
| Stack direction | Next.js + TypeScript + Tailwind (locked in RFC) |

---

## Grill-me decisions (locked)

1. Users = Sekolah Pilar Indonesia members only; features remain broad (Indo + international).
2. Both modules equal priority; keep each MVP brutal and honest.
3. Calculator must-ship = manual scores → % + breakdown + roadmap; OCR = stretch.
4. Competitions = curated JSON + date-based refresh; no live scrape.
5. School brand = Sekolah Pilar Indonesia.
6. Levels = JH + SH for competitions; calculator for SH (10–12).
7. Soft gate = email; prototype allows any email; later SPI school email format.
8. Scores = 0–100 Kurikulum Merdeka (Grades 7–12 grading style).
9. UI language = English (MVP default after grill recommendation; bilingual deferred).

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Equal priority on two modules overruns clock | Ship thinnest vertical for each; OCR already stretch |
| Match % looks like fake admissions AI | Transparent weights + strong disclaimer |
| Curated list feels “fake” | Label honestly; seed realistic Indo + international comps SPI students might enter |
| Soft gate with any email looks weak | Document as prototype; copy still says SPI-only |

---

## Out of scope follow-ups (post-workshop)

- Restrict unlock to SPI school email format
- Photo OCR for report cards
- Live competition feeds
- Bilingual EN/ID
- Teacher-curated competition admin
