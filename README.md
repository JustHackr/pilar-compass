# Pilar Compass

Web app for **Sekolah Pilar Indonesia** students to:

1. Find curated Indonesian & international academic competitions still open to register
2. Calculate a transparent university match % from Kurikulum Merdeka scores + context, with a short roadmap
3. Practice TKA on a school account tied to your `@pilar.sch.id` email
4. Practice OSN beside TKA (SD / SMP / SMA fields from the public archive, plus official Puspresnas PDFs). More fields can be added later from other sites.
5. Browse official school textbooks for grades 4–12 from [SIBI Kemendikdasmen](https://buku.kemendikdasmen.go.id/) (Kurikulum Merdeka and K-13). PDFs stay on the ministry site; refresh the catalog with `npm run materi:scrape`.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unlock with an SPI school email (`name@pilar.sch.id`). There is no student database — the app ships a demo school so you can walk the full workflow:

- `admin@pilar.sch.id` — admin dashboard with class rosters and metrics
- `rina.12-rio-de-janeiro@pilar.sch.id` — already-onboarded Grade 12 student (Rio De Janeiro)
- any other `@pilar.sch.id` address — new demo visitor (onboarding stays in this session)

```bash
npm test
npm run build
```

## Docs

- [docs/PRD.md](docs/PRD.md)
- [docs/RFC.md](docs/RFC.md)
- [llms.txt](llms.txt)
