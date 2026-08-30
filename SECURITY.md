# Security policy

## Supported versions

This project is a school web app shipped as source. Security fixes land on `main`.

## What this app stores

- The email gate is a **school-domain unlock**, not a password login.
- TKA progress can live in `data/tka-store.json` locally, or in Postgres when `DATABASE_URL` is set.
- Demo homerooms in the admin dashboard are **seeded sample students**, not a real school roster.

## Reporting a vulnerability

Do not open a public issue for a security problem.

1. Use GitHub **Report a vulnerability** on [JustHackr/pilar-compass](https://github.com/JustHackr/pilar-compass/security/advisories/new) if you can.
2. Or email the repository owner through GitHub.

Please include:

- The affected URL or file
- Steps to reproduce
- What an attacker could do with it

We will acknowledge the report and work on a fix before any public write-up.

## Please do not

- Commit `.env` files or production database URLs
- Publish real student names, photos, or emails from a live school
- Treat the university match percentage as an official admissions score
