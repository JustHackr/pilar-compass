"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OsnHtml } from "@/components/osn/OsnHtml";
import { useTkaMe } from "@/components/tka/TkaGate";
import { canAccessOsnLevel, paperById, type OsnQuestion } from "@/data/osn/bank";
import { tkaFetchInit } from "@/lib/tka/client";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function OsnPaperPage() {
  const { t, locale } = useLocale();
  const { me } = useTkaMe();
  const params = useParams<{ paperId: string }>();
  const paper = paperById(params.paperId);
  const [questions, setQuestions] = useState<OsnQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

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
  const paperId = paper.id;
  const paperTitle = paper.title;
  const q = questions?.[index];

  function go(next: number) {
    const merged = { ...answers };
    if (q && q.type === "pilgan" && choice !== null) merged[q.id] = choice;
    setAnswers(merged);
    const n = Math.max(0, Math.min((questions?.length ?? 1) - 1, next));
    const target = questions?.[n];
    setIndex(n);
    setChoice(target && merged[target.id] !== undefined ? merged[target.id] : null);
  }

  async function finish() {
    const merged = { ...answers };
    if (q && q.type === "pilgan" && choice !== null) merged[q.id] = choice;
    setAnswers(merged);
    setDone(true);
    await fetch(
      "/api/activity",
      tkaFetchInit({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "osn_paper",
          path: `/osn/paper/${paperId}`,
          detail: paperTitle.slice(0, 240),
        }),
      }),
    );
  }

  if (questions === null) {
    return <div className="page-wrap tka-page" aria-busy="true" />;
  }

  if (questions.length === 0) {
    return (
      <div className="page-wrap tka-page">
        <h1>{paper.title}</h1>
        <p className="lede">{t("osn.noQuestions")}</p>
        <a className="btn-primary" href={paper.sourceUrl} target="_blank" rel="noopener noreferrer">
          {t("osn.openSource")}
        </a>
        <Link className="btn-secondary" href={backHref}>
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
        <div className="tka-actions">
          <button className="btn-primary" type="button" onClick={() => setStarted(true)}>
            {t("osn.startPaper")}
          </button>
          <a className="btn-secondary" href={paper.sourceUrl} target="_blank" rel="noopener noreferrer">
            {t("osn.openSource")}
          </a>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("osn.finished")}</h1>
        <p className="lede">{t("osn.finishedLede")}</p>
        <ul className="tka-skill-list">
          {questions.map((item, i) => (
            <li key={item.id} className="tka-skill">
              <div>
                <h3>
                  {i + 1}. {item.type === "pilgan" ? t("osn.format.pilgan") : t("osn.format.essay")}
                </h3>
                {item.type === "pilgan" && answers[item.id] !== undefined ? (
                  <p>
                    {t("osn.yourAnswer")}: {String.fromCharCode(65 + answers[item.id])}
                  </p>
                ) : null}
              </div>
              {item.discussionUrl ? (
                <a
                  className="btn-secondary"
                  href={item.discussionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("osn.discussion")}
                </a>
              ) : null}
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

  return (
    <div className="page-wrap tka-page tka-lesson">
      <div className="tka-lesson-bar">
        <span>
          {index + 1} / {questions.length}
        </span>
        <span className="tka-source">{locale === "id" ? "Arsip OSN" : "OSN archive"}</span>
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
        {q.discussionUrl ? (
          <a className="btn-secondary" href={q.discussionUrl} target="_blank" rel="noopener noreferrer">
            {t("osn.discussion")}
          </a>
        ) : null}
        <button type="button" className="btn-primary" onClick={() => void finish()}>
          {t("osn.finish")}
        </button>
      </div>
    </div>
  );
}
