"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import universitiesData from "../../data/universities.json";
import type {
  Affordability,
  CalculatorInput,
  ScoreResult,
  SubjectScore,
  UniversityOption,
} from "@/types";
import { calculateMatch } from "@/lib/scoring";
import { ocrReportImage } from "@/lib/ocr/runOcr";
import { useLocale } from "@/lib/i18n/LocaleContext";

const universities = universitiesData.universities as UniversityOption[];

const DEFAULT_SUBJECTS: SubjectScore[] = [
  { name: "Matematika", score: 85 },
  { name: "Bahasa Inggris", score: 88 },
  { name: "IPA / Sains", score: 82 },
];

type OcrStatus = "idle" | "reading" | "ok" | "fail";

export function CalculatorView() {
  const { t, locale } = useLocale();
  const [subjects, setSubjects] = useState<SubjectScore[]>(DEFAULT_SUBJECTS);
  const [university, setUniversity] = useState("Institut Teknologi Bandung (ITB)");
  const [country, setCountry] = useState("Indonesia");
  const [region, setRegion] = useState<"indonesia" | "abroad">("indonesia");
  const [toefl, setToefl] = useState("");
  const [sat, setSat] = useState("");
  const [ielts, setIelts] = useState("");
  const [affordability, setAffordability] =
    useState<Affordability>("middle_class");
  const [age, setAge] = useState(17);
  const [intendedMajor, setIntendedMajor] = useState("Computer Science");
  const [competitionAwards, setCompetitionAwards] = useState(1);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState("");
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  const affordabilityOptions: { value: Affordability; label: string }[] = [
    { value: "can_afford", label: t("calc.afford.can_afford") },
    { value: "middle_class", label: t("calc.afford.middle_class") },
    { value: "need_scholarship", label: t("calc.afford.need_scholarship") },
    { value: "low_budget", label: t("calc.afford.low_budget") },
  ];

  const averagePreview = useMemo(() => {
    if (subjects.length === 0) return 0;
    return (
      subjects.reduce((a, s) => a + (Number.isFinite(s.score) ? s.score : 0), 0) /
      subjects.length
    );
  }, [subjects]);

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  // Refresh roadmap copy when language changes (same inputs).
  useEffect(() => {
    if (!result) return;
    const cleaned = subjects
      .map((s) => ({
        name: s.name.trim() || "Subject",
        score: Number(s.score),
      }))
      .filter((s) => Number.isFinite(s.score));
    if (cleaned.length === 0) return;
    setResult(
      calculateMatch(
        {
          subjects: cleaned,
          university: university.trim(),
          country: country.trim(),
          region,
          affordability,
          age,
          intendedMajor: intendedMajor.trim() || undefined,
          competitionAwards,
          toefl: toefl ? Number(toefl) : undefined,
          sat: sat ? Number(sat) : undefined,
          ielts: ielts ? Number(ielts) : undefined,
        },
        locale,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only retranslate on locale flip
  }, [locale]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function applyUniversity(name: string) {
    setUniversity(name);
    const hit = universities.find((u) => u.name === name);
    if (hit) {
      setCountry(hit.country);
      setRegion(hit.region);
    }
  }

  function loadDemoProfile() {
    setSubjects([
      { name: "Matematika", score: 91 },
      { name: "Bahasa Inggris", score: 89 },
      { name: "Fisika", score: 87 },
      { name: "Informatika", score: 93 },
    ]);
    setUniversity("Australian National University (ANU)");
    setCountry("Australia");
    setRegion("abroad");
    setIelts("6.5");
    setToefl("");
    setSat("");
    setAffordability("need_scholarship");
    setAge(17);
    setIntendedMajor("Computer Science");
    setCompetitionAwards(3);
    setResult(null);
    setError("");
    setOcrStatus("idle");
  }

  function updateSubject(i: number, patch: Partial<SubjectScore>) {
    setSubjects((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }

  function addSubject() {
    setSubjects((prev) => [...prev, { name: "", score: 80 }]);
  }

  function removeSubject(i: number) {
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onReportSelected(file: File | undefined) {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setOcrStatus("reading");
    setError("");
    try {
      const parsed = await ocrReportImage(file);
      if (parsed.ok && parsed.subjects.length > 0) {
        setSubjects(parsed.subjects);
        setOcrStatus("ok");
        setResult(null);
      } else {
        setOcrStatus("fail");
      }
    } catch {
      setOcrStatus("fail");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const cleaned = subjects
      .map((s) => ({
        name: s.name.trim() || "Subject",
        score: Number(s.score),
      }))
      .filter((s) => Number.isFinite(s.score));

    if (cleaned.length === 0) {
      setError(t("calc.error.subjects"));
      return;
    }
    if (cleaned.some((s) => s.score < 0 || s.score > 100)) {
      setError(t("calc.error.range"));
      return;
    }
    if (!university.trim() || !country.trim()) {
      setError(t("calc.error.uni"));
      return;
    }
    if (age < 10 || age > 25) {
      setError(t("calc.error.age"));
      return;
    }

    const input: CalculatorInput = {
      subjects: cleaned,
      university: university.trim(),
      country: country.trim(),
      region,
      affordability,
      age,
      intendedMajor: intendedMajor.trim() || undefined,
      competitionAwards,
      toefl: toefl ? Number(toefl) : undefined,
      sat: sat ? Number(sat) : undefined,
      ielts: ielts ? Number(ielts) : undefined,
    };

    setResult(calculateMatch(input, locale));
  }

  return (
    <div className="page-wrap">
      <header className="page-hero">
        <div className="page-hero-row">
          <div>
            <p className="eyebrow">{t("calc.eyebrow")}</p>
            <h1>{t("calc.title")}</h1>
            <p className="lede">{t("calc.lede")}</p>
          </div>
          <button type="button" className="btn-secondary" onClick={loadDemoProfile}>
            {t("calc.demo")}
          </button>
        </div>
      </header>

      <form className="calc-grid" onSubmit={onSubmit}>
        <section className="panel">
          <div className="panel-head">
            <h2>{t("calc.subjects")}</h2>
            <span className="avg-chip">
              {t("calc.avg", { avg: averagePreview.toFixed(1) })}
            </span>
          </div>

          <div className="ocr-box">
            <div className="ocr-row">
              <button
                type="button"
                className="btn-secondary"
                disabled={ocrStatus === "reading"}
                onClick={() => fileRef.current?.click()}
              >
                {ocrStatus === "reading" ? t("calc.ocr.reading") : t("calc.upload")}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => onReportSelected(e.target.files?.[0])}
              />
              <p className="ocr-hint">{t("calc.ocr.hint")}</p>
            </div>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="ocr-preview" />
            ) : null}
            {ocrStatus === "ok" ? (
              <p className="ocr-status ok">{t("calc.ocr.ok")}</p>
            ) : null}
            {ocrStatus === "fail" ? (
              <p className="ocr-status fail">{t("calc.ocr.fail")}</p>
            ) : null}
          </div>

          <div className="subject-list">
            {subjects.map((s, i) => (
              <div key={i} className="subject-row">
                <input
                  className="field-input"
                  placeholder={t("calc.subject")}
                  value={s.name}
                  onChange={(e) => updateSubject(i, { name: e.target.value })}
                  aria-label={`${t("calc.subject")} ${i + 1}`}
                />
                <input
                  className="field-input score-input"
                  type="number"
                  min={0}
                  max={100}
                  value={s.score}
                  onChange={(e) =>
                    updateSubject(i, { score: Number(e.target.value) })
                  }
                  aria-label={`Score ${i + 1}`}
                />
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => removeSubject(i)}
                  disabled={subjects.length <= 1}
                >
                  {t("calc.remove")}
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-secondary" onClick={addSubject}>
            {t("calc.addSubject")}
          </button>
        </section>

        <section className="panel">
          <h2>{t("calc.target")}</h2>
          <label className="field-label" htmlFor="uni">
            {t("calc.university")}
          </label>
          <input
            id="uni"
            className="field-input"
            list="uni-list"
            value={university}
            onChange={(e) => applyUniversity(e.target.value)}
            required
          />
          <datalist id="uni-list">
            {universities.map((u) => (
              <option key={u.name} value={u.name} />
            ))}
          </datalist>

          <label className="field-label" htmlFor="country">
            {t("calc.country")}
          </label>
          <input
            id="country"
            className="field-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />

          <fieldset className="radio-row">
            <legend className="field-label">{t("calc.region")}</legend>
            <label>
              <input
                type="radio"
                name="region"
                checked={region === "indonesia"}
                onChange={() => setRegion("indonesia")}
              />
              {t("calc.region.id")}
            </label>
            <label>
              <input
                type="radio"
                name="region"
                checked={region === "abroad"}
                onChange={() => setRegion("abroad")}
              />
              {t("calc.region.abroad")}
            </label>
          </fieldset>

          <label className="field-label" htmlFor="major">
            {t("calc.major")}
          </label>
          <input
            id="major"
            className="field-input"
            value={intendedMajor}
            onChange={(e) => setIntendedMajor(e.target.value)}
          />
        </section>

        <section className="panel">
          <h2>{t("calc.optional")}</h2>
          <div className="triple">
            <div>
              <label className="field-label" htmlFor="toefl">
                TOEFL
              </label>
              <input
                id="toefl"
                className="field-input"
                type="number"
                min={0}
                max={120}
                value={toefl}
                onChange={(e) => setToefl(e.target.value)}
                placeholder="iBT"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="sat">
                SAT
              </label>
              <input
                id="sat"
                className="field-input"
                type="number"
                min={400}
                max={1600}
                value={sat}
                onChange={(e) => setSat(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="ielts">
                IELTS
              </label>
              <input
                id="ielts"
                className="field-input"
                type="number"
                min={0}
                max={9}
                step={0.5}
                value={ielts}
                onChange={(e) => setIelts(e.target.value)}
              />
            </div>
          </div>

          <label className="field-label" htmlFor="afford">
            {t("calc.affordability")}
          </label>
          <select
            id="afford"
            className="field-input"
            value={affordability}
            onChange={(e) => setAffordability(e.target.value as Affordability)}
          >
            {affordabilityOptions.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>

          <div className="double">
            <div>
              <label className="field-label" htmlFor="age">
                {t("calc.age")}
              </label>
              <input
                id="age"
                className="field-input"
                type="number"
                min={10}
                max={25}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="awards">
                {t("calc.awards")}
              </label>
              <input
                id="awards"
                className="field-input"
                type="number"
                min={0}
                max={20}
                value={competitionAwards}
                onChange={(e) => setCompetitionAwards(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          {error ? <p className="field-error">{error}</p> : null}
          <button type="submit" className="btn-primary">
            {t("calc.submit")}
          </button>
        </div>
      </form>

      {result ? (
        <section
          ref={resultRef}
          className="result-panel animate-rise"
          aria-live="polite"
        >
          <div className="match-hero">
            <p className="eyebrow">{t("calc.result.eyebrow")}</p>
            <p className="match-percent">{result.matchPercent}%</p>
            <p>
              {t("calc.result.avg", {
                avg: result.averageScore,
                uni: university,
              })}
            </p>
          </div>

          <h2>{t("calc.breakdown")}</h2>
          <ul className="breakdown">
            {(
              Object.keys(result.breakdown) as Array<keyof typeof result.breakdown>
            ).map((k) => (
              <li key={k}>
                <div className="breakdown-row">
                  <span>{t(`factor.${k}`)}</span>
                  <span>
                    {Math.round(result.breakdown[k])} ·{" "}
                    {t("calc.weight", {
                      pct: Math.round(result.weights[k] * 100),
                    })}
                  </span>
                </div>
                <div className="bar-track" aria-hidden>
                  <div
                    className="bar-fill"
                    style={{ width: `${Math.round(result.breakdown[k])}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <h2>{t("calc.roadmap")}</h2>
          <ol className="roadmap">
            {result.roadmap.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <p className="disclaimer">{t("calc.disclaimer")}</p>
        </section>
      ) : null}
    </div>
  );
}
