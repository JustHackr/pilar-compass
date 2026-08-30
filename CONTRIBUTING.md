# Contributing to Pilar Compass

Thanks for helping. This repo is MIT-licensed and open to forks, issues, and pull requests.

## Before you start

1. Read [README.md](README.md) for what the app is and how to run it.
2. Read [docs/USAGE.md](docs/USAGE.md) so you know the student and admin flows.
3. Keep changes honest: competition data is curated or scraped from public ministry pages, and the university match % is a heuristic — not official admissions odds.

## Local setup

```bash
git clone https://github.com/JustHackr/pilar-compass.git
cd pilar-compass
npm install
npm run dev
```

Open http://localhost:3000 and unlock with `admin@pilar.sch.id` or any `@pilar.sch.id` address.

## What to change

| Area | Start here |
|------|------------|
| School name, email domain, admin account | `src/config/school.ts` |
| Homeroom classes | `src/data/spi-classes.ts` |
| EN / ID copy | `src/lib/i18n/dictionaries.ts` |
| Logo | `public/spi-logo.png` |
| How to fork onto your own domain | [docs/SELF_HOSTING.md](docs/SELF_HOSTING.md) |

## Checks before a pull request

```bash
npm test
npm run lint
npm run build
```

## Pull requests

- Keep the PR focused on one problem.
- Say **why** the change exists, not only what files moved.
- If you change UI, add or update a screenshot under `docs/screenshots/`.
- Do not commit `.env`, `data/tka-store.json`, or student data from a real school.

## Issues

Open an issue for bugs, docs gaps, or feature ideas. Include the page URL, what you expected, and what happened.

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
