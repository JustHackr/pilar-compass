"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  canAccessOsnLevel,
  isOsnLevel,
  papersForSubject,
  subjectByIds,
  yearsForSubject,
  type OsnFormat,
  type OsnStage,
} from "@/data/osn/bank";
import { OSN_LEVELS } from "@/data/osn/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTkaMe } from "@/components/tka/TkaGate";

const STAGES: Array<OsnStage | "all"> = ["all", "osk", "osp", "osn", "other"];
const FORMATS: Array<OsnFormat | "all"> = ["all", "pilgan", "essay", "mixed"];

export default function OsnSubjectPage() {
  const { t, locale } = useLocale();
  const params = useParams<{ level: string; subject: string }>();
  const { me } = useTkaMe();
  const level = params.level;
  const subjectId = params.subject;
  const [year, setYear] = useState<number | "all">("all");
  const [stage, setStage] = useState<OsnStage | "all">("all");
  const [format, setFormat] = useState<OsnFormat | "all">("all");

  const years = useMemo(
    () => (isOsnLevel(level) ? yearsForSubject(level, subjectId) : []),
    [level, subjectId],
  );
  const papers = useMemo(
    () =>
      isOsnLevel(level)
        ? papersForSubject(level, subjectId, { year, stage, format })
        : [],
    [level, subjectId, year, stage, format],
  );

  if (!isOsnLevel(level)) return null;
  const subject = subjectByIds(level, subjectId);
  const meta = OSN_LEVELS.find((l) => l.id === level);
  const allowed =
    Boolean(me.profile?.tkaTrack) && canAccessOsnLevel(me.profile!.tkaTrack, level);

  if (!subject || !meta || !allowed) {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("osn.locked")}</h1>
        <Link className="btn-secondary" href="/osn">
          {t("osn.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{locale === "id" ? meta.labelId : meta.labelEn}</p>
      <h1>{locale === "id" ? subject.labelId : subject.labelEn}</h1>
      <p className="lede">{t("osn.courseLede")}</p>

      <div className="osn-filters">
        <label>
          {t("osn.year")}
          <select
            value={year === "all" ? "all" : String(year)}
            onChange={(e) =>
              setYear(e.target.value === "all" ? "all" : Number(e.target.value))
            }
          >
            <option value="all">{t("osn.allYears")}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("osn.stage")}
          <select value={stage} onChange={(e) => setStage(e.target.value as OsnStage | "all")}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {t(`osn.stage.${s}`)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("osn.format")}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OsnFormat | "all")}
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {t(`osn.format.${f}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h2 className="tka-section">{t("osn.papers")}</h2>
      {papers.length === 0 ? (
        <p>{t("osn.empty")}</p>
      ) : (
        <div className="tka-grade-grid">
          {papers.map((p) => (
            <div key={p.id} className="tka-card">
              <p className="eyebrow">
                {p.year ?? "—"} · {t(`osn.stage.${p.stage}`)} · {t(`osn.format.${p.format}`)}
              </p>
              <h3>{p.title}</h3>
              <p>{t("osn.questionCount", { n: p.questionCount })}</p>
              <div className="tka-actions">
                <Link className="btn-primary" href={`/osn/paper/${p.id}`}>
                  {t("osn.startPaper")}
                </Link>
                <a
                  className="btn-secondary"
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("osn.openSource")}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link className="btn-secondary" href={`/osn/${level}`}>
        {t("osn.back")}
      </Link>
    </div>
  );
}
