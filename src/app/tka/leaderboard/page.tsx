"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

type Row = {
  rank: number;
  displayName: string;
  kelas: string;
  score: number;
  streakCount: number;
};

export default function TkaLeaderboardPage() {
  const { t } = useLocale();
  const [scope, setScope] = useState<"school" | "class">("school");
  const [rows, setRows] = useState<Row[]>([]);
  const [kelas, setKelas] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/tka/leaderboard?scope=${scope}`);
      if (!res.ok) return;
      const data = (await res.json()) as { rows: Row[]; kelas: string | null };
      setRows(data.rows);
      setKelas(data.kelas);
    })();
  }, [scope]);

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
      <h1>{t("tka.leaderboard")}</h1>
      <div className="tka-actions">
        <button
          type="button"
          className={scope === "school" ? "btn-primary" : "btn-secondary"}
          onClick={() => setScope("school")}
        >
          {t("tka.board.school")}
        </button>
        <button
          type="button"
          className={scope === "class" ? "btn-primary" : "btn-secondary"}
          onClick={() => setScope("class")}
        >
          {t("tka.board.class")}
          {kelas ? ` · ${kelas}` : ""}
        </button>
      </div>
      {scope === "school" ? (
        <p className="tka-hint-line">{t("tka.board.top10")}</p>
      ) : null}
      {rows.length === 0 ? (
        <p className="lede">{t("tka.board.empty")}</p>
      ) : (
        <ol className="tka-board">
          {rows.map((r) => (
            <li
              key={`${r.rank}-${r.displayName}`}
              className={r.rank <= 10 && scope === "school" ? "tka-top" : ""}
            >
              <span className="tka-rank">{r.rank}</span>
              <span>
                <strong>{r.displayName}</strong>
                <small> {r.kelas}</small>
              </span>
              <span>{r.score}</span>
              <span>🔥 {r.streakCount}</span>
            </li>
          ))}
        </ol>
      )}
      <Link className="btn-secondary" href="/tka">
        {t("tka.backSkills")}
      </Link>
    </div>
  );
}
