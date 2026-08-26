#!/usr/bin/env node
/** Refresh the offline Puspresnas snapshot used if the live calendar is unreachable. */
import { writeFileSync } from "node:fs";
import https from "node:https";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/data/puspresnas-fallback.json");
const BASE = "https://pusatprestasinasional.kemendikdasmen.go.id";
const UA = "PilarCompass/1.0 (SPI student competitions; +https://pilar.sch.id)";
const CATS = ["riset-dan-inovasi", "seni-budaya"];
const KEEP = [
  "id",
  "nama_event",
  "nama_singkat",
  "slug",
  "detail_singkat",
  "link",
  "start",
  "end",
  "route",
];

function decodePage(html) {
  const match = html.match(/data-page="([^"]+)"/);
  if (!match) throw new Error("missing data-page");
  const decoded = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  return JSON.parse(decoded);
}

function getHtml(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: { "User-Agent": UA, Accept: "text/html" },
        rejectUnauthorized: false,
      },
      (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          reject(new Error(`${url} ${res.statusCode}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        res.on("error", reject);
      },
    );
    req.on("error", reject);
  });
}

async function load(slug) {
  const page = decodePage(await getHtml(`${BASE}/event/${slug}`));
  return page?.props?.data?.event ?? [];
}

const events = [];
const seen = new Set();
for (const slug of CATS) {
  for (const event of await load(slug)) {
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    events.push({
      ...Object.fromEntries(KEEP.map((k) => [k, event[k]])),
      category: {
        slug: event.category?.slug,
        title: event.category?.title,
      },
    });
  }
}

const catalog = { fetchedAt: new Date().toISOString(), events };
writeFileSync(OUT, `${JSON.stringify(catalog)}\n`);
console.log(`Wrote ${events.length} events → ${OUT}`);
