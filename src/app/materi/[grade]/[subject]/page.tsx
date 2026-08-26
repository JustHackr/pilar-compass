"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  booksForSubject,
  canAccessMateriGrade,
  isMateriGrade,
  subjectByIdLookup,
  type MateriCurriculum,
  type MateriGrade,
  type MateriRole,
  type MateriStream,
} from "@/data/materi/bank";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTkaMe } from "@/components/tka/TkaGate";

const CURRICULA: Array<MateriCurriculum | "all"> = ["all", "merdeka", "k13"];
const ROLES: Array<MateriRole | "all"> = ["all", "siswa", "guru"];
const STREAMS: Array<MateriStream | "all"> = ["all", "umum", "smk"];

export default function MateriSubjectPage() {
  const { t, locale } = useLocale();
  const params = useParams<{ grade: string; subject: string }>();
  const { me } = useTkaMe();
  const gradeRaw = params.grade;
  const subjectId = params.subject;
  const [curriculum, setCurriculum] = useState<MateriCurriculum | "all">("all");
  const [role, setRole] = useState<MateriRole | "all">("all");
  const [stream, setStream] = useState<MateriStream | "all">("all");

  const grade = isMateriGrade(gradeRaw) ? (Number(gradeRaw) as MateriGrade) : null;
  const allBooks = useMemo(
    () => (grade ? booksForSubject(grade, subjectId) : []),
    [grade, subjectId],
  );
  const books = useMemo(
    () => (grade ? booksForSubject(grade, subjectId, { curriculum, role, stream }) : []),
    [grade, subjectId, curriculum, role, stream],
  );

  if (!grade) return null;
  const subject = subjectByIdLookup(subjectId);
  const allowed =
    Boolean(me.profile?.tkaTrack) && canAccessMateriGrade(me.profile!.tkaTrack, grade);

  if (!subject || !allowed) {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("materi.locked")}</h1>
        <Link className="btn-secondary" href="/materi">
          {t("materi.back")}
        </Link>
      </div>
    );
  }

  const showStream = allBooks.some((b) => b.stream === "smk");

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("materi.grade", { n: grade })}</p>
      <h1>{locale === "id" ? subject.labelId : subject.labelEn}</h1>
      <p className="lede">{t("materi.subjectLede")}</p>

      <div className="osn-filters">
        <label>
          {t("materi.curriculum")}
          <select
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value as MateriCurriculum | "all")}
          >
            {CURRICULA.map((c) => (
              <option key={c} value={c}>
                {t(`materi.curr.${c}`)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("materi.role")}
          <select value={role} onChange={(e) => setRole(e.target.value as MateriRole | "all")}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`materi.role.${r}`)}
              </option>
            ))}
          </select>
        </label>
        {showStream ? (
          <label>
            {t("materi.stream")}
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value as MateriStream | "all")}
            >
              {STREAMS.map((s) => (
                <option key={s} value={s}>
                  {t(`materi.stream.${s}`)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <h2 className="tka-section">{t("materi.books")}</h2>
      {books.length === 0 ? (
        <p>{t("materi.empty")}</p>
      ) : (
        <div className="tka-grade-grid">
          {books.map((b) => (
            <article key={b.id} className="tka-card materi-book-card">
              {b.coverUrl ? (
                // Official SIBI cover; remote hosts are not in next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="materi-cover" src={b.coverUrl} alt="" />
              ) : null}
              <p className="eyebrow">
                {t(`materi.curr.${b.curriculum}`)} · {t(`materi.role.${b.role}`)}
                {b.year ? ` · ${b.year}` : ""}
              </p>
              <h3>{b.title}</h3>
              {b.writer ? <p className="materi-writer">{b.writer}</p> : null}
              <div className="tka-actions">
                <a
                  className="btn-primary"
                  href={b.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("materi.download")}
                </a>
                <a
                  className="btn-secondary"
                  href={b.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("materi.openSibi")}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      <Link className="btn-secondary" href={`/materi/${grade}`}>
        {t("materi.backGrade")}
      </Link>
    </div>
  );
}
