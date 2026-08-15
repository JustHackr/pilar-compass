# Design: TKA practice tab (Pilar Compass)

**Date:** 2026-08-15  
**Status:** Draft pending user review  
**Product:** Pilar Compass — Sekolah Pilar Indonesia  
**Stack decision:** Approach 1 — TKA module in Compass + Supabase (Postgres + Auth)

## Problem

SPI students preparing for Tes Kemampuan Akademik (grades 6, 9, 12) have no in-school daily practice loop. Compass today only covers competitions and a university match calculator. Content will arrive slowly (first paper: SMA Matematika wajib).

## Goals

1. Add a **TKA** nav tab with a friendly study hub (Khan / Ruangguru catalog, Duolingo-sized lessons, streaks).
2. Split tracks **6 / 9 / 12**. At launch only **Grade 12 Matematika wajib** is playable; all other grades and subjects show **Coming soon**.
3. Persist **streak, XP, mastery, and leaderboards per verified email**, not per device.
4. Support a **full tryout** (official papers now, prediction packs later) without blocking the short daily lesson.
5. Collect **age, TKA track, kelas/rombel, and two Grade 12 pilihan** in onboarding so school-email mapping can land later without a redesign.

## Non-goals (this version)

- Enforcing SPI school email domains or filing emails by grade (explicitly later).
- Hearts, gems, streak freezes, friends, AI-generated live questions, parent accounts.
- Playable content for Grade 6, Grade 9, or any subject except Grade 12 Matematika wajib.
- Changing Competitions or Calculator behaviour except adding the TKA nav link.

## Personas

- **Grade 12 SPI student** — daily Matematika lessons, optional tryout, two locked electives, class + school leaderboards.
- **Grade 6 / 9 student** — can onboard and see the hub; practice locked Coming soon.
- **Student council** — school-wide monthly top 10 for prizes.

## Information architecture

New primary nav item: **TKA** (`/tka`), beside Home, Competitions, Calculator.

```
/tka                          Hub: streak, XP, continue, grade cards
/tka/onboarding               Age → confirm track → (G12) pick 2 pilihan → display name + kelas
/tka/grade/12                 Catalog: wajib + 2 pilihan
/tka/grade/12/matematika      Skill list + Lesson / Tryout
/tka/lesson/[skillId]         Duolingo short set
/tka/tryout/[packId]          Full paper
/tka/leaderboard              School-wide month + per-kelas tab
```

Grades 6 and 9 routes exist as Coming soon pages (not 404).

## Student journey

1. Open TKA. If the Compass gate email is not yet a **verified** Supabase user, send magic link or 6-digit OTP to that email. Unverified users cannot write progress or appear on leaderboards.
2. If onboarding incomplete: age → suggested track from age → student **confirms** 6 / 9 / 12 → Grade 12 must select **exactly two** pilihan → display name + kelas/rombel.
3. Hub shows flame, monthly activity, continue-lesson, three grade cards (6 and 9 locked).
4. Grade 12 home: three **wajib** always; two chosen **pilihan**; other electives not in package (collapsed).
5. Matematika: kompetensi skills. **Lesson** or **Tryout**.
6. After a lesson: streak saved if this is the first qualifying activity today; prompt to keep practicing (uncapped extra lessons).

### Age → suggested track

| Suggested track | Typical ages |
|-----------------|--------------|
| 6 | 11–12 |
| 9 | 13–15 |
| 12 | 16+ |

Student can override the suggestion. Track is stored; school email will later replace this heuristic.

## Subject catalog

### Grade 12 wajib (always shown)

| Id | Label | Launch |
|----|--------|--------|
| `matematika` | Matematika | **Playable** |
| `bahasa_indonesia` | Bahasa Indonesia | Coming soon |
| `bahasa_inggris` | Bahasa Inggris | Coming soon |

### Grade 12 pilihan (pick exactly two)

