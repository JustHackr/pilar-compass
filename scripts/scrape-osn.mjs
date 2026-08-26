#!/usr/bin/env node
/**
 * Fetch public OSN archive listings + question HTML from
 * forum.pelatihan-osn.com and write compact JSON for /osn courses.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "src/data/osn/generated");
const Q_DIR = join(ROOT, "public/osn/questions");
const UA = "PilarCompass/1.0 (SPI student practice; +https://pilar.sch.id)";
const BASE = "https://forum.pelatihan-osn.com";

/** @type {Array<{paket: string, id: string, level: "sd"|"smp"|"sma", labelEn: string, labelId: string}>} */
const SUBJECTS = [
  { paket: "MTQ", id: "ipa", level: "sd", labelEn: "Natural sciences", labelId: "IPA" },
  { paket: "MTM", id: "matematika", level: "sd", labelEn: "Mathematics", labelId: "Matematika" },
  { paket: "MTE", id: "ipa", level: "smp", labelEn: "Natural sciences", labelId: "IPA" },
  { paket: "MTI", id: "ips", level: "smp", labelEn: "Social sciences", labelId: "IPS" },
  { paket: "MTA", id: "matematika", level: "smp", labelEn: "Mathematics", labelId: "Matematika" },
  { paket: "MQ", id: "kimia", level: "sma", labelEn: "Chemistry", labelId: "Kimia" },
  { paket: "Mg", id: "biologi", level: "sma", labelEn: "Biology", labelId: "Biologi" },
  { paket: "Mw", id: "fisika", level: "sma", labelEn: "Physics", labelId: "Fisika" },
  { paket: "NQ", id: "matematika", level: "sma", labelEn: "Mathematics", labelId: "Matematika" },
  { paket: "Ng", id: "informatika", level: "sma", labelEn: "Informatics", labelId: "Informatika" },
  { paket: "OA", id: "astronomi", level: "sma", labelEn: "Astronomy", labelId: "Astronomi" },
  { paket: "MTg", id: "astronomi_2", level: "sma", labelEn: "Astronomy 2", labelId: "Astronomi 2" },
  { paket: "OQ", id: "kebumian", level: "sma", labelEn: "Earth science", labelId: "Kebumian" },
  { paket: "Nw", id: "geografi", level: "sma", labelEn: "Geography", labelId: "Geografi" },
  { paket: "NA", id: "ekonomi", level: "sma", labelEn: "Economics", labelId: "Ekonomi" },
  { paket: "MTc", id: "biologi_2", level: "sma", labelEn: "Biology 2", labelId: "Biologi 2" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json,text/html" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchJson(url) {
  const text = await fetchText(url);
  return JSON.parse(text);
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function compactHtml(html) {
  return html
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

function extractHref(html, needle) {
  const re = new RegExp(`href="([^"]*${needle}[^"]*)"`, "i");
  const m = html.match(re);
  return m ? m[1].replace(/\\\//g, "/") : undefined;
}

function parseTitle(cardHtml) {
  const text = stripTags(cardHtml);
  const title = text.split("Paket")[0].trim() || text;
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : null;
  let stage = "other";
  if (/\bKSN-K\b|\bOSK\b/i.test(text)) stage = "osk";
  else if (/\bKSN-P\b|\bOSP\b/i.test(text)) stage = "osp";
  else if (/\bKSN\b|\bOSN\b/i.test(text)) stage = "osn";
  let format = "mixed";
  if (/pilgan/i.test(text)) format = "pilgan";
  else if (/essay|esai/i.test(text)) format = "essay";
  return { title, year, stage, format, blurb: text };
}

function parseChoices(bodyHtml) {
  const re = /(?:<(?:p|div|li)[^>]*>|<br\s*\/?>)\s*([A-E])(?:[.)]|&#46;)\s*/gi;
  const markers = [];
  let m;
  while ((m = re.exec(bodyHtml))) {
    markers.push({ letter: m[1].toUpperCase(), start: m.index, end: m.index + m[0].length });
  }
  const seq = [];
  const wanted = "ABCDE";
  for (const mk of markers) {
    if (mk.letter === wanted[seq.length]) seq.push(mk);
    else if (seq.length >= 4) break;
    else if (mk.letter === "A") {
      seq.length = 0;
      seq.push(mk);
    }
  }
  if (seq.length < 4) return null;
  const stemHtml = compactHtml(bodyHtml.slice(0, seq[0].start));
  const choices = seq.map((mk, i) => {
    const end = i + 1 < seq.length ? seq[i + 1].start : bodyHtml.length;
    return compactHtml(bodyHtml.slice(mk.end, end).replace(/<\/(?:p|div|li)>\s*$/i, ""));
  });
  return { stemHtml, choices };
}

function parseQuestionCard(cardHtml, paperId, index) {
  const numMatch = cardHtml.match(/Soal\s+(\d+)/i);
  const number = numMatch ? Number(numMatch[1]) : index + 1;
  const bodyMatch = cardHtml.match(/kt-portlet__body">([\s\S]*?)<\/div>\s*<div class="kt-portlet__foot"/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : cardHtml;
  const discussionUrl = extractHref(cardHtml, "/arsip/discussion/");
  const mcq = parseChoices(bodyHtml);
  if (mcq) {
    return {
      id: `${paperId}-q${String(number).padStart(2, "0")}`,
      number,
      type: "pilgan",
      stemHtml: mcq.stemHtml,
      choices: mcq.choices,
      discussionUrl,
    };
  }
  return {
    id: `${paperId}-q${String(number).padStart(2, "0")}`,
    number,
    type: "essay",
    stemHtml: compactHtml(bodyHtml),
    choices: [],
    discussionUrl,
  };
}

function parsePaperRow(row, subject) {
  const href = extractHref(row.action, "/arsip/soal/");
  const token = href?.split("/").pop();
  if (!token) return null;
  const meta = parseTitle(row.card);
  const questionCount = Number(stripTags(row.content).replace(/[^\d]/g, "")) || 0;
  return {
    id: token,
    subjectId: subject.id,
    level: subject.level,
    paket: subject.paket,
    title: meta.title,
    year: meta.year,
    stage: meta.stage,
    format: meta.format,
    questionCount,
    sourceUrl: href.startsWith("http") ? href : `${BASE}${href}`,
  };
}

async function scrapeSubject(subject) {
  const list = await fetchJson(`${BASE}/arsip/get_list_paket/${subject.paket}`);
  const rows = list.data ?? [];
  const papers = [];
  const questionsByPaper = {};
  for (const row of rows) {
    const paper = parsePaperRow(row, subject);
    if (!paper) continue;
    papers.push(paper);
    try {
      const soal = await fetchJson(`${BASE}/arsip/get_list_soal/${paper.id}`);
      const cards = (soal.data ?? []).map((d) => d.card);
      questionsByPaper[paper.id] = cards.map((card, i) => parseQuestionCard(card, paper.id, i));
      if (questionsByPaper[paper.id].some((q) => q.type === "pilgan") && paper.format === "mixed") {
        paper.format = "pilgan";
      }
      paper.questionCount = questionsByPaper[paper.id].length || paper.questionCount;
    } catch (err) {
      console.error("  fail soal", paper.id, err.message);
      questionsByPaper[paper.id] = [];
    }
    await sleep(80);
  }
  papers.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title));
  return { papers, questionsByPaper };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(Q_DIR, { recursive: true });
  const allPapers = [];
  const allQuestions = {};
  for (const subject of SUBJECTS) {
    process.stdout.write(`Scraping ${subject.level}/${subject.id} (${subject.paket})… `);
    const { papers, questionsByPaper } = await scrapeSubject(subject);
    allPapers.push(...papers);
    Object.assign(allQuestions, questionsByPaper);
    console.log(`${papers.length} papers`);
  }
  const catalog = {
    scrapedAt: new Date().toISOString(),
    sources: {
      archive: "https://forum.pelatihan-osn.com/arsip",
      official: "https://pusatprestasinasional.kemendikdasmen.go.id/bank-soal-OSN",
    },
    subjects: SUBJECTS.map(({ paket, ...rest }) => ({ ...rest, paket })),
    papers: allPapers,
  };
  writeFileSync(join(OUT_DIR, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  for (const [paperId, questions] of Object.entries(allQuestions)) {
    writeFileSync(join(Q_DIR, `${paperId}.json`), `${JSON.stringify(questions)}\n`);
  }
  console.log(
    `Wrote ${allPapers.length} papers, ${Object.values(allQuestions).reduce((n, q) => n + q.length, 0)} questions`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
