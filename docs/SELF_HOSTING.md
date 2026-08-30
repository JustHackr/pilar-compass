# Run Pilar Compass on your own school or domain

Fork this repo, point it at your school, and deploy. You do not need to rewrite the app.

## What you are forking

Pilar Compass is a Next.js 16 app (App Router, React 19, Tailwind 4). Students unlock with a **school email domain**. Admins get a dashboard. TKA progress can stay on disk or go to Postgres.

Default live site: [pilar-compass.vercel.app](https://pilar-compass.vercel.app)

## 1. Clone and run locally

```bash
git clone https://github.com/JustHackr/pilar-compass.git
cd pilar-compass
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional env vars (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres URL. When set, TKA lessons, streaks, XP, and tryouts persist in the database. Without it, progress is written to `data/tka-store.json`. |

## 2. Make it your school

Edit **one identity file** first:

[`src/config/school.ts`](../src/config/school.ts)

```ts
export const SCHOOL = {
  name: "Your School Name",
  shortName: "YS",
  productName: "Your Compass",
  emailDomain: "yourschool.sch.id",   // unlocks name@yourschool.sch.id
  adminEmail: "admin@yourschool.sch.id",
  contactEmail: "info@yourschool.sch.id",
  website: "https://yourschool.sch.id/",
  liveUrl: "https://your-app.vercel.app",
} as const;
```

Then:

| Step | File | What to change |
|------|------|----------------|
| 1 | `public/spi-logo.png` | Replace with your logo (wide lockup works best) |
| 2 | `src/data/spi-classes.ts` | Homeroom list: `id`, `grade`, `city`/`label`, `tkaTrack` (`"6"` / `"9"` / `"12"`) |
| 3 | `src/lib/i18n/dictionaries.ts` | Search `Sekolah Pilar`, `SPI`, `Pilar Compass`, `@pilar.sch.id` and rewrite EN + ID strings |
| 4 | `src/app/page.tsx` | Hero eyebrow / product title if you do not use the dictionary |
| 5 | `src/app/layout.tsx` | `metadata.title` and `description` |
| 6 | `src/lib/tka/demo.ts` | Demo roster names if you still want a seeded school for screenshots |
| 7 | Tests | `src/lib/session.test.ts` and `src/data/spi-classes.test.ts` expect the old domain — update them |

The email gate already reads `SCHOOL.emailDomain`. The admin check already reads `SCHOOL.adminEmail`. The top bar contact link already uses `SCHOOL.contactEmail`.

### Email domain rules

- Only the **exact** domain matches (`yourschool.sch.id`). Subdomains such as `mail.yourschool.sch.id` are rejected on purpose.
- There is still no password. Anyone who knows a valid address at that domain can unlock a browser session. Put the site behind your school network or a stronger auth layer if that is not acceptable.

## 3. Deploy on Vercel (recommended)

This repo already includes `vercel.json` (daily competition refresh cron).

1. Push your fork to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Next.js**. Build command: `npm run build`.
4. Add `DATABASE_URL` if you want shared TKA progress across devices.
5. Deploy.

### Attach your own domain

In the Vercel project:

1. **Settings → Domains → Add**.
2. Enter `compass.yourschool.sch.id` (or the apex domain).
3. At your DNS host, add the records Vercel shows (usually a `CNAME` to `cname.vercel-dns.com`).
4. Wait for HTTPS. Update `SCHOOL.liveUrl` to match.

The email domain (`SCHOOL.emailDomain`) and the website domain are independent. Students can unlock with `@yourschool.sch.id` even if the app lives at `compass.yourschool.sch.id`.

## 4. Deploy on Netlify (fallback)

`netlify.toml` is included. Connect the repo, build command `npm run build`, plugin `@netlify/plugin-nextjs`. Custom domains work the same way under **Domain management**.

## 5. Refresh public data

These commands pull from public ministry / archive sites. Run them when you want a newer catalog, then commit the generated JSON.

```bash
npm run competitions:scrape   # Puspresnas ajang talenta
npm run materi:scrape         # SIBI textbooks
npm run osn:scrape            # OSN papers
```

## 6. What you should not copy blindly

- **SPI class city names** (Boston, Rio De Janeiro, …) are this school's homerooms. Replace them.
- **Demo students** (`rina.12-rio-de-janeiro@pilar.sch.id` and the rest) are fiction for screenshots. Do not treat them as real people.
- **University match %** is a heuristic. Keep the disclaimer if you ship the calculator.
- **OCR** runs in the browser with Tesseract. It is a helper, not a gradebook.

## 7. Production checklist

- [ ] `SCHOOL` values and logo updated
- [ ] Homerooms match your school
- [ ] Dictionary copy no longer says Sekolah Pilar Indonesia (unless that is you)
- [ ] `npm test` and `npm run build` pass
- [ ] Custom domain HTTPS is green
- [ ] Admin email is an address only staff know
- [ ] `.env` / `DATABASE_URL` never committed

More product context: [PRD](PRD.md), [RFC](RFC.md), [USAGE](USAGE.md).