Fisika, Kimia, Biologi, Matematika Tingkat Lanjut, Ekonomi, Sosiologi, Geografi, Sejarah, Antropologi, Pendidikan Pancasila dan Kewarganegaraan (PPKn), Bahasa Indonesia Tingkat Lanjut, Bahasa Inggris Tingkat Lanjut, Bahasa Arab, Bahasa Mandarin, Bahasa Jepang, Bahasa Korea, Bahasa Jerman, Bahasa Prancis, Informatika.

All pilihan: Coming soon. Changing the pair later requires an explicit confirm; mid-month they move to the new kelas board only if kelas changes — pilihan change does not reset monthly activity.

### Grades 6 and 9

Whole track Coming soon. Catalog structure can be stubbed with empty wajib/pilihan arrays until papers exist.

## Lesson loop (Duolingo-shaped)

- Default set: **6 unique items** for one skill (or a mixed daily set from weak skills on “Continue”).
- One question per screen: stem, optional figure, choices, Check.
- Hint hidden until first miss.
- **Correct first try:** full XP, next item, no hint.
- **Wrong:** do not reveal the key; unlock hint (1–3 sentences or formula cue); enqueue **redemption** later in the same lesson (not the immediately next card).
- **Redemption correct:** half XP, item cleared.
- **Second miss** on the same item: after they answer, show short explanation; **no XP**; lesson continues (no infinite trap).
- Extra lessons the same day: allowed; XP granted; **no extra streak days**.
- Optional short material card per kompetensi (what it is + one worked example), available before the lesson and linked under the hint after a miss.

### Item types (player)

- `pg` — five options A–E (TKA default).
- `pgk` — several true/false statements; all must match the key to count as correct.
- `figure` — image URL under the stem.

Data-sufficiency items from the seed PDF are stored as `pg` when they already use A–E keys. Do not invent missing stems or keys from broken OCR.

## Streak and XP

- Timezone: **Asia/Jakarta**. Day boundary = midnight WIB.
- Qualifying activity: **finish one lesson** or **submit one tryout** that calendar day → streak +1 (or maintain if already counted today).
- Miss a calendar day → `streak_count = 0`. No streak freeze shop.
- Badges at 3 / 7 / 14 / 30 days (display only).
- XP: first-try full; redemption half; second-miss reveal none; small bonus on lesson complete.
- No class ranking by lifetime XP; prize ranking uses **monthly activity** (below).

## Tryout

- Pack kinds: `official` | `prediction`.
- Launch: one **Grade 12 Matematika official** pack seeded from `28476724.pdf` (Pusmendik-style SMA Matematika). Prediction tab: Coming soon.
- Exam mode: all items in order, flag/skip/return, no in-item redemption.
- Timer optional at start; default **untimed**.
- After submit: score %, time used, breakdown by kompetensi, review with key + explanation.
- Weak kompetensi can deep-link to a lesson.
- Tryout keys are **scored on the server**. Lesson practice keys may live with content in git (practice, not high-stakes).

Tryout papers later include only **wajib + that student’s two pilihan**. The launch pack is Matematika-only, so this rule is structural for later packs.

## Leaderboards

Two views on `/tka/leaderboard`:

1. **School-wide “Pilar Active”** — all verified users, **current calendar month (WIB)**. Score = lessons finished + tryouts submitted + streak-days kept that month (sum of daily activity). Top **10** visually highlighted for student-council prizes. Resets on the 1st.
2. **Per class** — same score, `kelas` string match after normalize (trim, uppercase). `kelas` is self-typed (e.g. `12-A`) until school emails exist.

Display: rank, **display name** (never raw email), kelas, monthly score, current streak. One account per verified email. Changing `kelas` mid-month moves the student to the new class board; school-wide score unchanged.

## Auth and session

Compass remains a soft email gate in `localStorage` for Competitions/Calculator.

TKA requires **Supabase Auth** (magic link or OTP) to the **same email**. Profile and progress FKs use `auth.users.id`.

Until SPI domain enforcement: any verified email can play (same as today’s demo-friendly gate). Domain allowlist is a future flag on the same Auth user.

## Data model (Supabase)

`profiles`

