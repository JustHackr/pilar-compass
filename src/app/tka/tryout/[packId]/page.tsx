"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { questionById } from "@/data/tka/bank";
import { tryoutById } from "@/data/tka/tryouts";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { isPg, type LessonCheck, type PgkAnswer } from "@/lib/tka/scoring";
import { useTkaMe } from "@/components/tka/TkaGate";

type Review = {
  id: string;
  skillId: string;
  correct: boolean;
  explanation: string;
};

export default function TkaTryoutPage() {
  const { t, locale } = useLocale();
  const { reload } = useTkaMe();
  const params = useParams<{ packId: string }>();
  const pack = tryoutById(params.packId);
  const questions = useMemo(
    () =>
      (pack?.questionIds ?? [])
        .map(questionById)
        .filter((q): q is NonNullable<typeof q> => Boolean(q)),
    [pack],
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, LessonCheck>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [timed, setTimed] = useState(false);
  const [started, setStarted] = useState(false);
  const [startAt] = useState(() => Date.now());
  const [result, setResult] = useState<{
    scorePercent: number;
    correct: number;
    total: number;
    review: Review[];
  } | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [pgk, setPgk] = useState<PgkAnswer>({});

  const q = questions[index];

  function storeCurrent() {
    if (!q) return;
    if (isPg(q) && choice !== null) {
      setAnswers((a) => ({ ...a, [q.id]: { kind: "pg", choice } }));
    } else if (!isPg(q) && q.statements.every((s) => pgk[s.id] !== undefined)) {
      setAnswers((a) => ({ ...a, [q.id]: { kind: "pgk", answers: pgk } }));
    }
  }

  function go(next: number) {
    storeCurrent();
    const n = Math.max(0, Math.min(questions.length - 1, next));
    const target = questions[n];
    const prev = answers[target.id];
    setIndex(n);
    if (prev?.kind === "pg") {
      setChoice(prev.choice);
      setPgk({});
    } else if (prev?.kind === "pgk") {
      setChoice(null);
      setPgk(prev.answers);
    } else {
      setChoice(null);
      setPgk({});
    }
  }

  async function submit() {
    storeCurrent();
    const merged = { ...answers };
    if (q && isPg(q) && choice !== null) {
      merged[q.id] = { kind: "pg", choice };
    } else if (q && !isPg(q) && q.statements.every((s) => pgk[s.id] !== undefined)) {
      merged[q.id] = { kind: "pgk", answers: pgk };
    }
    const res = await fetch("/api/tka/tryout/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packId: pack?.id,
        durationSeconds: Math.round((Date.now() - startAt) / 1000),
        answers: merged,
      }),
    });
    const data = await res.json();
    if (!res.ok) return;
    setResult({
      scorePercent: data.attempt.scorePercent,
      correct: data.attempt.correct,
      total: data.attempt.total,
      review: data.review,
    });
    await reload();
  }

  if (!pack || pack.comingSoon || questions.length === 0) {
    return (
      <div className="page-wrap tka-page">
        <p>{t("tka.comingSoon")}</p>
        <Link href={`/tka/grade/${pack?.track ?? "12"}/${pack?.subjectId ?? "kimia"}`}>{t("tka.backSkills")}</Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="page-wrap tka-page">
        <h1>{locale === "id" ? pack.titleId : pack.titleEn}</h1>
        <p className="lede">
          {questions.length} soal ·{" "}
          {pack.kind === "official"
            ? t("tka.official")
            : pack.kind === "latihan"
              ? t("tka.latihan")
              : t("tka.prediction")}
        </p>
        <label className="tka-check">
          <input
            type="checkbox"
            checked={timed}
            onChange={(e) => setTimed(e.target.checked)}
          />
          {timed ? t("tka.timed") : t("tka.untimed")}
        </label>
        <button className="btn-primary" type="button" onClick={() => setStarted(true)}>
          {t("tka.startTryout")}
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="page-wrap tka-page">
        <h1>
          {t("tka.tryoutScore", {
            score: result.scorePercent,
            correct: result.correct,
            total: result.total,
          })}
        </h1>
        <h2 className="tka-section">{t("tka.review")}</h2>
        <ul className="tka-skill-list">
          {result.review.map((r, i) => (
            <li key={r.id} className="tka-skill">
              <div>
                <h3>
                  {i + 1}. {r.correct ? "✓" : "✗"}
                </h3>
                <p>{r.explanation}</p>
              </div>
              <Link className="btn-secondary" href={`/tka/lesson/${r.skillId}`}>
                {t("tka.lesson")}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="btn-primary" href={`/tka/grade/${pack.track}/${pack.subjectId}`}>
          {t("tka.backSkills")}
        </Link>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="page-wrap tka-page tka-lesson">
      <div className="tka-lesson-bar">
        <span>
          {index + 1} / {questions.length}
          {timed ? " · 45 min" : ""}
        </span>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
        >
          {t("tka.flag")} {flags[q.id] ? "★" : ""}
        </button>
      </div>
      <p className="tka-stem">{q.stem}</p>
      {isPg(q) ? (
        <ul className="tka-choices">
          {q.choices.map((c, i) => (
            <li key={i}>
              <button
                type="button"
                className={choice === i ? "tka-choice tka-choice-on" : "tka-choice"}
                onClick={() => setChoice(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {c}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="tka-pgk">
          {q.statements.map((s) => (
            <li key={s.id}>
              <p>
                <strong>{s.id}.</strong> {s.text}
              </p>
              <div className="tka-actions">
                <button
                  type="button"
                  className={pgk[s.id] === true ? "btn-primary" : "btn-secondary"}
                  onClick={() => setPgk((p) => ({ ...p, [s.id]: true }))}
                >
                  {t("tka.true")}
                </button>
                <button
                  type="button"
                  className={pgk[s.id] === false ? "btn-primary" : "btn-secondary"}
                  onClick={() => setPgk((p) => ({ ...p, [s.id]: false }))}
                >
                  {t("tka.false")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="tka-actions">
        <button
          type="button"
          className="btn-secondary"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          ←
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={index === questions.length - 1}
          onClick={() => go(index + 1)}
        >
          →
        </button>
        <button type="button" className="btn-primary" onClick={() => void submit()}>
          {t("tka.submitTryout")}
        </button>
      </div>
    </div>
  );
}
