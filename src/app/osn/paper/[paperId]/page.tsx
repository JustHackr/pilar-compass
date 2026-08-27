"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OsnHtml } from "@/components/osn/OsnHtml";
import { useTkaMe } from "@/components/tka/TkaGate";
import { canAccessOsnLevel, paperById, type OsnQuestion } from "@/data/osn/bank";
import { tkaFetchInit } from "@/lib/tka/client";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { OsnPaperScore } from "@/lib/osn/scoring";

export default function OsnPaperPage() {
  const { t } = useLocale();
  const { me, reload } = useTkaMe();
  const params = useParams<{ paperId: string }>();
  const paper = paperById(params.paperId);
  const [questions, setQuestions] = useState<OsnQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [started, setStarted] = useState(false);
  const [startAt] = useState(() => Date.now());
  const [result, setResult] = useState<OsnPaperScore | null>(null);

  const allowed =
    Boolean(paper) &&
    Boolean(me.profile?.tkaTrack) &&
    canAccessOsnLevel(me.profile!.tkaTrack, paper!.level);

  useEffect(() => {
    if (!paper || !allowed) return;
    let cancelled = false;
    void fetch(`/osn/questions/${paper.id}.json`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: OsnQuestion[]) => {
        if (!cancelled) setQuestions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setQuestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [allowed, paper]);

  if (!paper || !allowed) {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("osn.locked")}</h1>
        <Link className="btn-secondary" href="/osn">
          {t("osn.back")}
        </Link>
      </div>
    );
  }

  const backHref = `/osn/${paper.level}/${paper.subjectId}`;
  const q = questions?.[index];

  function mergedAnswers() {
    const next = { ...answers };
    if (q && q.type === "pilgan" && choice !== null) next[q.id] = choice;
    return next;
  }

  function go(next: number) {
    const merged = mergedAnswers();
    setAnswers(merged);
    const n = Math.max(0, Math.min((questions?.length ?? 1) - 1, next));
    const target = questions?.[n];
    setIndex(n);
    setChoice(target && merged[target.id] !== undefined ? merged[target.id] : null);
  }

  async function submit() {
    const merged = mergedAnswers();
    setAnswers(merged);
    const res = await fetch(
      "/api/osn/paper/submit",
      tkaFetchInit({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId: paper?.id,
          durationSeconds: Math.round((Date.now() - startAt) / 1000),
          answers: merged,
        }),
      }),
    );
    const data = await res.json();
    if (!res.ok) return;
    setResult({
      hasKeys: Boolean(data.hasKeys),
      correct: data.correct,
      total: data.total,
      scorePercent: data.attempt.scorePercent,
      review: data.review,
    });
    await reload();
  }

  if (questions === null) {
    return <div className="page-wrap tka-page" aria-busy="true" />;
  }

  if (questions.length === 0) {
    return (
      <div className="page-wrap tka-page">
        <h1>{paper.title}</h1>
        <p className="lede">{t("osn.noQuestions")}</p>
        <Link className="btn-primary" href={backHref}>
          {t("osn.back")}
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="page-wrap tka-page">
        <p className="eyebrow">
          {paper.year ?? "—"} · {t(`osn.stage.${paper.stage}`)}
        </p>
        <h1>{paper.title}</h1>
        <p className="lede">
          {t("osn.questionCount", { n: questions.length })} · {t(`osn.format.${paper.format}`)}
        </p>
        <p className="tka-source">{t("osn.practiceNote")}</p>
        <button className="btn-primary" type="button" onClick={() => setStarted(true)}>
          {t("osn.startPaper")}
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="page-wrap tka-page">
        <h1>
          {t(result.hasKeys ? "osn.scoreKeyed" : "osn.scoreAnswered", {
            score: result.scorePercent,
            correct: result.correct,
            total: result.total,
          })}
        </h1>
        <p className="lede">{t("osn.finishedLede")}</p>
        <h2 className="tka-section">{t("osn.review")}</h2>
        <ul className="tka-skill-list">
          {result.review.map((item) => (
            <li key={item.id} className="tka-skill">
              <div>
                <h3>
                  {item.number}.{" "}
                  {item.kind === "essay"
                    ? t("osn.essayReview")
                    : result.hasKeys
                      ? item.correct
                        ? "✓"
                        : "✗"
                      : t("osn.format.pilgan")}
                </h3>
                <p>
                  {item.kind === "essay"
                    ? t("osn.essayHint")
                    : item.choice !== null
                      ? `${t("osn.yourAnswer")}: ${String.fromCharCode(65 + item.choice)}`
                      : t("osn.skipped")}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Link className="btn-primary" href={backHref}>
          {t("osn.back")}
        </Link>
      </div>
    );
  }

  if (!q) return null;
  const last = index === questions.length - 1;

  return (
    <div className="page-wrap tka-page tka-lesson">
      <div className="tka-lesson-bar">
        <span>
          {index + 1} / {questions.length}
        </span>
        <span className="tka-source">{t("osn.archive")}</span>
      </div>
      <p className="eyebrow">
        {t("osn.soal")} {q.number}
      </p>
      <OsnHtml html={q.stemHtml} className="tka-stem" />
      {q.type === "pilgan" ? (
        <ul className="tka-choices">
          {q.choices.map((c, i) => (
            <li key={i}>
              <button
                type="button"
                className={choice === i ? "tka-choice tka-choice-on" : "tka-choice"}
                onClick={() => setChoice(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                <OsnHtml html={c} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tka-source">{t("osn.essayHint")}</p>
      )}
      <div className="tka-actions">
        <button
          type="button"
          className="btn-secondary"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          {t("osn.prev")}
        </button>
        {!last ? (
          <button className="btn-primary" type="button" onClick={() => go(index + 1)}>
            {t("osn.next")}
          </button>
        ) : null}
        <button
          className={last ? "btn-primary" : "btn-secondary"}
          type="button"
          onClick={() => void submit()}
        >
          {t("osn.submit")}
        </button>
      </div>
    </div>
  );
}