- `id` uuid PK = `auth.users.id`
- `email` text unique
- `display_name` text not null
- `age` int not null
- `tka_track` text not null check in (`6`,`9`,`12`)
- `kelas` text not null
- `pilihan_ids` text[] — length 0 unless track 12, then length 2
- `onboarding_completed_at` timestamptz
- `streak_count` int default 0
- `streak_last_date` date (WIB calendar date of last qualifying activity)

`daily_activity`

- `user_id`, `activity_date` (date, WIB), `lessons_completed`, `tryouts_submitted`, `xp_earned`, `streak_counted` bool
- PK (`user_id`, `activity_date`)
- Leaderboards: `sum(lessons_completed + tryouts_submitted + (streak_counted::int))` for dates in current month

`lesson_attempts`

- `id`, `user_id`, `skill_id`, `started_at`, `finished_at`, `xp`, `item_results` jsonb

`tryout_attempts`

- `id`, `user_id`, `pack_id`, `started_at`, `submitted_at`, `score_percent`, `duration_seconds`, `answers` jsonb

`skill_mastery`

- `user_id`, `skill_id`, `status` (`unseen` | `learning` | `mastered`), `updated_at`
- PK (`user_id`, `skill_id`)

Row Level Security: users read/write only their rows. Leaderboard reads a **security definer** view that exposes `display_name`, `kelas`, monthly score, streak — not email.

## Content in git

`src/data/tka/catalog.ts` — grades, subjects, `playable: boolean`. Only `12 / matematika` is true at launch.

`src/data/tka/skills/grade12-matematika.ts` — kompetensi ids aligned to the seed PDF (SPL, pertidaksamaan, fungsi invers/komposisi, barisan/deret, bangun ruang, trigonometri, penyajian data, statistika, peluang, program linear / PGK, geometri, etc.).

`src/data/tka/questions/grade12-matematika.json` — `{ id, skillId, type, stem, choices, key, hint, explanation, image? }`.

`src/data/tka/tryouts/grade12-matematika-official-1.ts` — ordered question ids.

`public/tka/` — figures.

Seed rule: transcribe items from `/Users/justradr/Downloads/28476724.pdf` when stem, choices, and key are complete. Skip incomplete OCR. Do not guess keys.

Adding a subject later = new files + `playable: true`. No CMS in v1.

## Lesson engine vs API

- Client: load catalog/questions, build set, render, local redemption queue, hint unlock.
- `POST /api/tka/lesson/complete` — records XP, mastery, daily_activity, streak.
- `POST /api/tka/tryout/submit` — server grades against pack keys, records attempt + daily_activity.
- `GET /api/tka/leaderboard?scope=school|class` — monthly ranks.

## i18n and UI

Follow existing EN/ID dictionaries and AppShell patterns. TKA student-facing copy in both locales. Questions stay in **Indonesian** (exam language).

UI stack: 8px spacing, existing Compass tokens where possible; streak/XP as 10% accent. Touch targets ≥ 44px. Focus rings. `prefers-reduced-motion` for flame/XP animations.

## Testing

- Unit: streak date math (WIB midnight), redemption queue (not immediately next), XP rules, monthly leaderboard aggregation, pilihan length === 2 for track 12.
- Unit: tryout server scorer for `pg` and `pgk`.
- Component: onboarding cannot finish Grade 12 without two distinct pilihan; locked subjects do not navigate to lessons.

## Risks

- Soft Compass gate vs verified TKA account: document in UI that TKA needs email confirm.
- Self-reported `kelas` can fragment boards (`12A` vs `12-A`); normalize and show examples.
- PDF figures: missing images skip those items rather than ship broken stems.
- Supabase keys in Vercel env; never commit service role to the client.

## Launch checklist (product)

- [ ] Nav TKA + Coming soon for 6, 9, non-math subjects
- [ ] Onboarding age / track / 2 pilihan / name / kelas
- [ ] Grade 12 Matematika lessons with hint + redemption
- [ ] One official tryout pack from the SMA Maths PDF
- [ ] Streak per verified email
- [ ] School monthly top 10 + per-kelas board
