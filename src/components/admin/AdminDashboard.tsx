"use client";

import { useCallback, useEffect, useState } from "react";
import { tkaFetchInit } from "@/lib/tka/client";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { AdminOverview } from "@/lib/tka/admin";

function when(iso: string | null | undefined, locale: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(locale === "id" ? "id-ID" : "en-GB", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function eventLabel(
  t: (key: string, vars?: Record<string, string | number>) => string,
  type: string,
): string {
  const key = `admin.event.${type}`;
  const label = t(key);
  return label === key ? type.replace(/_/g, " ") : label;
}

export function AdminDashboard() {
  const { t, locale } = useLocale();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await fetch("/api/admin/overview", tkaFetchInit());
    setBusy(false);
    if (res.status === 401 || res.status === 403) {
      setError(t("admin.forbidden.body"));
      return;
    }
    if (!res.ok) {
      setError(t("admin.loadError"));
      return;
    }
    setError("");
    setData((await res.json()) as AdminOverview);
  }, [t]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(id);
  }, [load]);

  if (error && !data) {
    return (
      <div className="page-wrap admin-page">
        <p className="field-error">{error}</p>
      </div>
    );
  }

  if (!data) {
    return <div className="page-wrap admin-page" aria-busy="true" />;
  }

  const maxDay = Math.max(1, ...data.last14.map((d) => d.lessons + d.tryouts + d.xp));
  const maxPath = Math.max(1, ...data.paths.map((p) => p.count));
  const bands = [
    { key: "6" as const, title: t("tka.track.6") },
    { key: "9" as const, title: t("tka.track.9") },
    { key: "12" as const, title: t("tka.track.12") },
  ];

  return (
    <div className="page-wrap admin-page">
      <p className="eyebrow">{t("admin.eyebrow")}</p>
      <div className="admin-head">
        <div>
          <h1>{t("admin.title")}</h1>
          <p className="lede">{t("admin.lede")}</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => void load()}
          disabled={busy}
        >
          {t("admin.refresh")}
        </button>
      </div>
      <p className="admin-meta">
        {t("admin.generated", { when: when(data.generatedAt, locale), today: data.today })}
      </p>
      <p className="admin-note" role="status">
        {t("admin.demoStore")}
      </p>

      <section aria-labelledby="admin-kpis">
        <h2 id="admin-kpis">{t("admin.kpis")}</h2>
        <div className="tka-stats admin-kpis">
          {(
            [
              ["accounts", data.kpis.accounts],
              ["onboarded", data.kpis.onboarded],
              ["activeToday", data.kpis.activeToday],
              ["lessonsToday", data.kpis.lessonsToday],
              ["tryoutsToday", data.kpis.tryoutsToday],
              ["xpToday", data.kpis.xpToday],
              ["lessonsAll", data.kpis.lessonsAll],
              ["tryoutsAll", data.kpis.tryoutsAll],
              ["pageViews", data.kpis.pageViews],
              ["events", data.kpis.events],
              ["classesLive", data.kpis.classesWithStudents],
              ["unmatched", data.kpis.unmatched],
            ] as const
          ).map(([key, value]) => (
            <div className="tka-stat" key={key}>
              <span>{t(`admin.kpi.${key}`)}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="admin-trend">
        <h2 id="admin-trend">{t("admin.trend")}</h2>
        <ol className="admin-trend">
          {data.last14.map((day) => (
            <li key={day.date}>
              <span className="admin-trend-date">{day.date.slice(5)}</span>
              <span
                className="admin-bar"
                title={`${day.lessons} · ${day.tryouts} · ${day.xp} XP`}
              >
                <span
                  style={{ width: `${Math.round(((day.lessons + day.tryouts + day.xp) / maxDay) * 100)}%` }}
                />
              </span>
              <span className="admin-trend-nums">
                {t("admin.trend.row", {
                  lessons: day.lessons,
                  tryouts: day.tryouts,
                  xp: day.xp,
                  active: day.activeStudents,
                })}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="admin-split">
        <section aria-labelledby="admin-events">
          <h2 id="admin-events">{t("admin.eventTypes")}</h2>
          <ul className="admin-count-list">
            {data.eventTypes.length === 0 ? (
              <li>{t("admin.empty")}</li>
            ) : (
              data.eventTypes.map((row) => (
                <li key={row.type}>
                  <span>{eventLabel(t, row.type)}</span>
                  <strong>{row.count}</strong>
                </li>
              ))
            )}
          </ul>
        </section>
        <section aria-labelledby="admin-paths">
          <h2 id="admin-paths">{t("admin.paths")}</h2>
          <ul className="admin-count-list">
            {data.paths.length === 0 ? (
              <li>{t("admin.empty")}</li>
            ) : (
              data.paths.map((row) => (
                <li key={row.path}>
                  <span>
                    <code>{row.path}</code>
                  </span>
                  <span
                    className="admin-bar admin-bar-inline"
                    aria-hidden
                  >
                    <span style={{ width: `${Math.round((row.count / maxPath) * 100)}%` }} />
                  </span>
                  <strong>{row.count}</strong>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      {bands.map((band) => (
        <section key={band.key} aria-labelledby={`admin-band-${band.key}`}>
          <h2 id={`admin-band-${band.key}`}>
            {t("admin.classes")} · {band.title}
          </h2>
          <div className="admin-class-list">
            {data.classes
              .filter((c) => c.tkaTrack === band.key)
              .map((cls) => (
                <details key={cls.id} className="admin-class">
                  <summary>
                    <span>
                      <strong>{cls.label}</strong>
                      <small>{cls.id}</small>
                    </span>
                    <span className="admin-class-kpis">
                      {t("admin.class.summary", {
                        students: cls.students,
                        active: cls.todayActive,
                        lessons: cls.lessons,
                        tryouts: cls.tryouts,
                      })}
                    </span>
                  </summary>
                  <dl className="admin-dl">
                    <div>
                      <dt>{t("admin.class.monthXp")}</dt>
                      <dd>{cls.monthXp}</dd>
                    </div>
                    <div>
                      <dt>{t("admin.class.avgTryout")}</dt>
                      <dd>{cls.avgTryout}%</dd>
                    </div>
                    <div>
                      <dt>{t("admin.class.firstTry")}</dt>
                      <dd>{cls.firstTryRate}%</dd>
                    </div>
                    <div>
                      <dt>{t("admin.class.avgStreak")}</dt>
                      <dd>{cls.avgStreak}</dd>
                    </div>
                    <div>
                      <dt>{t("admin.class.lastActivity")}</dt>
                      <dd>{when(cls.lastActivityAt, locale)}</dd>
                    </div>
                  </dl>
                  {cls.roster.length === 0 ? (
                    <p className="admin-empty">{t("admin.class.empty")}</p>
                  ) : (
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <caption>{t("admin.class.roster")}</caption>
                        <thead>
                          <tr>
                            <th>{t("admin.col.name")}</th>
                            <th>{t("admin.col.email")}</th>
                            <th>{t("admin.col.age")}</th>
                            <th>{t("admin.col.track")}</th>
                            <th>{t("admin.col.electives")}</th>
                            <th>{t("admin.col.streak")}</th>
                            <th>{t("admin.col.month")}</th>
                            <th>{t("admin.col.lessons")}</th>
                            <th>{t("admin.col.tryouts")}</th>
                            <th>{t("admin.col.lastLesson")}</th>
                            <th>{t("admin.col.lastTryout")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cls.roster.map((row) => (
                            <tr key={row.email}>
                              <td>{row.displayName}</td>
                              <td>
                                <code>{row.email}</code>
                              </td>
                              <td>{row.age}</td>
                              <td>{t("tka.grade", { n: row.track })}</td>
                              <td>{row.pilihan.length ? row.pilihan.join(", ") : "—"}</td>
                              <td>
                                {row.streak}
                                {row.streakLastDate ? ` · ${row.streakLastDate}` : ""}
                              </td>
                              <td>{row.monthScore}</td>
                              <td>{row.lessons}</td>
                              <td>
                                {row.tryouts}
                                {row.lastTryoutScore != null ? ` · ${row.lastTryoutScore}%` : ""}
                              </td>
                              <td>{when(row.lastLessonAt, locale)}</td>
                              <td>{when(row.lastTryoutAt, locale)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </details>
              ))}
          </div>
        </section>
      ))}

      {data.unmatchedKelas.length > 0 ? (
        <section aria-labelledby="admin-unmatched">
          <h2 id="admin-unmatched">{t("admin.unmatched")}</h2>
          <ul className="admin-count-list">
            {data.unmatchedKelas.map((row) => (
              <li key={row.email}>
                <span>
                  {row.displayName} · <code>{row.email}</code>
                </span>
                <strong>{row.kelas}</strong>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="admin-split">
        <section aria-labelledby="admin-skills">
          <h2 id="admin-skills">{t("admin.skills")}</h2>
          {data.skills.length === 0 ? (
            <p className="admin-empty">{t("admin.empty")}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("admin.col.skill")}</th>
                    <th>{t("admin.col.completions")}</th>
                    <th>{t("admin.col.mastered")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.skills.map((row) => (
                    <tr key={row.skillId}>
                      <td>
                        {row.title}
                        <div>
                          <code>{row.skillId}</code>
                        </div>
                      </td>
                      <td>{row.completions}</td>
                      <td>{row.mastered}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section aria-labelledby="admin-packs">
          <h2 id="admin-packs">{t("admin.packs")}</h2>
          {data.packs.length === 0 ? (
            <p className="admin-empty">{t("admin.empty")}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("admin.col.pack")}</th>
                    <th>{t("admin.col.attempts")}</th>
                    <th>{t("admin.col.avg")}</th>
                    <th>{t("admin.col.best")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.packs.map((row) => (
                    <tr key={row.packId}>
                      <td>
                        {row.title}
                        <div>
                          <code>{row.packId}</code>
                        </div>
                      </td>
                      <td>{row.attempts}</td>
                      <td>{Math.round(row.avgScore)}%</td>
                      <td>{row.best}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section aria-labelledby="admin-feed">
        <h2 id="admin-feed">{t("admin.feed")}</h2>
        {data.recentEvents.length === 0 ? (
          <p className="admin-empty">{t("admin.empty")}</p>
        ) : (
          <ol className="admin-feed">
            {data.recentEvents.map((ev) => (
              <li key={ev.id}>
                <time dateTime={ev.at}>{when(ev.at, locale)}</time>
                <strong>{eventLabel(t, ev.type)}</strong>
                <code>{ev.email}</code>
                {ev.path ? <span>{ev.path}</span> : null}
                {ev.detail ? <span>{ev.detail}</span> : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
