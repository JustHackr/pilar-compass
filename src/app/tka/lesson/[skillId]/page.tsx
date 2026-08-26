"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { questionsForSubject, skillById } from "@/data/tka/bank";
import { tkaFetchInit } from "@/lib/tka/client";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  enqueueRedemption,
  nextOutcomeAfterCheck,
  pickLessonItems,
} from "@/lib/tka/lessonEngine";
import {
  gradeItem,
  isPg,
  xpForOutcome,
  XP_LESSON_BONUS,
  type ItemOutcome,
  type LessonCheck,
  type PgkAnswer,
  type TkaQuestion,
} from "@/lib/tka/scoring";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function TkaLessonPage() {
  const { t, locale } = useLocale();
  const { reload } = useTkaMe();
  const params = useParams<{ skillId: string }>();
  const skill = skillById(params.skillId);

  const items = useMemo(() => {
    if (!skill) return [];
    return pickLessonItems(
      skill.id,
      questionsForSubject(skill.subjectId, skill.track ?? "12"),
    );
  }, [skill]);

  const byId = useMemo(() => {
    const m = new Map<string, TkaQuestion>();
    for (const q of items) m.set(q.id, q);
    return m;
  }, [items]);

  const [queue, setQueue] = useState<string[]>(() => items.map((q) => q.id));
  const [misses, setMisses] = useState<Record<string, number>>({});
  const [outcomes, setOutcomes] = useState<Record<string, ItemOutcome>>({});
  const outcomesRef = useRef(outcomes);
  const xpRef = useRef(0);
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const [xp, setXp] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [pgk, setPgk] = useState<PgkAnswer>({});
  const [phase, setPhase] = useState<"ask" | "feedback" | "done">("ask");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "revealed" | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  const currentId = queue[0];
  const question = currentId ? byId.get(currentId) : undefined;

  function check(): LessonCheck | null {
    if (!question) return null;
    if (isPg(question)) {
      if (choice === null) return null;
      return { kind: "pg", choice };
    }
    if (question.statements.some((s) => pgk[s.id] === undefined)) return null;
    return { kind: "pgk", answers: pgk };
  }

  function onCheck() {
    if (!question) return;
    const payload = check();
    if (!payload) return;
    const ok = gradeItem(question, payload);
    const before = misses[question.id] ?? 0;
    const result = nextOutcomeAfterCheck(ok, before);
    if (result.enqueue) {
      setHints((h) => ({ ...h, [question.id]: true }));
      setMisses((m) => ({ ...m, [question.id]: before + 1 }));
      setFeedback("wrong");
    } else if (result.outcome) {
      const gained = xpForOutcome(result.outcome);
      const nextXp = xpRef.current + gained;
      xpRef.current = nextXp;
      setXp(nextXp);
      const nextOut = { ...outcomesRef.current, [question.id]: result.outcome };
      outcomesRef.current = nextOut;
      setOutcomes(nextOut);
      setFeedback(result.reveal ? "revealed" : "correct");
      if (result.reveal) setMisses((m) => ({ ...m, [question.id]: before + 1 }));
    }
    setPhase("feedback");
  }

  async function onNext() {
    if (!question) return;
    const wasWrong = feedback === "wrong";
    let nextQueue: string[];
    if (wasWrong) {
      nextQueue = enqueueRedemption(queue.slice(1), question.id);
    } else {
      nextQueue = queue.slice(1);
    }
    setQueue(nextQueue);
    setChoice(null);
    setPgk({});
    setFeedback(null);
    if (nextQueue.length === 0) {
      setSaving(true);
      await fetch(
        "/api/tka/lesson/complete",
        tkaFetchInit({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillId: skill?.id,
            xp: xpRef.current + XP_LESSON_BONUS,
            outcomes: outcomesRef.current,
          }),
        }),
      );
      await reload();
      setSaving(false);
      setPhase("done");
      return;
    }
    setPhase("ask");
  }

  if (!skill || items.length === 0) {
    return (
      <div className="page-wrap tka-page">
        <p>{t("tka.lockedSubject")}</p>
        <Link href="/tka">{t("tka.backSkills")}</Link>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("tka.lessonDone")}</h1>
        <p className="lede">XP +{xp + XP_LESSON_BONUS}</p>
        <div className="tka-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            {t("tka.another")}
          </button>
          <Link className="btn-secondary" href={`/tka/grade/${skill.track ?? "12"}/${skill.subjectId}`}>
            {t("tka.backSkills")}
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="page-wrap tka-page tka-lesson">
      <div className="tka-lesson-bar">
        <span>
          {t("tka.progress", { n: queue.length })}
        </span>
        <span>XP {xp}</span>
      </div>
      <p className="eyebrow">
        {locale === "id" ? skill.titleId : skill.titleEn}
      </p>
      <details className="tka-material">
        <summary>{t("tka.material")}</summary>
        <p>{locale === "id" ? skill.materialId : skill.materialEn}</p>
      </details>
      <p className="tka-stem">{question.stem}</p>
      {question.source ? (
        <p className="tka-source">
          {t(
            question.source === "official"
              ? "tka.source.official"
              : "tka.source.latihan",
          )}
        </p>
      ) : null}

      {isPg(question) ? (
        <ul className="tka-choices">
          {question.choices.map((c, i) => (
            <li key={i}>
              <button
                type="button"
                className={
                  choice === i ? "tka-choice tka-choice-on" : "tka-choice"
                }
                onClick={() => phase === "ask" && setChoice(i)}
                disabled={phase !== "ask"}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {c}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="tka-pgk">
          {question.statements.map((s) => (
            <li key={s.id}>
              <p>
                <strong>{s.id}.</strong> {s.text}
              </p>
              <div className="tka-actions">
                <button
                  type="button"
                  className={
                    pgk[s.id] === true ? "btn-primary" : "btn-secondary"
                  }
                  disabled={phase !== "ask"}
                  onClick={() => setPgk((p) => ({ ...p, [s.id]: true }))}
                >
                  {t("tka.true")}
                </button>
                <button
                  type="button"
                  className={
                    pgk[s.id] === false ? "btn-primary" : "btn-secondary"
                  }
                  disabled={phase !== "ask"}
                  onClick={() => setPgk((p) => ({ ...p, [s.id]: false }))}
                >
                  {t("tka.false")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {hints[question.id] ? (
        <aside className="tka-hint-box">
          <strong>{t("tka.hint")}</strong>
          <p>{question.hint}</p>
        </aside>
      ) : null}

      {feedback === "revealed" ? (
        <aside className="tka-hint-box">
          <strong>{t("tka.revealed")}</strong>
          <p>{question.explanation}</p>
        </aside>
      ) : null}

      {feedback === "correct" ? <p className="tka-ok">{t("tka.correct")}</p> : null}
      {feedback === "wrong" ? <p className="field-error">{t("tka.wrong")}</p> : null}

      {phase === "ask" ? (
        <button className="btn-primary" type="button" onClick={onCheck}>
          {t("tka.check")}
        </button>
      ) : (
        <button
          className="btn-primary"
          type="button"
          onClick={() => void onNext()}
          disabled={saving}
        >
          {t("tka.next")}
        </button>
      )}
    </div>
  );
}
