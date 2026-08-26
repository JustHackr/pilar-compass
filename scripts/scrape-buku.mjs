#!/usr/bin/env node
/**
 * Fetch official SIBI textbook metadata (Kurikulum Merdeka + K13) for
 * grades 4–12 and write a compact catalog. PDFs stay on Kemendikdasmen;
 * we store cover, detail, and download URLs.
 *
 * Source: https://buku.kemendikdasmen.go.id/
 * API:    https://api.buku.cloudapp.web.id/api/catalogue/
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "src/data/materi/generated");
const UA = "PilarCompass/1.0 (SPI student materials; +https://pilar.sch.id)";
const API = "https://api.buku.cloudapp.web.id";
const SIBI = "https://buku.kemendikdasmen.go.id";
const GRADES = [4, 5, 6, 7, 8, 9, 10, 11, 12];

/** Academic / common subject labels. Vocational slugs fall back to title-case. */
const SUBJECT_LABELS = {
  matematika: { en: "Mathematics", id: "Matematika" },
  bahasa_indonesia: { en: "Indonesian", id: "Bahasa Indonesia" },
  bahasa_inggris: { en: "English", id: "Bahasa Inggris" },
  bahasa_jepang: { en: "Japanese", id: "Bahasa Jepang" },
  bahasa_korea: { en: "Korean", id: "Bahasa Korea" },
  bahasa_mandarin: { en: "Mandarin", id: "Bahasa Mandarin" },
  ipa: { en: "Natural sciences", id: "IPA" },
  ipas: { en: "Science and social studies", id: "IPAS" },
  projek_ipas: { en: "IPAS project", id: "Projek IPAS" },
  ips: { en: "Social sciences", id: "IPS" },
  pendidikan_pancasila: { en: "Pancasila education", id: "Pendidikan Pancasila" },
  pjok: { en: "Physical education", id: "PJOK" },
  informatika: { en: "Informatics", id: "Informatika" },
  koding_dan_kecerdasan_artifisial: {
    en: "Coding and AI",
    id: "Koding dan Kecerdasan Artifisial",
  },
  biologi: { en: "Biology", id: "Biologi" },
  fisika: { en: "Physics", id: "Fisika" },
  kimia: { en: "Chemistry", id: "Kimia" },
  ekonomi: { en: "Economics", id: "Ekonomi" },
  geografi: { en: "Geography", id: "Geografi" },
  sejarah: { en: "History", id: "Sejarah" },
  sosiologi: { en: "Sociology", id: "Sosiologi" },
  antropologi: { en: "Anthropology", id: "Antropologi" },
  seni_rupa: { en: "Visual arts", id: "Seni Rupa" },
  seni_musik: { en: "Music", id: "Seni Musik" },
  seni_tari: { en: "Dance", id: "Seni Tari" },
  seni_teater: { en: "Theatre", id: "Seni Teater" },
  seni_budaya: { en: "Arts and culture", id: "Seni Budaya" },
  prakarya: { en: "Crafts", id: "Prakarya" },
  prakarya_budidaya: { en: "Crafts · cultivation", id: "Prakarya · Budi daya" },
  prakarya_kerajinan: { en: "Crafts · handicraft", id: "Prakarya · Kerajinan" },
  prakarya_pengolahan: { en: "Crafts · processing", id: "Prakarya · Pengolahan" },
  prakarya_rekayasa: { en: "Crafts · engineering", id: "Prakarya · Rekayasa" },
  tematik: { en: "Thematic", id: "Tematik" },
  agama_islam: { en: "Islamic education", id: "Pendidikan Agama Islam" },
  agama_kristen: { en: "Christian education", id: "Pendidikan Agama Kristen" },
  agama_katolik: { en: "Catholic education", id: "Pendidikan Agama Katolik" },
  agama_hindu: { en: "Hindu education", id: "Pendidikan Agama Hindu" },
  agama_buddha: { en: "Buddhist education", id: "Pendidikan Agama Buddha" },
  agama_khonghucu: { en: "Confucian education", id: "Pendidikan Agama Khonghucu" },
  kepercayaan: {
    en: "Belief in God Almighty",
    id: "Kepercayaan terhadap Tuhan YME",
  },
};

