# Pilar Compass

**Open-source student tools for Sekolah Pilar Indonesia — and a starter you can fork onto your own school domain.**

[Live demo](https://pilar-compass.vercel.app) · [How to use](docs/USAGE.md) · [Run it on your school](docs/SELF_HOSTING.md) · [MIT License](LICENSE)

![Pilar Compass home](docs/screenshots/02-home.png)

Students at [Sekolah Pilar Indonesia](https://sekolah-pilar-indonesia.sch.id/) juggle competition deadlines, TKA practice, textbooks, and university plans across too many ministry sites. Pilar Compass puts those tools in one gated school app: find open *ajang talenta*, practice TKA and OSN, browse official SIBI books, and see a transparent university match % with a short roadmap.

It is built for **SPI Junior and Senior High**. The same codebase is meant to be copied. Change the school name, email domain, logo, and homerooms — then deploy on Vercel with your own domain.

## What it does

| Module | Why it exists |
|--------|----------------|
| **Competitions** | Live-ish calendar of Puspresnas academic events (OSN, OPSI, FIKSI, LKS, FLS3N, debate) plus niche contests, sorted by nearest deadline |
| **TKA** | Short lessons and tryouts by grade track (6 / 9 / 12), with streaks, XP, and a class leaderboard |
| **OSN** | Past OSK / OSP / OSN papers scored like a tryout, plus official ministry PDFs |
| **Materials** | Grades 4–12 textbooks from [SIBI](https://buku.kemendikdasmen.go.id/) — PDFs stay on the ministry site |
| **Calculator** | Kurikulum Merdeka scores → match % with visible weights and a roadmap (not official admissions) |
| **Admin** | Homeroom rosters, activity, and TKA metrics for `admin@pilar.sch.id` |

English and Indonesian throughout. Switch **EN / ID** in the top bar.

## Screenshots

Captured on the live demo while signed in as **`admin@pilar.sch.id`**.

### Unlock

![Email gate](docs/screenshots/01-login.png)

Only `@pilar.sch.id` addresses unlock the demo. There is no password.

### Intro + home

![Intro tour](docs/screenshots/03-intro-tour.png)

![Home](docs/screenshots/02-home.png)

### TKA

![Grade 12 TKA subjects](docs/screenshots/06-tka-grade-12.png)

![Mathematics lessons](docs/screenshots/07-tka-math.png)

![Leaderboard](docs/screenshots/09-tka-leaderboard.png)

### OSN, materials, competitions

![OSN hub](docs/screenshots/10-osn.png)

![OSN paper](docs/screenshots/11-osn-paper.png)

![School materials](docs/screenshots/12-materi.png)

![Competition finder](docs/screenshots/13-competitions.png)

### Calculator, profile, admin

![University calculator](docs/screenshots/14-calculator.png)

![Match result](docs/screenshots/15-calculator-result.png)

![Profile](docs/screenshots/16-profile.png)

![Admin dashboard](docs/screenshots/04-dashboard.png)

Step-by-step clicks: **[docs/USAGE.md](docs/USAGE.md)**.

## Quick start

```bash
git clone https://github.com/JustHackr/pilar-compass.git
cd pilar-compass
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Email | Role |
|-------|------|
| `admin@pilar.sch.id` | Admin dashboard + every student tool |
| `rina.12-rio-de-janeiro@pilar.sch.id` | Seeded Grade 12 student (already onboarded) |
| any other `*@pilar.sch.id` | New visitor — finish TKA onboarding once |

```bash
npm test
npm run build
```

## Use it on your own school or domain

1. Fork this repository.
2. Edit [`src/config/school.ts`](src/config/school.ts) — name, product title, **email domain**, admin email, contact email, website.
3. Replace `public/spi-logo.png` and rewrite homerooms in `src/data/spi-classes.ts`.
4. Update EN/ID copy in `src/lib/i18n/dictionaries.ts`.
5. Deploy to [Vercel](https://vercel.com/new) (or Netlify). Attach `compass.yourschool.sch.id` under **Domains**.

Full walkthrough: **[docs/SELF_HOSTING.md](docs/SELF_HOSTING.md)**.

Optional: set `DATABASE_URL` (Postgres) so TKA progress is shared. Without it, progress is written to `data/tka-store.json`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · optional Postgres

Refresh public catalogs:

```bash
npm run competitions:scrape
npm run materi:scrape
npm run osn:scrape
```

## Honesty

- Competition openness is date logic on public / curated data. If Puspresnas is down, the last snapshot is used.
- The university match % is a **planning heuristic** with visible weights — not SNBP, SNBT, or overseas admissions odds.
- OCR on a report photo stays in the browser. Always edit the scores.
- Admin homerooms in the demo are **seeded sample students**, not a live school SIS.

## Docs

| Doc | What it is |
|-----|------------|
| [USAGE.md](docs/USAGE.md) | How students and admins use each screen |
| [SELF_HOSTING.md](docs/SELF_HOSTING.md) | Fork, rebrand, deploy, custom domain |
| [PRD.md](docs/PRD.md) | Product requirements |
| [RFC.md](docs/RFC.md) | Architecture as built |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to send a change |
| [SECURITY.md](SECURITY.md) | How to report a vulnerability |
| [llms.txt](llms.txt) | Short machine-readable product card |

## License

[MIT](LICENSE). Use it, fork it, ship it at your school. Keep the copyright notice.

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).
