# Design: Report OCR + EN/ID locale

**Date:** 2026-08-01  
**Status:** Approved

## Goals

1. Let Senior High students upload a report-card photo; browser OCR pre-fills subject scores.
2. Let users switch the whole product UI between English and Indonesian (EN | ID).

## OCR (hybrid, no cloud API)

- Engine: **Tesseract.js** in the browser, languages `ind` + `eng`.
- UI: upload control on Subject scores panel; image preview; status messages.
- Parse lines into `{ name, score }` (0–100).
- Success when enough valid subjects **and** mean word confidence is above threshold → **replace** subject list (still editable).
- Failure → do **not** replace; show clear “enter scores manually” message.
- No photo upload to a server; no auto-submit of Calculate.

## Locale (EN / ID)

- Lightweight dictionary + `LocaleProvider` (no next-intl).
- Toggle **EN | ID** in top bar and on the email gate; persist in `localStorage`.
- Translate shell, gate, home, competitions chrome, calculator, OCR status, roadmap, errors.
- Keep proper nouns (competition titles, university names, SPI brand) as-is; competition descriptions get ID strings in the dictionary.

## Out of scope

- Cloud Vision fallback, photo storage, perfect OCR on every layout, translating external link labels.