const SUBJECT_ALIASES = {
  bahasa_indonesia: "bahasa_indonesia",
  "bahasa-indonesia": "bahasa_indonesia",
  bahasa_inggris: "bahasa_inggris",
  "bahasa-inggris": "bahasa_inggris",
  "prakarya budidaya": "prakarya_budidaya",
  "prakarya kerajinan": "prakarya_kerajinan",
  "prakarya pengolahan": "prakarya_pengolahan",
  "prakarya rekayasa": "prakarya_rekayasa",
};

const CORE_ORDER = [
  "tematik",
  "matematika",
  "bahasa_indonesia",
  "bahasa_inggris",
  "ipa",
  "ipas",
  "projek_ipas",
  "ips",
  "pendidikan_pancasila",
  "pjok",
  "informatika",
  "koding_dan_kecerdasan_artifisial",
  "biologi",
  "fisika",
  "kimia",
  "ekonomi",
  "geografi",
  "sejarah",
  "sosiologi",
  "antropologi",
  "seni_rupa",
  "seni_musik",
  "seni_tari",
  "seni_teater",
  "seni_budaya",
  "prakarya",
  "prakarya_budidaya",
  "prakarya_kerajinan",
  "prakarya_pengolahan",
  "prakarya_rekayasa",
  "agama_islam",
  "agama_kristen",
  "agama_katolik",
  "agama_hindu",
  "agama_buddha",
  "agama_khonghucu",
  "kepercayaan",
  "bahasa_jepang",
  "bahasa_korea",
  "bahasa_mandarin",
];

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function slugifySubject(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function inferSubjectFromTitle(title) {
  const t = title || "";
  if (/tema\s+\d+/i.test(t)) return "tematik";
  if (/matematika/i.test(t)) return "matematika";
  if (/prakarya dan kewirausahaan:\s*budi\s*daya/i.test(t)) return "prakarya_budidaya";
  if (/prakarya/i.test(t)) return "prakarya";
  if (/agribisnis perbenihan/i.test(t)) return "agribisnis_perbenihan_tanaman";
  if (/bahasa indonesia/i.test(t)) return "bahasa_indonesia";
  if (/bahasa inggris|english/i.test(t)) return "bahasa_inggris";
  if (/\bipas\b/i.test(t)) return "ipas";
  if (/\bipa\b/i.test(t)) return "ipa";
  if (/\bips\b/i.test(t)) return "ips";
  return "lainnya";
}

function subjectIdFrom(book) {
  const raw = slugifySubject(book.subject);
  const aliased = SUBJECT_ALIASES[raw] || raw;
  return aliased || inferSubjectFromTitle(book.title);
}

function labelFromSlug(id) {
  const known = SUBJECT_LABELS[id];
  if (known) return known;
  const text = id
    .split("_")
    .map((w, i) => {
      if (i > 0 && ["dan", "di", "ke", "untuk", "yang"].includes(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
  return { en: text, id: text };
}

function roleFrom(book) {
  const title = book.title || "";
  // SIBI sometimes tags teacher guides as buku_siswa; title is more reliable.
  if (/panduan guru|buku guru|buku panduan guru/i.test(title)) return "guru";
  if (/buku siswa/i.test(title)) return "siswa";
  const bt = String(book.book_type || "").toLowerCase();
  if (bt.includes("guru")) return "guru";
  if (bt.includes("siswa")) return "siswa";
  return "siswa";
}

function streamFromLevel(level) {
  const l = String(level || "").toUpperCase().replace(/\s+/g, "");
  if (l === "SMK/MAK" || (l.includes("SMK") && !l.includes("SMA"))) return "smk";
  return "umum";
}

function yearFrom(value) {
  if (!value) return null;
  const m = String(value).match(/\b(20\d{2}|19\d{2})\b/);
  return m ? Number(m[0]) : null;
}

function subjectSortKey(id) {
  const i = CORE_ORDER.indexOf(id);
  return i === -1 ? 1000 + id.charCodeAt(0) : i;
}

async function fetchCatalogue(path) {
  const url = `${API}${path}`;
  const data = await fetchJson(url);
  const results = Array.isArray(data.results) ? data.results : [];
  console.log(`${path} → ${results.length} (totalSize ${data.totalSize ?? "?"})`);
  return results;
}

function toBook(raw, curriculum) {
  const grade = Number(raw.class);
  if (!GRADES.includes(grade)) return null;
  const pdfUrl = typeof raw.attachment === "string" ? raw.attachment.trim() : "";
  if (!pdfUrl) return null;
  const slug = String(raw.slug || "").trim();
  if (!slug) return null;
  const subjectId = subjectIdFrom(raw);
  return {
    id: String(raw.id),
    slug,
    title: String(raw.title || "").trim(),
    grade,
    subjectId,
    curriculum,
    role: roleFrom(raw),
    stream: streamFromLevel(raw.level),
    level: String(raw.level || "").trim(),
    writer: raw.writer ? String(raw.writer).replace(/\s+/g, " ").trim() : "",
    isbn: raw.isbn ? String(raw.isbn).trim() : "",
    year: yearFrom(raw.published_year) ?? yearFrom(raw.curriculum),
    coverUrl: typeof raw.image === "string" ? raw.image : "",
    pdfUrl,
    detailUrl: `${SIBI}/katalog/${encodeURIComponent(slug)}`,
  };
}

async function main() {
  const merdeka = await fetchCatalogue(
    "/api/catalogue/getPenggerakTextBooks?limit=2000&type_pdf&order_by=updated_at",
  );
  const k13 = await fetchCatalogue("/api/catalogue/getTextBooks?limit=2000&type_pdf");

  const books = [];
  const seen = new Set();
  for (const raw of merdeka) {
    const book = toBook(raw, "merdeka");
    if (!book || seen.has(book.id)) continue;
    seen.add(book.id);
    books.push(book);
  }
  for (const raw of k13) {
    const book = toBook(raw, "k13");
    if (!book || seen.has(book.id)) continue;
    seen.add(book.id);
    books.push(book);
  }

  books.sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade;
    const sa = subjectSortKey(a.subjectId);
    const sb = subjectSortKey(b.subjectId);
    if (sa !== sb) return sa - sb;
    if (a.curriculum !== b.curriculum) return a.curriculum.localeCompare(b.curriculum);
    if (a.role !== b.role) return a.role === "siswa" ? -1 : 1;
    return a.title.localeCompare(b.title, "id");
  });

  const subjectIds = [...new Set(books.map((b) => b.subjectId))];
  const subjects = subjectIds
    .sort((a, b) => {
      const d = subjectSortKey(a) - subjectSortKey(b);
      return d !== 0 ? d : a.localeCompare(b);
    })
    .map((id) => {
      const labels = labelFromSlug(id);
      return { id, labelEn: labels.en, labelId: labels.id };
    });

  const catalog = {
    scrapedAt: new Date().toISOString(),
    source: SIBI,
    api: API,
    grades: GRADES,
    subjects,
    books,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const out = join(OUT_DIR, "catalog.json");
  writeFileSync(out, `${JSON.stringify(catalog)}\n`);

  const byGrade = Object.fromEntries(
    GRADES.map((g) => [g, books.filter((b) => b.grade === g).length]),
  );
  const byCurr = {
    merdeka: books.filter((b) => b.curriculum === "merdeka").length,
    k13: books.filter((b) => b.curriculum === "k13").length,
  };
  console.log(
    `Wrote ${books.length} books · ${subjects.length} subjects · grades ${JSON.stringify(byGrade)} · ${JSON.stringify(byCurr)} → ${out}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
